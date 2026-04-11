#!/usr/bin/env bash
# verify-setup.sh — Verifica se o ambiente AIOX Squads esta completo
# Uso: bash scripts/verify-setup.sh
#
# Verifica: ferramentas, dependencias, builds, squads, configs, docker

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
WARN=0
FAIL=0

pass() { echo -e "  ${GREEN}✓${NC} $*"; PASS=$((PASS+1)); }
warn() { echo -e "  ${YELLOW}⚠${NC}  $*"; WARN=$((WARN+1)); }
fail() { echo -e "  ${RED}✗${NC} $*"; FAIL=$((FAIL+1)); }
section() { echo -e "\n${BOLD}$*${NC}"; }

# ── Ferramentas ──────────────────────────────────────────────────────────────
section "1. Ferramentas de Sistema"

for tool in node npm git; do
  if command -v "$tool" &>/dev/null; then
    pass "$tool ($($tool --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1))"
  else
    fail "$tool nao encontrado"
  fi
done

if command -v docker &>/dev/null; then
  pass "docker ($(docker --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1))"
else
  warn "docker nao encontrado (necessario para deploy local)"
fi

if command -v gh &>/dev/null; then
  pass "gh CLI ($(gh --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'))"
else
  warn "gh CLI nao encontrado (necessario para autenticacao GitHub)"
fi

if command -v claude &>/dev/null; then
  pass "Claude Code CLI"
else
  warn "Claude Code CLI nao encontrado (npm install -g @anthropic-ai/claude-code)"
fi

# ── API Key ──────────────────────────────────────────────────────────────────
section "2. Configuracao"

if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  pass "ANTHROPIC_API_KEY definida (${#ANTHROPIC_API_KEY} chars)"
else
  fail "ANTHROPIC_API_KEY nao definida"
fi

if [ -f ".env" ]; then
  if grep -q "^ANTHROPIC_API_KEY=sk-" .env 2>/dev/null; then
    pass ".env com ANTHROPIC_API_KEY configurada"
  else
    warn ".env existe mas ANTHROPIC_API_KEY nao parece configurada"
  fi
else
  warn ".env nao encontrado (cp .env.example .env)"
fi

if [ -f "web/.env" ]; then
  pass "web/.env existe"
else
  warn "web/.env nao encontrado (cp web/.env.example web/.env)"
fi

# ── Dependencias ─────────────────────────────────────────────────────────────
section "3. Dependencias npm"

if [ -d "web/node_modules" ]; then
  pass "web/node_modules instalado"
else
  fail "web/node_modules ausente (cd web && npm install)"
fi

if [ -d "chatbot/node_modules" ]; then
  pass "chatbot/node_modules instalado"
else
  fail "chatbot/node_modules ausente (cd chatbot && npm install)"
fi

# ── Build ────────────────────────────────────────────────────────────────────
section "4. Build"

if [ -d "web/dist" ]; then
  pass "web/dist existe (build completo)"
else
  warn "web/dist nao encontrado (cd web && npm run build)"
fi

if [ -d "chatbot/dist" ]; then
  pass "chatbot/dist existe (build completo)"
else
  warn "chatbot/dist nao encontrado (cd chatbot && npm run build)"
fi

# ── Squads ───────────────────────────────────────────────────────────────────
section "5. Squads"

squad_count=0
squad_errors=0
for squad_dir in squads/*/; do
  if [ -d "$squad_dir" ]; then
    squad_name="$(basename "$squad_dir")"
    squad_count=$((squad_count+1))
    if [ ! -f "${squad_dir}README.md" ]; then
      fail "squad '${squad_name}' sem README.md"
      squad_errors=$((squad_errors+1))
    fi
  fi
done

if [ "$squad_errors" -eq 0 ]; then
  pass "${squad_count} squads validados (todos com README.md)"
fi

# ── Claude Code ──────────────────────────────────────────────────────────────
section "6. Claude Code Config"

if [ -f ".claude/settings.json" ]; then
  pass ".claude/settings.json presente"
else
  warn ".claude/settings.json ausente"
fi

skill_count=0
for skill in .claude/skills/*.md; do
  [ -f "$skill" ] && skill_count=$((skill_count+1))
done
if [ "$skill_count" -gt 0 ]; then
  pass "${skill_count} skills encontrados em .claude/skills/"
else
  warn "Nenhum skill encontrado em .claude/skills/"
fi

# ── Scripts de Deploy ────────────────────────────────────────────────────────
section "7. Scripts de Deploy"

for script in scripts/setup-macos.sh scripts/setup-wsl-env.sh scripts/vps-bootstrap.sh scripts/deploy-vps.sh; do
  if [ -f "$script" ]; then
    if [ -x "$script" ]; then
      pass "$script (executavel)"
    else
      warn "$script existe mas nao e executavel (chmod +x $script)"
    fi
  else
    fail "$script nao encontrado"
  fi
done

if [ -f "deploy/Caddyfile" ]; then
  pass "deploy/Caddyfile presente"
else
  warn "deploy/Caddyfile ausente"
fi

if [ -f "deploy/docker-compose.prod.yml" ]; then
  pass "deploy/docker-compose.prod.yml presente"
else
  warn "deploy/docker-compose.prod.yml ausente"
fi

# ── CI/CD ────────────────────────────────────────────────────────────────────
section "8. GitHub Actions"

workflow_count=0
for wf in .github/workflows/*.yml; do
  [ -f "$wf" ] && workflow_count=$((workflow_count+1))
done
pass "${workflow_count} workflows encontrados"

# ── Git ──────────────────────────────────────────────────────────────────────
section "9. Git"

if [ -d ".git" ]; then
  branch="$(git branch --show-current 2>/dev/null || echo 'unknown')"
  pass "Repositorio git (branch: ${branch})"

  if git remote -v 2>/dev/null | grep -q "github.com"; then
    pass "Remote origin configurado para GitHub"
  else
    warn "Remote origin nao aponta para GitHub"
  fi
else
  fail "Nao e um repositorio git"
fi

# ── Resultado ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}═══════════════════════════════════════${NC}"
echo -e "  ${GREEN}PASS${NC}: ${PASS}   ${YELLOW}WARN${NC}: ${WARN}   ${RED}FAIL${NC}: ${FAIL}"
echo -e "${BOLD}═══════════════════════════════════════${NC}"

if [ "$FAIL" -gt 0 ]; then
  echo -e "\n  ${RED}Ha ${FAIL} problema(s) que precisam ser corrigidos.${NC}"
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo -e "\n  ${YELLOW}Ambiente funcional com ${WARN} aviso(s) opcionais.${NC}"
  exit 0
else
  echo -e "\n  ${GREEN}Ambiente 100% configurado!${NC}"
  exit 0
fi
