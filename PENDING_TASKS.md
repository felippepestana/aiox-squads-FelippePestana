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

> **Pacote definido:** `@taazkareem/clickup-mcp-server` (fonte única: `CLICKUP_SETUP.md`).
> A incerteza de pacote foi resolvida — não usar `@clickup/mcp-server` nem
> `@modelcontextprotocol/server-clickup` (este último não existe no npm).
>
> **Requisito de licença:** o modo local/stdio exige `CLICKUP_API_KEY` +
> `CLICKUP_TEAM_ID` + `CLICKUP_MCP_LICENSE_KEY` (**licença paga**). `CLICKUP_API_TOKEN`
> não é lida pelo servidor.

### Tasks
- [ ] Obter ClickUp API key (https://app.clickup.com/settings/apps) e Workspace ID
- [ ] Adquirir a license key (`CLICKUP_MCP_LICENSE_KEY`) para uso local/stdio
- [ ] Configurar no Claude Code local
  ```bash
  claude mcp add ClickUp \
    -e CLICKUP_API_KEY=pk_SUA_API_KEY \
    -e CLICKUP_TEAM_ID=SEU_WORKSPACE_ID \
    -e CLICKUP_MCP_LICENSE_KEY=SUA_LICENSE_KEY \
    -- npx -y @taazkareem/clickup-mcp-server
  ```
- [ ] Testar conexão: `claude mcp list`
- [ ] Atualizar documentação em `CLAUDE.md`

### Acceptance Criteria
- [ ] ClickUp MCP conectado e funcional
- [ ] Credenciais (API key + license key) seguramente armazenadas (não commitadas)
- [ ] Documentação completa
- [ ] `claude mcp list` mostra ClickUp como connected

### Referência
Ver `MCP_SETUP_PLAN.md` (PASSO 5) e `CLICKUP_SETUP.md` para detalhes completos.

> **Nota — shell MCP resolvido:** o antigo plano registrava `/bin/bash` como MCP, o que é
> inviável (bash não fala JSON-RPC). Substituído pelo servidor MCP real
> `mcp-server-commands` (`npx mcp-server-commands`). Ver `MCP_SETUP_PLAN.md` (PASSO 3).

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
- ✅ **Resolvido** — o workflow `Docker Security Scan` passa na `main`
- 📍 Pré-existente (não relacionado ao PR #25)

### Causa Raiz (corrigida)
A descrição anterior ("build de imagens falhando antes do scan") estava imprecisa.
O log da última falha (run `26760409141`, 2026-06-01, branch `cursor/devenv-setup-f03a`)
mostra que o **build das imagens não era o problema** — a falha era na resolução da action:

```text
##[error]Unable to resolve action `aquasecurity/setup-trivy@v0.2.1`, unable to find version `v0.2.1`
```

O `aquasecurity/trivy-action@v0.28.0` referenciava internamente o `setup-trivy@v0.2.1`,
tag **removida durante o incidente de supply-chain GHSA-69fq-xp46-6x23** (CVE-2026-33634,
mar/2026).

### Correção Aplicada
Já presente em `.github/workflows/docker-security.yml`:
- `aquasecurity/trivy-action` **pinado em v0.35.0 por SHA completo**
  (`57a97c7e7821a5776cebc9bb87c984fa69cba8f1`), fora da janela do ataque
- `permissions: security-events: write` adicionada (upload SARIF deixava de dar 403)
- Self-trigger de paths do workflow removido do gatilho de PR (evita "Set up job" espúrio)

### Evidência
- Run `27112357907` (push `main`, 2026-06-08): todos os steps ✅ — build `chatbot`,
  build `web`, Trivy nas duas imagens e upload SARIF (chatbot + web)
- Histórico recente (5–8/jun) em `main` e branches: todos `success`

---

## 📌 Resumo

| Tarefa | Prioridade | Status | Tipo |
|--------|-----------|--------|------|
| ClickUp MCP | 🟡 Média | Documentado | Feature |
| Cloudflare Fix | 🔴 Alta | Investigação | Infrastructure |
| Docker Security | ✅ — | Resolvido | Infrastructure |

---

## 🎯 Próximas Ações

1. **Imediato:** Investigar Cloudflare (Docker Security já resolvido ✅)
2. **Curto prazo:** Obter ClickUp API token e configurar
3. **Validação:** Testar todos os MCPs no ambiente completo

---

*Documento criado durante conclusão de PR #25 (MCP Diagnostics)*  
*Versão: 1.0*
