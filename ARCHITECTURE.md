# ARCHITECTURE.md — AIOX Squads System Architecture

> Last updated: 2026-04-07

## Overview

AIOX Squads is a community ecosystem of specialized AI agent packages ("squads") that run on the [AIOX framework](https://github.com/SynkraAI/aiox-core). The repository provides three interfaces: a web portal, a CLI chatbot, and direct IDE integration.

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interfaces                       │
├──────────────┬──────────────┬───────────────────────────────┤
│  Web Portal  │ Chatbot CLI  │  IDE (Claude Code, Cursor)    │
│  (React+SSE) │ (Node REPL)  │  (Direct .md file loading)    │
└──────┬───────┴──────┬───────┴───────────────┬───────────────┘
       │              │                       │
       ▼              ▼                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express API Server                         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Sessions │ │  Agents   │ │  Files   │ │ Auth Portal  │  │
│  │ (Memory) │ │ (Loader)  │ │ (Upload) │ │ (API Key)    │  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └──────────────┘  │
│       │             │            │                           │
│       ▼             ▼            ▼                           │
│  ┌─────────────────────────────────────┐                    │
│  │         ChatSession (Streaming)      │                    │
│  │   Model: claude-opus-4-6             │                    │
│  │   Adaptive thinking + Files API      │                    │
│  └──────────────┬──────────────────────┘                    │
└─────────────────┼────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Anthropic Claude API                       │
│            (Messages API + Files API + Streaming)            │
└─────────────────────────────────────────────────────────────┘
                  ▲
                  │ System Prompts loaded from
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                      Squad Ecosystem                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ squads/<name>/                                         │  │
│  │  ├── agents/     # .md files with persona + voice DNA │  │
│  │  ├── tasks/      # Executable task definitions        │  │
│  │  ├── workflows/  # Multi-agent orchestration          │  │
│  │  ├── templates/  # Output templates                   │  │
│  │  ├── data/       # Reference data + registries        │  │
│  │  ├── checklists/ # Quality gate checklists            │  │
│  │  ├── config.yml  # Squad configuration                │  │
│  │  └── README.md   # Documentation                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Registry: .aiox/squad-runtime/ecosystem-registry.yaml       │
│  10 squads │ 87 agents │ 196 tasks │ 9 OPERATIONAL          │
└──────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Web Portal (`web/`)

**Stack:** React 19 + Vite (client) | Express 5 + TypeScript (server)

```
web/
├── server/
│   ├── index.ts          # Express app, API routes, SSE streaming
│   ├── chatSession.ts    # Claude API wrapper with streaming
│   ├── agents.ts         # Squad/agent loader from filesystem
│   ├── authPortal.ts     # Optional API key middleware
│   └── files.ts          # File upload → Anthropic Files API
├── client/src/
│   └── App.tsx           # React SPA with chat UI
├── scripts/
│   └── smoke-api.mjs     # Basic health check
└── worker/               # Cloudflare Workers adapter
```

**Request flow:**
1. Client sends message via `POST /api/chat/:sessionId`
2. Server retrieves or creates `ChatSession`
3. Agent system prompt loaded from squad's `.md` file
4. Message + files sent to Claude API with streaming
5. Response streamed back to client via SSE (`text/event-stream`)

**Key endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/auth/status` | Authentication status |
| GET | `/api/squads` | List all squads with agents |
| POST | `/api/session` | Create new chat session |
| POST | `/api/chat/:id` | Send message (SSE response) |
| POST | `/api/chat/:id/agent` | Switch active agent |
| POST | `/api/upload/:id` | Upload file to session |
| DELETE | `/api/session/:id` | Delete session |

### 2. Chatbot CLI (`chatbot/`)

**Stack:** Node.js + TypeScript + readline

Interactive CLI with menu-based squad/agent selection. Shares similar logic with web portal (agent loading, file handling, chat session).

### 3. Squad Ecosystem (`squads/`)

**Architecture: 6-Layer Anatomy**

Every squad follows a standardized structure with a tier-based chain of command:

```
Tier 0 — Chief (Orchestrator)
├── Routes requests, classifies intent, coordinates specialists
│
├── Tier 1 — Masters (Primary specialists)
│   Execute core domain tasks
│
├── Tier 2 — Specialists (Niche experts)
│   Handle specialized subtasks, called by Tier 1
│
└── Tier 3 — Support (Utilities)
    Quality gates, shared validation, analytics
```

**Agent anatomy (6 layers per .md file):**

| Layer | Purpose | Example |
|-------|---------|---------|
| `agent:` | Identity (name, id, tier) | `id: pipeline-architect` |
| `persona:` | Role and communication style | "CI/CD Pipeline Design Specialist" |
| `voice_dna:` | Cloned vocabulary and patterns | Sentence starters, anti-patterns |
| `heuristics:` | IF/THEN decision rules + veto | "IF no tests → VETO pipeline" |
| `examples:` | Input/output pairs (min. 3) | Concrete demonstrations |
| `handoffs:` | Delegation rules | "IF security concern → @devsecops" |

### 4. Ecosystem Registry

**File:** `.aiox/squad-runtime/ecosystem-registry.yaml`

Central catalog of all squads with metadata, scores, maturity levels, and a domain index for search/routing.

**Maturity levels:**

| Level | Score | Criteria |
|-------|-------|----------|
| DRAFT | < 7.0 | Basic structure, incomplete |
| DEVELOPING | 7.0-8.9 | Functional agents, executable tasks |
| OPERATIONAL | ≥ 9.0 | Validated, complete 6-layer anatomy |

## Infrastructure

### CI/CD (`.github/workflows/`)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `claude.yml` | `@claude` mention | Claude Code automation |
| `validate-squads.yml` | PR to squads/ | Squad structure validation |
| `web.yml` | PR to web/ | Build + smoke test |
| `deploy.yml` | Push to main | Cloudflare Workers deploy |

### Deployment

- **Cloudflare Workers:** Production deployment via `wrangler`
- **Docker Compose:** Local development with profiles (`web`, `chatbot`)
- **DevContainer:** Pre-configured with Node 20, ZSH, firewall

### Security

- Optional portal authentication (`WEB_PORTAL_API_KEY`)
- Rate limiting: 200 req/min standard, 30 req/min heavy operations
- Helmet middleware with security headers
- File upload whitelist (PDF, TXT, MD, JSON, CSV, images)
- Firewall (devcontainer): iptables allowlist for egress

## Data Flow

```
User Input
    │
    ▼
[Portal Auth] ──── 401 if key required and missing
    │
    ▼
[Rate Limiter] ─── 429 if exceeded
    │
    ▼
[Session Lookup] ── Creates session if new
    │
    ▼
[Agent Loader] ──── Reads squad config.yaml + agent .md
    │                Builds system prompt with persona + voice DNA
    ▼
[ChatSession] ──── Sends to Claude API:
    │               - System prompt (agent identity)
    │               - Message history
    │               - File attachments (if any)
    │               - Streaming enabled
    ▼
[SSE Stream] ────── Chunks streamed to client in real-time
    │
    ▼
[Client UI] ─────── Renders markdown response
```

## Key Design Decisions

1. **Agents as Markdown files** — Not code. Agents are `.md` files with structured YAML frontmatter. This makes them portable, versionable, and editable by non-developers.

2. **Tier-based chain of command** — Every squad has a Chief (Tier 0) that routes to specialists. This mirrors real organizational structure and prevents agent confusion.

3. **Voice DNA** — Agents don't just know *what* to say, they know *how* to say it. Cloned from real experts with sentence patterns, vocabulary, and anti-patterns.

4. **In-memory sessions** — Sessions are stored in a `Map<string, SessionState>`. Simple but ephemeral. See ULTRAPLAN F2.5 for persistence roadmap.

5. **SSE streaming** — Server-Sent Events for real-time chat. Simpler than WebSockets, sufficient for unidirectional streaming.

6. **Monorepo without shared package** — Web and chatbot currently duplicate agent/file/chat logic. See ULTRAPLAN F2.3 for extraction plan.
