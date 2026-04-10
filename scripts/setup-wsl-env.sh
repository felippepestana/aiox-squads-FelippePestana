#!/usr/bin/env bash
# setup-wsl-env.sh — Configura ambiente de desenvolvimento completo no WSL2
# Uso: bash scripts/setup-wsl-env.sh
#
# Pre-requisitos (executar no Windows PowerShell como Admin):
#   wsl --install
#   wsl --set-default-version 2
#   Instalar Docker Desktop com backend WSL2

set -euo pipefail

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

# ── Verificar que estamos no WSL2 ────────────────────────────────────────────
check_wsl() {
  step "Verificando ambiente WSL2..."

  if grep -qi microsoft /proc/version 2>/dev/null; then
    ok "WSL2 detectado"
  else
    warn "Nao parece ser WSL2 — este script foi feito para WSL2, mas continuando..."
  fi
}

# ── Atualizar sistema ────────────────────────────────────────────────────────
update_system() {
  step "Atualizando pacotes do sistema..."
  sudo apt update -qq && sudo apt upgrade -y -qq
  ok "Sistema atualizado"
}

# ── Instalar ferramentas de sistema ──────────────────────────────────────────
install_system_tools() {
  step "Instalando ferramentas de sistema..."

  sudo apt install -y -qq \
    build-essential curl wget unzip jq \
    python3 python3-pip \
    zsh fzf ripgrep \
    dnsutils iproute2 \
    gnupg2 ca-certificates lsb-release \
    nano vim less man-db procps

  ok "Ferramentas de sistema instaladas"
}

# ── Instalar NVM + Node.js ───────────────────────────────────────────────────
install_node() {
  step "Verificando Node.js..."

  if command -v node &>/dev/null; then
    NODE_VER="$(node --version)"
    ok "Node.js ${NODE_VER} ja instalado"
    return
  fi

  echo "  Instalando NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  echo "  Instalando Node.js 22 (producao)..."
  nvm install 22
  echo "  Instalando Node.js 20 (devcontainer compat)..."
  nvm install 20
  nvm alias default 22
  nvm use 22

  ok "Node.js $(node --version) instalado via NVM"
}

# ── Instalar GitHub CLI ──────────────────────────────────────────────────────
install_gh() {
  step "Verificando GitHub CLI..."

  if command -v gh &>/dev/null; then
    ok "gh $(gh --version | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+') ja instalado"
    return
  fi

  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg 2>/dev/null
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update -qq && sudo apt install -y -qq gh

  ok "GitHub CLI instalado"
  echo ""
  echo "  Para autenticar, execute:"
  echo "    gh auth login"
}

# ── Instalar Claude Code CLI ────────────────────────────────────────────────
install_claude_code() {
  step "Verificando Claude Code CLI..."

  if command -v claude &>/dev/null; then
    ok "Claude Code ja instalado: $(claude --version 2>/dev/null || echo 'versao desconhecida')"
    return
  fi

  echo "  Instalando Claude Code CLI..."
  npm install -g @anthropic-ai/claude-code@latest
  ok "Claude Code instalado"
}

# ── Configurar Git ───────────────────────────────────────────────────────────
configure_git() {
  step "Verificando configuracao Git..."

  if git config --global user.name &>/dev/null; then
    ok "Git configurado: $(git config --global user.name) <$(git config --global user.email)>"
  else
    warn "Git nao configurado. Execute:"
    echo '    git config --global user.name "Seu Nome"'
    echo '    git config --global user.email "seu-email@exemplo.com"'
  fi

  # Configurar opcoes uteis
  git config --global init.defaultBranch main
  git config --global pull.rebase false
  git config --global core.autocrlf input
  ok "Git defaults configurados (main branch, autocrlf=input)"
}

# ── Configurar SSH para GitHub ───────────────────────────────────────────────
configure_ssh() {
  step "Verificando chave SSH..."

  if [ -f "$HOME/.ssh/id_ed25519.pub" ]; then
    ok "Chave SSH encontrada"
    echo "  Chave publica:"
    echo "  $(cat "$HOME/.ssh/id_ed25519.pub")"
  else
    warn "Chave SSH nao encontrada. Para criar:"
    echo '    ssh-keygen -t ed25519 -C "seu-email@exemplo.com"'
    echo '    eval "$(ssh-agent -s)"'
    echo '    ssh-add ~/.ssh/id_ed25519'
    echo ""
    echo "  Depois, copie a chave publica e adicione no GitHub:"
    echo '    cat ~/.ssh/id_ed25519.pub'
    echo "  GitHub > Settings > SSH and GPG keys > New SSH key"
  fi
}

