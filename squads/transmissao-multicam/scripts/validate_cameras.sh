#!/usr/bin/env bash
# validate_cameras.sh
# Smoke validation for OBSBOT cameras connected to the host.
# Usage: bash scripts/validate_cameras.sh
# Exits 0 on PASS, 1 on FAIL.

set -euo pipefail

# Colors for output
ok()   { printf "\033[1;32m[ OK ]\033[0m %s\n" "$1"; }
warn() { printf "\033[1;33m[WARN]\033[0m %s\n" "$1"; }
err()  { printf "\033[1;31m[FAIL]\033[0m %s\n" "$1"; }
step() { printf "\033[1;34m[STEP]\033[0m %s\n" "$1"; }

EXPECTED_CAMERAS=4
# OBSBOT Tiny 2 vendor id (Remo Tech). Confirmed via Linux hardware database
# (3564:fef8). Earlier 3429 is incorrect and silently breaks SuperSpeed checks.
OBSBOT_VID="3564"
FAILURES=0

# Detect platform
PLATFORM="unknown"
case "$(uname -s)" in
  Linux*)  PLATFORM="linux" ;;
  Darwin*) PLATFORM="macos" ;;
  CYGWIN*|MINGW*|MSYS*) PLATFORM="windows" ;;
esac

step "Platform detected: $PLATFORM"

# 1. Check dependencies
step "Checking dependencies"
case "$PLATFORM" in
  linux)
    if ! command -v lsusb >/dev/null 2>&1; then
      err "lsusb not installed (apt install usbutils)"
      exit 1
    fi
    ok "lsusb available"
    ;;
  macos)
    if ! command -v system_profiler >/dev/null 2>&1; then
      err "system_profiler not available"
      exit 1
    fi
    ok "system_profiler available"
    ;;
  windows)
    warn "Windows detected — manual validation via USBTreeView recommended"
    warn "This script provides best-effort detection only"
    ;;
  *)
    err "Unsupported platform"
    exit 1
    ;;
esac

# 2. Detect OBSBOT cameras
step "Detecting OBSBOT cameras"
CAMERA_COUNT=0
case "$PLATFORM" in
  linux)
    CAMERA_COUNT=$(lsusb | grep -ic "obsbot\|${OBSBOT_VID}" || true)
    ;;
  macos)
    CAMERA_COUNT=$(system_profiler SPUSBDataType 2>/dev/null | grep -ic "obsbot" || true)
    ;;
  windows)
    # PowerShell fallback; best-effort. @() forces array semantics so .Count
    # is well-defined even when PowerShell 5.1 returns a single object.
    if command -v powershell.exe >/dev/null 2>&1; then
      CAMERA_COUNT=$(powershell.exe -Command "@(Get-PnpDevice -Class Camera -Status OK | Where-Object FriendlyName -match 'OBSBOT').Count" 2>/dev/null | tr -d '\r' || echo "0")
    fi
    ;;
esac

if [ "${CAMERA_COUNT:-0}" -eq "$EXPECTED_CAMERAS" ]; then
  ok "Found $CAMERA_COUNT OBSBOT cameras (expected $EXPECTED_CAMERAS)"
elif [ "${CAMERA_COUNT:-0}" -gt 0 ]; then
  warn "Found $CAMERA_COUNT OBSBOT cameras (expected $EXPECTED_CAMERAS)"
  FAILURES=$((FAILURES + 1))
else
  err "No OBSBOT cameras detected"
  FAILURES=$((FAILURES + 1))
fi

# 3. Check SuperSpeed negotiation (Linux only — most actionable)
# `lsusb -t` does not include vendor names, so we identify OBSBOT cameras by
# vendor id via /sys/bus/usb/devices/*/idVendor and read the negotiated speed
# from /sys/bus/usb/devices/*/speed (in Mbit/s).
if [ "$PLATFORM" = "linux" ]; then
  step "Checking SuperSpeed negotiation"
  HISPEED_COUNT=0
  SUPERSPEED_COUNT=0
  for dev in /sys/bus/usb/devices/*/; do
    [ -f "${dev}idVendor" ] || continue
    if [ "$(cat "${dev}idVendor" 2>/dev/null)" = "$OBSBOT_VID" ]; then
      speed=$(cat "${dev}speed" 2>/dev/null || echo "")
      case "$speed" in
        5000|10000) SUPERSPEED_COUNT=$((SUPERSPEED_COUNT + 1)) ;;
        480)        HISPEED_COUNT=$((HISPEED_COUNT + 1)) ;;
      esac
    fi
  done

  if [ "$HISPEED_COUNT" -gt 0 ]; then
    err "$HISPEED_COUNT camera(s) negotiated only Hi-Speed (480M). Should be SuperSpeed."
    FAILURES=$((FAILURES + 1))
  fi
  if [ "$SUPERSPEED_COUNT" -gt 0 ]; then
    ok "$SUPERSPEED_COUNT camera(s) at SuperSpeed (5G+)"
  fi
fi

# 4. Warn on D6000 presence
step "Checking for Dell D6000 dock"
case "$PLATFORM" in
  linux)
    if lsusb 2>/dev/null | grep -qi "displaylink\|dell d6000"; then
      warn "DisplayLink device detected. Confirm cameras are NOT plugged into D6000."
    fi
    ;;
  macos)
    if system_profiler SPUSBDataType 2>/dev/null | grep -qi "displaylink\|d6000"; then
      warn "DisplayLink device detected. Confirm cameras are NOT plugged into D6000."
    fi
    ;;
esac

# 5. Summary
echo ""
step "Summary"
if [ "$FAILURES" -eq 0 ]; then
  ok "All checks passed."
  exit 0
else
  err "$FAILURES check(s) failed."
  exit 1
fi
