# 📋 Pendências - MCP Setup & Infrastructure

**Criado em:** 2026-05-05  
**Status:** Isolado para tratamento posterior  
**Responsável:** Próximo sprint

---

## 1. 🔌 ClickUp MCP Integration

### Status
- ✅ Documentado em `MCP_SETUP_PLAN.md` (PASSO 4)
- ✅ Script support em `fix-mcp.sh`
- ⏳ Awaiting configuration & testing

### Tasks
- [ ] Obter ClickUp API token (https://app.clickup.com/settings/apps)
- [ ] Testar disponibilidade do MCP package
  - Verificar `@clickup/mcp-server` ou `@modelcontextprotocol/server-clickup`
  - Determinar nome correto e versão no npm
- [ ] Configurar no Claude Code local
  ```bash
  npm install -g @clickup/mcp-server  # (ou package correto)
  claude mcp add ClickUp \
    -e CLICKUP_API_TOKEN=pk_YOUR_TOKEN \
    -- npx @modelcontextprotocol/server-clickup
  ```
- [ ] Testar conexão: `claude mcp list`
- [ ] Atualizar documentação em `CLAUDE.md`

### Acceptance Criteria
- [ ] ClickUp MCP conectado e funcional
- [ ] Token seguramente armazenado (não commitado)
- [ ] Documentação completa
- [ ] `claude mcp list` mostra ClickUp como connected

### Referência
Ver `MCP_SETUP_PLAN.md` linhas 84-98 para detalhes completos

---

## 2. 🔧 Cloudflare Workers Deployment Failures

### Status
- ❌ Múltiplas falhas de build
- 📍 Pré-existente (não relacionado ao PR #25)
- 🔍 Requer investigação

### Serviços Afetados
1. `aiox-squads-felippepestana-cf` - Build failures
2. `aiox-squads-felippepestana` - Build failures

### Investigação Necessária
- [ ] Verificar logs de build do Cloudflare Dashboard
- [ ] Revisar wrangler.toml configuration
- [ ] Checar dependências e versões
- [ ] Verificar quotas/restrições da conta
- [ ] Testar build localmente com `wrangler publish --dry-run`

### Próximos Passos
1. Acessar: https://dash.cloudflare.com/
2. Navegar até Workers services
3. Revisar últimas build failures e logs de erro
4. Verificar se há mudanças recentes em wrangler/dependencies

### Impacto
- Bloqueia deployments automáticos
- Não bloqueia desenvolvimento local
- Não bloqueia merge de PRs (Railway deploy funciona)

---

## 3. 📊 Docker Security Scan Failures

### Status
- ❌ Trivy security scan falhando
- 📍 Pré-existente (não relacionado ao PR #25)
- 🔍 Requer investigação

### Contexto
- Workflow: `.github/workflows/docker-security.yml`
- Verifica: `chatbot/Dockerfile` e `web/Dockerfile`
- Issue: Build de imagens falhando antes do scan

### Investigação Necessária
- [ ] Testar build das imagens localmente
  ```bash
  docker build -f chatbot/Dockerfile -t aiox-chatbot:test .
  docker build -f web/Dockerfile -t aiox-web:test .
  ```
- [ ] Verificar dependências em `chatbot/package.json`
- [ ] Verificar dependências em `web/package.json`
- [ ] Checar se há secrets/env vars faltando

### Próximos Passos
1. Reproduzir error localmente
2. Identificar qual step está falhando
3. Corrigir Dockerfile ou dependências
4. Testar novo build

---

## 📌 Resumo

| Tarefa | Prioridade | Status | Tipo |
|--------|-----------|--------|------|
| ClickUp MCP | 🟡 Média | Documentado | Feature |
| Cloudflare Fix | 🔴 Alta | Investigação | Infrastructure |
| Docker Security | 🟡 Média | Investigação | Infrastructure |

---

## 🎯 Próximas Ações

1. **Imediato:** Investigar Cloudflare e Docker Security
2. **Curto prazo:** Obter ClickUp API token e configurar
3. **Validação:** Testar todos os MCPs no ambiente completo

---

*Documento criado durante conclusão de PR #25 (MCP Diagnostics)*  
*Versão: 1.0*
