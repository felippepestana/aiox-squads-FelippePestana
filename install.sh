#!/usr/bin/env bash
# install.sh — Instala o AIOX Squads com todos os recursos de implantação
# Uso: curl -fsSL https://raw.githubusercontent.com/SynkraAI/aiox-squads/main/install.sh | bash
#
# O que este script faz:
#   1. Verifica dependências (git, node, npm, docker)
#   2. Instala Claude Code CLI (se ausente)
#   3. Clona o repositório aiox-squads
#   4. Instala dependências do chatbot (se presente)
#   5. Configura o devcontainer para desenvolvimento seguro
#   6. Configura o local-deploy (dl) para deploy local
#   7. Exibe próximos passos

set -euo pipefail

REPO_URL="https://github.com/SynkraAI/aiox-squads.git"
INSTALL_DIR="${AIOX_SQUADS_DIR:-aiox-squads-felippepestanav2}"
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

  # Docker é opcional mas recomendado
  if command -v docker &>/dev/null; then
    ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)"
    if docker compose version &>/dev/null 2>&1; then
      ok "Docker Compose v2 (plugin)"
    elif docker-compose --version &>/dev/null 2>&1; then
      warn "docker-compose standalone detectado — recomendado Docker Compose v2 (plugin)."
    fi
  else
    warn "Docker não encontrado — devcontainer e Docker Compose não estarão disponíveis."
    warn "  Instale em: https://docs.docker.com/get-docker/"
  fi
}

