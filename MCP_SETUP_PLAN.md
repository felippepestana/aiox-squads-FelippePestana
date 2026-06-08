# 📋 PLANO DE DIAGNÓSTICO E RESOLUÇÃO DE MCPs
## Claude Code - AIOX Squads

**Data:** 2026-05-05  
**Status:** ✅ Diagnóstico Completo | 🔧 Implementação em Andamento

---

## 📊 ESTADO ATUAL DO SISTEMA

### ✅ Componentes Saudáveis

| Componente | Status | Versão |
|-----------|--------|---------|
| Node.js | ✅ OK | v22.22.2 |
| NPX | ✅ OK | 10.9.7 |
| Shell (/bin/bash) | ✅ OK | Funcional |
| Docker CLI | ⚠️ Sem Socket | - |

### 🔴 Problemas Identificados

1. **MCP_DOCKER: Failed to connect**
   - Causa: Docker socket não disponível (`/var/run/docker.sock` não existe)
   - Contexto: Rodando em container sem acesso ao Docker do host
   - Diagnóstico correto: a **configuração é válida**, porém o servidor é
     **não-funcional neste ambiente** — sem socket/daemon não há a quem se conectar.
     Só passa a funcionar onde o socket do Docker está montado.

2. **shell: Failed to connect**
   - Causa real: **`/bin/bash` não é um servidor MCP.** Um MCP server precisa falar o
     protocolo MCP (JSON-RPC 2.0 sobre stdio); o bash puro lê comandos do stdin e os
     executa, mas **não implementa JSON-RPC**. Por isso registrar `/bin/bash` como MCP
     **sempre** resulta em "Failed to connect" — não é problema de "argumentos especiais".
   - Correção: usar um servidor MCP de shell **de verdade** (ver PASSO 3). Lembrando que
     o Claude Code **já possui ferramenta Bash nativa**, então este MCP é complementar.

3. **MCPs Configurados: 0**
   - Causa: Discrepância entre `.claude.json` (raiz) e config do projeto
   - Solução: Verificar escopo de configuração (global vs projeto)

---

## 🛠️ PLANO DE RESOLUÇÃO (7 PASSOS)

### PASSO 1: Diagnóstico Avançado ✅
- [x] Inspecionar `~/.claude.json`
- [x] Verificar status do Docker
- [x] Testar Shell disponibilidade
- [x] Criar script `fix-mcp.sh`

### PASSO 2: Instalar MCPs ✅
- [x] Instalar `docker-mcp` v1.0.0
- [x] Configurar MCP_DOCKER via `claude mcp add`
- [x] Configurar shell via `claude mcp add`

### PASSO 3: Configurar o Shell com um Servidor MCP Real 🔧
**Problema:** `/bin/bash` puro **não** é um servidor MCP (não fala JSON-RPC), portanto
nunca conecta. A solução **não** é wrapper de bash — é usar um servidor que implemente
o protocolo MCP e exponha execução de comandos como ferramenta.

**Solução — `mcp-server-commands` (servidor MCP real, stdio):**
```bash
# Remove qualquer registro inválido anterior
claude mcp remove shell || true

# Servidor MCP real: expõe a ferramenta `run_process` via stdio
# -y evita prompt interativo do npx ao baixar o pacote (Claude Code roda sem TTY)
claude mcp add shell -- npx -y mcp-server-commands
```

> **Nota de redundância:** o Claude Code já possui **ferramenta Bash nativa**. Este MCP só
> é necessário se você quiser expor `run_process` explicitamente via MCP (ex.: para outro
> cliente). Para uso comum, a ferramenta nativa já cobre a necessidade.

> **Nota de viabilidade:** `npx mcp-server-commands` baixa o pacote na primeira execução,
> exigindo egress de rede. No devcontainer, o firewall usa **allowlist** — garanta que o
> registry do npm está liberado, ou pré-instale o pacote.

⚠️ **Não usar** `@anthropic-ai/mcp-server-bash` nem `@modelcontextprotocol/server-bash`:
**esses pacotes não existem no npm.**

### PASSO 4: Viabilidade do Docker MCP
**Estado:** a configuração do `MCP_DOCKER` é **válida**, mas o servidor só é **funcional**
onde existe um daemon acessível via socket. Resumo de viabilidade:
- **Neste container (sem socket):** não-funcional → degrada graciosamente (N/A).
- **Host/ambiente com Docker:** funcional montando o socket, por exemplo:
  `docker run -v /var/run/docker.sock:/var/run/docker.sock ...`
- **Devcontainer:** requer o socket montado; com `--dangerously-skip-permissions` o
  workspace fica irrestrito, mas isso **não** cria o socket por si só.

### PASSO 5: ClickUp MCP (Opcional)
Pacote definido: **`@taazkareem/clickup-mcp-server`** (ver `CLICKUP_SETUP.md`, fonte única
do procedimento). Se a credencial estiver disponível:
```bash
# Obter token em: https://app.clickup.com/settings/apps
export CLICKUP_API_TOKEN="pk_SEU_TOKEN_AQUI"

# Instalar o pacote correto
npm install -g @taazkareem/clickup-mcp-server

# Adicionar
claude mcp add ClickUp \
  -e CLICKUP_API_TOKEN=$CLICKUP_API_TOKEN \
  -- npx -y @taazkareem/clickup-mcp-server
```

