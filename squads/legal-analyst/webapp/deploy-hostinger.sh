#!/usr/bin/env bash
# =============================================================================
# Legal Analyst Squad — Deploy para Hostinger VPS
# =============================================================================
# Este script automatiza o setup completo em uma VPS Hostinger (Ubuntu 22/24).
#
# MODO DE USO:
#   1. Copie este script para sua VPS:
#      scp deploy-hostinger.sh root@SEU_IP:/root/
#
#   2. Execute na VPS:
#      chmod +x /root/deploy-hostinger.sh
#      /root/deploy-hostinger.sh
#
#   3. Ou execute tudo de uma vez (SSH):
#      ssh root@SEU_IP 'bash -s' < deploy-hostinger.sh
#
# PRE-REQUISITOS:
#   - VPS Hostinger com Ubuntu 22.04 ou 24.04
#   - Acesso root via SSH
#   - Dominio apontando para o IP da VPS (opcional, mas recomendado)
#
# O QUE ESTE SCRIPT FAZ:
#   1. Atualiza o sistema
#   2. Instala Docker, Docker Compose, Node.js 20, Nginx, Certbot
#   3. Clona o repositorio
#   4. Configura variaveis de ambiente
#   5. Build e start dos containers
#   6. Configura Nginx como reverse proxy
#   7. Configura SSL com Let's Encrypt (se dominio informado)
#   8. Configura firewall (UFW)
#   9. Cria servico systemd para auto-restart
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GOLD='\033[0;33m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Configuracao — EDITE AQUI
# ---------------------------------------------------------------------------
REPO_URL="${REPO_URL:-https://github.com/felippepestana/aiox-squads-FelippePestana.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="/opt/legal-analyst"
DOMAIN="${DOMAIN:-}"
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
API_PORT=8000
UI_PORT=3000

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------
echo ""
echo -e "${GOLD}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║   Legal Analyst Squad — Hostinger VPS Deploy            ║${NC}"
echo -e "${GOLD}║   Setup automatizado para Ubuntu 22/24                  ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ---------------------------------------------------------------------------
# Coleta de informacoes
# ---------------------------------------------------------------------------
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}[?] Informe sua ANTHROPIC_API_KEY:${NC}"
  read -r ANTHROPIC_API_KEY
  if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${RED}[x] API key obrigatoria. Obtenha em https://console.anthropic.com/settings/keys${NC}"
    exit 1
  fi
fi

if [ -z "$DOMAIN" ]; then
  echo -e "${YELLOW}[?] Informe o dominio (ex: legal.seudominio.com.br) ou deixe vazio para usar IP:${NC}"
  read -r DOMAIN
fi

if [ "$REPO_URL" = "https://github.com/SEU_USUARIO/aiox-squads-FelippePestana.git" ]; then
  echo -e "${YELLOW}[?] Informe a URL do repositorio Git:${NC}"
  read -r REPO_URL
fi

echo ""
echo -e "${BLUE}Configuracao:${NC}"
echo -e "  Repo:     $REPO_URL"
echo -e "  Branch:   $BRANCH"
echo -e "  Dominio:  ${DOMAIN:-'(sem dominio — acesso por IP)'}"
echo -e "  App dir:  $APP_DIR"
echo ""

# ---------------------------------------------------------------------------
# ETAPA 1: Atualizar sistema
# ---------------------------------------------------------------------------
echo -e "${GREEN}[1/9] Atualizando sistema...${NC}"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git software-properties-common \
  apt-transport-https ca-certificates gnupg lsb-release

# ---------------------------------------------------------------------------
# ETAPA 2: Instalar Docker
# ---------------------------------------------------------------------------
echo -e "${GREEN}[2/9] Instalando Docker...${NC}"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo -e "${GREEN}    Docker instalado: $(docker --version)${NC}"
else
  echo -e "${YELLOW}    Docker ja instalado: $(docker --version)${NC}"
fi

# Instalar Docker Compose plugin (se nao tiver)
if ! docker compose version &>/dev/null; then
  apt-get install -y docker-compose-plugin
fi
echo -e "${GREEN}    Docker Compose: $(docker compose version)${NC}"

# ---------------------------------------------------------------------------
# ETAPA 3: Instalar Node.js 20 (para build do frontend)
# ---------------------------------------------------------------------------
echo -e "${GREEN}[3/9] Instalando Node.js 20...${NC}"
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  echo -e "${GREEN}    Node.js: $(node --version)${NC}"
else
  echo -e "${YELLOW}    Node.js ja instalado: $(node --version)${NC}"
fi

# ---------------------------------------------------------------------------
# ETAPA 4: Instalar Nginx
# ---------------------------------------------------------------------------
echo -e "${GREEN}[4/9] Instalando Nginx...${NC}"
if ! command -v nginx &>/dev/null; then
  apt-get install -y nginx
  systemctl enable nginx
fi
echo -e "${GREEN}    Nginx: $(nginx -v 2>&1)${NC}"

# ---------------------------------------------------------------------------
# ETAPA 5: Clonar repositorio e configurar
# ---------------------------------------------------------------------------
echo -e "${GREEN}[5/9] Clonando repositorio...${NC}"
if [ -d "$APP_DIR" ]; then
  echo -e "${YELLOW}    Diretorio $APP_DIR ja existe. Atualizando...${NC}"
  cd "$APP_DIR"
  git pull origin "$BRANCH" || true
else
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

WEBAPP_DIR="$APP_DIR/squads/legal-analyst/webapp"
cd "$WEBAPP_DIR"

