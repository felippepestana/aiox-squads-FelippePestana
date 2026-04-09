# Architecture

**Analysis Date:** 2026-04-09

## Pattern Overview

**Overall:** Distributed multi-tier agent orchestration platform with composable squad system

**Key Characteristics:**
- Multi-tier agent hierarchy (Tier 0 Chief → Tier 1 Masters → Tier 2 Specialists → Tier 3 Support)
- Self-contained squad packages with agents, tasks, templates, and workflows
- Real-time chat interface with agent switching and file upload capabilities
- Cloudflare Workers compatibility with optional squad bundling
- Evidence-based pipeline execution with mandatory quality gates

## Layers

**Web Server (Backend):**
- Purpose: Express.js HTTP API for agent discovery, session management, chat streaming
- Location: `web/server/`
- Contains: Session handlers, agent loader, file upload processor, authentication middleware
- Depends on: Anthropic SDK, Express, environment configuration
- Used by: React web client, Cloudflare Workers deployment

**Web Client (Frontend):**
- Purpose: React UI for interactive chat with squad agents, session history, file uploads
- Location: `web/client/src/`
- Contains: App component, API client, markdown rendering, local storage persistence
- Depends on: React, Vite, Anthropic SDK
- Used by: End users via browser

**Agent System:**
- Purpose: Load, parse, and manage squad agents from filesystem or bundle
- Location: `web/server/agents.ts`
- Contains: Agent metadata extraction, squad meta loading, system prompt building
- Depends on: YAML parsing, filesystem access (or bundled JSON for Workers)
- Used by: Session creation, agent routing

**Chat Session Layer:**
- Purpose: Maintain conversation history and message streaming with selected agent
- Location: `web/server/chatSession.ts`
- Contains: ChatSession class managing message history, file attachments, Claude API calls
- Depends on: Anthropic SDK beta APIs (files-api-2025-04-14, adaptive thinking)
- Used by: Server message handling, agent switching

**File Handling:**
- Purpose: Process and upload files to Anthropic Files API for agent access
- Location: `web/server/files.ts`
- Contains: MIME type mapping, buffer/stream upload, content block building
- Depends on: Anthropic SDK Files API
- Used by: Upload endpoint, chat session file attachment

**Authentication Layer:**
- Purpose: Optional portal-based API key authentication for multi-tenant deployments
- Location: `web/server/authPortal.ts`
- Contains: Portal key validation via X-Portal-Key header or Bearer token
- Depends on: Environment variable (WEB_PORTAL_API_KEY)
- Used by: Middleware in main server

**Squad Packages:**
- Purpose: Self-contained domain-specific agent collections with structured workflows
- Location: `squads/{squad-name}/`
- Contains: agents/, tasks/, templates/, workflows/, config.yaml, README.md
- Depends on: AIOX core framework for execution
- Used by: Agent system loader

## Data Flow

**Session Creation Flow:**

1. Client: `POST /api/sessions` with `{squadId, agentId}`
2. Server: Load all squads via `loadAllSquads()` → find agent via `findAgent()`
3. Server: Create `ChatSession` with Anthropic client + selected Agent
4. Server: Store in-memory session state (Map<sessionId, SessionState>)
5. Server: Return `{sessionId, agent}` to client
6. Client: Establish SSE connection for subsequent messages

**Message Flow:**

1. Client: `POST /api/sessions/{id}/messages` with text + file IDs
2. Server: Retrieve session state from Map
3. Server: Call `ChatSession.send()` with user content + files
4. ChatSession: Build Anthropic MessageParam with user text + file content blocks
5. ChatSession: Call `client.beta.messages.stream()` with agent's systemPrompt
6. Server: Relay streamed chunks via SSE (`data:` format)
7. Client: Parse SSE chunks, append to chat display, save to localStorage

**File Upload Flow:**

1. Client: `POST /api/sessions/{id}/upload` with multipart file
2. Server: Validate MIME type via supportedExtensions()
3. Server: Call `uploadFileFromBuffer()` with Anthropic Files API
4. Anthropic: Return `{id, filename, size}` 
5. Server: Return UploadedFileMeta to client
6. Client: Store file ID, include in next message

**Squad Discovery Flow:**

1. Client: `GET /api/squads` on app load
2. Server: Call `loadAllSquads()` → scan `squads/` directory
3. Server: For each squad, parse `config.yaml` for metadata
4. Server: For each agent, extract name/id from YAML frontmatter
5. Server: Return SquadSummary[] (id, meta, agents list)
6. Client: Populate squad/agent dropdowns

