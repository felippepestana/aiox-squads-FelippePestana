#!/bin/bash
# ============================================================
# Configura DNS do domínio pesnatana.app via Hostinger API
# Execute localmente: bash scripts/configure-dns-hostinger.sh
# ============================================================

API_TOKEN="tk829bYhStgtJst0wZHaahfLpvBjxd4GZEJyxNQv93e4b8ae"
DOMAIN="pesnatana.app"
VPS_IP="31.97.29.196"
BASE_URL="https://developers.hostinger.com/api/v1"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[AVISO]${NC} $1"; }
error()   { echo -e "${RED}[ERRO]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Configuração DNS — pesnatana.app           ║"
echo "║   VPS: 31.97.29.196                          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Listar domínios disponíveis ────────────────────────────
info "Buscando domínios na conta..."
DOMAINS_RESPONSE=$(curl -s -X GET "$BASE_URL/domains" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Accept: application/json")

echo "Resposta: $DOMAINS_RESPONSE" | head -5
echo ""

# ── 2. Listar zonas DNS do domínio ────────────────────────────
info "Buscando zona DNS de $DOMAIN..."
DNS_ZONE=$(curl -s -X GET "$BASE_URL/dns/zones/$DOMAIN/records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Accept: application/json")
echo "Zona DNS atual:"
echo "$DNS_ZONE" | python3 -m json.tool 2>/dev/null || echo "$DNS_ZONE"
echo ""

# ── 3. Criar registro A para @ (raiz) ─────────────────────────
info "Criando registro A: $DOMAIN → $VPS_IP"
ROOT_RESULT=$(curl -s -X POST "$BASE_URL/dns/zones/$DOMAIN/records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"type\": \"A\",
    \"name\": \"@\",
    \"content\": \"$VPS_IP\",
    \"ttl\": 300
  }")
echo "Resultado @ → $VPS_IP:"
echo "$ROOT_RESULT" | python3 -m json.tool 2>/dev/null || echo "$ROOT_RESULT"
echo ""

# ── 4. Criar registro A para www ──────────────────────────────
info "Criando registro A: www.$DOMAIN → $VPS_IP"
WWW_RESULT=$(curl -s -X POST "$BASE_URL/dns/zones/$DOMAIN/records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"type\": \"A\",
    \"name\": \"www\",
    \"content\": \"$VPS_IP\",
    \"ttl\": 300
  }")
echo "Resultado www → $VPS_IP:"
echo "$WWW_RESULT" | python3 -m json.tool 2>/dev/null || echo "$WWW_RESULT"
echo ""

# ── 5. Verificar registros criados ────────────────────────────
info "Verificando zona DNS final..."
FINAL_ZONE=$(curl -s -X GET "$BASE_URL/dns/zones/$DOMAIN/records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Accept: application/json")
echo "$FINAL_ZONE" | python3 -m json.tool 2>/dev/null || echo "$FINAL_ZONE"
echo ""

# ── 6. Testar resolução ───────────────────────────────────────
info "Testando resolução DNS (pode levar até 30 min para propagar)..."
sleep 3
RESOLVED=$(dig +short "$DOMAIN" @8.8.8.8 2>/dev/null || nslookup "$DOMAIN" 8.8.8.8 2>/dev/null | grep Address | tail -1 | awk '{print $2}')
if [ "$RESOLVED" = "$VPS_IP" ]; then
  success "DNS já resolvendo: $DOMAIN → $VPS_IP ✅"
  echo ""
  success "Agora você pode rodar o SSL no servidor:"
  echo "  ssh root@$VPS_IP 'certbot --nginx -d $DOMAIN -d www.$DOMAIN --email admin@$DOMAIN --agree-tos --non-interactive --redirect'"
else
  warn "DNS ainda propagando (resolvido como: ${RESOLVED:-nenhum})"
  warn "Aguarde até 30 minutos e teste com:"
  warn "  dig +short $DOMAIN"
fi
