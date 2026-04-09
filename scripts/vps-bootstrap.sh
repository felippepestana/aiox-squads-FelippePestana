#!/usr/bin/env bash
# vps-bootstrap.sh — Bootstrap de VPS para AIOX Squads
# Uso: scp scripts/vps-bootstrap.sh root@<IP>:/tmp/ && ssh root@<IP> 'bash /tmp/vps-bootstrap.sh'
#
# Testado em: Ubuntu 22.04 LTS (Hostinger VPS KVM)
# Instala: Docker, Docker Compose v2, Caddy, Node.js 22, firewall, fail2ban

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

APP_DIR="/opt/aiox-squads"
APP_USER="deploy"

# ── Verificar root ───────────────────────────────────────────────────────────
check_root() {
  if [ "$(id -u)" -ne 0 ]; then
    err "Execute como root: sudo bash $0"
  fi
}

# ── Atualizar sistema ────────────────────────────────────────────────────────
update_system() {
  step "Atualizando sistema..."
  apt update -qq && apt upgrade -y -qq
  apt install -y -qq \
    curl wget git jq unzip \
    ca-certificates gnupg lsb-release \
    software-properties-common
  ok "Sistema atualizado"
}

# ── Criar usuario de deploy ─────────────────────────────────────────────────
create_deploy_user() {
  step "Configurando usuario de deploy..."

  if id "$APP_USER" &>/dev/null; then
    ok "Usuario '${APP_USER}' ja existe"
  else
    useradd -m -s /bin/bash "$APP_USER"
    ok "Usuario '${APP_USER}' criado"
  fi

  # Copiar chaves SSH do root
  if [ -d /root/.ssh ]; then
    mkdir -p "/home/${APP_USER}/.ssh"
    cp /root/.ssh/authorized_keys "/home/${APP_USER}/.ssh/" 2>/dev/null || true
    chown -R "${APP_USER}:${APP_USER}" "/home/${APP_USER}/.ssh"
    chmod 700 "/home/${APP_USER}/.ssh"
    chmod 600 "/home/${APP_USER}/.ssh/authorized_keys" 2>/dev/null || true
    ok "Chaves SSH copiadas para ${APP_USER}"
  fi
}

# ── Docker ───────────────────────────────────────────────────────────────────
install_docker() {
  step "Instalando Docker..."

  if command -v docker &>/dev/null; then
    ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1) ja instalado"
  else
    curl -fsSL https://get.docker.com | sh
    ok "Docker instalado"
  fi

  usermod -aG docker "$APP_USER"
  systemctl enable docker
  systemctl start docker

  if docker compose version &>/dev/null 2>&1; then
    ok "Docker Compose v2: $(docker compose version --short)"
  else
    warn "Docker Compose v2 nao encontrado — verifique a instalacao"
  fi
}

# ── Node.js 22 ───────────────────────────────────────────────────────────────
install_node() {
  step "Instalando Node.js 22..."

  if command -v node &>/dev/null; then
    ok "Node.js $(node --version) ja instalado"
    return
  fi

  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y -qq nodejs
  ok "Node.js $(node --version) instalado"
}

# ── Caddy (reverse proxy + HTTPS automatico) ────────────────────────────────
install_caddy() {
  step "Instalando Caddy..."

  if command -v caddy &>/dev/null; then
    ok "Caddy $(caddy version | head -1) ja instalado"
    return
  fi

  apt install -y -qq debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null
  apt update -qq && apt install -y -qq caddy

  systemctl enable caddy
  ok "Caddy instalado"
}

# ── Firewall (UFW) ──────────────────────────────────────────────────────────
configure_firewall() {
  step "Configurando firewall (UFW)..."

  apt install -y -qq ufw

  ufw default deny incoming
  ufw default allow outgoing
  ufw allow ssh
  ufw allow http
  ufw allow https
  ufw --force enable

  ok "Firewall ativo (SSH, HTTP, HTTPS permitidos)"
}

# ── Fail2Ban ─────────────────────────────────────────────────────────────────
install_fail2ban() {
  step "Instalando Fail2Ban..."

  apt install -y -qq fail2ban

  cat > /etc/fail2ban/jail.local << 'JAIL'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
JAIL

  systemctl enable fail2ban
  systemctl restart fail2ban
  ok "Fail2Ban configurado (ban SSH apos 5 tentativas)"
}

# ── Diretorio do app ────────────────────────────────────────────────────────
setup_app_dir() {
  step "Configurando diretorio da aplicacao..."

  mkdir -p "$APP_DIR"
  chown "${APP_USER}:${APP_USER}" "$APP_DIR"
  ok "Diretorio ${APP_DIR} criado"
}

# ── Log rotation ────────────────────────────────────────────────────────────
setup_logrotate() {
  step "Configurando log rotation..."

  cat > /etc/logrotate.d/aiox-squads << 'LOGROTATE'
/var/log/caddy/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    postrotate
        systemctl reload caddy 2>/dev/null || true
    endscript
}
LOGROTATE

  ok "Log rotation configurado (14 dias)"
}

# ── Swap (para VPS com pouca RAM) ───────────────────────────────────────────
setup_swap() {
  step "Verificando swap..."

  if swapon --show | grep -q "/swapfile"; then
    ok "Swap ja configurado"
    return
  fi

  if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    ok "Swap 2GB criado"
  fi
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== VPS Bootstrap Concluido ===${NC}"
  echo ""

  echo -e "  ${GREEN}✓${NC} Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)"
  echo -e "  ${GREEN}✓${NC} Docker Compose $(docker compose version --short 2>/dev/null)"
  echo -e "  ${GREEN}✓${NC} Node.js $(node --version)"
  echo -e "  ${GREEN}✓${NC} Caddy $(caddy version 2>/dev/null | head -1)"
  echo -e "  ${GREEN}✓${NC} UFW (firewall)"
  echo -e "  ${GREEN}✓${NC} Fail2Ban"
  echo -e "  ${GREEN}✓${NC} App dir: ${APP_DIR}"
  echo -e "  ${GREEN}✓${NC} Deploy user: ${APP_USER}"

  echo ""
  echo -e "${BOLD}  Proximos passos:${NC}"
  echo ""
  echo "  1. Copie o Caddyfile para /etc/caddy/Caddyfile"
  echo "  2. Configure DNS do dominio para apontar para este IP"
  echo "  3. Faca deploy com: bash scripts/deploy-vps.sh"
  echo "  4. Verifique HTTPS: curl https://seudominio.com.br"
  echo ""
  echo "  IP deste servidor: $(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== VPS Bootstrap — AIOX Squads ===${NC}"
  echo ""

  check_root
  update_system
  create_deploy_user
  install_docker
  install_node
  install_caddy
  configure_firewall
  install_fail2ban
  setup_app_dir
  setup_logrotate
  setup_swap
  show_status
}

main "$@"
