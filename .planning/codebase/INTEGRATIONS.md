# External Integrations

**Analysis Date:** 2026-04-09

## APIs & External Services

**Anthropic Claude API:**
- Claude API (via `@anthropic-ai/sdk` 0.54.0)
  - What it's used for: Core conversational AI engine, message streaming, file analysis
  - SDK/Client: `@anthropic-ai/sdk` package
  - Auth: Environment variable `ANTHROPIC_API_KEY` (required, format: `sk-ant-...`)
  - Model: `claude-opus-4-6` (configured in `web/server/chatSession.ts:6`)
  - Features: 
    - Message streaming with Server-Sent Events (SSE)
    - File upload via Files API (beta: `files-api-2025-04-14`)
    - Adaptive thinking mode
    - Max tokens: 8192 per response

**Files API:**
- Anthropic Files API (v2025-04-14)
  - What it's used for: Upload and process documents (.pdf, .txt, .md, .json, .csv, .docx, .xlsx, .pptx, .jpg, .png, .gif, .webp)
  - Implementation: `web/server/files.ts`, `chatbot/src/files.ts`
  - Max file size: 32MB per file
  - Supported extensions: [`.pdf`, `.txt`, `.md`, `.json`, `.csv`, `.docx`, `.xlsx`, `.pptx`, `.jpg`, `.png`, `.gif`, `.webp`]
  - Usage: Agents can analyze uploaded documents in chat messages

## Data Storage

**Databases:**
- None - Stateless application. Session data stored in-memory (Node.js process memory only)
  - Session map: `web/server/index.ts:79` (Map<sessionId, ChatSession>)
  - Chat history: In `ChatSession.history` property
  - **Important:** Sessions are lost on server restart; no persistence layer

**File Storage:**
- Remote: Anthropic Files API (managed service)
- Local (Development): Temporary files in system temp directory via `multer` memoryStorage
  - No local disk persistence configured
  - Files uploaded to API, stored by Anthropic

**Caching:**
- None - No Redis or caching layer detected

## Authentication & Identity

**Portal Authentication (Optional):**
- Custom implementation in `web/server/authPortal.ts`
  - Provider: Custom Bearer token authentication
  - Config: Environment variable `WEB_PORTAL_API_KEY` (optional)
  - Implementation: 
    - Header check: `X-Portal-Key` or `Authorization: Bearer <token>`
    - Public routes: `/api/health`, `/api/auth/status`
    - Protected: All other `/api/*` routes when key is set
  - Note: When `WEB_PORTAL_API_KEY` is not set, no authentication required

**API Key Management:**
- Chatbot: Requires `ANTHROPIC_API_KEY` at startup, checks in `chatbot/src/index.ts:261`
- Web: Checks `ANTHROPIC_API_KEY` per-request in `web/server/index.ts:108`, allows override per session

## Monitoring & Observability

**Error Tracking:**
- None configured - Application logs errors to stdout/console

**Logs:**
- Approach: Console logging via native `console.log()` and `console.error()`
- Locations:
  - Chatbot: ANSI color-coded logs (chalk-based formatting in `chatbot/src/index.ts`)
  - Web: Plain text JSON responses for API errors
  - Health checks: Configured in Docker Compose

**Health Checks:**
- Chatbot: `GET http://127.0.0.1:3000/` returns basic HTTP 200
- Web: `GET http://127.0.0.1:8787/api/health` returns `{ ok: true, service: "aiox-squads-web" }`

## CI/CD & Deployment

**Hosting:**
- Docker Compose orchestration - Local or containerized deployments
- Cloudflare Workers support (secondary path via `web/worker/index.ts`)
- Environment: Docker (Alpine Linux base)

**CI Pipeline:**
- GitHub Actions configured at `.github/workflows/claude.yml`
- Trigger: Mentions of `@claude` in issues or PRs
- Secret required: `ANTHROPIC_API_KEY`

**Build Pipeline:**
- Docker multi-stage builds:
  - Chatbot: Build in Node 22, prune devDeps, run compiled JS
  - Web: Build server + client (Vite), prune devDeps, serve static + API

## Environment Configuration

**Required Environment Variables:**
- `ANTHROPIC_API_KEY` - Anthropic API authentication (must be `sk-ant-...` format)

**Optional Environment Variables:**
- `WEB_PORTAL_API_KEY` - Protect web portal with Bearer token
- `CORS_ORIGIN` - Comma-separated allowed origins (default: all origins)
- `TRUST_PROXY` - Set to 1 in production behind reverse proxy
- `RATE_LIMIT_ENABLED` - Enable/disable rate limiting (default: enabled)
- `RATE_LIMIT_MAX` - Standard API limit per minute (default: 200)
- `RATE_LIMIT_HEAVY_MAX` - Heavy ops limit per minute (default: 30)
- `PORT` - Web server port (default: 8787)
- `CHATBOT_PORT` - Chatbot server port (default: 3000)
- `NODE_ENV` - Set to `production` for deployment

**Secrets Location:**
- `.env` file at repository root (never committed - in `.gitignore`)
- Docker Compose passes via `.env` file or `-e` flags
- Example: `.env.example` with template

## Webhooks & Callbacks

**Incoming Webhooks:**
- None configured

**Outgoing Webhooks:**
- None - Application does not trigger external webhooks

**Server-Sent Events (SSE):**
- Response format: Line-delimited JSON in text/event-stream
- Chat endpoint: `POST /api/sessions/:id/chat`
- Event types: `{ type: "chunk", text: string }`, `{ type: "done" }`, `{ type: "error", message: string }`

## Rate Limiting

**Standard Limit:**
- 200 requests per 60 seconds (all `/api/*` routes)
- Response header: `RateLimit-*` headers included
- Limit class: `apiLimiter` in `web/server/index.ts:52`

**Heavy Limit:**
- 30 requests per 60 seconds (file uploads, chat messages)
- Routes: `POST /api/sessions/:id/upload`, `POST /api/sessions/:id/chat`
- Limit class: `heavyLimiter` in `web/server/index.ts:63`

**Bypass:**
- Set `RATE_LIMIT_ENABLED=0` to disable all rate limiting
- Useful for internal/local deployments

## Session Management

**Session Storage:**
- In-memory Map: `sessions` in `web/server/index.ts:79`
- Session structure: `{ chat: ChatSession }`
- Lifecycle: Created on `POST /api/sessions`, destroyed on server shutdown
- Chat history: Per-session, stored in `ChatSession.history[]`

**Client-Side:**
- Recent sessions cached in localStorage via `web/client/src/recentSessions.ts`
- Format: JSON array of session IDs
- Persistence: Browser storage only (not backed by server)

## Security Configuration

**Headers:**
- Helmet.js security headers enabled (CSP disabled for markdown rendering)
  - `helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })`
- CORS: Configurable origin list or reflect request origin
- Rate limiting: Both standard and heavy tiers

**File Upload Validation:**
- Extension whitelist: Only supported MIME types allowed
- Size limit: 32MB per file
- Storage: In-memory buffer (not saved to disk)

---

*Integration audit: 2026-04-09*