# Criar .env
cat > .env <<ENVFILE
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ANTHROPIC_MODEL=claude-sonnet-4-20250514
API_PORT=${API_PORT}
UI_PORT=${UI_PORT}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY:-}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}
STRIPE_PRICE_ID=${STRIPE_PRICE_ID:-}
APP_URL=${APP_URL:-http://${PUBLIC_IP:-localhost}}
ENVFILE

echo -e "${GREEN}    .env configurado${NC}"

# ---------------------------------------------------------------------------
# ETAPA 6: Build e start dos containers
# ---------------------------------------------------------------------------
echo -e "${GREEN}[6/9] Construindo e iniciando containers...${NC}"
docker compose build
docker compose up -d

echo -e "${GREEN}    Containers iniciados${NC}"
docker compose ps

# ---------------------------------------------------------------------------
# ETAPA 7: Configurar Nginx reverse proxy
# ---------------------------------------------------------------------------
echo -e "${GREEN}[7/9] Configurando Nginx...${NC}"

SERVER_NAME="${DOMAIN:-_}"

cat > /etc/nginx/sites-available/legal-analyst <<NGINXCONF
server {
    listen 80;
    server_name ${SERVER_NAME};

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:${UI_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 50M;
        proxy_read_timeout 120s;
    }

    # Upload endpoint — timeout maior
    location /api/documents/upload {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        client_max_body_size 50M;
        proxy_read_timeout 300s;
    }

    # Stripe webhook — raw body required
    location /api/stripe/webhook {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header Stripe-Signature \$http_stripe_signature;
        proxy_read_timeout 30s;
    }

    # Clips (imagens extraidas)
    location /clips/ {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_set_header Host \$host;
    }

    # Cache de assets estaticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        proxy_pass http://127.0.0.1:${UI_PORT};
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
NGINXCONF

# Ativar site
ln -sf /etc/nginx/sites-available/legal-analyst /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar e reiniciar
nginx -t
systemctl restart nginx

echo -e "${GREEN}    Nginx configurado${NC}"

# ---------------------------------------------------------------------------
# ETAPA 8: SSL com Let's Encrypt (se dominio informado)
# ---------------------------------------------------------------------------
if [ -n "$DOMAIN" ]; then
  echo -e "${GREEN}[8/9] Configurando SSL com Let's Encrypt...${NC}"

  if ! command -v certbot &>/dev/null; then
    apt-get install -y certbot python3-certbot-nginx
  fi

  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    --email "admin@${DOMAIN}" --redirect || {
    echo -e "${YELLOW}    [!] Certbot falhou. Verifique se o DNS do dominio aponta para este IP.${NC}"
    echo -e "${YELLOW}    Execute manualmente: certbot --nginx -d $DOMAIN${NC}"
  }
else
  echo -e "${YELLOW}[8/9] SSL ignorado (sem dominio configurado)${NC}"
fi

# ---------------------------------------------------------------------------
# ETAPA 9: Firewall (UFW)
# ---------------------------------------------------------------------------
echo -e "${GREEN}[9/9] Configurando firewall...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
# Nao expor portas internas
ufw deny "$API_PORT"
ufw deny "$UI_PORT"
echo "y" | ufw enable || true
echo -e "${GREEN}    Firewall configurado (SSH + HTTP/HTTPS abertos)${NC}"

# ---------------------------------------------------------------------------
# Criar servico systemd para auto-restart
# ---------------------------------------------------------------------------
echo -e "${GREEN}[+] Criando servico systemd...${NC}"

cat > /etc/systemd/system/legal-analyst.service <<SYSTEMD
[Unit]
Description=Legal Analyst Squad - Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${WEBAPP_DIR}
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
ExecReload=/usr/bin/docker compose restart
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
SYSTEMD

systemctl daemon-reload
systemctl enable legal-analyst
echo -e "${GREEN}    Servico systemd criado e habilitado${NC}"

# ---------------------------------------------------------------------------
# Resumo final
# ---------------------------------------------------------------------------
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "SEU_IP")

echo ""
echo -e "${GOLD}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║   DEPLOY CONCLUIDO COM SUCESSO!                         ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -n "$DOMAIN" ]; then
  echo -e "${GREEN}Acesse:${NC}"
  echo -e "  App:     ${BLUE}https://${DOMAIN}${NC}"
  echo -e "  API:     ${BLUE}https://${DOMAIN}/api/health${NC}"
  echo -e "  Swagger: ${BLUE}https://${DOMAIN}/api/docs${NC}"
else
  echo -e "${GREEN}Acesse:${NC}"
  echo -e "  App:     ${BLUE}http://${PUBLIC_IP}${NC}"
  echo -e "  API:     ${BLUE}http://${PUBLIC_IP}/api/health${NC}"
  echo -e "  Swagger: ${BLUE}http://${PUBLIC_IP}/api/docs${NC}"
fi

echo ""
echo -e "${GREEN}Comandos uteis:${NC}"
echo -e "  ${GOLD}docker compose -f ${WEBAPP_DIR}/docker-compose.yml logs -f${NC}    # Ver logs"
echo -e "  ${GOLD}systemctl restart legal-analyst${NC}                              # Reiniciar"
echo -e "  ${GOLD}systemctl status legal-analyst${NC}                               # Status"
echo -e "  ${GOLD}docker compose -f ${WEBAPP_DIR}/docker-compose.yml exec backend bash${NC}  # Shell no backend"
echo ""
echo -e "${GREEN}Atualizacao futura:${NC}"
echo -e "  ${GOLD}cd ${APP_DIR} && git pull && cd ${WEBAPP_DIR} && docker compose up -d --build${NC}"
echo ""
