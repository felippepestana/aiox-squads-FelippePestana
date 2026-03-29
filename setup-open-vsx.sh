#!/usr/bin/env bash
# setup-open-vsx.sh — Configura o Open VSX (open-vsx.org) como marketplace local
# para VS Code, Cursor e Antigravity.
#
# O que este script faz:
#   1. Detecta IDEs instaladas (VS Code, Cursor, Antigravity)
#   2. Configura cada IDE para usar open-vsx.org como Extension Marketplace
#   3. Faz backup do product.json original antes de modificar
#   4. Instala extensões populares via CLI (opcional)
#
# Uso:
#   chmod +x setup-open-vsx.sh
#   ./setup-open-vsx.sh
#
# Referência: https://open-vsx.org/

set -euo pipefail

# ── Cores ─────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
err()  { echo -e "${RED}✗${NC} $*"; }
step() { echo -e "\n${CYAN}→${NC} $*"; }
info() { echo -e "  $*"; }

# ── Variáveis ─────────────────────────────────────────────────────────────────
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
BACKUP_SUFFIX=".bak-$(date +%Y%m%d%H%M%S)"
CONFIGURED_COUNT=0

# ── Open VSX Gallery config ──────────────────────────────────────────────────
# Endpoint oficial do Open VSX Registry
OPENVSX_SERVICE_URL="https://open-vsx.org/vscode/gallery"
OPENVSX_ITEM_URL="https://open-vsx.org/vscode/item"
OPENVSX_CONTROL_URL=""
OPENVSX_NLS_BASE_URL=""
OPENVSX_PUBLISHER_URL="https://open-vsx.org/api"

# ── Detectar caminhos por OS ─────────────────────────────────────────────────
detect_ide_paths() {
  VSCODE_PRODUCT_PATHS=()
  CURSOR_PRODUCT_PATHS=()
  ANTIGRAVITY_PRODUCT_PATHS=()

  case "${OS}" in
    linux)
      # VS Code — instalações comuns no Linux
      VSCODE_PRODUCT_PATHS=(
        "/usr/share/code/resources/app/product.json"
        "/usr/lib/code/product.json"
        "/opt/visual-studio-code/resources/app/product.json"
        "/snap/code/current/usr/share/code/resources/app/product.json"
        "${HOME}/.vscode-server/bin/*/product.json"
      )
      # Cursor
      CURSOR_PRODUCT_PATHS=(
        "/opt/Cursor/resources/app/product.json"
        "/usr/share/cursor/resources/app/product.json"
        "${HOME}/.local/share/cursor/resources/app/product.json"
        "${HOME}/AppImages/cursor/resources/app/product.json"
        "${HOME}/.cursor-server/bin/*/product.json"
      )
      # Antigravity
      ANTIGRAVITY_PRODUCT_PATHS=(
        "/opt/Antigravity/resources/app/product.json"
        "/usr/share/antigravity/resources/app/product.json"
        "${HOME}/.local/share/antigravity/resources/app/product.json"
        "/opt/antigravity/resources/app/product.json"
      )
      ;;
    darwin)
      # VS Code — macOS
      VSCODE_PRODUCT_PATHS=(
        "/Applications/Visual Studio Code.app/Contents/Resources/app/product.json"
        "${HOME}/Applications/Visual Studio Code.app/Contents/Resources/app/product.json"
      )
      # Cursor — macOS
      CURSOR_PRODUCT_PATHS=(
        "/Applications/Cursor.app/Contents/Resources/app/product.json"
        "${HOME}/Applications/Cursor.app/Contents/Resources/app/product.json"
      )
      # Antigravity — macOS
      ANTIGRAVITY_PRODUCT_PATHS=(
        "/Applications/Antigravity.app/Contents/Resources/app/product.json"
        "${HOME}/Applications/Antigravity.app/Contents/Resources/app/product.json"
      )
      ;;
    msys*|mingw*|cygwin*)
      # Windows (Git Bash / MSYS2)
      VSCODE_PRODUCT_PATHS=(
        "${LOCALAPPDATA}/Programs/Microsoft VS Code/resources/app/product.json"
        "C:/Program Files/Microsoft VS Code/resources/app/product.json"
      )
      CURSOR_PRODUCT_PATHS=(
        "${LOCALAPPDATA}/Programs/Cursor/resources/app/product.json"
        "C:/Program Files/Cursor/resources/app/product.json"
      )
      ANTIGRAVITY_PRODUCT_PATHS=(
        "${LOCALAPPDATA}/Programs/Antigravity/resources/app/product.json"
        "C:/Program Files/Antigravity/resources/app/product.json"
      )
      ;;
    *)
      warn "Sistema operacional '${OS}' não reconhecido. Tentando caminhos Linux."
      VSCODE_PRODUCT_PATHS=("/usr/share/code/resources/app/product.json")
      CURSOR_PRODUCT_PATHS=("/opt/Cursor/resources/app/product.json")
      ANTIGRAVITY_PRODUCT_PATHS=("/opt/Antigravity/resources/app/product.json")
      ;;
  esac
}