**State Management:**

- **Server-side:** In-memory Map<sessionId, SessionState> — sessions lost on restart
- **Client-side:** 
  - localStorage for recent sessions (RecentSessionMeta[])
  - localStorage for chat history (ChatLine[] per session)
  - sessionStorage for portal API key (if auth required)

## Key Abstractions

**Agent:**
- Purpose: Represents a single specialized AI persona within a squad
- Location: Defined in `squads/{squad}/agents/{agent-id}.md` with YAML frontmatter
- Pattern: Markdown file with YAML block (name, id, persona, voice_dna, heuristics, examples, handoffs)
- Used by: ChatSession to build system prompts

**Squad:**
- Purpose: Collection of related agents operating in a domain
- Location: Directory `squads/{squad-id}/` with structure defined by config.yaml
- Pattern: Self-contained package with agents/, tasks/, templates/, data/, workflows/
- Used by: Agent loader, discovery endpoint

**ChatSession:**
- Purpose: Encapsulates conversation state with a specific agent
- Located in: `web/server/chatSession.ts` (ChatSession class)
- Pattern: Maintains history array, handles file attachments, streams responses
- Provides: `send(text, files)`, `switchAgent()`, `resetHistory()`, `historyLength()`

**SquadMeta:**
- Purpose: Lightweight metadata about a squad for discovery UI
- Located in: `web/server/agents.ts` and `web/client/src/api.ts`
- Pattern: `{icon, title, description}` extracted from squad config.yaml
- Used by: Squad dropdown, squad cards in UI

## Entry Points

**Web Server HTTP:**
- Location: `web/server/index.ts`
- Triggers: `npm run dev:server` (tsx watch) or `npm run build && npm start`
- Responsibilities: 
  - Load environment config
  - Initialize Express app with CORS, helmet, rate limiting
  - Register API routes (/api/squads, /api/sessions, /api/upload, etc)
  - Serve static client build at `dist/client/`

**Web Client Browser:**
- Location: `web/client/src/main.tsx`
- Triggers: Vite dev server at port 5173 or static file from `dist/client/`
- Responsibilities:
  - Mount React App component
  - Initialize auth check (portalAuthRequired?)
  - Load squad list
  - Manage session UI (selection, chat, file upload)

**Cloudflare Workers:**
- Location: `web/worker/index.ts`
- Triggers: `npm run deploy` via wrangler
- Responsibilities:
  - Import compiled server/index.js
  - Expose HTTP handler via `httpServerHandler`
  - Require bundled squads JSON (built via scripts/bundle-squads.mjs)

**Squad Execution:**
- Location: Each squad's orchestrator agent (e.g., `squads/education/agents/education-chief.md`)
- Triggers: @chief command or *task invocation within AIOX
- Responsibilities:
  - Receive user intent
  - Route through tier pipeline (Tier 0 diagnostic → Tier 1 execution → Tier 2/3 specialists)
  - Enforce quality gates
  - Return structured output

## Error Handling

**Strategy:** Graceful degradation with user-facing error messages

**Patterns:**

- **Missing ANTHROPIC_API_KEY:** Server responds 503 with setup instructions
- **Session Not Found:** 404 with "Sessão não encontrada"
- **Unsupported File Type:** 400 with "Extensão não suportada"
- **Portal Auth Required:** 401 with "Chave do portal ausente ou inválida"
- **Streaming Abort:** Client catches AbortError, retains chat history
- **Squad/Agent Not Found:** 404, retry squad discovery

**Rate Limiting:**
- API limiter: 200 req/min per IP
- Heavy limiter: 30 req/min for uploads/messages
- Both skip if RATE_LIMIT_ENABLED=0

## Cross-Cutting Concerns

**Logging:** Console via chalk library in chatbot; structured errors in web server

**Validation:** 
- File MIME types checked against allowlist (supportedExtensions)
- sessionId routed safely (Array.isArray guard)
- Portal key trimmed and compared as string

**Authentication:**
- Portal auth optional (checks WEB_PORTAL_API_KEY env var)
- Public routes: GET /api/health, GET /api/auth/status
- Protected routes: All /api/* except public routes
- Headers: X-Portal-Key or Authorization: Bearer

**Squad Loading Modes:**
- **Development:** Load from `squads/` filesystem directory
- **Cloudflare Workers:** Load from `dist/squads-bundle.json` (no fs access)
- **Fallback:** Cache strategy with null checks on bundle load

---

*Architecture analysis: 2026-04-09*
