"""Motion detector — F8.

Lightweight wrapper around OpenCV background subtraction that ranks cameras
by recent visual activity. Used by the engine as a fallback when audio is
silent for ``silence_fallback_ms``.

The implementation is decoupled from a real video source: callers feed
frames (numpy arrays) per camera and the detector returns the camera with
the highest motion score. This makes it testable without OpenCV installed.

Real integration uses OpenCV's ``cv2.createBackgroundSubtractorMOG2`` per
camera, fed by frames captured from the OBS preview output via the
``obs-websocket`` ``GetSourceScreenshot`` request.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Mapping


@dataclass
class MotionDetector:
    """Returns the camera target with the highest motion score above a
    configurable threshold. Score units are arbitrary (e.g. fraction of
    pixels changed). Caller decides scale and threshold."""

    threshold: float = 0.005  # 0.5% pixels changed
    _last_scores: dict[str, float] = field(default_factory=dict)

    def update(self, scores: Mapping[str, float]) -> None:
        """Replace scores from the most recent capture round."""
        self._last_scores = dict(scores)

    def best_target(self) -> str | None:
        """Return the camera with the highest motion score, or None if no
        camera exceeds the threshold."""
        if not self._last_scores:
            return None
        best_name, best_score = max(
            self._last_scores.items(), key=lambda item: item[1]
        )
        if best_score < self.threshold:
            return None
        return best_name


def opencv_score(prev_frame, curr_frame) -> float:  # pragma: no cover
    """Compute a motion score using OpenCV. Returns the fraction of pixels
    whose grayscale absolute difference exceeds 25/255.

    Imports are lazy so the package can be installed without OpenCV when
    motion detection is not used.
    """
    import cv2  # type: ignore[import-not-found]
    import numpy as np  # type: ignore[import-not-found]

    gray_prev = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    gray_curr = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)
    delta = cv2.absdiff(gray_prev, gray_curr)
    changed = np.count_nonzero(delta > 25)
    total = delta.size
    return float(changed) / float(total) if total else 0.0