# ── Verificar dependências ───────────────────────────────────────────────────
check_deps() {
  step "Verificando dependências..."

  if ! command -v jq &>/dev/null; then
    warn "jq não encontrado. Instalando..."
    if command -v apt-get &>/dev/null; then
      sudo apt-get update -qq && sudo apt-get install -y -qq jq
    elif command -v brew &>/dev/null; then
      brew install jq
    elif command -v pacman &>/dev/null; then
      sudo pacman -S --noconfirm jq
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y jq
    else
      err "Não foi possível instalar jq automaticamente. Instale manualmente: https://stedolan.github.io/jq/"
      exit 1
    fi
  fi
  ok "jq $(jq --version 2>/dev/null || echo 'instalado')"

  if ! command -v curl &>/dev/null; then
    err "curl não encontrado. Instale curl para continuar."
    exit 1
  fi
  ok "curl disponível"
}

# ── Verificar conectividade com Open VSX ─────────────────────────────────────
check_openvsx_connectivity() {
  step "Verificando conectividade com open-vsx.org..."

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://open-vsx.org/api/-/search?query=python&size=1" 2>/dev/null || echo "000")

  if [ "${HTTP_CODE}" = "200" ]; then
    ok "open-vsx.org acessível (HTTP ${HTTP_CODE})"
  else
    warn "open-vsx.org retornou HTTP ${HTTP_CODE}. Verifique sua conexão. A configuração será feita mesmo assim."
  fi
}

# ── Patch product.json com Open VSX ──────────────────────────────────────────
patch_product_json() {
  local product_json="$1"
  local ide_name="$2"

  if [ ! -f "${product_json}" ]; then
    return 1
  fi

  info "Encontrado: ${product_json}"

  # Backup
  local backup_path="${product_json}${BACKUP_SUFFIX}"
  if cp "${product_json}" "${backup_path}" 2>/dev/null; then
    info "Backup salvo: ${backup_path}"
  else
    warn "Não foi possível criar backup (permissão?). Tentando com sudo..."
    sudo cp "${product_json}" "${backup_path}"
    info "Backup salvo: ${backup_path}"
  fi

  # Gerar JSON patcheado
  local tmp_file
  tmp_file="$(mktemp)"

  jq --arg serviceUrl "${OPENVSX_SERVICE_URL}" \
     --arg itemUrl "${OPENVSX_ITEM_URL}" \
     --arg publisherUrl "${OPENVSX_PUBLISHER_URL}" \
     '
     .extensionsGallery = {
       "serviceUrl": $serviceUrl,
       "itemUrl": $itemUrl,
       "controlUrl": "",
       "nlsBaseUrl": "",
       "publisherUrl": $publisherUrl
     }
     ' "${product_json}" > "${tmp_file}" 2>/dev/null

  if [ $? -ne 0 ]; then
    err "Falha ao processar ${product_json} com jq"
    rm -f "${tmp_file}"
    return 1
  fi

  # Aplicar patch
  if cp "${tmp_file}" "${product_json}" 2>/dev/null; then
    ok "${ide_name}: Open VSX configurado com sucesso"
  else
    sudo cp "${tmp_file}" "${product_json}"
    ok "${ide_name}: Open VSX configurado com sucesso (via sudo)"
  fi

  rm -f "${tmp_file}"
  CONFIGURED_COUNT=$((CONFIGURED_COUNT + 1))
  return 0
}

# ── Configurar IDE ───────────────────────────────────────────────────────────
configure_ide() {
  local ide_name="$1"
  shift
  local -a paths=("$@")
  local found=false

  step "Configurando ${ide_name}..."

  for path_pattern in "${paths[@]}"; do
    # Expandir globs
    for product_json in ${path_pattern}; do
      if [ -f "${product_json}" ]; then
        if patch_product_json "${product_json}" "${ide_name}"; then
          found=true
        fi
      fi
    done
  done

  if [ "${found}" = false ]; then
    warn "${ide_name}: não encontrado nos caminhos padrão."
    info "Se instalado em local customizado, execute:"
    info "  $0 --custom-path /caminho/para/resources/app/product.json"
  fi
}

