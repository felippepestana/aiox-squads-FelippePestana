"""Switch decision engine. Pure logic — no I/O. Easy to test."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Mapping, Protocol

from .config import EngineConfig


class _HealthLike(Protocol):
    def is_healthy(self, source_name: str, now_ms: int) -> bool: ...


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
    health: _HealthLike | None = None
    silence_fallback_ms: int = 3_000
    on_motion_request: Callable[[int], str | None] | None = None
    last_audio_activity_ms: int = -(10**18)
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

        any_above_threshold = False

        # Update per-channel speech-start tracking.
        for ch in self.config.channels:
            peak = peaks_dbfs.get(ch.obs_source_name, -90.0)
            state = self._state[ch.obs_source_name]
            state.last_peak_dbfs = peak
            if peak >= ch.threshold_dbfs:
                if state.speech_started_at_ms is None:
                    state.speech_started_at_ms = now_ms
                if ch.camera_target is not None:
                    any_above_threshold = True
            else:
                state.speech_started_at_ms = None

        if any_above_threshold:
            self.last_audio_activity_ms = now_ms
        elif self.last_audio_activity_ms == -(10**18):
            # Engine just started: anchor the silence clock to the first
            # observation so motion fallback waits for real elapsed silence
            # rather than firing on tick zero.
            self.last_audio_activity_ms = now_ms

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

        if best_channel is not None:
            target = self._resolve_healthy(best_channel.camera_target, now_ms)
            if target is None or target == self.current_scene:
                return None
            return self._commit_switch(target, now_ms)

        # Audio-silent fallback: ask motion detector for a target.
        silence = now_ms - self.last_audio_activity_ms
        if (
            self.on_motion_request is not None
            and silence >= self.silence_fallback_ms
        ):
            motion_target = self.on_motion_request(now_ms)
            if motion_target and motion_target != self.current_scene:
                resolved = self._resolve_healthy(motion_target, now_ms)
                if resolved is not None and resolved != self.current_scene:
                    return self._commit_switch(resolved, now_ms, motion=True)

        return None

    last_motion_triggered: bool = field(default=False, init=False, repr=False)

    def _resolve_healthy(self, target: str, now_ms: int) -> str | None:
        """If the target camera is unhealthy, pick another camera with
        recent speech activity that IS healthy, or return None if no
        viable alternative exists."""
        if self.health is None or self.health.is_healthy(target, now_ms):
            return target
        # Try another channel whose camera is healthy and is currently speaking.
        for ch in self.config.channels:
            if ch.camera_target is None or ch.camera_target == target:
                continue
            state = self._state[ch.obs_source_name]
            if state.speech_started_at_ms is None:
                continue
            if self.health.is_healthy(ch.camera_target, now_ms):
                return ch.camera_target
        return None

    def _commit_switch(
        self,
        target: str,
        now_ms: int,
        *,
        motion: bool = False,
    ) -> str:
        self.last_switch_at_ms = now_ms
        self.current_scene = target
        self.last_motion_triggered = motion
        return target