# ── Instalar Claude Code CLI ─────────────────────────────────────────────────
install_claude_code() {
  step "Verificando Claude Code CLI..."

  if command -v claude &>/dev/null; then
    ok "Claude Code já instalado: $(claude --version 2>/dev/null || echo 'versão desconhecida')"
    return
  fi

  echo "  Instalando Claude Code CLI..."
  if npm install -g @anthropic-ai/claude-code@latest 2>/dev/null; then
    ok "Claude Code instalado via npm"
    return
  else
    warn "Não foi possível instalar Claude Code via npm."
    warn "  Instale manualmente: curl -fsSL https://claude.ai/install.sh | bash"
  fi
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

# ── Configurar local-deploy (dl) ─────────────────────────────────────────────
setup_local_deploy() {
  if [ ! -f "$INSTALL_DIR/setup-local-deploy.sh" ]; then
    warn "setup-local-deploy.sh não encontrado — pulando configuração do local-deploy."
    return
  fi

  step "Configurando local-deploy (dl)..."

  if command -v dl &>/dev/null; then
    ok "dl já instalado: $(dl version 2>/dev/null | head -1 || echo 'versão desconhecida')"
    return
  fi

  if ! command -v docker &>/dev/null; then
    warn "Docker necessário para local-deploy — pulando."
    warn "  Instale Docker e execute: bash ${INSTALL_DIR}/setup-local-deploy.sh"
    return
  fi

  if ! docker compose version &>/dev/null 2>&1 && \
     ! docker-compose --version &>/dev/null 2>&1; then
    warn "Docker Compose não encontrado para local-deploy — pulando."
    warn "  Instale Docker Compose e execute: bash ${INSTALL_DIR}/setup-local-deploy.sh"
    return
  fi

  bash "$INSTALL_DIR/setup-local-deploy.sh" && \
    ok "local-deploy configurado" || \
    warn "Falha ao configurar local-deploy — execute manualmente: bash ${INSTALL_DIR}/setup-local-deploy.sh"
}

# ── Verificar devcontainer ───────────────────────────────────────────────────
check_devcontainer() {
  step "Verificando devcontainer..."

  if [ ! -f "$INSTALL_DIR/.devcontainer/devcontainer.json" ]; then
    warn "Configuração devcontainer não encontrada."
    return
  fi

  ok "devcontainer.json presente"

  if [ -f "$INSTALL_DIR/.devcontainer/Dockerfile" ]; then
    ok "Dockerfile presente"
  else
    warn "Dockerfile não encontrado em .devcontainer/"
  fi

  if [ -f "$INSTALL_DIR/.devcontainer/init-firewall.sh" ]; then
    ok "init-firewall.sh presente (segurança de rede)"
  else
    warn "init-firewall.sh não encontrado em .devcontainer/"
  fi

  echo ""
  echo "  Para usar o devcontainer:"
  echo "    1. Abra o projeto no VS Code"
  echo "    2. Instale a extensão 'Remote - Containers'"
  echo "    3. Cmd+Shift+P → 'Remote-Containers: Reopen in Container'"
}

# ── Verificar GitHub Actions ─────────────────────────────────────────────────
check_github_actions() {
  step "Verificando GitHub Actions..."

  if [ -f "$INSTALL_DIR/.github/workflows/claude.yml" ]; then
    ok "Workflow Claude Code Actions configurado"
    echo ""
    echo "  Para ativar:"
    echo "    1. No GitHub, vá em Settings → Secrets and variables → Actions"
    echo "    2. Adicione o secret: ANTHROPIC_API_KEY"
    echo "    3. Mencione @claude em issues ou PRs para acionar o Claude"
  else
    warn "Workflow GitHub Actions não encontrado."
  fi
}

# ── Listar squads disponíveis ────────────────────────────────────────────────
list_squads() {
  step "Squads disponíveis"

  local count=0
  for squad_dir in "$INSTALL_DIR"/squads/*/; do
    if [ -d "$squad_dir" ]; then
      squad_name="$(basename "$squad_dir")"
      echo "  - ${squad_name}"
      count=$((count + 1))
    fi
  done

  if [ "$count" -eq 0 ]; then
    warn "Nenhum squad encontrado."
  else
    ok "${count} squads disponíveis"
  fi
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== AIOX Squads instalado com sucesso! ===${NC}"
  echo ""
  echo -e "${BOLD}  Recursos de implantação configurados:${NC}"
  echo ""

  # Checklist de recursos
  [ -d "$INSTALL_DIR/.devcontainer" ] && \
    echo -e "  ${GREEN}✓${NC} Devcontainer (ambiente seguro com firewall)" || \
    echo -e "  ${RED}✗${NC} Devcontainer"

  [ -f "$INSTALL_DIR/.github/workflows/claude.yml" ] && \
    echo -e "  ${GREEN}✓${NC} GitHub Actions (Claude Code CI/CD)" || \
    echo -e "  ${RED}✗${NC} GitHub Actions"

  [ -f "$INSTALL_DIR/docker-compose.chatbot.yml" ] && \
    echo -e "  ${GREEN}✓${NC} Docker Compose (chatbot)" || \
    echo -e "  ${RED}✗${NC} Docker Compose"

  [ -f "$INSTALL_DIR/setup-local-deploy.sh" ] && \
    echo -e "  ${GREEN}✓${NC} Local Deploy (dl)" || \
    echo -e "  ${RED}✗${NC} Local Deploy"

  command -v claude &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Claude Code CLI" || \
    echo -e "  ${YELLOW}⚠${NC}  Claude Code CLI (instale: curl -fsSL https://claude.ai/install.sh | bash)"

  echo ""
  echo -e "${BOLD}  Próximos passos:${NC}"
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
  echo "  5. Devcontainer (VS Code):"
  echo "     cd ${INSTALL_DIR} && code . → 'Reopen in Container'"
  echo ""
  echo "  6. GitHub Actions:"
  echo "     Configure ANTHROPIC_API_KEY em Settings → Secrets → Actions"
  echo ""
  echo "  Documentação: https://github.com/SynkraAI/aiox-squads"
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== AIOX Squads Installer ===${NC}"
  echo -e "  Instalação completa com todos os recursos de implantação"
  echo ""
  check_deps
  install_claude_code
  clone_repo
  install_chatbot
  setup_local_deploy
  check_devcontainer
  check_github_actions
  list_squads
  show_status
}

main "$@"