# ── Configurar settings.json das IDEs ────────────────────────────────────────
configure_settings() {
  local settings_dir="$1"
  local ide_name="$2"

  if [ ! -d "${settings_dir}" ]; then
    mkdir -p "${settings_dir}" 2>/dev/null || return 1
  fi

  local settings_file="${settings_dir}/settings.json"

  if [ -f "${settings_file}" ]; then
    # Backup do settings.json existente
    cp "${settings_file}" "${settings_file}${BACKUP_SUFFIX}" 2>/dev/null || true

    # Adicionar configuração de gallery ao settings.json
    local tmp_file
    tmp_file="$(mktemp)"
    jq '. + {
      "extensions.gallery.serviceUrl": "https://open-vsx.org/vscode/gallery",
      "extensions.gallery.itemUrl": "https://open-vsx.org/vscode/item"
    }' "${settings_file}" > "${tmp_file}" 2>/dev/null

    if [ $? -eq 0 ]; then
      mv "${tmp_file}" "${settings_file}"
      ok "${ide_name}: settings.json atualizado"
    else
      rm -f "${tmp_file}"
    fi
  else
    cat > "${settings_file}" <<'SETTINGS_EOF'
{
  "extensions.gallery.serviceUrl": "https://open-vsx.org/vscode/gallery",
  "extensions.gallery.itemUrl": "https://open-vsx.org/vscode/item"
}
SETTINGS_EOF
    ok "${ide_name}: settings.json criado com configuração Open VSX"
  fi
}

# ── Configurar settings.json de cada IDE ─────────────────────────────────────
configure_all_settings() {
  step "Configurando settings.json das IDEs..."

  case "${OS}" in
    linux)
      configure_settings "${HOME}/.config/Code/User" "VS Code"
      configure_settings "${HOME}/.config/Cursor/User" "Cursor"
      configure_settings "${HOME}/.config/Antigravity/User" "Antigravity"
      ;;
    darwin)
      configure_settings "${HOME}/Library/Application Support/Code/User" "VS Code"
      configure_settings "${HOME}/Library/Application Support/Cursor/User" "Cursor"
      configure_settings "${HOME}/Library/Application Support/Antigravity/User" "Antigravity"
      ;;
    msys*|mingw*|cygwin*)
      configure_settings "${APPDATA}/Code/User" "VS Code"
      configure_settings "${APPDATA}/Cursor/User" "Cursor"
      configure_settings "${APPDATA}/Antigravity/User" "Antigravity"
      ;;
  esac
}

# ── Instalar extensões populares via CLI ─────────────────────────────────────
install_popular_extensions() {
  step "Instalando extensões populares do Open VSX..."

  # Extensões essenciais disponíveis no open-vsx.org
  local EXTENSIONS=(
    "ms-python.python"
    "esbenp.prettier-vscode"
    "dbaeumer.vscode-eslint"
    "eamodio.gitlens"
    "PKief.material-icon-theme"
    "formulahendry.auto-rename-tag"
    "bradlc.vscode-tailwindcss"
    "ms-azuretools.vscode-docker"
  )

  for ide_cmd in code cursor antigravity; do
    if command -v "${ide_cmd}" &>/dev/null; then
      info "Instalando extensões via '${ide_cmd}' CLI..."
      for ext in "${EXTENSIONS[@]}"; do
        if ${ide_cmd} --install-extension "${ext}" --force 2>/dev/null; then
          ok "${ide_cmd}: ${ext}"
        else
          warn "${ide_cmd}: falha ao instalar ${ext} (pode não existir no Open VSX)"
        fi
      done
    fi
  done
}

# ── Criar script de verificação ──────────────────────────────────────────────
create_verify_script() {
  local verify_script="${HOME}/.local/bin/verify-openvsx.sh"
  mkdir -p "${HOME}/.local/bin" 2>/dev/null || true

  cat > "${verify_script}" <<'VERIFY_EOF'
#!/usr/bin/env bash
# verify-openvsx.sh — Verifica se Open VSX está configurado corretamente
echo "=== Verificação Open VSX ==="
echo ""

check_product() {
  local file="$1" name="$2"
  if [ -f "$file" ]; then
    if grep -q "open-vsx.org" "$file" 2>/dev/null; then
      echo -e "\033[0;32m✓\033[0m ${name}: Open VSX configurado"
    else
      echo -e "\033[0;31m✗\033[0m ${name}: Marketplace padrão (não Open VSX)"
    fi
  fi
}

echo "Testando conectividade..."
if curl -s --max-time 5 "https://open-vsx.org/api/-/search?query=test&size=1" | grep -q "extensions"; then
  echo -e "\033[0;32m✓\033[0m open-vsx.org acessível"
else
  echo -e "\033[0;31m✗\033[0m open-vsx.org inacessível"
fi
echo ""

echo "Verificando configurações..."
# Linux paths
for f in /usr/share/code/resources/app/product.json /opt/visual-studio-code/resources/app/product.json; do
  check_product "$f" "VS Code"
done
for f in /opt/Cursor/resources/app/product.json; do
  check_product "$f" "Cursor"
done
for f in /opt/Antigravity/resources/app/product.json /opt/antigravity/resources/app/product.json; do
  check_product "$f" "Antigravity"
done
echo ""
echo "Para buscar extensões: https://open-vsx.org/"
VERIFY_EOF

  chmod +x "${verify_script}" 2>/dev/null || true
  ok "Script de verificação criado: ${verify_script}"
}

