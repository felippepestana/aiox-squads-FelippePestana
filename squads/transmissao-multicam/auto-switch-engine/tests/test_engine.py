"""Tests for the pure SwitchEngine logic."""

from __future__ import annotations

import pytest

from auto_switch.config import ChannelConfig, EngineConfig
from auto_switch.engine import SwitchEngine


PROTECTED = frozenset({"SLIDES_FULL", "SLIDES_PIP", "TELA_PIP", "STANDBY", "ENCERRAMENTO"})


def make_config(
    cooldown_ms: int = 1500,
    override_ms: int = 10_000,
) -> EngineConfig:
    return EngineConfig(
        cooldown_ms=cooldown_ms,
        manual_override_ms=override_ms,
        evaluation_window_ms=500,
        channels=(
            ChannelConfig("MIC_1", "CAM1", -32.0, 500, "principal_speaker"),
            ChannelConfig("MIC_2", "CAM2", -32.0, 500, "audience"),
            ChannelConfig("MIC_4", None, -20.0, 2000, "ambient"),
        ),
        protected_scenes=PROTECTED,
    )


def test_speech_below_min_does_not_switch():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    # Speech detected at t=0, but only 200ms elapsed → below min_speech_ms 500.
    assert engine.on_meters(0, {"MIC_2": -10.0}) is None
    assert engine.on_meters(200, {"MIC_2": -10.0}) is None


def test_sustained_speech_triggers_switch():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(800, {"MIC_2": -10.0})
    assert target == "CAM2"
    assert engine.current_scene == "CAM2"


def test_cooldown_blocks_rapid_switch():
    engine = SwitchEngine(config=make_config(cooldown_ms=1500), current_scene="CAM1")
    # First switch at t=800.
    engine.on_meters(0, {"MIC_2": -10.0})
    engine.on_meters(800, {"MIC_2": -10.0})
    # MIC_3 (no, we don't have one) — use MIC_1 to try to switch back.
    # But CAM1 is now off-program; sustained MIC_1 speech 500ms after switch
    # at t=1300 should NOT switch because cooldown is 1500ms (1300 - 800 = 500 < 1500).
    engine.on_meters(800, {"MIC_1": -10.0})
    target = engine.on_meters(1300, {"MIC_1": -10.0})
    assert target is None


def test_cooldown_allows_switch_after_window():
    engine = SwitchEngine(config=make_config(cooldown_ms=1500), current_scene="CAM1")
    engine.on_meters(0, {"MIC_2": -10.0})
    engine.on_meters(800, {"MIC_2": -10.0})  # switch to CAM2 at t=800
    engine.on_meters(1000, {"MIC_1": -10.0})  # MIC_1 starts speaking
    # 2400 - 800 = 1600 > 1500 cooldown, and 2400 - 1000 = 1400 sustained > 500 min_speech.
    target = engine.on_meters(2400, {"MIC_1": -10.0})
    assert target == "CAM1"


def test_manual_override_blocks_switch():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    engine.apply_override(expires_at_ms=10_000)
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(800, {"MIC_2": -10.0})
    assert target is None
    # First meter event after override expiry, with already-sustained speech,
    # must release the switch.
    target = engine.on_meters(10_001, {"MIC_2": -10.0})
    assert target == "CAM2"


def test_protected_scene_blocks_forced_switch():
    engine = SwitchEngine(config=make_config(), current_scene="SLIDES_PIP")
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(800, {"MIC_2": -10.0})
    assert target is None


def test_ambient_channel_does_not_trigger():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    # MIC_4 is ambient (camera_target=None) — even sustained speech ignored.
    engine.on_meters(0, {"MIC_4": 0.0})
    target = engine.on_meters(3000, {"MIC_4": 0.0})
    assert target is None


def test_below_threshold_does_not_trigger():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    # MIC_2 threshold is -32 dBFS; -40 is below, never triggers.
    engine.on_meters(0, {"MIC_2": -40.0})
    target = engine.on_meters(2000, {"MIC_2": -40.0})
    assert target is None


def test_speech_interruption_resets_timer():
    engine = SwitchEngine(config=make_config(), current_scene="CAM1")
    engine.on_meters(0, {"MIC_2": -10.0})
    # Silence breaks streak.
    engine.on_meters(300, {"MIC_2": -50.0})
    # New burst doesn't have 500ms accumulated yet.
    engine.on_meters(400, {"MIC_2": -10.0})
    target = engine.on_meters(700, {"MIC_2": -10.0})
    assert target is None  # 700 - 400 = 300 < 500


def test_does_not_switch_to_same_scene():
    engine = SwitchEngine(config=make_config(), current_scene="CAM2")
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(800, {"MIC_2": -10.0})
    assert target is None  # already on CAM2
