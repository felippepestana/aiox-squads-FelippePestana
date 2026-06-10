# CLAUDE.md — Regras do Projeto AIOX Squads

## Sobre o Projeto

Este é o repositório da comunidade para compartilhar, descobrir e contribuir squads para o framework AIOX. Squads são pacotes self-contained de agentes IA especializados.

## Linguagem

- Código, commits e nomes de variáveis: **inglês**
- Documentação voltada ao usuário (README, docs): **português brasileiro**
- Comentários no código: inglês

## Convenções de Código

### Commits

- Prefixos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Mensagem em inglês, concisa (1 linha), descritiva do "porquê"
- Corpo opcional para detalhes adicionais

### Scripts Bash

- Usar `set -euo pipefail` em todo script
- Funções auxiliares de output: `ok()`, `warn()`, `err()`, `step()`
- Verificar dependências antes de executar operações
- Tratar graciosamente diretórios/arquivos ausentes (warn, não err)

### TypeScript (chatbot)

- Target: ES2022, módulos CommonJS
- Strict mode habilitado
- Dependências em `package.json`, sem instalações globais implícitas

## Estrutura de Squads

Todo squad segue a anatomia de 6 camadas:

```text
squads/<nome>/
├── agents/          # Agentes .md com persona, voice_dna, heuristics
├── tasks/           # Tasks executáveis
├── templates/       # Templates de output
├── data/            # Dados de referência
├── workflows/       # (opcional) Workflows .yaml encadeando tasks
├── checklists/      # (opcional) Quality gates como checklists .md
├── config.yaml      # Configuração do squad
└── README.md        # Documentação do squad
```

### Cadeia de Comando (Tiers)

- **Tier 0** — Chief: orquestrador que roteia
- **Tier 1** — Masters: especialistas primários
- **Tier 2** — Specialists: especialistas de nicho
- **Tier 3** — Support: utilidades e quality gates

## Segurança

- Nunca commitar API keys, tokens ou credenciais
- `.env` e `credentials.*` devem estar no `.gitignore`
- O devcontainer usa firewall restritivo (allowlist de domínios)
- Scripts de instalação devem verificar dependências, não assumi-las como presentes

## CI/CD

- GitHub Actions configurado em `.github/workflows/claude.yml`
- Trigger: menção `@claude` em issues ou PRs
- Secret necessário: `ANTHROPIC_API_KEY`

## Devcontainer

- Base: Node.js 20, ZSH, ferramentas de dev
- Firewall via iptables (init-firewall.sh)
- Firewall restringe egress, mas `--dangerously-skip-permissions` permite alterações irrestritas no workspace — use apenas com repositórios confiáveis
- Volumes persistentes para histórico de comandos e config do Claude

## Model Context Protocol (MCP)

MCPs são servidores que estendem as capacidades do Claude Code. Este projeto utiliza os seguintes MCPs:

### MCPs Configurados

- **MCP_DOCKER**: Gerenciar containers e imagens Docker
  - Pacote: `docker-mcp`
  - Requer: Docker daemon rodando (acesso ao `/var/run/docker.sock`)
  - Instalação: `npm install -g docker-mcp`

- **shell**: Executar comandos via servidor MCP de shell
  - Pacote: `mcp-server-commands` (`npx mcp-server-commands`), expõe a ferramenta `run_process`
  - Nota: `/bin/bash` puro **não** é um servidor MCP (não fala JSON-RPC) — use o pacote acima
  - Complementar à ferramenta Bash nativa do Claude Code
  - Requer aprovação explícita no Claude Code

- **ClickUp** (opcional): Integração com ClickUp para gerenciamento de tarefas
  - Pacote recomendado: `@taazkareem/clickup-mcp-server`
  - Requer (modo local/stdio): `CLICKUP_API_KEY`, `CLICKUP_TEAM_ID` (Workspace ID) e
    `CLICKUP_MCP_LICENSE_KEY` (**licença paga**). `CLICKUP_API_TOKEN` não é lida.
  - Obtenção da API key: https://app.clickup.com/settings/apps
  - Instalação:
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

### Diagnóstico e Resolução de MCPs

Caso encontre erros de conexão com MCPs:

1. **Executar script de diagnóstico:**
   ```bash
   ./fix-mcp.sh
   ```

2. **Verificar status:**
   ```bash
   claude mcp list
   ```

3. **Reinstalar MCPs:**
   ```bash
   claude mcp add MCP_DOCKER -- npx -y docker-mcp   # funcional só com socket do Docker montado
   claude mcp add shell -- npx -y mcp-server-commands  # servidor MCP de shell real (NÃO /bin/bash)
   ```

### Documentação Detalhada

Veja `MCP_SETUP_PLAN.md` para:
- Análise completa de erros
- Plano de resolução com 7 passos
- Testes de validação
- Scripts de resolução rápida