# ── Custom path ──────────────────────────────────────────────────────────────
handle_custom_path() {
  local custom_path="$1"
  if [ -f "${custom_path}" ]; then
    patch_product_json "${custom_path}" "IDE (custom path)"
  else
    err "Arquivo não encontrado: ${custom_path}"
    exit 1
  fi
}

# ── Status final ─────────────────────────────────────────────────────────────
show_status() {
  step "Resumo da instalação"

  echo ""
  if [ "${CONFIGURED_COUNT}" -gt 0 ]; then
    ok "${CONFIGURED_COUNT} IDE(s) configurada(s) para usar Open VSX"
  else
    warn "Nenhum product.json de IDE foi encontrado nos caminhos padrão."
    info "As IDEs podem não estar instaladas ou estão em caminhos customizados."
    info "Os settings.json foram configurados para quando as IDEs forem instaladas."
  fi

  echo ""
  info "O que foi configurado:"
  info "  - Extension Marketplace: https://open-vsx.org/vscode/gallery"
  info "  - Extension Item URL:    https://open-vsx.org/vscode/item"
  info "  - Publisher API:         https://open-vsx.org/api"
  echo ""
  info "Próximos passos:"
  info "  1. Reinicie as IDEs (VS Code, Cursor, Antigravity) para aplicar"
  info "  2. Abra Extensions (Ctrl+Shift+X) — agora aponta para Open VSX"
  info "  3. Busque e instale extensões normalmente"
  info "  4. Verifique: ~/.local/bin/verify-openvsx.sh"
  echo ""
  info "Para reverter, restaure o product.json do backup (.bak-*)"
  info "Documentação Open VSX: https://open-vsx.org/"
  echo ""
}

# ── Ajuda ─────────────────────────────────────────────────────────────────────
show_help() {
  echo "setup-open-vsx.sh — Configura Open VSX para IDEs locais"
  echo ""
  echo "Uso:"
  echo "  ./setup-open-vsx.sh                     Configuração automática"
  echo "  ./setup-open-vsx.sh --custom-path FILE   Configurar um product.json específico"
  echo "  ./setup-open-vsx.sh --skip-extensions    Não instalar extensões"
  echo "  ./setup-open-vsx.sh --help               Exibir esta ajuda"
  echo ""
  echo "IDEs suportadas: VS Code, Cursor, Antigravity"
  echo "Registry: https://open-vsx.org/"
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
  local skip_extensions=false
  local custom_path=""

  while [ $# -gt 0 ]; do
    case "$1" in
      --help|-h)
        show_help
        exit 0
        ;;
      --custom-path)
        custom_path="$2"
        shift 2
        ;;
      --skip-extensions)
        skip_extensions=true
        shift
        ;;
      *)
        err "Opção desconhecida: $1. Use --help para ver opções."
        exit 1
        ;;
    esac
  done

  echo "=========================================="
  echo "  Open VSX — Setup para IDEs locais"
  echo "  Registry: https://open-vsx.org/"
  echo "=========================================="

  check_deps
  check_openvsx_connectivity
  detect_ide_paths

  if [ -n "${custom_path}" ]; then
    handle_custom_path "${custom_path}"
  else
    configure_ide "VS Code"     "${VSCODE_PRODUCT_PATHS[@]}"
    configure_ide "Cursor"      "${CURSOR_PRODUCT_PATHS[@]}"
    configure_ide "Antigravity" "${ANTIGRAVITY_PRODUCT_PATHS[@]}"
  fi

  configure_all_settings

  if [ "${skip_extensions}" = false ]; then
    install_popular_extensions
  fi

  create_verify_script
  show_status
}

main "$@"
