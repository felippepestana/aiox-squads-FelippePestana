"""Tests for the OSC feedback emitter.

The emitter must:
- Stay disabled when env vars are missing (no crash, just no-ops)
- Stay disabled when ``python-osc`` is missing (handled in import path)
- Send the correct address+value when enabled
- Survive send failures without raising
"""

from __future__ import annotations

from unittest.mock import patch

from auto_switch import osc_feedback


def setup_function() -> None:
    osc_feedback.reset_for_tests()


def teardown_function() -> None:
    osc_feedback.reset_for_tests()


def test_disabled_without_env_vars(monkeypatch) -> None:
    monkeypatch.delenv("OSC_FEEDBACK_HOST", raising=False)
    monkeypatch.delenv("OSC_FEEDBACK_PORT", raising=False)

    emitter = osc_feedback.get_emitter()
    assert emitter.enabled is False

    # All emits are no-ops; no exception even though no client exists.
    emitter.emit_scene("CAM1")
    emitter.emit_mode(manual_override=True)
    emitter.emit_health("CAM2", healthy=False)


def test_disabled_when_port_invalid(monkeypatch) -> None:
    monkeypatch.setenv("OSC_FEEDBACK_HOST", "127.0.0.1")
    monkeypatch.setenv("OSC_FEEDBACK_PORT", "not-a-number")

    emitter = osc_feedback.get_emitter()
    assert emitter.enabled is False


def test_emits_scene_address(monkeypatch) -> None:
    monkeypatch.setenv("OSC_FEEDBACK_HOST", "127.0.0.1")
    monkeypatch.setenv("OSC_FEEDBACK_PORT", "9301")

    sent: list[tuple[str, float]] = []

    class FakeClient:
        def __init__(self, host: str, port: int) -> None:
            self.host, self.port = host, port

        def send_message(self, address: str, value):  # noqa: ANN001
            sent.append((address, value))

    with patch.dict("sys.modules", {"pythonosc.udp_client": _module(FakeClient)}):
        emitter = osc_feedback.OscFeedbackEmitter()
        assert emitter.enabled is True
        emitter.emit_scene("CAM2")
        emitter.emit_mode(manual_override=True)
        emitter.emit_mode(manual_override=False)
        emitter.emit_health("CAM3", healthy=False)

    assert sent == [
        ("/tx/feedback/scene/CAM2", 1.0),
        ("/tx/feedback/mode", 1.0),
        ("/tx/feedback/mode", 0.0),
        ("/tx/feedback/health/CAM3", 0.0),
    ]


def test_swallows_send_errors(monkeypatch) -> None:
    monkeypatch.setenv("OSC_FEEDBACK_HOST", "127.0.0.1")
    monkeypatch.setenv("OSC_FEEDBACK_PORT", "9301")

    class CrashingClient:
        def __init__(self, host: str, port: int) -> None:
            pass

        def send_message(self, address: str, value):  # noqa: ANN001
            raise RuntimeError("network down")

    with patch.dict("sys.modules", {"pythonosc.udp_client": _module(CrashingClient)}):
        emitter = osc_feedback.OscFeedbackEmitter()
        assert emitter.enabled is True
        # Must not raise — the engine's main loop relies on this
        emitter.emit_scene("CAM1")


def _module(cls: type) -> object:
    """Build an ad-hoc module stub exposing ``SimpleUDPClient = cls``."""
    import types

    mod = types.ModuleType("pythonosc.udp_client")
    setattr(mod, "SimpleUDPClient", cls)
    return mod
