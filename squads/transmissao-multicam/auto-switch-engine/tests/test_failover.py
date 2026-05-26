"""Tests for camera health monitor and engine failover."""

from __future__ import annotations

from auto_switch.config import ChannelConfig, EngineConfig
from auto_switch.engine import SwitchEngine
from auto_switch.health import HealthMonitor


PROTECTED = frozenset({"SLIDES_FULL", "SLIDES_PIP", "TELA_PIP", "STANDBY", "ENCERRAMENTO"})


def make_config() -> EngineConfig:
    return EngineConfig(
        cooldown_ms=1500,
        manual_override_ms=10_000,
        evaluation_window_ms=500,
        channels=(
            ChannelConfig("MIC_1", "CAM1", -32.0, 500, "principal_speaker"),
            ChannelConfig("MIC_2", "CAM2", -32.0, 500, "audience"),
            ChannelConfig("MIC_3", "CAM3", -32.0, 500, "co_speaker"),
        ),
        protected_scenes=PROTECTED,
    )


def test_unhealthy_camera_skipped_for_alternative():
    health = HealthMonitor(timeout_ms=3_000)
    # CAM2 marked active only at t=0; will be stale at t=10_000.
    health.mark_active("CAM2", 0)
    # CAM3 stays fresh.
    health.mark_active("CAM3", 8_500)

    engine = SwitchEngine(
        config=make_config(),
        current_scene="CAM1",
        health=health,
    )
    # MIC_2 starts speaking at t=0; MIC_3 joins at t=0 too.
    engine.on_meters(0, {"MIC_2": -10.0, "MIC_3": -10.0})
    # At t=10_000: CAM2 stale (10s > 3s), CAM3 fresh (1.5s). Engine prefers
    # MIC_2 by duration tie-break but its CAM2 is dead → falls back to CAM3.
    target = engine.on_meters(10_000, {"MIC_2": -10.0, "MIC_3": -10.0})
    assert target == "CAM3"


def test_no_alternative_returns_none():
    health = HealthMonitor(timeout_ms=3_000)
    health.mark_active("CAM2", 0)  # CAM2 will go stale
    engine = SwitchEngine(
        config=make_config(),
        current_scene="CAM1",
        health=health,
    )
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(10_000, {"MIC_2": -10.0})
    # Only MIC_2 speaking, CAM2 unhealthy, no alternative speaking → None.
    assert target is None


def test_healthy_camera_switches_normally():
    health = HealthMonitor(timeout_ms=3_000)
    engine = SwitchEngine(
        config=make_config(),
        current_scene="CAM1",
        health=health,
    )
    health.mark_active("CAM2", 700)  # within timeout
    engine.on_meters(0, {"MIC_2": -10.0})
    target = engine.on_meters(800, {"MIC_2": -10.0})
    assert target == "CAM2"
