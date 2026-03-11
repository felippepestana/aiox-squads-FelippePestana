# Ollama + Claude Code

Modelos open source podem ser usados com o Claude Code via API compatível com Anthropic do Ollama, habilitando modelos como `qwen3.5`, `glm-5:cloud` e `kimi-k2.5:cloud`.

## Instalação

### Ollama

```bash
# Linux / macOS
curl -fsSL https://ollama.com/install.sh | sh

# Ou use o script deste repositório:
./setup-ollama.sh
```

### Claude Code

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows
irm https://claude.ai/install.ps1 | iex
```

## Configuração

### Setup rápido (via launcher)

```bash
ollama launch claude
ollama launch claude --model kimi-k2.5:cloud
```

### Setup manual

Defina as variáveis de ambiente:

```bash
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
```

Execute o Claude Code com um modelo Ollama:

```bash
claude --model qwen3.5

# Ou tudo inline:
ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model glm-5:cloud
```

## Modelos Recomendados

| Modelo | Tipo |
|--------|------|
| `kimi-k2.5:cloud` | Cloud |
| `glm-5:cloud` | Cloud |
| `minimax-m2.5:cloud` | Cloud |
| `qwen3.5:cloud` | Cloud |
| `glm-4.7-flash` | Local |
| `qwen3.5` | Local |

Modelos cloud disponíveis em: [ollama.com/search?c=cloud](https://ollama.com/search?c=cloud)

## Tarefas Agendadas com `/loop`

O comando `/loop` executa um prompt ou slash command em intervalos regulares dentro do Claude Code.

```
/loop <intervalo> <prompt ou /comando>
```

### Exemplos

```bash
# Monitorar PRs abertos
/loop 30m Check my open PRs and summarize their status

# Pesquisa automatizada
/loop 1h Research the latest AI news and summarize key developments

# Triagem de issues
/loop 15m Check for new GitHub issues and triage by priority

# Lembretes
/loop 1h Remind me to review the deploy status
```

## Context Length

O Claude Code requer uma janela de contexto grande. Recomenda-se pelo menos **64k tokens**.

Para ajustar o context length no Ollama, consulte: https://docs.ollama.com/context-length
