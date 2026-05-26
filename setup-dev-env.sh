#!/usr/bin/env bash
# setup-dev-env.sh — Configura o ambiente de desenvolvimento completo
# Uso: bash setup-dev-env.sh
#
# O que este script faz:
#   1. Verifica dependências do sistema (node, npm)
#   2. Cria arquivos .env para todas as aplicações (a partir dos .env.example)
#   3. Instala dependências npm de cada aplicação
#   4. Compila TypeScript onde necessário
#   5. Exibe checklist do que precisa ser preenchido manualmente

set -euo pipefail

# ── Cores ─────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
err()  { echo -e "${RED}✗${NC} $*"; }
step() { echo -e "\n${BLUE}${BOLD}═══ $* ═══${NC}"; }
info() { echo -e "  ${BOLD}→${NC} $*"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── 1. Verificar dependências ─────────────────────────────────────────────────
step "1/7 — Verificando dependências do sistema"

if ! command -v node &>/dev/null; then
  err "Node.js não encontrado. Instale v20+ em: https://nodejs.org/"
  exit 1
fi

NODE_VER="$(node --version | grep -oE '[0-9]+' | head -1)"
if [ "$NODE_VER" -lt 20 ]; then
  err "Node.js v${NODE_VER} detectado — requer v20+."
  exit 1
fi
ok "Node.js $(node --version)"

if ! command -v npm &>/dev/null; then
  err "npm não encontrado."
  exit 1
fi
ok "npm $(npm --version)"

# ── 2. Configurar .env — Raiz (Docker Compose) ───────────────────────────────
step "2/7 — Criando arquivos .env"

if [ ! -f ".env" ]; then
  cp .env.example .env
  ok "Criado .env (raiz — Docker Compose)"
  warn "Edite .env e preencha ANTHROPIC_API_KEY"
else
  ok ".env (raiz) já existe"
fi

# ── 3. Configurar .env — Web Portal ──────────────────────────────────────────
if [ ! -f "web/.env" ]; then
  cat > web/.env <<'ENVEOF'
# === AIOX Web Portal — Ambiente de Desenvolvimento ===
# Obrigatória: chave da API Anthropic para chat
ANTHROPIC_API_KEY=

# Opcional: protege rotas /api/* com header X-Portal-Key
# WEB_PORTAL_API_KEY=

# Porta da API (padrão 8787)
# PORT=8787

# Desabilitar rate limit em dev
RATE_LIMIT_ENABLED=0

# Sentry (opcional em dev)
# SENTRY_DSN=
# VITE_SENTRY_DSN=
ENVEOF
  ok "Criado web/.env"
  warn "Edite web/.env e preencha ANTHROPIC_API_KEY"
else
  ok "web/.env já existe"
fi

# ── 4. Configurar .env — Analista Processual Web ─────────────────────────────
if [ ! -f "analista-processual-web/.env.local" ]; then
  cat > analista-processual-web/.env.local <<'ENVEOF'
# === Analista Processual Web — Ambiente de Desenvolvimento ===

# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database — Prisma (obrigatório)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Redis (opcional — para BullMQ job queue)
# REDIS_URL=redis://localhost:6379

# LLM Provider — Principal (obrigatório)
OPENAI_API_KEY=sk-...

# LLM Providers — Alternativos (opcionais)
# ANTHROPIC_API_KEY=sk-ant-...
# DEEPSEEK_API_KEY=sk-...
# QWEN_API_KEY=sk-...
# KIMI_API_KEY=sk-...
# MINIMAX_API_KEY=sk-...
# GEMINI_API_KEY=...

# Aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Email — Resend (opcional)
# RESEND_API_KEY=re_...
# EMAIL_FROM=noreply@yourdomain.com

# Storage
STORAGE_BUCKET=documents
ENVEOF
  ok "Criado analista-processual-web/.env.local"
  warn "Edite analista-processual-web/.env.local e preencha as credenciais Supabase + OpenAI"
else
  ok "analista-processual-web/.env.local já existe"
fi

# ── 5. Configurar .env — Landing Pages (5 alternativas) ──────────────────────
for lp_dir in landing-pages/alternative-*/; do
  lp_name="$(basename "$lp_dir")"
  if [ ! -f "${lp_dir}.env" ]; then
    cat > "${lp_dir}.env" <<'ENVEOF'
# === Landing Page — Ambiente de Desenvolvimento ===
# Supabase (obrigatório para formulários e dados)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
ENVEOF
    ok "Criado ${lp_dir}.env"
  else
    ok "${lp_dir}.env já existe"
  fi
done
warn "Edite os .env das landing pages com suas credenciais Supabase"

# ── 6. Instalar dependências npm ──────────────────────────────────────────────
step "3/7 — Instalando dependências: web/"
cd "$SCRIPT_DIR/web"
npm install --silent 2>/dev/null || npm install
ok "web/ — dependências instaladas"

step "4/7 — Instalando dependências: chatbot/"
cd "$SCRIPT_DIR/chatbot"
npm install --silent 2>/dev/null || npm install
ok "chatbot/ — dependências instaladas"

step "5/7 — Instalando dependências: analista-processual-web/"
cd "$SCRIPT_DIR/analista-processual-web"
npm install --ignore-scripts --silent 2>/dev/null || npm install --ignore-scripts
ok "analista-processual-web/ — dependências instaladas (--ignore-scripts por erro Prisma pré-existente)"

step "6/7 — Instalando dependências: landing pages"
for lp_dir in "$SCRIPT_DIR"/landing-pages/alternative-*/; do
  lp_name="$(basename "$lp_dir")"
  cd "$lp_dir"
  if [ -f "package.json" ]; then
    npm install --silent 2>/dev/null || npm install
    ok "${lp_name} — dependências instaladas"
  fi
done

# ── 7. Compilar TypeScript ────────────────────────────────────────────────────
step "7/7 — Compilando TypeScript"

cd "$SCRIPT_DIR/chatbot"
npx tsc 2>/dev/null && ok "chatbot/ — compilado" || warn "chatbot/ — erro na compilação (verifique manualmente)"

cd "$SCRIPT_DIR/web"
npm run build 2>/dev/null && ok "web/ — compilado (server + client)" || warn "web/ — erro no build (verifique manualmente)"

cd "$SCRIPT_DIR"

# ── Resumo Final ──────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║           AMBIENTE DE DESENVOLVIMENTO CONFIGURADO           ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}📋 CHECKLIST — Preencha as credenciais nos arquivos .env:${NC}"
echo ""
echo -e "${RED}  OBRIGATÓRIOS (sem estes nada funciona):${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 1. web/.env                                              │"
echo "  │    → ANTHROPIC_API_KEY=sk-ant-...                        │"
echo "  │                                                          │"
echo "  │ 2. .env (raiz — se usar Docker Compose)                  │"
echo "  │    → ANTHROPIC_API_KEY=sk-ant-...                        │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${YELLOW}  NECESSÁRIOS para analista-processual-web:${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 3. analista-processual-web/.env.local                    │"
echo "  │    → NEXT_PUBLIC_SUPABASE_URL                            │"
echo "  │    → NEXT_PUBLIC_SUPABASE_ANON_KEY                       │"
echo "  │    → SUPABASE_SERVICE_ROLE_KEY                           │"
echo "  │    → DATABASE_URL                                        │"
echo "  │    → OPENAI_API_KEY                                      │"
echo "  │    → NEXTAUTH_SECRET (gere: openssl rand -base64 32)     │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${YELLOW}  NECESSÁRIOS para landing pages:${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 4. landing-pages/alternative-*/.env (todos os 5)         │"
echo "  │    → VITE_SUPABASE_URL                                   │"
echo "  │    → VITE_SUPABASE_ANON_KEY                              │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${BLUE}  OPCIONAIS (para monitoramento/deploy):${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ • SENTRY_DSN / VITE_SENTRY_DSN (error tracking)         │"
echo "  │ • WEB_PORTAL_API_KEY (proteger API do portal)            │"
echo "  │ • CLOUDFLARE_API_TOKEN (deploy via GitHub Actions)       │"
echo "  │ • CLOUDFLARE_ACCOUNT_ID (deploy landing pages)           │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${BOLD}🚀 COMANDOS PARA INICIAR:${NC}"
echo ""
echo "  Web Portal (principal):"
echo "    cd web && npm run dev"
echo "    → Frontend: http://localhost:5173"
echo "    → API:      http://localhost:8787"
echo ""
echo "  Chatbot:"
echo "    cd chatbot && ANTHROPIC_API_KEY=sk-ant-... npm run dev"
echo "    → Web: http://localhost:3000"
echo ""
echo "  Analista Processual Web:"
echo "    cd analista-processual-web && npm run dev"
echo "    → App: http://localhost:3000"
echo ""
echo "  Landing Page (qualquer alternativa):"
echo "    cd landing-pages/alternative-1-sanctuary && npx vite"
echo "    → App: http://localhost:5173"
echo ""
echo "  Docker Compose (portal + chatbot):"
echo "    docker compose --profile web --profile chatbot up -d --build"
echo ""
echo -e "${BOLD}🧪 TESTES:${NC}"
echo "  cd web && npm run test:smoke    # (com servidor rodando)"
echo "  cd web && npx tsc --noEmit      # typecheck"
echo "  cd chatbot && npx tsc --noEmit  # typecheck"
echo ""
echo -e "${BOLD}📖 DOCUMENTAÇÃO:${NC}"
echo "  Sentry:     SENTRY_SETUP.md / SENTRY_KEYS_SETUP.md"
echo "  Monitoring:  MONITORING_SETUP.md"
echo "  Uptime:     UPTIME_MONITORING_SETUP.md / UPTIMEROBOT_QUICK_START.md"
echo "  Analytics:  RUM_ANALYTICS_SETUP.md"
echo "  Pendências: PENDING_TASKS.md"
echo ""
