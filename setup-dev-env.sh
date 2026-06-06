#!/usr/bin/env bash
# setup-dev-env.sh — Sets up the complete development environment
# Usage: bash setup-dev-env.sh
#
# What this script does:
#   1. Checks system dependencies (node, npm)
#   2. Creates .env files for all applications (from .env.example templates)
#   3. Installs npm dependencies for each application
#   4. Compiles TypeScript where needed
#   5. Prints a checklist of credentials to fill manually

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── 1. Check system dependencies ─────────────────────────────────────────────
step "1/7 — Checking system dependencies"

if ! command -v node &>/dev/null; then
  err "Node.js not found. Install v20+ from: https://nodejs.org/"
  exit 1
fi

NODE_VER="$(node --version | grep -oE '[0-9]+' | head -1)"
if [ "$NODE_VER" -lt 20 ]; then
  err "Node.js v${NODE_VER} detected — requires v20+."
  exit 1
fi
ok "Node.js $(node --version)"

if ! command -v npm &>/dev/null; then
  err "npm not found."
  exit 1
fi
ok "npm $(npm --version)"

# ── 2. Create .env — Root (Docker Compose) ───────────────────────────────────
step "2/7 — Creating .env files"

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    ok "Created .env (root — Docker Compose)"
    warn "Edit .env and fill in ANTHROPIC_API_KEY"
  else
    warn "No .env.example found at root — generating minimal .env"
    echo "ANTHROPIC_API_KEY=" > .env
    ok "Created minimal .env (root)"
    warn "Edit .env and fill in ANTHROPIC_API_KEY"
  fi
else
  ok ".env (root) already exists"
fi

# ── 3. Create .env — Web Portal ──────────────────────────────────────────────
if [ -d "web" ] && [ ! -f "web/.env" ]; then
  cat > web/.env <<'ENVEOF'
# === AIOX Web Portal — Development Environment ===
# Required: Anthropic API key for chat
ANTHROPIC_API_KEY=

# Optional: protects /api/* routes with X-Portal-Key header
# WEB_PORTAL_API_KEY=

# API port (default 8787)
# PORT=8787

# Disable rate limiting in dev
RATE_LIMIT_ENABLED=0

# Sentry (optional in dev)
# SENTRY_DSN=
# VITE_SENTRY_DSN=
ENVEOF
  ok "Created web/.env"
  warn "Edit web/.env and fill in ANTHROPIC_API_KEY"
elif [ -f "web/.env" ]; then
  ok "web/.env already exists"
fi

# ── 4. Create .env — Analista Processual Web ─────────────────────────────────
if [ -d "analista-processual-web" ] && [ ! -f "analista-processual-web/.env.local" ]; then
  cat > analista-processual-web/.env.local <<'ENVEOF'
# === Analista Processual Web — Development Environment ===

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database — Prisma (required)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Redis (optional — for BullMQ job queue)
# REDIS_URL=redis://localhost:6379

# LLM Provider — Primary (required)
OPENAI_API_KEY=sk-...

# LLM Providers — Alternatives (optional)
# ANTHROPIC_API_KEY=sk-ant-...
# DEEPSEEK_API_KEY=sk-...
# QWEN_API_KEY=sk-...
# KIMI_API_KEY=sk-...
# MINIMAX_API_KEY=sk-...
# GEMINI_API_KEY=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Email — Resend (optional)
# RESEND_API_KEY=re_...
# EMAIL_FROM=noreply@yourdomain.com

# Storage
STORAGE_BUCKET=documents
ENVEOF
  ok "Created analista-processual-web/.env.local"
  warn "Edit analista-processual-web/.env.local and fill in Supabase + OpenAI credentials"
elif [ -f "analista-processual-web/.env.local" ]; then
  ok "analista-processual-web/.env.local already exists"
fi

# ── 5. Create .env — Landing Pages (5 alternatives) ──────────────────────────
if [ -d "landing-pages" ]; then
  for lp_dir in landing-pages/alternative-*/; do
    [ -d "$lp_dir" ] || continue
    lp_name="$(basename "$lp_dir")"
    if [ ! -f "${lp_dir}.env" ]; then
      cat > "${lp_dir}.env" <<'ENVEOF'
# === Landing Page — Development Environment ===
# Supabase (required for forms and data)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
ENVEOF
      ok "Created ${lp_dir}.env"
    else
      ok "${lp_dir}.env already exists"
    fi
  done
  warn "Edit landing page .env files with your Supabase credentials"
else
  warn "landing-pages/ directory not found — skipping"
fi

# ── 6. Install npm dependencies ──────────────────────────────────────────────
if [ -d "$SCRIPT_DIR/web" ]; then
  step "3/7 — Installing dependencies: web/"
  cd "$SCRIPT_DIR/web"
  npm install
  ok "web/ — dependencies installed"
