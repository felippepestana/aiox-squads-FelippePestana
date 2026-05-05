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
   - Solução: Não aplicável em container, mas configuração está correta

2. **shell: Failed to connect**
   - Causa: Provável problema com argumentos do shell MCP
   - Contexto: `/bin/bash` sozinho pode não iniciar corretamente como stdio
   - Solução: Reconfigurar com wrapper ou script de inicialização

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

### PASSO 3: Corrigir Configuração do Shell 🔧
**Problema:** `/bin/bash` como stdio precisa de argumentos especiais

**Opção A - Wrapper Script (Recomendado):**
```bash
# Criar: ~/.claude/shell-wrapper.sh
#!/bin/bash
exec bash "$@"

# Adicionar ao Claude:
claude mcp remove shell
claude mcp add shell -- ~/.claude/shell-wrapper.sh
```

**Opção B - Usar npx com mcp-server-bash:**
```bash
# Se existir pacote, instalar e usar:
npm install -g @modelcontextprotocol/server-bash
claude mcp remove shell
claude mcp add shell -- npx @modelcontextprotocol/server-bash
```

**Opção C - Simples (Atual):**
```bash
claude mcp add shell -- /bin/bash
```

### PASSO 4: Documentação de Erro do Docker
**Aviso:** Se rodando em container sem acesso a Docker socket:
- MCP_DOCKER não funcionará até que Docker socket seja montado
- Solução: `docker run -v /var/run/docker.sock:/var/run/docker.sock ...`
- Para devcontainer: Já configurado ou requer `--dangerously-skip-permissions`

### PASSO 5: ClickUp MCP (Opcional)
Se credencial disponível:
```bash
# Obter token em: https://app.clickup.com/settings/apps
export CLICKUP_API_TOKEN="pk_SEU_TOKEN_AQUI"

# Instalar (nome precisa ser verificado)
npm install -g @clickup/mcp-server  # OU
npm install -g @modelcontextprotocol/server-clickup

# Adicionar
claude mcp add ClickUp \
  -e CLICKUP_API_TOKEN=$CLICKUP_API_TOKEN \
  -- npx @modelcontextprotocol/server-clickup
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
      "command": "/bin/bash",
      "args": [],
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
# Esperado: ✓ Conectado
claude mcp list | grep shell

# Diagnosticar:
/bin/bash --version
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

echo "📦 Reinstalando packages..."
npm install -g docker-mcp

echo "➕ Adicionando MCPs..."
claude mcp add MCP_DOCKER -- npx -y docker-mcp
claude mcp add shell -- /bin/bash

echo "✅ Verificando..."
claude mcp list

echo "✨ Concluído!"
```

### Diagnóstico Rápido
```bash
/home/user/aiox-squads-FelippePestana/fix-mcp.sh
```

---

## 📝 REFERÊNCIAS

- **Roteiro Original:** Fornecido via chat
- **Diretório MCP Config:** `~/.claude.json` (global) e `.claude.json` (projeto)
- **Documentação Claude:** https://claude.ai/docs (quando disponível)
- **MCP Packages:** 
  - `docker-mcp` - v1.0.0 (instalado ✅)
  - `@anthropic-ai/mcp-server-bash` - ❌ não existe no npm

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

## 🎯 OBJETIVO FINAL

✅ **Estado Desejado:**
- MCPs configurados e funcionais (ou graciosamente degradados)
- Script de diagnóstico automático disponível
- Documentação clara sobre como resolver cada erro
- Permissões configuradas corretamente no Claude Code

---

*Última atualização: 2026-05-05 13:00 UTC*
