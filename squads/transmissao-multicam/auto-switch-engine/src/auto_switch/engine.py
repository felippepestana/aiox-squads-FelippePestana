"""Switch decision engine. Pure logic — no I/O. Easy to test."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Mapping

from .config import EngineConfig


@dataclass
class _ChannelState:
    speech_started_at_ms: int | None = None
    last_peak_dbfs: float = -90.0


@dataclass
class SwitchEngine:
    """Decides scene switches based on OBS audio meters.

    The engine is intentionally pure: callers feed it timestamped audio meter
    snapshots and override events; the engine returns ``Optional[str]`` with
    the scene to switch to (or ``None`` if no switch is warranted).
    """

    config: EngineConfig
    current_scene: str = "STANDBY"
    # Far in the past so the first switch is never gated by cooldown.
    last_switch_at_ms: int = -(10**18)
    override_until_ms: int = 0
    _state: dict[str, _ChannelState] = field(default_factory=dict)

    def __post_init__(self) -> None:
        for ch in self.config.channels:
            self._state.setdefault(ch.obs_source_name, _ChannelState())

    # --- inputs -------------------------------------------------------------

    def apply_override(self, expires_at_ms: int) -> None:
        """Operator manual override: suspend auto-switch until ``expires_at_ms``."""
        self.override_until_ms = max(self.override_until_ms, expires_at_ms)

    def set_current_scene(self, scene: str) -> None:
        """Track the scene we believe is on program (mirror of OBS state)."""
        self.current_scene = scene

    def on_meters(
        self,
        now_ms: int,
        peaks_dbfs: Mapping[str, float],
    ) -> str | None:
        """Feed an audio meter snapshot; return target scene or ``None``."""

        # Update per-channel speech-start tracking.
        for ch in self.config.channels:
            peak = peaks_dbfs.get(ch.obs_source_name, -90.0)
            state = self._state[ch.obs_source_name]
            state.last_peak_dbfs = peak
            if peak >= ch.threshold_dbfs:
                if state.speech_started_at_ms is None:
                    state.speech_started_at_ms = now_ms
            else:
                state.speech_started_at_ms = None

        # Honor manual override.
        if now_ms < self.override_until_ms:
            return None

        # Honor protected scenes — IA does not force scene changes here.
        if self.current_scene in self.config.protected_scenes:
            return None

        # Honor cooldown.
        if now_ms - self.last_switch_at_ms < self.config.cooldown_ms:
            return None

        # Pick the channel whose speech sustained for the longest, beyond its
        # min_speech_ms. Skip channels with no camera_target (ambient mics).
        best_channel = None
        best_duration = -1
        for ch in self.config.channels:
            if ch.camera_target is None:
                continue
            state = self._state[ch.obs_source_name]
            if state.speech_started_at_ms is None:
                continue
            duration = now_ms - state.speech_started_at_ms
            if duration < ch.min_speech_ms:
                continue
            if duration > best_duration:
                best_duration = duration
                best_channel = ch

        if best_channel is None:
            return None
        if best_channel.camera_target == self.current_scene:
            return None

        self.last_switch_at_ms = now_ms
        target = best_channel.camera_target
        self.current_scene = target  # type: ignore[assignment]
        return target
