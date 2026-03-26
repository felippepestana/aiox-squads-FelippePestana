# AIOX Squads — Chatbot & Interface Web

Ambiente de conversação com os agentes do repositório **aiox-squads**.
Disponível em dois modos: **interface web** (recomendado) e **CLI no terminal**.

---

## Como acessar

### Pré-requisito

- Node.js 18+
- Chave de API Anthropic (`ANTHROPIC_API_KEY`) — obtenha em [console.anthropic.com](https://console.anthropic.com/)

### Opção 1 — Script (mais rápido)

```bash
# Na raiz do repositório
export ANTHROPIC_API_KEY=sk-ant-...

bash chatbot/web-start.sh
```

Acesse em: **http://localhost:3000**

### Opção 2 — Docker Compose

```bash
# Na raiz do repositório
ANTHROPIC_API_KEY=sk-ant-... docker compose -f docker-compose.chatbot.yml up
```

Acesse em: **http://localhost:3000**

### Opção 3 — Manual (passo a passo)

```bash
cd chatbot
npm install
npm run build
node dist/server.js
```

Acesse em: **http://localhost:3000**

### Porta personalizada

```bash
PORT=8080 bash chatbot/web-start.sh
# Acesse: http://localhost:8080
```

---

## Interface Web — O que você vai ver

Ao abrir **http://localhost:3000** você verá o **Squad Dashboard**:

```
┌─────────────────────────────────────────────────────┐
│  ⬡ AIOX   Squads Platform                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎨 Apex          🎬 Curator       🔬 Deep Research  │
│  14 agentes       12 agentes       11 agentes        │
│  [Entrar →]       [Entrar →]       [Entrar →]        │
│                                                     │
│  ⚡ Dispatch      🧠 Education     🔄 Kaizen         │
│  4 agentes        16 agentes       7 agentes         │
│                                                     │
│  📈 SEO           🛠️ Squad Creator                   │
│  8 agentes        1 agente                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Clique em **Entrar →** em qualquer squad para abrir o workspace:

- **Painel esquerdo:** descrição do squad, 3 prompts rápidos clicáveis e lista de agentes
- **Chat à direita:** conversa com streaming em tempo real, suporte a upload de arquivos
- O **agente orquestrador** (chief) é selecionado automaticamente
- Você pode trocar de agente a qualquer momento durante a conversa

---

## CLI no terminal (alternativo)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
bash chatbot/start.sh
```

### Comandos disponíveis no CLI

| Comando | Descrição |
|---------|-----------|
| `/help` | Exibe ajuda |
| `/agent` | Troca de agente (mantém histórico) |
| `/upload <caminho>` | Envia um arquivo para análise |
| `/files` | Lista arquivos enviados na sessão |
| `/reset` | Limpa o histórico da conversa |
| `/status` | Exibe agente ativo e estatísticas |
| `/exit` | Encerra o chatbot |

---

## Formatos de arquivo suportados

`pdf`, `txt`, `md`, `json`, `csv`, `png`, `jpg`, `jpeg`, `webp`, `gif`

---

## Squads disponíveis

O servidor carrega automaticamente todos os agentes encontrados em `../squads/*/agents/*.md`:

| Squad | Agentes | Especialidade |
|-------|---------|---------------|
| **apex** | 14 | Frontend premium — Web, Mobile e Spatial |
| **curator** | 12 | Curadoria e montagem de conteúdo de vídeo |
| **deep-research** | 11 | Pesquisa acadêmica e investigativa baseada em evidências |
| **dispatch** | 4 | Orquestração e execução paralela de tarefas |
| **education** | 16 | Design instrucional e currículos com compliance MEC |
| **kaizen** | 7 | Melhoria contínua e análise de processos |
| **seo** | 8 | Otimização para motores de busca (score 0-100) |
| **squad-creator** | 1 | Criação de novos squads |

---

## Arquitetura

```
chatbot/
├── src/
│   ├── server.ts   — Servidor Express + dashboard web (SSE, upload)
│   ├── index.ts    — CLI principal (menus, loop de chat, comandos)
│   ├── agents.ts   — Carregador de agentes e metadados de squads
│   ├── chat.ts     — Sessão de chat com streaming (claude-opus-4-6)
│   └── files.ts    — Upload/download de arquivos via Files API
├── dist/           — JavaScript compilado (gerado por npm run build)
├── web-start.sh    — Script de inicialização da interface web
├── start.sh        — Script de inicialização do CLI
└── package.json
```

## Modelo utilizado

`claude-opus-4-6` com adaptive thinking (`thinking: {type: "adaptive"}`).
