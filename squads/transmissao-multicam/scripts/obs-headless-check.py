#!/usr/bin/env python3
"""
obs-headless-check.py

Smoke E2E test for the transmissao-multicam scene pack via obs-websocket v5.
Connects to a running OBS instance, iterates through all 10 expected scenes,
and reports OK/FAIL per scene plus an overall status.

Usage:
    pip install obsws-python
    OBS_WS_HOST=localhost OBS_WS_PORT=4455 OBS_WS_PASSWORD=<secret> \\
        python3 scripts/obs-headless-check.py

Exit codes:
    0 — all scenes OK
    1 — one or more scenes failed
    2 — connection or configuration error
"""

import os
import sys
import time
from typing import List

EXPECTED_SCENES: List[str] = [
    "STANDBY",
    "CAM1",
    "CAM2",
    "CAM3",
    "CAM4",
    "GRID",
    "SLIDES_FULL",
    "SLIDES_PIP",
    "TELA_PIP",
    "ENCERRAMENTO",
]

DWELL_SECONDS = 2.0  # how long to remain on each scene before validating


def fail(msg: str, code: int = 2) -> None:
    print(f"[FAIL] {msg}", file=sys.stderr)
    sys.exit(code)


def main() -> int:
    try:
        import obsws_python as obs
    except ImportError:
        fail("obsws-python not installed. Run: pip install obsws-python")

    host = os.environ.get("OBS_WS_HOST", "localhost")
    port = int(os.environ.get("OBS_WS_PORT", "4455"))
    password = os.environ.get("OBS_WS_PASSWORD", "")

    if not password:
        print("[WARN] OBS_WS_PASSWORD not set. Connecting without auth.")

    print(f"[STEP] Connecting to obs-websocket at {host}:{port}")
    try:
        client = obs.ReqClient(host=host, port=port, password=password, timeout=5)
    except Exception as exc:
        fail(f"Connection failed: {exc}")

    try:
        scene_list = client.get_scene_list()
    except Exception as exc:
        fail(f"Failed to fetch scenes: {exc}")

    available = {s["sceneName"] for s in scene_list.scenes}

    missing = [name for name in EXPECTED_SCENES if name not in available]
    if missing:
        print(f"[FAIL] Missing scenes: {missing}", file=sys.stderr)
        return 1

    print(f"[OK]   All {len(EXPECTED_SCENES)} expected scenes present.")

    failures = 0
    for scene in EXPECTED_SCENES:
        print(f"[STEP] Switching to {scene}", flush=True)
        switch_start = time.monotonic()

        try:
            client.set_current_program_scene(scene)
        except Exception as exc:
            print(f"[FAIL] Could not switch to {scene}: {exc}")
            failures += 1
            continue

        time.sleep(DWELL_SECONDS)

        try:
            current = client.get_current_program_scene()
            current_name = getattr(current, "current_program_scene_name", None) or \
                getattr(current, "scene_name", None)
        except Exception as exc:
            print(f"[FAIL] Could not query active scene after switch to {scene}: {exc}")
            failures += 1
            continue

        elapsed_ms = (time.monotonic() - switch_start) * 1000

        if current_name == scene:
            print(f"[OK]   {scene} active (round-trip ~{elapsed_ms:.0f} ms)")
        else:
            print(f"[FAIL] Expected {scene}, got {current_name}")
            failures += 1

    print("")
    if failures == 0:
        print(f"[PASS] All {len(EXPECTED_SCENES)} scenes verified.")
        return 0

    print(f"[FAIL] {failures}/{len(EXPECTED_SCENES)} scene(s) failed.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
