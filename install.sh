#!/usr/bin/env bash
# install.sh — Instala o AIOX Squads no diretório atual
# Uso: curl -fsSL https://raw.githubusercontent.com/SynkraAI/aiox-squads/main/install.sh | bash
#
# O que este script faz:
#   1. Verifica dependências (git, node, npm)
#   2. Clona o repositório aiox-squads
#   3. Instala dependências do chatbot
#   4. Compila o projeto
#   5. Exibe próximos passos

set -euo pipefail

REPO_URL="https://github.com/SynkraAI/aiox-squads.git"
INSTALL_DIR="${AIOX_SQUADS_DIR:-aiox-squads}"
NODE_MIN_VERSION=18

# ── Cores ─────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
err()  { echo -e "${RED}✗${NC} $*"; exit 1; }
step() { echo -e "\n${BOLD}→ $*${NC}"; }

# ── Verificar dependências ────────────────────────────────────────────────────
check_deps() {
  step "Verificando dependências..."

  if ! command -v git &>/dev/null; then
    err "git não encontrado. Instale em: https://git-scm.com/downloads"
  fi
  ok "git $(git --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"

  if ! command -v node &>/dev/null; then
    err "Node.js não encontrado. Instale v${NODE_MIN_VERSION}+ em: https://nodejs.org/"
  fi

  NODE_VER="$(node --version | grep -oE '[0-9]+' | head -1)"
  if [ "$NODE_VER" -lt "$NODE_MIN_VERSION" ]; then
    err "Node.js v${NODE_VER} detectado — requer v${NODE_MIN_VERSION}+. Atualize em: https://nodejs.org/"
  fi
  ok "Node.js $(node --version)"

  if ! command -v npm &>/dev/null; then
    err "npm não encontrado. Instale junto com Node.js: https://nodejs.org/"
  fi
  ok "npm $(npm --version)"
}

# ── Clonar repositório ───────────────────────────────────────────────────────
clone_repo() {
  step "Clonando aiox-squads..."

  if [ -d "$INSTALL_DIR" ]; then
    if [ -d "$INSTALL_DIR/.git" ]; then
      warn "Diretório ${INSTALL_DIR} já existe. Atualizando..."
      git -C "$INSTALL_DIR" pull --ff-only || warn "Não foi possível atualizar — usando versão existente."
      return
    else
      err "Diretório ${INSTALL_DIR} já existe e não é um repositório git."
    fi
  fi

  git clone "$REPO_URL" "$INSTALL_DIR"
  ok "Repositório clonado em ${INSTALL_DIR}"
}

# ── Instalar dependências do chatbot ─────────────────────────────────────────
install_chatbot() {
  if [ ! -d "$INSTALL_DIR/chatbot" ]; then
    warn "Diretório chatbot/ não encontrado — pulando instalação do chatbot."
    return
  fi

  step "Instalando dependências do chatbot..."

  cd "$INSTALL_DIR/chatbot"
  npm install --silent
  ok "Dependências instaladas"

  step "Compilando TypeScript..."
  npx tsc
  ok "Build concluído"

  cd - >/dev/null
}

# ── Listar squads disponíveis ────────────────────────────────────────────────
list_squads() {
  step "Squads disponíveis"

  for squad_dir in "$INSTALL_DIR"/squads/*/; do
    squad_name="$(basename "$squad_dir")"
    echo "  - ${squad_name}"
  done
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== AIOX Squads instalado com sucesso! ===${NC}"
  echo ""
  echo "  Próximos passos:"
  echo ""
  echo "  1. Defina sua API key:"
  echo "     export ANTHROPIC_API_KEY=sk-ant-..."
  echo ""
  if [ -d "$INSTALL_DIR/chatbot" ]; then
    echo "  2. Inicie o chatbot (terminal):"
    echo "     cd ${INSTALL_DIR}/chatbot && bash start.sh"
    echo ""
    echo "  3. Ou inicie o chatbot (web):"
    echo "     cd ${INSTALL_DIR}/chatbot && bash web-start.sh"
    echo "     Acesse: http://localhost:3000"
    echo ""
    echo "  4. Ou use com Docker:"
    echo "     cd ${INSTALL_DIR} && ANTHROPIC_API_KEY=sk-ant-... docker compose -f docker-compose.chatbot.yml up"
  else
    echo "  2. Instale um squad no seu projeto AIOX:"
    echo "     cp -r ${INSTALL_DIR}/squads/<nome> ./squads/"
  fi
  echo ""
  echo "  Documentação: https://github.com/SynkraAI/aiox-squads"
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== AIOX Squads Installer ===${NC}"
  check_deps
  clone_repo
  install_chatbot
  list_squads
  show_status
}

main "$@"
