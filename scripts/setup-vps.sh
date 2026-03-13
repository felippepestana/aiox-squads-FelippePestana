#!/bin/bash
# ============================================================
# AIOX Legal Squad — Setup Completo para VPS Hostinger
# Domínio: pesnatana.app → 31.97.29.196
# Execute como root: bash setup-vps.sh
# ============================================================
set -e

APP_NAME="aiox-legal"
DEPLOY_PATH="/var/www/aiox-legal"
NODE_VERSION="20"
APP_PORT="3000"
DOMAIN="pesnatana.app"
DOMAIN_WWW="www.pesnatana.app"
VPS_IP="31.97.29.196"
EMAIL_SSL="admin@pesnatana.app"   # e-mail para notificações do Let's Encrypt

# ── Cores ────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[AVISO]${NC} $1"; }
error()   { echo -e "${RED}[ERRO]${NC} $1"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   AIOX Legal Squad — Setup VPS Hostinger    ║"
echo "║   pesnatana.app → 31.97.29.196              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Atualizar sistema ──────────────────────────────────────
info "Atualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq curl wget git build-essential nginx ufw certbot python3-certbot-nginx
success "Sistema atualizado"

# ── 2. Node.js ───────────────────────────────────────────────
info "Instalando Node.js $NODE_VERSION..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y -qq nodejs
fi
success "Node.js: $(node -v)"

# ── 3. PM2 ───────────────────────────────────────────────────
info "Instalando PM2..."
npm install -g pm2 --quiet
pm2 startup systemd -u root --hp /root | tail -1 | bash || true
success "PM2: $(pm2 -v)"

# ── 4. Estrutura de diretórios ────────────────────────────────
info "Criando estrutura de diretórios..."
mkdir -p "$DEPLOY_PATH/releases"
mkdir -p "$DEPLOY_PATH/shared/logs"
mkdir -p "$DEPLOY_PATH/shared/uploads"
chmod -R 755 "$DEPLOY_PATH"
success "Diretório: $DEPLOY_PATH"

# ── 5. Arquivo .env ───────────────────────────────────────────
if [ ! -f "$DEPLOY_PATH/.env" ]; then
  info "Criando arquivo .env base..."
  cat > "$DEPLOY_PATH/.env" << 'ENVEOF'
NODE_ENV=production
PORT=3000

# Claude API — obrigatório (https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-INSIRA_SUA_CHAVE_AQUI

# Segurança — gere com: openssl rand -hex 32
SESSION_SECRET=GERAR_STRING_ALEATORIA_32_CHARS

# Domínio
APP_URL=https://pesnatana.app
ENVEOF
  chmod 600 "$DEPLOY_PATH/.env"
  warn ".env criado em $DEPLOY_PATH/.env — CONFIGURE a ANTHROPIC_API_KEY antes do deploy!"
else
  success ".env já existe — mantido"
fi

# ── 6. Nginx — configuração inicial (HTTP) ───────────────────
info "Configurando Nginx (HTTP inicial)..."
cat > "/etc/nginx/sites-available/$APP_NAME" << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN $DOMAIN_WWW;

    client_max_body_size 10M;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    location /health {
        proxy_pass http://127.0.0.1:$APP_PORT/health;
        access_log off;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/$APP_NAME"
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl reload nginx
success "Nginx HTTP configurado"

# ── 7. SSL com Let's Encrypt ─────────────────────────────────
info "Verificando se o DNS já aponta para este servidor..."
RESOLVED_IP=$(dig +short "$DOMAIN" 2>/dev/null | tail -1 || echo "")

if [ "$RESOLVED_IP" = "$VPS_IP" ]; then
  info "DNS resolvido corretamente para $VPS_IP — obtendo certificado SSL..."
  certbot --nginx \
    -d "$DOMAIN" \
    -d "$DOMAIN_WWW" \
    --email "$EMAIL_SSL" \
    --agree-tos \
    --non-interactive \
    --redirect

  # Renovação automática
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
  success "SSL configurado — https://$DOMAIN"
else
  warn "DNS ainda não aponta para este servidor (detectado: ${RESOLVED_IP:-nenhum})"
  warn "Configure os registros DNS e rode depois:"
  warn "  certbot --nginx -d $DOMAIN -d $DOMAIN_WWW --email $EMAIL_SSL --agree-tos --non-interactive --redirect"
  info "Enquanto isso, a aplicação ficará disponível em http://$VPS_IP"
fi

# ── 8. Chave SSH para GitHub Actions ─────────────────────────
info "Configurando chave SSH para deploy automático (GitHub Actions)..."
SSH_KEY_FILE="/root/.ssh/id_ed25519_github_deploy"
if [ ! -f "$SSH_KEY_FILE" ]; then
  ssh-keygen -t ed25519 -C "github-actions-deploy@pesnatana.app" -f "$SSH_KEY_FILE" -N ""
  success "Chave SSH criada: $SSH_KEY_FILE"
else
  success "Chave SSH já existe — mantida"
fi

mkdir -p /root/.ssh
chmod 700 /root/.ssh
PUBKEY=$(cat "${SSH_KEY_FILE}.pub")
if ! grep -q "$PUBKEY" /root/.ssh/authorized_keys 2>/dev/null; then
  echo "$PUBKEY" >> /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
  success "Chave pública adicionada a authorized_keys"
fi

# ── 9. Firewall ───────────────────────────────────────────────
info "Configurando firewall (UFW)..."
ufw --force reset > /dev/null 2>&1
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1
ufw allow 22/tcp   comment 'SSH'   > /dev/null 2>&1
ufw allow 80/tcp   comment 'HTTP'  > /dev/null 2>&1
ufw allow 443/tcp  comment 'HTTPS' > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
success "Firewall ativo (SSH 22, HTTP 80, HTTPS 443)"

# ── 10. Script de rollback ────────────────────────────────────
cat > "$DEPLOY_PATH/rollback.sh" << 'ROLLBACKEOF'
#!/bin/bash
DEPLOY_PATH="/var/www/aiox-legal"
APP_NAME="aiox-legal"
RELEASES=($(ls -dt "$DEPLOY_PATH/releases"/*/))
if [ ${#RELEASES[@]} -lt 2 ]; then
  echo "❌ Sem releases anteriores disponíveis para rollback"
  exit 1
fi
PREV_RELEASE="${RELEASES[1]}"
echo "⏪ Rollback para: $PREV_RELEASE"
ln -sfn "$PREV_RELEASE" "$DEPLOY_PATH/current"
pm2 reload "$APP_NAME" --update-env
echo "✅ Rollback concluído"
ROLLBACKEOF
chmod +x "$DEPLOY_PATH/rollback.sh"
success "Rollback: $DEPLOY_PATH/rollback.sh"

# ── 11. Resumo ───────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    SETUP CONCLUÍDO ✅                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Node.js  $(node -v)"
echo "  NPM      $(npm -v)"
echo "  PM2      $(pm2 -v)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📋 PASSOS FINAIS:"
echo ""
echo "  1. Configure a ANTHROPIC_API_KEY:"
echo "     nano $DEPLOY_PATH/.env"
echo ""
echo "  2. Configure os 5 secrets no GitHub:"
echo "     (Repo → Settings → Secrets → Actions → New repository secret)"
echo ""
echo "  ┌─────────────────────────────────┬──────────────────────────┐"
echo "  │ HOSTINGER_SSH_HOST              │ 31.97.29.196             │"
echo "  │ HOSTINGER_SSH_USER              │ root                     │"
echo "  │ HOSTINGER_SSH_KEY               │ (chave abaixo)           │"
echo "  │ HOSTINGER_DEPLOY_PATH           │ /var/www/aiox-legal      │"
echo "  │ HOSTINGER_APP_URL               │ https://pesnatana.app    │"
echo "  └─────────────────────────────────┴──────────────────────────┘"
echo ""
echo "  3. Conteúdo do secret HOSTINGER_SSH_KEY (copie TODO abaixo):"
echo ""
cat "$SSH_KEY_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Após secrets configurados: push para 'main' → deploy automático"
echo ""
echo "  Comandos úteis:"
echo "    pm2 status                    → status da aplicação"
echo "    pm2 logs aiox-legal           → logs em tempo real"
echo "    bash $DEPLOY_PATH/rollback.sh → rollback para versão anterior"
echo ""
