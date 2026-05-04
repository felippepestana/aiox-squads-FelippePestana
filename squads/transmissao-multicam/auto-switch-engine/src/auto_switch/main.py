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
    parser = argparse.ArgumentParser(description="Auto-switch engine (F6).")
    parser.add_argument("--mic-mapping", default=os.environ.get("MIC_MAPPING"))
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--log-switches", default=None)
    parser.add_argument("--log-level", default="INFO")
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    if not args.mic_mapping:
        LOG.error("--mic-mapping or $MIC_MAPPING is required")
        return 2

    config = load_engine_config(Path(args.mic_mapping))
    engine = SwitchEngine(config=config)

    try:
        import obsws_python as obs
    except ImportError:
        LOG.error("obsws-python not installed. Run: pip install obsws-python")
        return 2

    host = os.environ.get("OBS_WS_HOST", "localhost")
    port = int(os.environ.get("OBS_WS_PORT") or "4455")
    password = os.environ.get("OBS_WS_PASSWORD", "")

    LOG.info("Connecting to obs-websocket at %s:%d", host, port)
    req = obs.ReqClient(host=host, port=port, password=password, timeout=5)
    events = obs.EventClient(host=host, port=port, password=password, timeout=5)

    switch_log = (
        open(args.log_switches, "a", encoding="utf-8") if args.log_switches else None
    )

    def on_meters(data) -> None:
        peaks: dict[str, float] = {}
        for inp in getattr(data, "inputs", []):
            peaks[inp["inputName"]] = _peak_dbfs_from_levels(
                inp.get("inputLevelsMul", [])
            )
        target = engine.on_meters(int(time.time() * 1000), peaks)
        if target and not args.dry_run:
            try:
                req.set_current_program_scene(target)
            except Exception:  # noqa: BLE001
                LOG.exception("SetCurrentProgramScene(%s) failed", target)
        if target:
            entry = {
                "ts_ms": int(time.time() * 1000),
                "target": target,
                "peaks": peaks,
                "dry_run": args.dry_run,
            }
            LOG.info("switch → %s", target)
            if switch_log:
                switch_log.write(json.dumps(entry) + "\n")
                switch_log.flush()

    def on_custom(data) -> None:
        payload = getattr(data, "event_data", None) or getattr(data, "eventData", {})
        if not isinstance(payload, dict):
            return
        if payload.get("type") == "operator-override":
            expires = int(payload.get("expires_at", 0))
            engine.apply_override(expires)
            LOG.info("operator override until %s", expires)

    def on_scene(data) -> None:
        scene_name = getattr(data, "scene_name", None) or getattr(
            data, "sceneName", None
        )
        if scene_name:
            engine.set_current_scene(scene_name)

    events.callback.register(on_meters)
    events.callback.register(on_custom)
    events.callback.register(on_scene)

    LOG.info("Engine running. Mode: %s", "dry-run" if args.dry_run else "live")

    stop = {"flag": False}

    def _shutdown(*_args) -> None:  # noqa: ANN001
        stop["flag"] = True

    signal.signal(signal.SIGINT, _shutdown)
    signal.signal(signal.SIGTERM, _shutdown)

    try:
        while not stop["flag"]:
            time.sleep(0.5)
    finally:
        if switch_log:
            switch_log.close()

    LOG.info("Engine stopped")
    return 0


if __name__ == "__main__":
    sys.exit(run())
