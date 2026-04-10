#!/usr/bin/env bash
# setup-macos.sh — Configura ambiente de desenvolvimento completo no macOS (Apple Silicon)
# Uso: bash scripts/setup-macos.sh
#
# Testado em: MacBook Pro M5, 24GB RAM, macOS Sequoia+
# Pre-requisito: Xcode Command Line Tools (instalado automaticamente se ausente)

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

# ── Verificar macOS + Apple Silicon ──────────────────────────────────────────
check_platform() {
  step "Verificando plataforma..."

  if [[ "$(uname -s)" != "Darwin" ]]; then
    err "Este script e para macOS. Para Linux/WSL2 use: bash scripts/setup-wsl-env.sh"
  fi

  ARCH="$(uname -m)"
  if [[ "$ARCH" == "arm64" ]]; then
    ok "macOS Apple Silicon (${ARCH}) detectado"
  else
    warn "macOS Intel (${ARCH}) detectado — script otimizado para Apple Silicon, mas funciona em ambos"
  fi

  SW_VER="$(sw_vers -productVersion)"
  ok "macOS ${SW_VER}"
}

# ── Xcode Command Line Tools ────────────────────────────────────────────────
install_xcode_cli() {
  step "Verificando Xcode Command Line Tools..."

  if xcode-select -p &>/dev/null; then
    ok "Xcode CLI Tools instalado"
  else
    echo "  Instalando Xcode Command Line Tools (pode abrir um dialog)..."
    xcode-select --install 2>/dev/null || true
    echo "  Aguardando instalacao concluir..."
    until xcode-select -p &>/dev/null; do
      sleep 5
    done
    ok "Xcode CLI Tools instalado"
  fi
}

# ── Homebrew ─────────────────────────────────────────────────────────────────
install_homebrew() {
  step "Verificando Homebrew..."

  if command -v brew &>/dev/null; then
    ok "Homebrew $(brew --version | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"
  else
    echo "  Instalando Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Adicionar ao PATH para Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
    fi

    ok "Homebrew instalado"
  fi
}

# ── Ferramentas de sistema via Homebrew ──────────────────────────────────────
install_system_tools() {
  step "Instalando ferramentas de sistema..."

  TOOLS=(jq ripgrep fzf wget curl git-delta gnupg)
  for tool in "${TOOLS[@]}"; do
    if brew list "$tool" &>/dev/null; then
      ok "  ${tool} (ja instalado)"
    else
      brew install "$tool" 2>/dev/null
      ok "  ${tool}"
    fi
  done
}

# ── NVM + Node.js ────────────────────────────────────────────────────────────
install_node() {
  step "Verificando Node.js..."

  if command -v node &>/dev/null; then
    NODE_VER="$(node --version)"
    NODE_MAJOR="${NODE_VER%%.*}"
    NODE_MAJOR="${NODE_MAJOR#v}"
    if [ "$NODE_MAJOR" -ge 20 ]; then
      ok "Node.js ${NODE_VER} ja instalado"
      return
    fi
  fi

  # Instalar NVM se ausente
  if ! command -v nvm &>/dev/null && [ ! -d "$HOME/.nvm" ]; then
    echo "  Instalando NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  fi

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

# ── GitHub CLI ───────────────────────────────────────────────────────────────
install_gh() {
  step "Verificando GitHub CLI..."

  if command -v gh &>/dev/null; then
    ok "gh $(gh --version | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"
    return
  fi

  brew install gh
  ok "GitHub CLI instalado"
  echo ""
  echo "  Para autenticar, execute:"
  echo "    gh auth login"
}

# ── Claude Code CLI ─────────────────────────────────────────────────────────
install_claude_code() {
  step "Verificando Claude Code CLI..."

  if command -v claude &>/dev/null; then
    ok "Claude Code ja instalado: $(claude --version 2>/dev/null || echo 'versao desconhecida')"
    return
  fi

  echo "  Instalando Claude Code CLI..."
  npm install -g @anthropic-ai/claude-code@latest
  ok "Claude Code CLI instalado"
}

# ── Claude Code Desktop App ─────────────────────────────────────────────────
check_claude_desktop() {
  step "Verificando Claude Code Desktop App..."

  if [ -d "/Applications/Claude.app" ]; then
    ok "Claude Desktop App encontrado"
  else
    warn "Claude Desktop App nao encontrado."
    echo "  Baixe em: https://claude.ai/download"
    echo "  Arraste para /Applications e abra."
  fi
}

# ── Docker Desktop ──────────────────────────────────────────────────────────
install_docker() {
  step "Verificando Docker..."

  if command -v docker &>/dev/null; then
    ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)"
    if docker compose version &>/dev/null 2>&1; then
      ok "Docker Compose v2: $(docker compose version --short 2>/dev/null)"
    fi
    return
  fi

  if [ -d "/Applications/Docker.app" ]; then
    warn "Docker Desktop instalado mas nao rodando. Abra o Docker Desktop."
    return
  fi

  echo "  Instalando Docker Desktop via Homebrew Cask..."
  brew install --cask docker
  ok "Docker Desktop instalado"
  echo ""
  echo "  Abra o Docker Desktop para completar a configuracao."
  echo "  Configuracoes recomendadas:"
  echo "    - Memory: 8GB (de 24GB disponiveis)"
  echo "    - CPUs: 4"
  echo "    - Virtual disk limit: 64GB"
  echo "    - Use Virtualization Framework: habilitado"
  echo "    - Use Rosetta: desabilitado (Apple Silicon nativo)"
}

