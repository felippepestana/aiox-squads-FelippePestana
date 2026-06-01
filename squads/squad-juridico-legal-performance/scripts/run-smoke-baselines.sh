#!/usr/bin/env bash
# run-smoke-baselines.sh — Valida os três baselines de regressão do squad
#
# Uso (a partir de qualquer diretório):
#   bash squads/squad-juridico-legal-performance/scripts/run-smoke-baselines.sh
#
# Exit codes:
#   0 = todos PASS
#   1 = pelo menos um FAIL
#   2 = apenas WARNINGs (nenhum FAIL)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VALIDATE="$SCRIPT_DIR/validate-deliverable.sh"
BASELINE_DIR="$SQUAD_DIR/examples/expected-outputs"

ok() { echo "[OK] $*"; }
err() { echo "[ERR] $*"; }

if [[ ! -x "$VALIDATE" ]]; then
  chmod +x "$VALIDATE" 2>/dev/null || true
fi

declare -a BASELINES=(
  "civil:$BASELINE_DIR/relatorio-civil-acao-cobranca.md"
  "recursal:$BASELINE_DIR/relatorio-recursal-resp.md"
  "brief:$BASELINE_DIR/brief-dashboard-juridico.md"
)

echo "=== Legal Performance — Smoke Baselines ==="
echo "Squad: $SQUAD_DIR"
echo ""

FAILURES=0
WARNINGS=0
PASSED=0

for entry in "${BASELINES[@]}"; do
  profile="${entry%%:*}"
  file="${entry#*:}"
  echo "--- $profile: $(basename "$file") ---"
  if [[ ! -f "$file" ]]; then
    err "Arquivo ausente: $file"
    FAILURES=$((FAILURES + 1))
    echo ""
    continue
  fi
  set +e
  bash "$VALIDATE" "$file" --profile "$profile"
  code=$?
  set -e
  case $code in
    0) PASSED=$((PASSED + 1)); ok "GATE-PASS" ;;
    1) FAILURES=$((FAILURES + 1)); err "GATE-FAIL" ;;
    2) WARNINGS=$((WARNINGS + 1)); ok "WARNING (aceitável)" ;;
    *) FAILURES=$((FAILURES + 1)); err "Exit inesperado: $code" ;;
  esac
  echo ""
done

echo "=== Resumo ==="
echo "Pass: $PASSED | Warn: $WARNINGS | Fail: $FAILURES"

if [[ $FAILURES -gt 0 ]]; then
  echo "Status geral: FAIL"
  exit 1
fi
if [[ $WARNINGS -gt 0 ]]; then
  echo "Status geral: WARNING"
  exit 2
fi
echo "Status geral: PASS"
exit 0
