#!/usr/bin/env bash
# deploy-vps.sh — Deploy do AIOX Squads para VPS via SSH
# Uso: VPS_HOST=<ip> bash scripts/deploy-vps.sh
#
# Variaveis de ambiente:
#   VPS_HOST  — IP ou dominio do VPS (obrigatorio)
#   VPS_USER  — Usuario SSH (padrao: deploy)
#   APP_DIR   — Diretorio no VPS (padrao: /opt/aiox-squads)

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

VPS_HOST="${VPS_HOST:?Defina VPS_HOST com o IP ou dominio do VPS}"
VPS_USER="${VPS_USER:-deploy}"
APP_DIR="${APP_DIR:-/opt/aiox-squads}"
SSH_OPTS="-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10"

# ── Verificar conexao SSH ────────────────────────────────────────────────────
check_ssh() {
  step "Verificando conexao SSH..."
  # shellcheck disable=SC2086
  if ssh ${SSH_OPTS} "${VPS_USER}@${VPS_HOST}" 'echo ok' &>/dev/null; then
    ok "Conexao SSH com ${VPS_USER}@${VPS_HOST}"
  else
    err "Falha ao conectar via SSH. Verifique:\n  - Chave SSH configurada\n  - VPS_HOST=${VPS_HOST}\n  - VPS_USER=${VPS_USER}"
  fi
}

# ── Sincronizar codigo ──────────────────────────────────────────────────────
sync_code() {
  step "Sincronizando codigo..."

  rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude 'web/dist' \
    --exclude 'chatbot/dist' \
    --exclude 'web/node_modules' \
    --exclude 'chatbot/node_modules' \
    --exclude '.DS_Store' \
    -e "ssh ${SSH_OPTS}" \
    ./ "${VPS_USER}@${VPS_HOST}:${APP_DIR}/"

  ok "Codigo sincronizado para ${APP_DIR}"
}

# ── Verificar .env no VPS ────────────────────────────────────────────────────
check_env() {
  step "Verificando .env no VPS..."

  # shellcheck disable=SC2086,SC2029
  if ssh ${SSH_OPTS} "${VPS_USER}@${VPS_HOST}" "test -f ${APP_DIR}/.env"; then
    ok ".env encontrado no VPS"
  else
    warn ".env nao encontrado no VPS."
    echo "  Copie manualmente:"
    echo "    scp .env.production ${VPS_USER}@${VPS_HOST}:${APP_DIR}/.env"
    echo ""
    echo "  Ou crie diretamente no VPS:"
    echo "    ssh ${VPS_USER}@${VPS_HOST} 'nano ${APP_DIR}/.env'"
    echo ""
    echo "  Conteudo minimo:"
    echo "    ANTHROPIC_API_KEY=sk-ant-..."
    echo "    TRUST_PROXY=1"
    echo "    RATE_LIMIT_ENABLED=1"
    err "Impossivel continuar sem .env no VPS"
  fi
}

# ── Build e deploy ───────────────────────────────────────────────────────────
deploy() {
  step "Executando build e deploy no VPS..."

  # shellcheck disable=SC2086,SC2029
  ssh ${SSH_OPTS} "${VPS_USER}@${VPS_HOST}" << REMOTE
    set -euo pipefail
    cd ${APP_DIR}

    echo "→ Building e iniciando containers..."
    docker compose --profile web --profile chatbot up -d --build --remove-orphans

    echo "→ Aguardando servicos ficarem saudaveis..."
    sleep 10

    echo "→ Status dos containers:"
    docker compose ps

    echo ""
    echo "→ Health check web:"
    curl -sf http://localhost:8787/api/health && echo " OK" || echo " FAIL"

    echo "→ Health check chatbot:"
    curl -sf http://localhost:3000/ && echo " OK" || echo " FAIL"
REMOTE

  ok "Deploy concluido"
}

# ── Atualizar Caddy ──────────────────────────────────────────────────────────
update_caddy() {
  step "Atualizando Caddyfile..."

  if [ -f "deploy/Caddyfile" ]; then
    # shellcheck disable=SC2086
    scp ${SSH_OPTS} deploy/Caddyfile "${VPS_USER}@${VPS_HOST}:/tmp/Caddyfile.new"
    # shellcheck disable=SC2086,SC2029
    ssh ${SSH_OPTS} "${VPS_USER}@${VPS_HOST}" \
      'sudo cp /tmp/Caddyfile.new /etc/caddy/Caddyfile && sudo systemctl reload caddy'
    ok "Caddyfile atualizado"
  else
    warn "deploy/Caddyfile nao encontrado — pulando atualizacao do Caddy"
  fi
}

# ── Limpeza ──────────────────────────────────────────────────────────────────
cleanup() {
  step "Limpando imagens Docker antigas..."

  # shellcheck disable=SC2086,SC2029
  ssh ${SSH_OPTS} "${VPS_USER}@${VPS_HOST}" \
    'docker image prune -f 2>/dev/null || true'

  ok "Imagens antigas removidas"
}

# ── Status final ──────────────────────────────────────────────────────────────
show_status() {
  echo ""
  echo -e "${GREEN}${BOLD}=== Deploy Concluido ===${NC}"
  echo ""
  echo "  VPS:     ${VPS_USER}@${VPS_HOST}"
  echo "  App dir: ${APP_DIR}"
  echo ""
  echo "  Web:     http://${VPS_HOST}:8787"
  echo "  Chatbot: http://${VPS_HOST}:3000"
  echo ""
  echo "  Logs:    ssh ${VPS_USER}@${VPS_HOST} 'cd ${APP_DIR} && docker compose logs -f'"
  echo "  Status:  ssh ${VPS_USER}@${VPS_HOST} 'cd ${APP_DIR} && docker compose ps'"
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}=== Deploy AIOX Squads → VPS ===${NC}"
  echo ""

  check_ssh
  sync_code
  check_env
  deploy
  update_caddy
  cleanup
  show_status
}

main "$@"