# ── Configurar Git ───────────────────────────────────────────────────────────
configure_git() {
  step "Verificando configuracao Git..."

  if git config --global user.name &>/dev/null; then
    ok "Git configurado: $(git config --global user.name) <$(git config --global user.email)>"
  else
    warn "Git nao configurado. Execute:"
    echo '    git config --global user.name "Felippe Pestana"'
    echo '    git config --global user.email "seu-email@exemplo.com"'
  fi

  # Configurar opcoes uteis para macOS
  git config --global init.defaultBranch main
  git config --global pull.rebase false
  git config --global core.autocrlf input
  git config --global credential.helper osxkeychain
  ok "Git defaults configurados (main branch, osxkeychain credential helper)"
}

# ── SSH para GitHub ──────────────────────────────────────────────────────────
configure_ssh() {
  step "Verificando chave SSH..."

  if [ -f "$HOME/.ssh/id_ed25519.pub" ]; then
    ok "Chave SSH encontrada"
    echo "  Chave publica:"
    echo "  $(cat "$HOME/.ssh/id_ed25519.pub")"
    echo ""
    echo "  Para adicionar ao macOS Keychain:"
    echo "    ssh-add --apple-use-keychain ~/.ssh/id_ed25519"
  else
    warn "Chave SSH nao encontrada. Para criar:"
    echo '    ssh-keygen -t ed25519 -C "seu-email@exemplo.com"'
    echo '    eval "$(ssh-agent -s)"'
    echo '    ssh-add --apple-use-keychain ~/.ssh/id_ed25519'
    echo ""
    echo "  Adicione ao ~/.ssh/config:"
    echo '    Host github.com'
    echo '      AddKeysToAgent yes'
    echo '      UseKeychain yes'
    echo '      IdentityFile ~/.ssh/id_ed25519'
    echo ""
    echo "  Copie e adicione no GitHub > Settings > SSH keys:"
    echo '    pbcopy < ~/.ssh/id_ed25519.pub'
  fi
}

# ── ANTHROPIC_API_KEY ────────────────────────────────────────────────────────
configure_api_key() {
  step "Verificando ANTHROPIC_API_KEY..."

  if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
    ok "ANTHROPIC_API_KEY definida (${#ANTHROPIC_API_KEY} chars)"
  else
    warn "ANTHROPIC_API_KEY nao definida."
    echo ""
    echo "  Adicione ao ~/.zshrc (shell padrao do macOS):"
    echo '    echo '\''export ANTHROPIC_API_KEY="sk-ant-SUA_CHAVE"'\'' >> ~/.zshrc'
    echo "    source ~/.zshrc"
    echo ""
    echo "  Obtenha sua chave em: https://console.anthropic.com/settings/keys"
  fi
}

# ── VS Code ──────────────────────────────────────────────────────────────────
install_vscode() {
  step "Verificando VS Code..."

  if command -v code &>/dev/null; then
    ok "VS Code detectado"

    EXTENSIONS=(
      "anthropic.claude-code"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "eamodio.gitlens"
      "ms-vscode-remote.remote-containers"
    )

    echo "  Instalando extensoes recomendadas..."
    for ext in "${EXTENSIONS[@]}"; do
      if code --list-extensions 2>/dev/null | grep -qi "${ext}"; then
        ok "    ${ext} (ja instalada)"
      else
        code --install-extension "${ext}" --force 2>/dev/null && \
          ok "    ${ext}" || \
          warn "    ${ext} (falha)"
      fi
    done
  elif [ -d "/Applications/Visual Studio Code.app" ]; then
    warn "VS Code instalado mas 'code' nao esta no PATH."
    echo "  Abra VS Code > Cmd+Shift+P > 'Shell Command: Install code in PATH'"
  else
    echo "  Instalando VS Code via Homebrew..."
    brew install --cask visual-studio-code
    ok "VS Code instalado"
    echo "  Abra VS Code > Cmd+Shift+P > 'Shell Command: Install code in PATH'"
  fi
}