# ── Verificar Docker ─────────────────────────────────────────────────────────
check_docker() {
  step "Verificando Docker..."

  if command -v docker &>/dev/null; then
    ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)"
    if docker compose version &>/dev/null 2>&1; then
      ok "Docker Compose v2: $(docker compose version --short 2>/dev/null)"
    else
      warn "Docker Compose nao encontrado — verifique a integracao WSL2 no Docker Desktop"
    fi
  else
    warn "Docker nao disponivel no WSL2."
    echo "  Instale o Docker Desktop para Windows com backend WSL2:"
    echo "  1. Baixe em: https://docs.docker.com/desktop/install/windows-install/"
    echo "  2. Habilite 'Use WSL 2 based engine'"
    echo "  3. Em Settings > Resources > WSL Integration: habilite sua distro"
  fi
}

# ── Configurar ANTHROPIC_API_KEY ─────────────────────────────────────────────
configure_api_key() {
  step "Verificando ANTHROPIC_API_KEY..."

  if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
    ok "ANTHROPIC_API_KEY definida (${#ANTHROPIC_API_KEY} chars)"
  else
    SHELL_RC="$HOME/.bashrc"
    [ -n "${ZSH_VERSION:-}" ] && SHELL_RC="$HOME/.zshrc"

    warn "ANTHROPIC_API_KEY nao definida."
    echo ""
    echo "  Adicione ao ${SHELL_RC}:"
    echo '    echo '\''export ANTHROPIC_API_KEY="sk-ant-SUA_CHAVE"'\'' >> '"${SHELL_RC}"
    echo "    source ${SHELL_RC}"
    echo ""
    echo "  Obtenha sua chave em: https://console.anthropic.com/settings/keys"
  fi
}

# ── Instalar extensoes VS Code ───────────────────────────────────────────────
install_vscode_extensions() {
  step "Verificando VS Code..."

  if command -v code &>/dev/null; then
    ok "VS Code detectado"
    echo "  Instalando extensoes recomendadas..."

    EXTENSIONS=(
      "anthropic.claude-code"
      "ms-vscode-remote.remote-wsl"
      "ms-vscode-remote.remote-containers"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "eamodio.gitlens"
    )

    for ext in "${EXTENSIONS[@]}"; do
      if code --list-extensions 2>/dev/null | grep -qi "${ext}"; then
        ok "  ${ext} (ja instalada)"
      else
        code --install-extension "${ext}" --force 2>/dev/null && \
          ok "  ${ext}" || \
          warn "  ${ext} (falha ao instalar)"
      fi
    done
  else
    warn "VS Code nao detectado no PATH."
    echo "  Instale VS Code para Windows: https://code.visualstudio.com/"
    echo "  Certifique-se de marcar 'Add to PATH' durante a instalacao."
    echo "  Extensoes recomendadas:"
    echo "    - anthropic.claude-code"
    echo "    - ms-vscode-remote.remote-wsl"
    echo "    - ms-vscode-remote.remote-containers"
    echo "    - dbaeumer.vscode-eslint"
    echo "    - esbenp.prettier-vscode"
    echo "    - eamodio.gitlens"
  fi
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== Ambiente de Desenvolvimento Configurado ===${NC}"
  echo ""

  command -v node &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Node.js $(node --version)" || \
    echo -e "  ${RED}✗${NC} Node.js"

  command -v npm &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} npm $(npm --version)" || \
    echo -e "  ${RED}✗${NC} npm"

  command -v git &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} git $(git --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)" || \
    echo -e "  ${RED}✗${NC} git"

  command -v gh &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} GitHub CLI $(gh --version | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')" || \
    echo -e "  ${YELLOW}⚠${NC}  GitHub CLI"

  command -v docker &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)" || \
    echo -e "  ${YELLOW}⚠${NC}  Docker"

  command -v claude &>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Claude Code CLI" || \
    echo -e "  ${YELLOW}⚠${NC}  Claude Code CLI"

  [ -n "${ANTHROPIC_API_KEY:-}" ] && \
    echo -e "  ${GREEN}✓${NC} ANTHROPIC_API_KEY" || \
    echo -e "  ${YELLOW}⚠${NC}  ANTHROPIC_API_KEY"

  echo ""
  echo -e "${BOLD}  Proximos passos:${NC}"
  echo ""
  echo "  1. Autenticar GitHub CLI:  gh auth login"
  echo "  2. Clonar o projeto:       git clone git@github.com:felippepestana/aiox-squads-felippepestana.git aiox-squads-felippepestanav2"
  echo "  3. Instalar deps:          cd aiox-squads-felippepestanav2 && cd web && npm install && cd ../chatbot && npm install"
  echo "  4. Configurar .env:        cp .env.example .env && nano .env"
  echo "  5. Iniciar dev:            cd web && npm run dev"
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== Setup Ambiente WSL2 para AIOX Squads ===${NC}"
  echo -e "  Configuracao completa: ferramentas, Claude Code, GitHub"
  echo ""

  check_wsl
  update_system
  install_system_tools
  install_node
  install_gh
  install_claude_code
  configure_git
  configure_ssh
  check_docker
  configure_api_key
  install_vscode_extensions
  show_status
}

main "$@"