fi

if [ -d "$SCRIPT_DIR/chatbot" ]; then
  step "4/7 — Installing dependencies: chatbot/"
  cd "$SCRIPT_DIR/chatbot"
  npm install
  ok "chatbot/ — dependencies installed"
fi

if [ -d "$SCRIPT_DIR/analista-processual-web" ]; then
  step "5/7 — Installing dependencies: analista-processual-web/"
  cd "$SCRIPT_DIR/analista-processual-web"
  npm install --ignore-scripts
  ok "analista-processual-web/ — dependencies installed (--ignore-scripts due to pre-existing Prisma schema error)"
fi

if [ -d "$SCRIPT_DIR/landing-pages" ]; then
  step "6/7 — Installing dependencies: landing pages"
  for lp_dir in "$SCRIPT_DIR"/landing-pages/alternative-*/; do
    [ -d "$lp_dir" ] || continue
    lp_name="$(basename "$lp_dir")"
    if [ -f "${lp_dir}package.json" ]; then
      cd "$lp_dir"
      npm install
      ok "${lp_name} — dependencies installed"
    fi
  done
fi

# ── 7. Compile TypeScript ─────────────────────────────────────────────────────
step "7/7 — Compiling TypeScript"

if [ -d "$SCRIPT_DIR/chatbot" ]; then
  cd "$SCRIPT_DIR/chatbot"
  if npx tsc; then
    ok "chatbot/ — compiled"
  else
    warn "chatbot/ — compilation error (check manually)"
  fi
fi

if [ -d "$SCRIPT_DIR/web" ]; then
  cd "$SCRIPT_DIR/web"
  if npm run build; then
    ok "web/ — compiled (server + client)"
  else
    warn "web/ — build error (check manually)"
  fi
fi

cd "$SCRIPT_DIR"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║            DEVELOPMENT ENVIRONMENT CONFIGURED               ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}CHECKLIST — Fill in credentials in .env files:${NC}"
echo ""
echo -e "${RED}  REQUIRED (nothing works without these):${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 1. web/.env                                              │"
echo "  │    → ANTHROPIC_API_KEY=sk-ant-...                        │"
echo "  │                                                          │"
echo "  │ 2. .env (root — if using Docker Compose)                 │"
echo "  │    → ANTHROPIC_API_KEY=sk-ant-...                        │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${YELLOW}  NEEDED for analista-processual-web:${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 3. analista-processual-web/.env.local                    │"
echo "  │    → NEXT_PUBLIC_SUPABASE_URL                            │"
echo "  │    → NEXT_PUBLIC_SUPABASE_ANON_KEY                       │"
echo "  │    → SUPABASE_SERVICE_ROLE_KEY                           │"
echo "  │    → DATABASE_URL                                        │"
echo "  │    → OPENAI_API_KEY                                      │"
echo "  │    → NEXTAUTH_SECRET (run: openssl rand -base64 32)      │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${YELLOW}  NEEDED for landing pages:${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ 4. landing-pages/alternative-*/.env (all 5)              │"
echo "  │    → VITE_SUPABASE_URL                                   │"
echo "  │    → VITE_SUPABASE_ANON_KEY                              │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${BLUE}  OPTIONAL (monitoring/deploy):${NC}"
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │ • SENTRY_DSN / VITE_SENTRY_DSN (error tracking)         │"
echo "  │ • WEB_PORTAL_API_KEY (protect portal API)                │"
echo "  │ • CLOUDFLARE_API_TOKEN (deploy via GitHub Actions)       │"
echo "  │ • CLOUDFLARE_ACCOUNT_ID (deploy landing pages)           │"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
echo -e "${BOLD}COMMANDS TO START:${NC}"
echo ""
echo "  Web Portal (main):"
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
echo "  Landing Page (any alternative):"
echo "    cd landing-pages/alternative-1-sanctuary && npx vite"
echo "    → App: http://localhost:5173"
echo ""
echo "  Docker Compose (portal + chatbot):"
echo "    docker compose --profile web --profile chatbot up -d --build"
echo ""
echo -e "${BOLD}TESTS:${NC}"
echo "  cd web && npm run test:smoke    # (with server running)"
echo "  cd web && npx tsc --noEmit      # typecheck"
echo "  cd chatbot && npx tsc --noEmit  # typecheck"
echo ""
echo -e "${BOLD}DOCS:${NC}"
echo "  Sentry:      SENTRY_SETUP.md / SENTRY_KEYS_SETUP.md"
echo "  Monitoring:  MONITORING_SETUP.md"
echo "  Uptime:      UPTIME_MONITORING_SETUP.md / UPTIMEROBOT_QUICK_START.md"
echo "  Analytics:   RUM_ANALYTICS_SETUP.md"
echo "  Pending:     PENDING_TASKS.md"
echo ""