# ── Clonar e configurar projeto ──────────────────────────────────────────────
setup_project() {
  step "Verificando projeto AIOX Squads..."

  PROJECT_DIR="${HOME}/projetos/aiox-squads-felippepestanav2"

  if [ -d "${PROJECT_DIR}/.git" ]; then
    ok "Projeto encontrado em ${PROJECT_DIR}"
    return
  fi

  # Verificar se estamos dentro do projeto
  if [ -f "$(pwd)/CLAUDE.md" ] && grep -q "AIOX Squads" "$(pwd)/CLAUDE.md" 2>/dev/null; then
    ok "Ja estamos dentro do projeto AIOX Squads"
    return
  fi

  echo "  Para clonar o projeto:"
  echo "    mkdir -p ${HOME}/projetos"
  echo "    cd ${HOME}/projetos"
  echo "    git clone https://github.com/felippepestana/aiox-squads-felippepestana.git aiox-squads-felippepestanav2"
  echo "    cd aiox-squads-felippepestanav2"
  echo "    cp .env.example .env"
  echo "    nano .env  # preencher ANTHROPIC_API_KEY"
  echo "    cd web && npm install && cd .."
  echo "    cd chatbot && npm install && cd .."
  echo ""
  echo "  Nota: se preferir SSH (requer chave configurada no GitHub):"
  echo "    git clone git@github.com:felippepestana/aiox-squads-felippepestana.git aiox-squads-felippepestanav2"
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== Ambiente macOS Configurado para AIOX Squads ===${NC}"
  echo ""

  # Checklist
  local items=(
    "node:Node.js"
    "npm:npm"
    "git:Git"
    "gh:GitHub CLI"
    "docker:Docker"
    "claude:Claude Code CLI"
  )

  for item in "${items[@]}"; do
    cmd="${item%%:*}"
    label="${item##*:}"
    if command -v "$cmd" &>/dev/null; then
      ver="$("$cmd" --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
      echo -e "  ${GREEN}✓${NC} ${label} ${ver}"
    else
      echo -e "  ${YELLOW}⚠${NC}  ${label} (nao encontrado)"
    fi
  done

  [ -n "${ANTHROPIC_API_KEY:-}" ] && \
    echo -e "  ${GREEN}✓${NC} ANTHROPIC_API_KEY" || \
    echo -e "  ${YELLOW}⚠${NC}  ANTHROPIC_API_KEY"

  [ -d "/Applications/Claude.app" ] && \
    echo -e "  ${GREEN}✓${NC} Claude Desktop App" || \
    echo -e "  ${YELLOW}⚠${NC}  Claude Desktop App"

  echo ""
  echo -e "${BOLD}  Proximos passos:${NC}"
  echo ""
  echo "  1. Configurar API key:    echo 'export ANTHROPIC_API_KEY=\"sk-ant-...\"' >> ~/.zshrc"
  echo "  2. Autenticar GitHub:     gh auth login"
  echo "  3. Clonar projeto:        git clone https://github.com/felippepestana/aiox-squads-felippepestana.git aiox-squads-felippepestanav2"
  echo "  4. Instalar deps:         cd aiox-squads-felippepestanav2 && cd web && npm install && cd ../chatbot && npm install"
  echo "  5. Configurar .env:       cp .env.example .env && nano .env"
  echo "  6. Iniciar dev:           cd web && npm run dev"
  echo "  7. Claude Code:           claude (no diretorio do projeto)"
  echo ""
  echo -e "${BOLD}  Recursos de 24GB RAM — configuracoes recomendadas:${NC}"
  echo "    Docker Desktop: 8GB RAM, 4 CPUs"
  echo "    Node.js:        NODE_OPTIONS=--max-old-space-size=4096"
  echo "    Claude Code:    Funciona nativamente em ARM64 via Node.js"
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== Setup macOS Apple Silicon — AIOX Squads ===${NC}"
  echo -e "  MacBook Pro M5 / 24GB RAM"
  echo ""

  check_platform
  install_xcode_cli
  install_homebrew
  install_system_tools
  install_node
  install_gh
  install_claude_code
  check_claude_desktop
  install_docker
  configure_git
  configure_ssh
  configure_api_key
  install_vscode
  setup_project
  show_status
}

main "$@"
