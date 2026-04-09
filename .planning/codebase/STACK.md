# Technology Stack

**Analysis Date:** 2026-04-09

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (chatbot, web server, client, build scripts)
- JavaScript (ES modules) - Vite configuration and utility scripts

**Secondary:**
- Bash - Installation and deployment scripts (`install.sh`, `setup-local-deploy.sh`)

## Runtime

**Environment:**
- Node.js 20 (development, devcontainer) - Used in `.devcontainer/Dockerfile` and base runtime
- Node.js 22-Alpine (production) - Lightweight base for web and chatbot Docker images

**Package Manager:**
- npm - Primary package manager
- Lockfile: `package-lock.json` present in `chatbot/`, `web/`, and implied root

## Frameworks

**Core:**
- Express.js 5.2.1 - Web server framework (both `chatbot` and `web` projects)
- React 19.0.0 - Client UI framework (web portal)
- Vite 6.0.0 - Build tool and dev server for client application

**File Processing:**
- Multer 2.1.1 - File upload middleware (chatbot and web)

**Build/Dev:**
- TypeScript 5.9.3 - Language compilation
- ts-node 10.9.2 - Direct TypeScript execution (chatbot dev mode)
- tsx 4.21.0 - TypeScript executor with watch mode (web dev server)
- concurrently 9.2.0 - Run multiple npm scripts concurrently (web dev environment)
- @vitejs/plugin-react 4.3.0 - React support in Vite

## Key Dependencies

**Critical:**
- @anthropic-ai/sdk 0.54.0 - Anthropic Claude API client (both chatbot and web)
  - Provides Files API for document uploads
  - Streaming message support with adaptive thinking
  - Model: claude-opus-4-6 in chat sessions
- express 5.2.1 - REST API server framework
- @types/express 5.0.6 - TypeScript types for Express
- @types/node 22.0.0+ - Node.js type definitions

**Infrastructure & Security:**
- helmet 8.1.0 - Express security middleware (CSP, HSTS headers, etc.)
- cors 2.8.5 - Cross-Origin Resource Sharing middleware
- express-rate-limit 8.3.1 - Request rate limiting (200 req/min standard, 30 req/min heavy)
- dotenv 16.6.1 - Environment variable management
- multer 2.1.1 - Multipart file upload handling

**Client/Markdown:**
- react-markdown 10.1.0 - Markdown rendering in React
- remark-gfm 4.0.1 - GitHub Flavored Markdown support
- rehype-highlight 7.0.2 - Syntax highlighting for code blocks
- highlight.js 11.11.1 - Syntax highlighting library

**Development:**
- chalk 5.4.1 - Terminal color output (chatbot CLI)
- readline 1.3.0 - Interactive CLI input (chatbot)

## Configuration

**Environment:**
- `.env` and `.env.example` at repository root - Contains `ANTHROPIC_API_KEY` and optional web/rate-limit settings
- Per-service environment variable loading in:
  - `web/server/index.ts` - Loads `.env` from multiple locations
  - `chatbot/src/index.ts` - Requires `ANTHROPIC_API_KEY` at startup

**Key Configuration Variables:**
- `ANTHROPIC_API_KEY` (required) - API key for Claude API calls
- `WEB_PORTAL_API_KEY` (optional) - Basic auth for web portal
- `CORS_ORIGIN` (optional) - Comma-separated list of allowed origins
- `TRUST_PROXY` (optional) - Enable X-Forwarded-* headers (1 for production)
- `RATE_LIMIT_ENABLED` (optional) - Enable/disable rate limiting
- `RATE_LIMIT_MAX` (optional) - Standard rate limit (default: 200 req/min)
- `RATE_LIMIT_HEAVY_MAX` (optional) - Heavy operation limit (default: 30 req/min)
- `PORT` (optional) - Web server port (default: 8787)
- `CHATBOT_PORT` (optional) - Chatbot server port (default: 3000)
- `NODE_ENV` - production or development

**Build:**
- `tsconfig.json` (chatbot) - Target ES2022, CommonJS modules, strict mode enabled
- `tsconfig.server.json` (web) - Server-side TypeScript compilation
- `tsconfig.json` (web/client) - ES2022 target, ESNext modules, JSX support, no emit (Vite handles)
- `.devcontainer/Dockerfile` - Development container setup with Node 20

## Platform Requirements

**Development:**
- Node.js 20+ with npm
- Docker (for containerized dev/production)
- ~2GB available disk for node_modules installation
- Firewall access to `api.anthropic.com` (API calls)

**Production:**
- Docker with Docker Compose support
- Node.js 22-Alpine runtime (provided in images)
- Environment variables: `ANTHROPIC_API_KEY` (required), optional portal/rate-limit settings
- Network: Outbound HTTPS to `api.anthropic.com`
- Health checks configured for both chatbot (port 3000) and web (port 8787)

## Build Artifacts

**Chatbot:**
- `chatbot/dist/` - Compiled TypeScript output
- Entry: `chatbot/dist/server.js` (Docker) or `chatbot/dist/index.js` (npm start)

**Web:**
- `web/dist/server/` - Compiled server code
- `web/dist/client/` - Built React application (Vite output)
- Bundled squads at runtime via `web/scripts/bundle-squads.mjs`

**Docker Images:**
- `aiox-chatbot:latest` - Chatbot service
- `aiox-squads-web:latest` - Web portal + API server
- Multi-stage builds (Alpine for minimal size)

---

*Stack analysis: 2026-04-09*
