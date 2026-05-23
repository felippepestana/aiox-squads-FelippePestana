"""Camera health monitor.

A camera is "healthy" when its OBS source reported active recently. We track
the last activity timestamp per camera and consider a camera dead when no
activity has been seen for ``timeout_ms``. The engine consults the monitor
before committing a switch and falls back to the next viable camera if the
target is dead.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class HealthMonitor:
    timeout_ms: int = 3_000
    _last_seen_ms: dict[str, int] = field(default_factory=dict)

    def mark_active(self, source_name: str, now_ms: int) -> None:
        self._last_seen_ms[source_name] = now_ms

    def mark_inactive(self, source_name: str) -> None:
        # A source going inactive doesn't immediately mean dead — it may just
        # be off-program. We rely on the timeout for dead detection.
        self._last_seen_ms.setdefault(source_name, 0)

    def is_healthy(self, source_name: str, now_ms: int) -> bool:
        last = self._last_seen_ms.get(source_name)
        if last is None:
            # Unknown sources are assumed healthy (haven't proven otherwise).
            return True
        return (now_ms - last) <= self.timeout_ms