### PASSO 6: Validação Final
```bash
# 1. Verificar configuração
cat ~/.claude.json | python3 -m json.tool | grep -A 20 "mcpServers"

# 2. Testar status
claude mcp list

# 3. Rejeitar permissões se necessário
# (Claude Code pedirá confirmação para usar shell)
```

### PASSO 7: Documentação
- [x] Criar `fix-mcp.sh` (script de diagnóstico)
- [ ] Criar `MCP_DIAGNOSTICO_DETALHADO.md` (este arquivo)
- [ ] Adicionar seção ao `CLAUDE.md` sobre MCPs

---

## 📋 CONFIGURAÇÃO CONSOLIDADA ESPERADA

Após todos os passos, `~/.claude.json` deve ter:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "docker-mcp"],
      "env": {}
    },
    "shell": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-server-commands"],
      "env": {}
    }
  }
}
```

---

## 🧪 TESTES DE VALIDAÇÃO

### Teste 1: Docker MCP
```bash
# Esperado: ✓ Conectado (ou erro de socket se sem Docker)
claude mcp list | grep MCP_DOCKER

# Diagnosticar:
npx -y docker-mcp --version 2>&1
```

### Teste 2: Shell MCP
```bash
# Esperado: ✓ Conectado (servidor MCP real respondendo via stdio)
claude mcp list | grep shell

# Diagnosticar (deve resolver/baixar o servidor MCP, não o bash):
npx -y mcp-server-commands --help 2>&1 | head -n 5
```

### Teste 3: Arquivo de Config
```bash
# Deve retornar JSON válido
cat ~/.claude.json | python3 -m json.tool

# Contar MCPs configurados
cat ~/.claude.json | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'MCPs: {len(d.get(\"mcpServers\", {}))}')"
```

---

## 🚀 SCRIPTS DE RESOLUÇÃO RÁPIDA

### Reinstalar Tudo
```bash
#!/bin/bash
set -euo pipefail

echo "🔄 Removendo MCPs antigos..."
claude mcp remove MCP_DOCKER || true
claude mcp remove shell || true

echo "➕ Adicionando MCPs..."
# docker-mcp e mcp-server-commands são baixados via npx sob demanda
claude mcp add MCP_DOCKER -- npx -y docker-mcp        # funcional só com socket do Docker
claude mcp add shell -- npx -y mcp-server-commands    # servidor MCP de shell real (NÃO /bin/bash)

echo "✅ Verificando..."
claude mcp list

echo "✨ Concluído!"
```

### Diagnóstico Rápido
```bash
./fix-mcp.sh
```

---

## 📝 REFERÊNCIAS

- **Roteiro Original:** Fornecido via chat
- **Diretório MCP Config:** `~/.claude.json` (global) e `.claude.json` (projeto)
- **Documentação Claude:** https://claude.ai/docs (quando disponível)
- **MCP Packages:** 
  - `docker-mcp` - real, porém **funcional apenas com socket do Docker montado**
  - `mcp-server-commands` - servidor MCP de shell real (`npx mcp-server-commands`,
    ferramenta `run_process`) — substitui o `/bin/bash` puro
  - `@anthropic-ai/mcp-server-bash` - ❌ **não existe no npm** (não usar)
  - `@modelcontextprotocol/server-bash` - ❌ **não existe no npm** (não usar)

---

## 📌 PRÓXIMOS PASSOS

1. [x] Executar diagnóstico completo
2. [x] Instalar `docker-mcp`
3. [x] Criar `fix-mcp.sh`
4. [ ] **Testar shell MCP com wrapper script**
5. [ ] **Documentar soluções de container/Docker**
6. [ ] **Commit e push das mudanças**
7. [ ] **Criar PR com melhorias**

---

## 📐 MATRIZ DE VIABILIDADE

Resumo honesto do que é alcançável, fechando o gap entre diagnóstico e finalidade:

| Componente | Viabilidade | Caminho | Observação |
|-----------|-------------|---------|------------|
| **shell MCP** | ✅ Funcional | `npx mcp-server-commands` | Servidor MCP real (stdio, `run_process`). Requer egress de rede (allowlist do firewall). Redundante com a Bash nativa do Claude Code. |
| **ClickUp MCP** | ✅ Funcional | `@taazkareem/clickup-mcp-server` + token | Opcional; depende de `CLICKUP_API_TOKEN`. Ver `CLICKUP_SETUP.md`. |
| **MCP_DOCKER** | ⚠️ Degradado | `docker-mcp` (com socket) | Config válida, mas **não-funcional neste container** (sem `/var/run/docker.sock`). Funcional só onde o socket estiver montado. |
| `/bin/bash` como MCP | ❌ Descartado | — | Bash puro não fala JSON-RPC; **nunca** conecta como MCP. Substituído pelo `mcp-server-commands`. |
| `@anthropic-ai/mcp-server-bash` | ❌ Descartado | — | Pacote **não existe** no npm. |
| `@modelcontextprotocol/server-bash` | ❌ Descartado | — | Pacote **não existe** no npm. |

---

## 🎯 OBJETIVO FINAL

✅ **Estado Desejado:**
- MCPs configurados e funcionais (ou graciosamente degradados)
- Script de diagnóstico automático disponível
- Documentação clara sobre como resolver cada erro
- Permissões configuradas corretamente no Claude Code

---

*Última atualização: 2026-06-08 — diagnóstico corrigido e plano adequado à viabilidade real*
