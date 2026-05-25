"""Prometheus-style metrics for the auto-switch engine.

We do not depend on prometheus_client to keep the package light. Output
follows the Prometheus text exposition format and is served from a small
threaded HTTP server. Scrape with `curl http://host:9099/metrics`.
"""

from __future__ import annotations

import threading
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


@dataclass
class Metrics:
    switches_total: int = 0
    switches_by_target: dict[str, int] = field(default_factory=dict)
    pingpong_total: int = 0  # switch where target equals previous-but-one
    overrides_total: int = 0
    camera_dropouts_total: int = 0
    failovers_total: int = 0
    motion_triggers_total: int = 0
    last_switch_target: str | None = None
    _previous_target: str | None = None
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)

    def record_switch(self, target: str) -> None:
        with self._lock:
            self.switches_total += 1
            self.switches_by_target[target] = (
                self.switches_by_target.get(target, 0) + 1
            )
            if self._previous_target is not None and target == self._previous_target:
                self.pingpong_total += 1
            self._previous_target = self.last_switch_target
            self.last_switch_target = target

    def record_override(self) -> None:
        with self._lock:
            self.overrides_total += 1

    def record_dropout(self) -> None:
        with self._lock:
            self.camera_dropouts_total += 1

    def record_failover(self) -> None:
        with self._lock:
            self.failovers_total += 1

    def record_motion_trigger(self) -> None:
        with self._lock:
            self.motion_triggers_total += 1

    def render_prometheus(self) -> str:
        with self._lock:
            lines: list[str] = []

            def add(name: str, help_text: str, value: int) -> None:
                lines.append(f"# HELP {name} {help_text}")
                lines.append(f"# TYPE {name} counter")
                lines.append(f"{name} {value}")

            add(
                "tx_multicam_switches_total",
                "Total scene switches commanded by the engine.",
                self.switches_total,
            )
            add(
                "tx_multicam_pingpong_total",
                "Switches that immediately reverse the previous one (potential ping-pong).",
                self.pingpong_total,
            )
            add(
                "tx_multicam_overrides_total",
                "Operator override events received.",
                self.overrides_total,
            )
            add(
                "tx_multicam_camera_dropouts_total",
                "Camera dropouts observed by the health monitor.",
                self.camera_dropouts_total,
            )
            add(
                "tx_multicam_failovers_total",
                "Failovers triggered (target camera was unhealthy).",
                self.failovers_total,
            )
            add(
                "tx_multicam_motion_triggers_total",
                "Motion-driven switches (audio-silent fallback).",
                self.motion_triggers_total,
            )

            lines.append("# HELP tx_multicam_switches_by_target Switches per target scene.")
            lines.append("# TYPE tx_multicam_switches_by_target counter")
            for target, count in sorted(self.switches_by_target.items()):
                lines.append(
                    f'tx_multicam_switches_by_target{{target="{target}"}} {count}'
                )

            return "\n".join(lines) + "\n"


class _Handler(BaseHTTPRequestHandler):
    metrics: Metrics  # injected per-class

    # Silence default logging
    def log_message(self, format: str, *args: object) -> None:  # noqa: A003
        return

    def do_GET(self) -> None:  # noqa: N802
        if self.path != "/metrics":
            self.send_response(404)
            self.end_headers()
            return
        body = self.metrics.render_prometheus().encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; version=0.0.4")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def start_metrics_server(metrics: Metrics, port: int = 9099) -> ThreadingHTTPServer:
    handler_cls = type("BoundHandler", (_Handler,), {"metrics": metrics})
    server = ThreadingHTTPServer(("0.0.0.0", port), handler_cls)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server
