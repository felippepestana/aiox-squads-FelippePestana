# Guia de Configuração da Integração ClickUp MCP

## Visão Geral

Este guia ajuda você a configurar a integração do ClickUp com o Claude Code usando o
Model Context Protocol (MCP).

## Pacotes ClickUp MCP Disponíveis

Existem várias implementações de servidor ClickUp MCP no npm. Comparação:

| Pacote | Versão | Recursos | Recomendado para |
|--------|--------|----------|------------------|
| `@taazkareem/clickup-mcp-server` | v0.14.4+ | Cobertura completa da API do ClickUp, gestão de tarefas/documentos/chat | Uso geral (recomendado) |
| `@chykalophia/clickup-mcp-server` | v5.0.0 | 177+ ferramentas, otimização com IA, workflows com contexto | Uso avançado/focado em IA |
| `@sjotie/clickup-mcp` | v1.8.6 | Alta performance, otimizado para integração com IA | Tarefas sensíveis a performance |
| `@pipeworx/mcp-clickup` | v0.1.0 | Wrapper leve sobre a API REST v2 do ClickUp | Setup com dependências mínimas |
| `@antidrift/mcp-clickup` | v0.22.0 | Workspaces, spaces, tarefas, comentários | Colaboração de equipe abrangente |

## Setup Recomendado: @taazkareem/clickup-mcp-server

Recomendamos o `@taazkareem/clickup-mcp-server` por oferecer:
- Atualizações recentes
- Cobertura completa da API do ClickUp
- Suporte a tarefas, documentos e gestão de chat
- Bom suporte da comunidade
- Integração clara com assistentes de IA

> ⚠️ **Requisito de licença (modo local/stdio):** as versões atuais deste pacote exigem
> **três** variáveis de ambiente para rodar localmente — `CLICKUP_API_KEY`,
> `CLICKUP_TEAM_ID` (o **Workspace ID**) e `CLICKUP_MCP_LICENSE_KEY` (**chave de licença
> paga**). Atenção: `CLICKUP_API_TOKEN` **não** é lida pelo servidor. Sem a license key o
> MCP é registrado, mas não inicia. Se você não possui licença, considere um dos pacotes
> alternativos listados acima (confirme as variáveis exigidas na documentação de cada um).

## Passos de Configuração

### Passo 1: Obter a API Key do ClickUp e o Workspace ID

1. Acesse https://app.clickup.com/settings/apps
2. Procure a seção "API Token" ou "Developer"
3. Gere uma nova API key, caso ainda não tenha
4. Copie a chave (mantenha em segredo!)
5. Anote também o seu **Workspace ID** (usado como `CLICKUP_TEAM_ID`)

### Passo 2: Obter a License Key

A versão atual do `@taazkareem/clickup-mcp-server` exige uma `CLICKUP_MCP_LICENSE_KEY`
para o modo local/stdio. Obtenha-a com o mantenedor do pacote.

### Passo 3: Adicionar o ClickUp MCP ao Claude Code

```bash
export CLICKUP_API_KEY="sua_api_key"
export CLICKUP_TEAM_ID="seu_workspace_id"
export CLICKUP_MCP_LICENSE_KEY="sua_license_key"
claude mcp add ClickUp \
  -e CLICKUP_API_KEY=$CLICKUP_API_KEY \
  -e CLICKUP_TEAM_ID=$CLICKUP_TEAM_ID \
  -e CLICKUP_MCP_LICENSE_KEY=$CLICKUP_MCP_LICENSE_KEY \
  -- npx -y @taazkareem/clickup-mcp-server
```

> A flag `-y` evita que o `npx` peça confirmação interativa ao baixar o pacote — o Claude
> Code executa os MCP servers sem TTY, então o prompt travaria a inicialização.

### Passo 4: Verificar a Instalação

```bash
claude mcp list
```

Você deve ver `ClickUp` na lista de MCPs disponíveis.

### Passo 5: Testar a Integração

Experimente usar as tarefas do ClickUp a partir do Claude Code. O MCP deve permitir:
- Listar tarefas e workspaces
- Criar e atualizar tarefas
- Gerenciar comentários de tarefas
- Visualizar anexos de tarefas
- Acessar a gestão de documentos

## Alternativa: Usando Outro Pacote

Se preferir um pacote diferente, basta substituir o nome do pacote e o comando.

> **Atenção às variáveis de ambiente:** cada pacote pode ler variáveis diferentes
> (e alguns não exigem license key). Confirme os nomes exatos na documentação do pacote
> escolhido antes de configurar.

### @chykalophia/clickup-mcp-server (Avançado)
```bash
export CLICKUP_API_KEY="sua_api_key"
claude mcp add ClickUp \
  -e CLICKUP_API_KEY=$CLICKUP_API_KEY \
  -- npx -y @chykalophia/clickup-mcp-server
```

### @pipeworx/mcp-clickup (Leve)
```bash
export CLICKUP_API_KEY="sua_api_key"
claude mcp add ClickUp \
  -e CLICKUP_API_KEY=$CLICKUP_API_KEY \
  -- npx -y @pipeworx/mcp-clickup
```

## Resolução de Problemas

### Token Não Reconhecido
- Verifique a API key em https://app.clickup.com/settings/apps
- Confirme que as variáveis estão definidas no ambiente: `env | grep CLICKUP`
- Verifique se as credenciais estão sendo passadas corretamente ao MCP server

### Falha na Conexão do MCP
```bash
# Rode o script de diagnóstico
./fix-mcp.sh

# Confira as variáveis explicitamente
env | grep CLICKUP

# Tente listar os recursos do ClickUp
claude mcp list
```

### Problemas de Permissão
- No Claude Code, você pode ser solicitado a aprovar o acesso do MCP
- Clique em "Allow" ou "Approve" quando solicitado
- Se negado, execute novamente o comando `claude mcp add`

## Boas Práticas de Segurança

⚠️ **Nunca commite sua API key ou license key no git:**

1. Adicione ao `.gitignore`:
   ```text
   .env
   .env.local
   ```

2. Armazene as credenciais em variáveis de ambiente:
   ```bash
   # Adicione ao ~/.bashrc, ~/.zshrc ou ~/.env
   export CLICKUP_API_KEY="sua_api_key"
   export CLICKUP_TEAM_ID="seu_workspace_id"
   export CLICKUP_MCP_LICENSE_KEY="sua_license_key"
   ```

3. Ou use um gerenciador de credenciais:
   ```bash
   # Keychain do macOS
   security add-generic-password -s "ClickUp API Key" -a "$USER" -w "sua_api_key"

   # E então recupere-a
   export CLICKUP_API_KEY=$(security find-generic-password -s "ClickUp API Key" -w)
   ```

## Atualizando o Pacote

Para atualizar para uma versão mais recente:

```bash
npm install -g @taazkareem/clickup-mcp-server@latest
```

Depois verifique com:
```bash
claude mcp list
```

## Removendo o ClickUp MCP

Se precisar remover a integração:

```bash
claude mcp remove ClickUp
```

## Recursos Adicionais

- Documentação da API do ClickUp: https://clickup.com/api
- Documentação do MCP: https://modelcontextprotocol.io
- Configurações do ClickUp: https://app.clickup.com/settings

---

Para mais informações sobre configuração de MCP, veja `CLAUDE.md` ou `MCP_SETUP_PLAN.md`.
