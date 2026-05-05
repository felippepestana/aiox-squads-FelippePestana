#!/bin/bash
set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
ok() { echo -e "${GREEN}✅${NC} $1"; }
warn() { echo -e "${YELLOW}⚠️${NC} $1"; }
err() { echo -e "${RED}❌${NC} $1"; }
step() { echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${BLUE}$1${NC}"; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

step "DIAGNÓSTICO MCP CLAUDE CODE"

echo ""
echo "1️⃣ Docker Status:"
if docker info > /dev/null 2>&1; then
  ok "Docker rodando"
  docker info | grep "Server Version" | sed 's/^/   /'
else
  err "Docker OFF - abra o Docker Desktop ou verifique o daemon"
  warn "   Se rodando em container, pode não ter acesso ao socket do Docker"
fi

echo ""
echo "2️⃣ Shell Test:"
if /bin/bash -c "echo 'test' > /dev/null" 2>/dev/null; then
  ok "Shell /bin/bash funcional"
else
  err "Shell com problema"
fi

echo ""
echo "3️⃣ Node/NPX:"
if npx --version > /dev/null 2>&1; then
  ok "npx disponível: $(npx --version)"
  ok "Node: $(node --version)"
else
  err "npx não encontrado - instale Node.js"
fi

echo ""
echo "4️⃣ MCPs Instalados Globalmente:"
DOCKER_MCP=$(npm list -g docker-mcp 2>&1 | grep "docker-mcp@" | head -1 || echo "")
BASH_MCP=$(npm list -g @anthropic-ai/mcp-server-bash 2>&1 | grep "mcp-server-bash" | head -1 || echo "")

if [ -n "$DOCKER_MCP" ]; then
  ok "docker-mcp: $(echo $DOCKER_MCP | grep -oP '\d+\.\d+\.\d+' | head -1)"
else
  warn "docker-mcp não instalado globalmente"
fi

if [ -n "$BASH_MCP" ]; then
  ok "@anthropic-ai/mcp-server-bash instalado"
else
  warn "@anthropic-ai/mcp-server-bash não instalado"
fi

echo ""
echo "5️⃣ Arquivo de Configuração Claude:"
CONFIG="$HOME/.claude.json"
if [ -f "$CONFIG" ]; then
  ok "Arquivo existe: $CONFIG"

  if python3 -m json.tool < "$CONFIG" > /dev/null 2>&1; then
    ok "JSON válido"

    MCP_COUNT=$(python3 -c "import json; data = json.load(open('$CONFIG')); print(len(data.get('mcpServers', {})))" 2>/dev/null || echo "0")
    echo "   MCPs configurados: $MCP_COUNT"

    python3 -c "
import json
data = json.load(open('$CONFIG'))
mcps = data.get('mcpServers', {})
for name, config in mcps.items():
    cmd = config.get('command', 'N/A')
    args = ' '.join(config.get('args', []))
    print(f'   - {name}: {cmd} {args}')
" 2>/dev/null
  else
    err "JSON inválido no arquivo de config"
  fi
else
  err "Arquivo de config não encontrado: $CONFIG"
fi

echo ""
echo "6️⃣ Status dos MCPs (Live Health Check):"
if command -v claude &> /dev/null; then
  if claude mcp list 2>&1 | grep -q "checking\|MCP"; then
    claude mcp list
  else
    warn "Não foi possível obter status dos MCPs"
  fi
else
  warn "Comando 'claude' não encontrado no PATH"
fi

echo ""
echo "7️⃣ Variáveis de Ambiente (Credenciais):"
if env | grep -qi "CLICKUP\|API\|TOKEN\|SECRET" | head -3; then
  ok "Credenciais encontradas (parcialmente exibidas)"
else
  warn "Nenhuma credencial de API detectada (ClickUp, etc)"
fi

echo ""
step "PRÓXIMOS PASSOS"
echo ""
echo "Se algum item falhou:"
echo "  1. Docker: Abra Docker Desktop e verifique 'docker info'"
echo "  2. MCPs: Execute 'claude mcp list' para status detalhado"
echo "  3. Credenciais: Defina CLICKUP_API_TOKEN se usar ClickUp"
echo "  4. Config: Verifique ~/.claude.json manualmente"
echo ""
echo "Para reinstalar MCPs:"
echo "  npm install -g docker-mcp"
echo "  claude mcp add MCP_DOCKER -- npx -y docker-mcp"
echo "  claude mcp add shell -- /bin/bash"
echo ""
step "FIM DO DIAGNÓSTICO"
