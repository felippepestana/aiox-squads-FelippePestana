"""Entry point that wires SwitchEngine to a real obs-websocket connection."""

from __future__ import annotations

import argparse
import json
import logging
import math
import os
import signal
import sys
import time
from pathlib import Path

from .config import load_engine_config
from .engine import SwitchEngine
from .health import HealthMonitor
from .metrics import Metrics, start_metrics_server
from .motion import MotionDetector
from .osc_feedback import get_emitter as get_osc_emitter
from .supabase_writer import get_writer as get_supabase_writer

LOG = logging.getLogger("tx-auto-switch")


def _peak_dbfs_from_levels(levels: list[list[float]]) -> float:
    """Convert obs-websocket InputVolumeMeters levels into a peak dBFS value.

    The event payload carries linear amplitude multipliers per channel and
    sample window; we take the loudest finite value and convert to dBFS,
    flooring at -90 dB so silent inputs don't propagate -inf.
    """

    finite = [v for sub in levels for v in sub if math.isfinite(v)]
    if not finite:
        return -90.0
    peak = max(finite)
    if peak <= 0.0:
        return -90.0
    return max(20.0 * math.log10(peak), -90.0)


def run() -> int:  # pragma: no cover — thin glue layer
    parser = argparse.ArgumentParser(description="Auto-switch engine (F6+F7+F8).")
    parser.add_argument("--mic-mapping", default=os.environ.get("MIC_MAPPING"))
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--log-switches", default=None)
    parser.add_argument("--log-level", default="INFO")
    parser.add_argument(
        "--metrics-port",
        type=int,
        default=int(os.environ.get("METRICS_PORT", "0")),
        help="HTTP port for Prometheus exporter. 0 disables. Default 0.",
    )
    parser.add_argument(
        "--enable-motion",
        action="store_true",
        help="Enable motion-detection fallback (F8). Requires periodic frames "
        "to be fed into the engine; in this scaffold motion is left as a stub.",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    if not args.mic_mapping:
        LOG.error("--mic-mapping or $MIC_MAPPING is required")
        return 2

    config = load_engine_config(Path(args.mic_mapping))
    metrics = Metrics()
    health = HealthMonitor(timeout_ms=3_000)
    motion = MotionDetector() if args.enable_motion else None

    engine = SwitchEngine(
        config=config,
        health=health,
        on_motion_request=(lambda _now: motion.best_target() if motion else None),
    )

    if args.metrics_port > 0:
        start_metrics_server(metrics, port=args.metrics_port)
        LOG.info("Metrics exporter listening on :%d/metrics", args.metrics_port)

    sb = get_supabase_writer()
    if sb.enabled:
        LOG.info("Supabase switch-log persistence enabled")

    osc = get_osc_emitter()
    if osc.enabled:
        LOG.info("OSC feedback emitter enabled (TouchOSC tablet)")

    try:
        import obsws_python as obs
        from obsws_python.subs import Subs
    except ImportError:
        LOG.error("obsws-python not installed. Run: pip install obsws-python")
        return 2

    host = os.environ.get("OBS_WS_HOST", "localhost")
    port = int(os.environ.get("OBS_WS_PORT") or "4455")
    password = os.environ.get("OBS_WS_PASSWORD", "")

    LOG.info("Connecting to obs-websocket at %s:%d", host, port)
    req = obs.ReqClient(host=host, port=port, password=password, timeout=5)
    # ALL = LOW_VOLUME | HIGH_VOLUME. The high-volume mask is required for
    # InputVolumeMeters and InputActiveStateChanged events; without it the
    # engine never receives meter snapshots and switching is disabled.
    events = obs.EventClient(
        host=host,
        port=port,
        password=password,
        timeout=5,
        subs=int(Subs.ALL),
    )

    # File handle and clients are opened inside the try/finally guard below to
    # avoid resource leaks if callback registration or signal setup raise.
    switch_log = None  # set inside try block

    # obsws-python dispatches by function name → on_<snake_case_event_name>.
    # Renaming below is required, otherwise none of these callbacks fire.

    def on_input_volume_meters(data) -> None:
        now_ms = int(time.time() * 1000)
        peaks: dict[str, float] = {}
        for inp in getattr(data, "inputs", []):
            peaks[inp["inputName"]] = _peak_dbfs_from_levels(
                inp.get("inputLevelsMul", [])
            )
        target = engine.on_meters(now_ms, peaks)
        if target:
            metrics.record_switch(target)
            trigger = "motion" if engine.last_motion_triggered else "audio"
            if engine.last_motion_triggered:
                metrics.record_motion_trigger()

            t_before = time.monotonic()
            if not args.dry_run:
                try:
                    req.set_current_program_scene(target)
                except Exception:  # noqa: BLE001
                    LOG.exception("SetCurrentProgramScene(%s) failed", target)
            latency_ms = int((time.monotonic() - t_before) * 1000)

            entry = {
                "ts_ms": now_ms,
                "target": target,
                "peaks": peaks,
                "dry_run": args.dry_run,
                "motion": engine.last_motion_triggered,
            }
            LOG.info(
                "switch → %s%s (latency %dms)",
                target,
                " (motion)" if engine.last_motion_triggered else "",
                latency_ms,
            )
            if switch_log:
                switch_log.write(json.dumps(entry) + "\n")
                switch_log.flush()

            # Persist to Supabase (no-op if not configured)
            sb.log_switch(
                from_scene=engine.current_scene,
                to_scene=target,
                trigger=trigger,
                latency_ms=latency_ms,
            )

            # Push tablet state via OSC (no-op if not configured)
            osc.emit_scene(target)

    def on_custom_event(data) -> None:
        payload = getattr(data, "event_data", None) or getattr(data, "eventData", {})
        if not isinstance(payload, dict):
            return
        if payload.get("type") == "operator-override":
            # Prefer duration_ms (clock-skew safe). Fall back to expires_at
            # for backwards compatibility with older panel builds.
            now_ms = int(time.time() * 1000)
            duration = payload.get("duration_ms")
            if duration is not None:
                try:
                    expires = now_ms + int(duration)
                except (TypeError, ValueError):
                    LOG.warning("invalid duration_ms in override event: %r", duration)
                    return
            else:
                expires = int(payload.get("expires_at", 0))
            engine.apply_override(expires)
            metrics.record_override()
            LOG.info("operator override until %s", expires)
            # Tell the tablet whether we're in manual or auto mode now.
            osc.emit_mode(manual_override=(expires > now_ms))

    def on_current_program_scene_changed(data) -> None:
        scene_name = getattr(data, "scene_name", None) or getattr(
            data, "sceneName", None
        )
        if scene_name:
            engine.set_current_scene(scene_name)

    def on_input_active_state_changed(data) -> None:
        source_name = getattr(data, "input_name", None) or getattr(
            data, "inputName", None
        )
        active = getattr(data, "video_active", None) or getattr(
            data, "videoActive", None
        )
        if not source_name:
            return
        if active:
            health.mark_active(source_name, int(time.time() * 1000))
            osc.emit_health(source_name, healthy=True)
        else:
            health.mark_inactive(source_name)
            metrics.record_dropout()
            osc.emit_health(source_name, healthy=False)

    events.callback.register(on_input_volume_meters)
    events.callback.register(on_custom_event)
    events.callback.register(on_current_program_scene_changed)
    events.callback.register(on_input_active_state_changed)

    LOG.info("Engine running. Mode: %s", "dry-run" if args.dry_run else "live")

    stop = {"flag": False}

    def _shutdown(*_args) -> None:  # noqa: ANN001
        stop["flag"] = True

    signal.signal(signal.SIGINT, _shutdown)
    signal.signal(signal.SIGTERM, _shutdown)

    try:
        if args.log_switches:
            switch_log = open(args.log_switches, "a", encoding="utf-8")
        while not stop["flag"]:
            time.sleep(0.5)
    finally:
        for client in (events, req):
            try:
                client.disconnect()
            except Exception:  # noqa: BLE001
                LOG.debug("client disconnect raised", exc_info=True)
        if switch_log:
            switch_log.close()

    LOG.info("Engine stopped")
    return 0


if __name__ == "__main__":
    sys.exit(run())
