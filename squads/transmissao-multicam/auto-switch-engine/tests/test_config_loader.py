"""Tests for load_engine_config — make sure YAML overrides drive the engine."""

from __future__ import annotations

from pathlib import Path

from auto_switch.config import load_engine_config


def write(tmp_path: Path, body: str) -> Path:
    p = tmp_path / "mic-mapping.yaml"
    p.write_text(body, encoding="utf-8")
    return p


def test_loads_protected_scenes_from_yaml(tmp_path: Path) -> None:
    body = """
vad_engine:
  cooldown_ms: 2000
  manual_override_ms: 8000
  evaluation_window_ms: 250
channels:
  - id: 1
    obs_source_name: MIC_1
    camera_target: CAM1
    vad_threshold_dbfs: -30
    vad_min_speech_ms: 400
    role: principal_speaker
protected_scenes:
  - CUSTOM_PROTECTED
  - ANOTHER_PROTECTED
"""
    cfg = load_engine_config(write(tmp_path, body))
    assert cfg.cooldown_ms == 2000
    assert cfg.manual_override_ms == 8000
    assert cfg.evaluation_window_ms == 250
    assert cfg.protected_scenes == frozenset({"CUSTOM_PROTECTED", "ANOTHER_PROTECTED"})
    assert len(cfg.channels) == 1
    assert cfg.channels[0].obs_source_name == "MIC_1"


def test_falls_back_to_defaults_when_yaml_missing_section(tmp_path: Path) -> None:
    body = """
channels:
  - id: 1
    obs_source_name: MIC_1
    camera_target: CAM1
    vad_threshold_dbfs: -30
    vad_min_speech_ms: 400
    role: principal_speaker
"""
    cfg = load_engine_config(write(tmp_path, body))
    # Defaults applied: cooldown 1500, override 10000, eval 500.
    assert cfg.cooldown_ms == 1500
    assert cfg.manual_override_ms == 10_000
    assert cfg.evaluation_window_ms == 500
    # protected_scenes falls back to the engine defaults.
    assert "STANDBY" in cfg.protected_scenes
    assert "SLIDES_PIP" in cfg.protected_scenes
