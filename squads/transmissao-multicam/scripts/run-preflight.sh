#!/usr/bin/env bash
# run-preflight.sh
#
# Single-command pre-flight check for the transmissao-multicam squad.
# Runs the cameras + obs-headless validations in order and exits with
# the worst status. Intended for T-2h on the pre-event checklist.
#
# Usage (from anywhere in the squad):
#   bash scripts/run-preflight.sh
#
# Requires:
#   - lsusb (Linux) or system_profiler (macOS)
#   - python3 + obsws-python (pip install obsws-python)
#   - OBS running with WebSocket enabled
#   - Env vars: OBS_WS_HOST, OBS_WS_PORT, OBS_WS_PASSWORD
#     (can be set inline: OBS_WS_PASSWORD=xxx bash scripts/run-preflight.sh)

set -uo pipefail   # NOTE: no -e — we want to keep running so all sub-checks report

# ─── Output helpers ──────────────────────────────────────
ok()    { printf "\033[1;32m[ OK ]\033[0m %s\n" "$1"; }
warn()  { printf "\033[1;33m[WARN]\033[0m %s\n" "$1"; }
err()   { printf "\033[1;31m[FAIL]\033[0m %s\n" "$1"; }
section() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$1"; }

# ─── Path resolution ─────────────────────────────────────
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_ROOT="$(cd "${HERE}/.." && pwd)"
VALIDATE="${HERE}/validate_cameras.sh"
HEADLESS="${HERE}/obs-headless-check.py"

FAIL_COUNT=0
WARN_COUNT=0

# ─── Sub-check 1: USB cameras + SuperSpeed ───────────────
section "1/3 — USB cameras"
if [ -x "$VALIDATE" ]; then
  bash "$VALIDATE"
  rc=$?
  if [ "$rc" -ne 0 ]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
else
  err "validate_cameras.sh not found or not executable at $VALIDATE"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# ─── Sub-check 2: OBS scene pack via WebSocket ───────────
section "2/3 — OBS scenes (obs-headless-check)"
if ! command -v python3 >/dev/null 2>&1; then
  err "python3 not installed; cannot run OBS headless check"
  FAIL_COUNT=$((FAIL_COUNT + 1))
elif [ ! -f "$HEADLESS" ]; then
  err "obs-headless-check.py not found at $HEADLESS"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  if [ -z "${OBS_WS_PASSWORD:-}" ]; then
    warn "OBS_WS_PASSWORD not set; obs-headless-check may fail to authenticate"
    WARN_COUNT=$((WARN_COUNT + 1))
  fi
  python3 "$HEADLESS"
  rc=$?
  if [ "$rc" -ne 0 ]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
fi

# ─── Sub-check 3: optional — OSC bridge reachable ────────
# Only fires if OSC_PORT is set (operator using TouchOSC integration).
section "3/3 — OSC bridge (TouchOSC) — optional"
if [ -z "${OSC_PORT:-}" ]; then
  warn "OSC_PORT not set; skipping (TouchOSC integration not in use)"
else
  if ! command -v nc >/dev/null 2>&1; then
    warn "nc (netcat) not installed; cannot probe UDP port. Skipping."
    WARN_COUNT=$((WARN_COUNT + 1))
  else
    # Probe the bridge by sending a benign OSC-ish UDP packet to its port.
    # We only check that the host doesn't reject the packet with ICMP
    # unreachable; the bridge itself logs invalid OSC and keeps running.
    if ss -lu 2>/dev/null | grep -q ":${OSC_PORT}\b"; then
      ok "OSC bridge listening on UDP :${OSC_PORT}"
    else
      err "Nothing listening on UDP :${OSC_PORT}. Start the bridge first."
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  fi
fi

# ─── Summary ─────────────────────────────────────────────
section "Summary"
echo "Failures: $FAIL_COUNT"
echo "Warnings: $WARN_COUNT"
echo

if [ "$FAIL_COUNT" -eq 0 ]; then
  ok "PRE-FLIGHT PASS — safe to proceed with the next checklist step"
  if [ "$WARN_COUNT" -gt 0 ]; then
    warn "But review warnings above; some are environmental and may need attention."
  fi
  exit 0
else
  err "PRE-FLIGHT FAIL — $FAIL_COUNT sub-check(s) failed. DO NOT GO LIVE."
  err "Fix the failures above before continuing the pre-event checklist."
  exit 1
fi
