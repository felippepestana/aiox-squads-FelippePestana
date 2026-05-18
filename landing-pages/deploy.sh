#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Aliança de Amor — Build & Deploy Script (Cloudflare Pages)
# ============================================================
# Usage:
#   ./deploy.sh [alternative] [--all] [--build-only]
#
# Examples:
#   ./deploy.sh sanctuary          # Build + deploy Alternative 1
#   ./deploy.sh covenant           # Build + deploy Alternative 2
#   ./deploy.sh --all              # Build + deploy all 5
#   ./deploy.sh flame --build-only # Build only, no deploy
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LANDING_DIR="$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
step() { echo -e "${BLUE}[>>]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1" >&2; }

# Map short names to directories
declare -A ALT_MAP=(
  [sanctuary]="alternative-1-sanctuary"
  [covenant]="alternative-2-covenant"
  [flame]="alternative-3-flame"
  [community]="alternative-4-community"
  [pilgrimage]="alternative-5-pilgrimage"
)

# Cloudflare Pages project names
declare -A CF_PROJECTS=(
  [sanctuary]="alianca-de-amor-sanctuary"
  [covenant]="alianca-de-amor-covenant"
  [flame]="alianca-de-amor-flame"
  [community]="alianca-de-amor-community"
  [pilgrimage]="alianca-de-amor-pilgrimage"
)

# ============================================================
# Functions
# ============================================================

check_deps() {
  local missing=()
  command -v node >/dev/null 2>&1 || missing+=("node")
  command -v npm >/dev/null 2>&1  || missing+=("npm")

  if [[ ${#missing[@]} -gt 0 ]]; then
    err "Missing dependencies: ${missing[*]}"
    err "Install Node.js 18+ from https://nodejs.org"
    exit 1
  fi

  local node_version
  node_version=$(node -v | sed 's/v//' | cut -d. -f1)
  if [[ "$node_version" -lt 18 ]]; then
    err "Node.js 18+ required (found v$(node -v))"
    exit 1
  fi
  ok "Node.js $(node -v) and npm $(npm -v) found"
}

build_alternative() {
  local name="$1"
  local dir="${ALT_MAP[$name]}"
  local full_path="$LANDING_DIR/$dir"

  if [[ ! -d "$full_path" ]]; then
    err "Directory not found: $full_path"
    return 1
  fi

  step "Building $name ($dir)..."

  # Install dependencies
  if [[ ! -d "$full_path/node_modules" ]]; then
    step "  Installing dependencies..."
    (cd "$full_path" && npm install --silent) || {
      err "  npm install failed for $name"
      return 1
    }
  fi

  # Build
  step "  Running vite build..."
  (cd "$full_path" && npx vite build) || {
    err "  Build failed for $name"
    return 1
  }

  if [[ -d "$full_path/dist" ]]; then
    local size
    size=$(du -sh "$full_path/dist" | cut -f1)
    ok "  Built $name — output: $full_path/dist ($size)"
  else
    err "  No dist directory created for $name"
    return 1
  fi
}

deploy_alternative() {
  local name="$1"
  local dir="${ALT_MAP[$name]}"
  local project="${CF_PROJECTS[$name]}"
  local full_path="$LANDING_DIR/$dir"

  if [[ ! -d "$full_path/dist" ]]; then
    err "No build output for $name. Run build first."
    return 1
  fi

  if ! command -v wrangler >/dev/null 2>&1; then
    warn "wrangler CLI not found. Install with: npm install -g wrangler"
    warn "Then authenticate: wrangler login"
    warn ""
    warn "Manual deploy command:"
    echo "  npx wrangler pages deploy $full_path/dist --project-name=$project"
    return 0
  fi

  step "Deploying $name to Cloudflare Pages ($project)..."
  (cd "$full_path" && npx wrangler pages deploy dist \
    --project-name="$project" \
    --commit-dirty=true) || {
    warn "Deploy failed. You may need to create the project first:"
    echo "  npx wrangler pages project create $project"
    return 1
  }

  ok "Deployed $name → https://$project.pages.dev"
}

show_usage() {
  echo "Usage: ./deploy.sh [alternative] [--all] [--build-only]"
  echo ""
  echo "Alternatives:"
  echo "  sanctuary   — Alt 1: Dark/spiritual/immersive"
  echo "  covenant    — Alt 2: Modern/minimalist/clean"
  echo "  flame       — Alt 3: Bold/high-conversion"
  echo "  community   — Alt 4: Social proof/people"
  echo "  pilgrimage  — Alt 5: Storytelling/journey"
  echo ""
  echo "Flags:"
  echo "  --all         Build and deploy all 5 alternatives"
  echo "  --build-only  Build without deploying"
  echo ""
  echo "Examples:"
  echo "  ./deploy.sh sanctuary"
  echo "  ./deploy.sh --all --build-only"
  echo "  ./deploy.sh flame"
}

# ============================================================
# Main
# ============================================================

BUILD_ONLY=false
DEPLOY_ALL=false
TARGET=""

for arg in "$@"; do
  case "$arg" in
    --build-only) BUILD_ONLY=true ;;
    --all)        DEPLOY_ALL=true ;;
    --help|-h)    show_usage; exit 0 ;;
    *)
      if [[ -n "${ALT_MAP[$arg]+_}" ]]; then
        TARGET="$arg"
      else
        err "Unknown alternative: $arg"
        show_usage
        exit 1
      fi
      ;;
  esac
done

if [[ -z "$TARGET" && "$DEPLOY_ALL" == "false" ]]; then
  show_usage
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  Aliança de Amor — Landing Pages Deploy             ║"
echo "║  Cloudflare Pages (Free: Unlimited BW, Custom DNS)  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

check_deps

if [[ "$DEPLOY_ALL" == "true" ]]; then
  for alt in sanctuary covenant flame community pilgrimage; do
    echo ""
    echo "━━━ Alternative: $alt ━━━"
    build_alternative "$alt"
    if [[ "$BUILD_ONLY" == "false" ]]; then
      deploy_alternative "$alt"
    fi
  done
else
  build_alternative "$TARGET"
  if [[ "$BUILD_ONLY" == "false" ]]; then
    deploy_alternative "$TARGET"
  fi
fi

echo ""
ok "Done! All operations completed."

if [[ "$BUILD_ONLY" == "false" ]]; then
  echo ""
  echo "📋 Deployed URLs:"
  if [[ "$DEPLOY_ALL" == "true" ]]; then
    for alt in sanctuary covenant flame community pilgrimage; do
      echo "  • $alt → https://${CF_PROJECTS[$alt]}.pages.dev"
    done
  else
    echo "  • $TARGET → https://${CF_PROJECTS[$TARGET]}.pages.dev"
  fi
  echo ""
  echo "🔧 Custom Domain Setup:"
  echo "  1. Go to Cloudflare Dashboard → Pages → your project → Custom Domains"
  echo "  2. Add your domain (e.g., aliancadeamor.com.br)"
  echo "  3. Follow DNS configuration instructions"
fi
