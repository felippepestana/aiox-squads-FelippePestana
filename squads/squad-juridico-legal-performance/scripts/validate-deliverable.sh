#!/usr/bin/env bash
# validate-deliverable.sh — Valida entregáveis Markdown do Squad Jurídico Legal Performance
#
# Uso:
#   bash validate-deliverable.sh <arquivo.md> --profile civil|recursal|brief|auto
#
# Exit codes:
#   0 = GATE-PASS
#   1 = GATE-FAIL (seções/gates obrigatórios ausentes)
#   2 = WARNING (recomendado, não bloqueante)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DELIVERABLE_FILE="${1:-}"
PROFILE="${2:-}"
if [[ "$PROFILE" == "--profile" ]]; then
  PROFILE="${3:-auto}"
else
  PROFILE="auto"
fi

ok() { echo "  [PASS] $*"; }
warn() { echo "  [WARN] $*"; }
fail() { echo "  [FAIL] $*"; }

usage() {
  echo "Uso: bash validate-deliverable.sh <arquivo.md> [--profile civil|recursal|brief|auto]"
  exit 1
}

[[ -n "$DELIVERABLE_FILE" ]] || usage
[[ -f "$DELIVERABLE_FILE" ]] || { echo "ERRO: Arquivo não encontrado: $DELIVERABLE_FILE"; exit 1; }

detect_profile() {
  if grep -qiE "Modo:\s*RECURSAL|UC-LP-004|Recurso Especial" "$DELIVERABLE_FILE"; then
    echo "recursal"
  elif grep -qiE "Brief de Design|UC-LP-008|Handoff para Apex" "$DELIVERABLE_FILE"; then
    echo "brief"
  else
    echo "civil"
  fi
}

if [[ "$PROFILE" == "auto" ]]; then
  PROFILE="$(detect_profile)"
fi

case "$PROFILE" in
  civil|recursal|brief) ;;
  *) echo "ERRO: profile inválido: $PROFILE"; exit 1 ;;
esac

echo "=== Legal Performance — Deliverable Validation ==="
echo "Arquivo: $DELIVERABLE_FILE"
echo "Profile: $PROFILE"
echo ""

ERRORS=0
WARNINGS=0

require_section() {
  local pattern="$1"
  local label="$2"
  if grep -qiE "$pattern" "$DELIVERABLE_FILE"; then
    ok "Seção: $label"
  else
    fail "Seção ausente: $label"
    ERRORS=$((ERRORS + 1))
  fi
}

require_pattern() {
  local pattern="$1"
  local label="$2"
  if grep -qiE "$pattern" "$DELIVERABLE_FILE"; then
    ok "$label"
  else
    fail "$label"
    ERRORS=$((ERRORS + 1))
  fi
}

warn_pattern() {
  local pattern="$1"
  local label="$2"
  if grep -qiE "$pattern" "$DELIVERABLE_FILE"; then
    ok "$label"
  else
    warn "$label"
    WARNINGS=$((WARNINGS + 1))
  fi
}

# Gates comuns
require_pattern "Revisão Humana|revisão humana" "Revisão humana declarada"

if [[ "$PROFILE" == "brief" ]]; then
  require_section "Objetivo do Produto|## 1\\. Objetivo" "Objetivo do produto"
  require_section "## 2\\. Personas|Personas" "Personas"
  require_section "Jornadas|## 3\\. Jornadas" "Jornadas"
  require_section "Arquitetura de Informação|## 4\\. Arquitetura" "Arquitetura de informação"
  require_section "Componentes|## 5\\. Componentes" "Componentes críticos"
  require_section "Estados de Interface|## 6\\. Estados" "Estados de interface"
  require_pattern "WCAG" "Requisito WCAG AA"
  require_pattern "Handoff para Apex|handoff ao squad .apex" "Handoff Apex documentado"
  warn_pattern "Pendente|pendente até aprovação" "Handoff condicionado à aprovação"
  if grep -qiE 'import React|export default function|<div className=' "$DELIVERABLE_FILE"; then
    fail "Brief contém código de implementação (deve ser apenas especificação)"
    ERRORS=$((ERRORS + 1))
  else
    ok "Sem código de implementação no brief"
  fi
  warn_pattern "rastreabilidade|Evidence Drawer|fonte de cada" "Modelo de rastreabilidade na UI"
else
  require_pattern '```citacoes|tipo:\s*(peca-processual|legislacao|jurisprudencia)' "Bloco de citações rastreadas"
  require_section "Identificação e Escopo|## 1\\. Identificação" "Identificação e escopo"
  require_section "Sumário Executivo|## 2\\. Sumário" "Sumário executivo"
  require_section "Plano de Ação|## 7\\. Plano|## 9\\. Plano" "Plano de ação"
  require_pattern "QG-LP-00[0-9]" "Quality gates referenciados"

  if [[ "$PROFILE" == "civil" ]]; then
    require_section "Triagem e Auditoria|Auditoria Processual" "Triagem/auditoria processual"
    require_section "Estratégia e Cenários|## 6\\. Estratégia" "Estratégia e cenários"
    if grep -qiE "Probabilidade|Otimista|Realista|Pessimista" "$DELIVERABLE_FILE"; then
      ok "Cenários com probabilidades"
      if grep -qiE "100%|100 %" "$DELIVERABLE_FILE"; then
        ok "Referência a soma 100% dos cenários"
      else
        warn "Soma 100% dos cenários não mencionada explicitamente"
        WARNINGS=$((WARNINGS + 1))
      fi
    else
      fail "Cenários estratégicos ausentes"
      ERRORS=$((ERRORS + 1))
    fi
    require_pattern "CPC art\\. 373|ônus" "Risco/ônus da prova (CPC)"
  fi

  if [[ "$PROFILE" == "recursal" ]]; then
    require_section "Checklist de Admissibilidade|Admissibilidade" "Checklist de admissibilidade"
    require_section "Análise de Mérito|mérito recursal" "Análise de mérito recursal"
    require_section "Recomendação Final|Recomendação" "Recomendação final"
    require_pattern "INTERPOR|NÃO INTERPOR|interpor com cautelas" "Recomendação condicionada"
    require_pattern "Súmula 7|sumula 7" "Risco Súmula 7/STJ"
    require_pattern "prequestionamento" "Prequestionamento tratado"
    warn_pattern "[0-9]+ dias" "Prazo restante no plano"
  fi
fi

# Quality gates YAML cross-check (optional warning)
GATES_FILE="$SQUAD_DIR/data/quality-gates.yaml"
if [[ -f "$GATES_FILE" ]]; then
  ok "Catálogo quality-gates.yaml encontrado"
else
  warn "quality-gates.yaml não encontrado em $GATES_FILE"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=== Resultado ==="
echo "Erros: $ERRORS | Warnings: $WARNINGS"

if [[ $ERRORS -gt 0 ]]; then
  echo "Status: GATE-FAIL"
  exit 1
elif [[ $WARNINGS -gt 0 ]]; then
  echo "Status: WARNING"
  exit 2
else
  echo "Status: GATE-PASS"
  exit 0
fi
