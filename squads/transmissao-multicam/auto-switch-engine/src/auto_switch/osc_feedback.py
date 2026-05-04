"""Optional OSC feedback emitter for the F6 auto-switch engine.

Whenever the engine decides to switch, override or detect a dropout, we
push the new state to a TouchOSC tablet over UDP so the operator's surface
reflects reality without polling. Degrades silently when ``python-osc``
isn't installed or when the env vars aren't set.
"""

from __future__ import annotations

import logging
import os
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    pass

LOG = logging.getLogger("tx-auto-switch.osc")


class OscFeedbackEmitter:
    """Thin wrapper around python-osc's UDPClient for engine status pushes."""

    def __init__(self) -> None:
        self._client: Any | None = None
        self._enabled = False

        host = os.environ.get("OSC_FEEDBACK_HOST")
        port_raw = os.environ.get("OSC_FEEDBACK_PORT")

        if not host or not port_raw:
            LOG.debug("OSC feedback env vars not set — emitter disabled.")
            return

        try:
            port = int(port_raw)
        except ValueError:
            LOG.warning("Invalid OSC_FEEDBACK_PORT=%r; emitter disabled.", port_raw)
            return

        try:
            from pythonosc.udp_client import SimpleUDPClient  # type: ignore[import]

            self._client = SimpleUDPClient(host, port)
            self._enabled = True
            LOG.info("OSC feedback emitter initialised (target=%s:%d)", host, port)
        except ImportError:
            LOG.warning(
                "python-osc not installed. Run: pip install '.[osc]' "
                "to enable TouchOSC feedback."
            )

    @property
    def enabled(self) -> bool:
        return self._enabled

    # ─── public API ────────────────────────────────────────────────

    def emit_scene(self, scene_name: str) -> None:
        """Engine just committed a switch to ``scene_name``."""
        self._send(f"/tx/feedback/scene/{scene_name}", 1.0)

    def emit_mode(self, *, manual_override: bool) -> None:
        """Operator override is active (manual) or has expired (auto)."""
        self._send("/tx/feedback/mode", 1.0 if manual_override else 0.0)

    def emit_health(self, camera_id: str, *, healthy: bool) -> None:
        """Camera health flip — used by the tablet to dim the failed input."""
        self._send(f"/tx/feedback/health/{camera_id}", 1.0 if healthy else 0.0)

    # ─── internal ──────────────────────────────────────────────────

    def _send(self, address: str, value: Any) -> None:
        if not self._enabled or self._client is None:
            return
        try:
            self._client.send_message(address, value)
        except Exception:  # noqa: BLE001
            LOG.exception("OSC feedback send failed for %s", address)


# Module-level singleton, created lazily on first access so tests can
# instantiate fresh emitters with patched env.
_emitter: OscFeedbackEmitter | None = None


def get_emitter() -> OscFeedbackEmitter:
    global _emitter  # noqa: PLW0603
    if _emitter is None:
        _emitter = OscFeedbackEmitter()
    return _emitter


def reset_for_tests() -> None:
    """Clear the cached singleton — used by pytest fixtures."""
    global _emitter  # noqa: PLW0603
    _emitter = None
