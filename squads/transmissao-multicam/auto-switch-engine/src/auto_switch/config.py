"""Load mic-mapping.yaml into typed dataclasses."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import yaml


@dataclass(frozen=True)
class ChannelConfig:
    obs_source_name: str
    camera_target: str | None
    threshold_dbfs: float
    min_speech_ms: int
    role: str


@dataclass(frozen=True)
class EngineConfig:
    cooldown_ms: int
    manual_override_ms: int
    evaluation_window_ms: int
    channels: tuple[ChannelConfig, ...]
    protected_scenes: frozenset[str]


_DEFAULT_PROTECTED = frozenset(
    {
        "SLIDES_FULL",
        "SLIDES_PIP",
        "TELA_PIP",
        "STANDBY",
        "ENCERRAMENTO",
    }
)


def load_engine_config(path: str | Path) -> EngineConfig:
    """Parse mic-mapping.yaml into an EngineConfig."""

    # yaml.safe_load returns None for an empty document; coerce to {} so the
    # subsequent .get(...) calls degrade gracefully into defaults.
    raw = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or {}
    vad = raw.get("vad_engine", {})
    channels = tuple(
        ChannelConfig(
            obs_source_name=ch["obs_source_name"],
            camera_target=ch.get("camera_target"),
            threshold_dbfs=float(ch["vad_threshold_dbfs"]),
            min_speech_ms=int(ch.get("vad_min_speech_ms", 500)),
            role=ch.get("role", "speaker"),
        )
        for ch in raw.get("channels", [])
    )
    yaml_protected = raw.get("protected_scenes")
    protected = (
        frozenset(str(s) for s in yaml_protected)
        if isinstance(yaml_protected, list) and yaml_protected
        else _DEFAULT_PROTECTED
    )
    return EngineConfig(
        cooldown_ms=int(vad.get("cooldown_ms", 1500)),
        manual_override_ms=int(vad.get("manual_override_ms", 10_000)),
        evaluation_window_ms=int(vad.get("evaluation_window_ms", 500)),
        channels=channels,
        protected_scenes=protected,
    )
