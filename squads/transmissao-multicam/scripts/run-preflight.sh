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
if [ -f "$VALIDATE" ]; then
  # We invoke with `bash $VALIDATE` so the executable bit isn't required —
  # only readable. This survives clones on Windows / network shares that
  # strip Unix exec bits.
  bash "$VALIDATE"
  rc=$?
  if [ "$rc" -ne 0 ]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
else
  err "validate_cameras.sh not found at $VALIDATE"
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
# Probes the local socket table (NOT a live packet send) so the check is
# cheap and works without DNS or network. Cross-platform: ss on Linux,
# lsof or netstat on macOS / BSDs.
section "3/3 — OSC bridge (TouchOSC) — optional"
if [ -z "${OSC_PORT:-}" ]; then
  warn "OSC_PORT not set; skipping (TouchOSC integration not in use)"
elif ! command -v ss >/dev/null 2>&1 \
  && ! command -v lsof >/dev/null 2>&1 \
  && ! command -v netstat >/dev/null 2>&1; then
  warn "Neither ss, lsof, nor netstat is installed; cannot verify UDP port. Skipping."
  WARN_COUNT=$((WARN_COUNT + 1))
else
  PORT_FOUND=false
  if command -v ss >/dev/null 2>&1; then
    ss -lu 2>/dev/null | grep -q ":${OSC_PORT}\b" && PORT_FOUND=true
  elif command -v lsof >/dev/null 2>&1; then
    lsof -iUDP:"${OSC_PORT}" >/dev/null 2>&1 && PORT_FOUND=true
  elif command -v netstat >/dev/null 2>&1; then
    # BSD/macOS: netstat -an -p udp; ports show as ".PORT" in the address column.
    netstat -an -p udp 2>/dev/null | grep -q "\.${OSC_PORT}\b" && PORT_FOUND=true
  fi

  if [ "$PORT_FOUND" = true ]; then
    ok "OSC bridge listening on UDP :${OSC_PORT}"
  else
    err "Nothing listening on UDP :${OSC_PORT}. Start the bridge first."
    FAIL_COUNT=$((FAIL_COUNT + 1))
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
