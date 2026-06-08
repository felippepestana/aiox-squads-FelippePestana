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
- ✅ **Falha contínua resolvida** — workflow redundante `deploy.yml` removido
- ⚠️ **Pendência residual (sua):** o `CLOUDFLARE_API_TOKEN` tem restrição de IP
- 📍 Pré-existente (não relacionado ao PR #25)

### Causa Raiz
O workflow `deploy.yml` ("Deploy AIOX Web App") rodava `npx wrangler deploy` em
todo push para `main` e falhava **30/30 vezes**. O build (vite) passava; a falha
era na API da Cloudflare:

```text
✘ [ERROR] A request to the Cloudflare API (/accounts) failed.
  Cannot use the access token from location: 52.161.82.97 [code: 9109]
```

O erro **9109** indica que o secret `CLOUDFLARE_API_TOKEN` tem **Client IP
Filtering**, que bloqueia os IPs dinâmicos dos runners do GitHub Actions.

### Redundância (motivo da remoção)
- A **Cloudflare Git integration** já deploya o worker `aiox-squads-felippepestana`
  com sucesso (confirmado via API: existe **apenas 1 worker**, atualizado a cada push).
- O `deploy.yml` tentava criar um worker `aiox-squads-web` (nome do `web/wrangler.toml`)
  que **nunca chegou a existir**, pois o deploy sempre falhava.
- O build/smoke do `web` já é coberto pelo workflow `web.yml` ("Portal web"),
  em push **e** pull_request.

Por isso o `deploy.yml` foi **removido**: caminho de deploy quebrado, redundante
com a Git integration e sem cobertura de CI exclusiva.

### Pendência residual (ação sua)
O mesmo `CLOUDFLARE_API_TOKEN` ainda é usado por `deploy-landing-pages.yml`
(via `cloudflare/wrangler-action`). Esse workflow só dispara em mudanças de
`landing-pages/alternative-*/**`, então raramente roda — mas falharia pelo mesmo
erro 9109. Para habilitá-lo:
1. Cloudflare Dashboard → My Profile → API Tokens → editar o token
2. Remover o **Client IP Address Filtering** (ou ajustar para liberar os runners)
3. Atualizar o secret `CLOUDFLARE_API_TOKEN` no GitHub, se o token for recriado

### Impacto (atual)
- Site web continua publicado normalmente (Cloudflare Git integration)
- Push para `main` deixa de gerar falhas de deploy
- Auto-deploy das landing pages permanece dependente do fix do token (residual)

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
| Cloudflare Fix | 🟡 Média | Resolvido (resíduo: token) | Infrastructure |
| Docker Security | — | Resolvido | Infrastructure |

---

## 🎯 Próximas Ações

1. **Imediato:** Cloudflare e Docker Security já resolvidos ✅
2. **Quando for usar landing pages:** remover Client IP Filtering do `CLOUDFLARE_API_TOKEN`
3. **Curto prazo:** Obter ClickUp API token e configurar
4. **Validação:** Testar todos os MCPs no ambiente completo

---

*Documento criado durante conclusão de PR #25 (MCP Diagnostics)*  
*Versão: 1.0*
