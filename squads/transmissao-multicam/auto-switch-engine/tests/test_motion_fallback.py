"""Tests for motion-driven fallback when audio is silent."""

from __future__ import annotations

from auto_switch.config import ChannelConfig, EngineConfig
from auto_switch.engine import SwitchEngine
from auto_switch.motion import MotionDetector


PROTECTED = frozenset({"SLIDES_FULL", "SLIDES_PIP", "TELA_PIP", "STANDBY", "ENCERRAMENTO"})


def make_config() -> EngineConfig:
    return EngineConfig(
        cooldown_ms=1500,
        manual_override_ms=10_000,
        evaluation_window_ms=500,
        channels=(
            ChannelConfig("MIC_1", "CAM1", -32.0, 500, "principal_speaker"),
            ChannelConfig("MIC_2", "CAM2", -32.0, 500, "audience"),
        ),
        protected_scenes=PROTECTED,
    )


def test_motion_detector_picks_top_score():
    md = MotionDetector(threshold=0.005)
    md.update({"CAM1": 0.001, "CAM2": 0.020})
    assert md.best_target() == "CAM2"


def test_motion_detector_below_threshold_returns_none():
    md = MotionDetector(threshold=0.005)
    md.update({"CAM1": 0.001, "CAM2": 0.002})
    assert md.best_target() is None


def test_engine_uses_motion_when_silent():
    md = MotionDetector(threshold=0.005)
    md.update({"CAM2": 0.020})

    engine = SwitchEngine(
        config=make_config(),
        current_scene="CAM1",
        silence_fallback_ms=1_000,
        on_motion_request=lambda _now: md.best_target(),
    )
    # Provide silence (peaks below threshold) for > silence_fallback_ms.
    engine.on_meters(0, {"MIC_1": -90.0, "MIC_2": -90.0})
    target = engine.on_meters(2_000, {"MIC_1": -90.0, "MIC_2": -90.0})
    assert target == "CAM2"
    assert engine.last_motion_triggered is True


def test_engine_does_not_use_motion_when_audio_recent():
    md = MotionDetector(threshold=0.005)
    md.update({"CAM2": 0.020})

    engine = SwitchEngine(
        config=make_config(),
        current_scene="CAM1",
        silence_fallback_ms=1_000,
        on_motion_request=lambda _now: md.best_target(),
    )
    # Recent audio activity at t=0 should suppress motion fallback.
    engine.on_meters(0, {"MIC_1": -10.0})
    target = engine.on_meters(500, {"MIC_1": -90.0, "MIC_2": -90.0})
    # Silence only 500ms < 1000ms fallback threshold. No motion fallback.
    assert target is None
    assert engine.last_motion_triggered is False
