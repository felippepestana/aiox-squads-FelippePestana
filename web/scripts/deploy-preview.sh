#!/bin/bash
set -euo pipefail

ok()   { echo -e "\033[32m✔ $1\033[0m"; }
warn() { echo -e "\033[33m⚠ $1\033[0m"; }
err()  { echo -e "\033[31m✘ $1\033[0m"; exit 1; }
step() { echo -e "\n\033[36m→ $1\033[0m"; }

cd "$(dirname "$0")/.."

step "Checking dependencies"
command -v node  >/dev/null || err "node not found — install Node.js 18+"
command -v npx   >/dev/null || err "npx not found — install Node.js 18+"

step "Installing dependencies"
npm install --silent

step "Building project (client + server + squads bundle)"
npm run build:worker

step "Setting ANTHROPIC_API_KEY secret on Cloudflare Workers"
if [ -f .env ] && grep -q "^ANTHROPIC_API_KEY=." .env; then
    ANTHROPIC_API_KEY=$(grep "^ANTHROPIC_API_KEY=" .env | cut -d= -f2-)
    echo "$ANTHROPIC_API_KEY" | npx wrangler secret put ANTHROPIC_API_KEY
    ok "ANTHROPIC_API_KEY configured from .env"
else
    warn ".env not found or ANTHROPIC_API_KEY is empty"
    echo "   You can set it manually with: npx wrangler secret put ANTHROPIC_API_KEY"
    echo "   Or create a .env file with ANTHROPIC_API_KEY=sk-ant-..."
fi

step "Deploying to Cloudflare Workers"
npx wrangler deploy

ok "Deploy complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Your preview URL is shown above."
echo "  Share it with the client for review."
echo ""
echo "  Useful commands:"
echo "    npx wrangler tail          # live logs"
echo "    npx wrangler secret list   # check secrets"
echo "    npx wrangler delete        # remove when done"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
