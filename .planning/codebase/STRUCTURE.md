# Codebase Structure

**Analysis Date:** 2026-04-09

## Directory Layout

```
aiox-squads-FelippePestana/
├── .aiox/                    # AIOX runtime cache (generated, ignore)
├── .devcontainer/            # Dev container config for GitHub Codespaces
├── .github/workflows/         # CI/CD pipelines (Claude, deploy, validate, web)
├── .planning/                 # GSD planning directory (this file lives here)
├── chatbot/                   # Standalone Node.js chatbot CLI
├── doc/                       # Documentation and assets
├── squads/                    # Squad packages (the core of this repo)
├── web/                       # Web UI + server (chat interface)
├── CLAUDE.md                  # Project conventions (language, commits, structure)
├── README.md                  # Main documentation (Portuguese)
├── docker-compose.yml         # Local dev environment
├── install.sh                 # Setup script
└── setup-local-deploy.sh      # Deployment setup script
```

## Directory Purposes

**`squads/`:**
- Purpose: Community squad packages for different domains (education, research, SEO, etc.)
- Contains: Subdirectories for each squad (apex, curator, deep-research, dispatch, education, kaizen, seo, squad-creator, squad-creator-pro, devops)
- Key files: Each squad has config.yaml, README.md, CHANGELOG.md
- Pattern: Self-contained packages following 6-layer agent anatomy

**`web/`:**
- Purpose: Web chat interface and API server
- Contains: 
  - `server/` — Express.js backend
  - `client/` — React frontend
  - `worker/` — Cloudflare Workers entry point
  - `scripts/` — Build utilities (bundle-squads.mjs, smoke-api.mjs)
- Key files: `package.json`, `tsconfig.server.json`

**`web/server/`:**
- Purpose: Express.js HTTP API for agents and sessions
- Contains: TypeScript source files implementing session, file, agent, auth layers
- Key files:
  - `index.ts` — Main Express app with all routes
  - `agents.ts` — Squad/agent loading and discovery
  - `chatSession.ts` — Message history and streaming
  - `files.ts` — File upload and content blocks
  - `authPortal.ts` — Portal auth middleware

**`web/client/`:**
- Purpose: React UI for interactive chat
- Contains:
  - `src/` — React components and utilities
  - `vite.config.ts` — Vite build config
  - `tsconfig.json` — TypeScript config
  - `package.json` — Dependencies
- Key files:
  - `src/App.tsx` — Main app component (large, ~400 lines)
  - `src/api.ts` — Fetch client for server endpoints
  - `src/recentSessions.ts` — localStorage persistence
  - `src/MarkdownMessage.tsx` — Markdown rendering with syntax highlight

**`web/client/src/`:**
- Purpose: React source code
- Contains: Components and utility modules
- Key modules:
  - `App.tsx` — State management for squads, agents, sessions, chat messages, UI
  - `api.ts` — Type definitions and fetch wrappers (createSession, chatStream, uploadFile, etc.)
  - `recentSessions.ts` — localStorage helper for session history and chat lines
  - `MarkdownMessage.tsx` — react-markdown with GitHub flavor and code highlighting
  - `main.tsx` — React root mounting
  - `vite-env.d.ts` — Vite type definitions

**`chatbot/`:**
- Purpose: Standalone CLI chatbot (alternative to web UI)
- Contains: TypeScript source files for terminal-based interaction
- Key files:
  - `src/index.ts` — CLI entry point
  - `src/agents.ts` — Agent loading (same pattern as web)
  - `src/chat.ts` — Chat session (similar to web)
  - `src/files.ts` — File handling
  - `src/server.ts` — Express server for chatbot

**`squads/{squad-name}/`:**
- Purpose: Single squad package
- Standard subdirectories:
  - `agents/` — Agent definitions (.md files with YAML frontmatter)
  - `tasks/` — Executable task definitions
  - `templates/` — Output templates (YAML)
  - `workflows/` — Multi-step workflow definitions (YAML)
  - `data/` — Domain-specific reference data
  - `scripts/` — Utility scripts (TypeScript/Bash)
  - `checklists/` — Quality checklists
  - `config.yaml` — Squad metadata and tier architecture
  - `README.md` — Squad documentation
  - `CHANGELOG.md` — Version history

**`squads/education/` (Example):**
- `agents/` — 16 agents (education-chief, bloom-diagnostician, wiggins-architect, etc.)
- `tasks/` — 24 task definitions (create-course, design-curriculum, validate, etc.)
- `templates/` — 9 output templates (curriculum-master-tmpl.yaml, lesson-tmpl.yaml, etc.)
- `config.yaml` — Defines tier structure: Tier 0 diagnostic → Tier 1 core engine → Tier 2 specialists + orchestrator

**`squads/deep-research/` (Example):**
- `agents/` — 11 agents (dr-orchestrator, sackett, booth, forsgren, cochrane, etc.)
- `tasks/` — 17 task definitions
- `workflows/` — 3 workflows (wf-deep-research.yaml, wf-quick-research.yaml, wf-competitive-intel.yaml)
- `data/minds/` — 8 expert DNA profiles (klein_dna.yaml, forsgren_dna.yaml, etc.)
- `config.yaml` — Defines pipeline: Tier 0 diagnostic (3) → Tier 1 execution (5 parallel) → QA (2 sequential)

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Key files:
  - `claude.yml` — Trigger GSD commands when @claude mentioned in issues/PRs
  - `deploy.yml` — Production deployment
  - `validate-squads.yml` — Quality validation on push
  - `web.yml` — Build and test web app

**`doc/`:**
- Purpose: User-facing documentation and assets
- Contains: `assets/` (logos, header images), `README.en.md` (English version)

## Key File Locations

**Entry Points:**

- `web/server/index.ts` — Express app, listen on PORT (default 8787)
- `web/client/src/main.tsx` — React entry, mounts App to #root
- `web/worker/index.ts` — Cloudflare Workers handler
- `chatbot/src/index.ts` — CLI chatbot entry point
- `squads/{squad}/agents/{agent}.md` — Agent definitions (loaded via agents.ts)

**Configuration:**

- `web/package.json` — Dependencies, scripts (dev, build, deploy)
- `web/tsconfig.server.json` — Server-side TypeScript config
- `web/client/vite.config.ts` — Vite bundler config with dev proxy
- `squads/{squad}/config.yaml` — Squad architecture and agent registry
- `.env` (not committed) — ANTHROPIC_API_KEY, WEB_PORTAL_API_KEY, etc.
- `CLAUDE.md` — Project conventions (commits, code style, squad structure)

**Core Logic:**

- `web/server/agents.ts` — loadAllSquads(), findAgent(), buildSystemPrompt()
- `web/server/chatSession.ts` — ChatSession class with message history
- `web/server/index.ts` — All HTTP route handlers (POST /api/sessions, POST /api/upload, etc.)
- `web/client/src/App.tsx` — State management for UI (squads, chat, sessions)
- `web/client/src/api.ts` — Fetch wrappers and TypeScript interfaces

**Testing:**

- `web/scripts/smoke-api.mjs` — Basic API health checks
- No unit test framework detected; validation via `*validate-squad` command in AIOX

## Naming Conventions

**Files:**

- Agent definitions: `agents/{agent-id}.md` (kebab-case, lowercase)
  - Example: `bloom-diagnostician.md`, `wiggins-architect.md`
- Task definitions: `tasks/{task-name}.md` (kebab-case)
  - Example: `create-curriculum.md`, `design-lesson.md`
- Templates: `templates/{template-name}-tmpl.yaml` (kebab-case with `-tmpl` suffix)
  - Example: `curriculum-master-tmpl.yaml`, `lesson-tmpl.yaml`
- Workflows: `workflows/wf-{workflow-name}.yaml` (kebab-case with `wf-` prefix)
  - Example: `wf-full-course-creation.yaml`
- Squad config: `config.yaml` (always lowercase, always at squad root)
- TypeScript: PascalCase for classes, camelCase for functions/variables
  - Class example: `ChatSession`, `UploadedFile`
  - Function example: `loadAllSquads()`, `findAgent()`, `buildSystemPrompt()`

**Directories:**

- Squad directories: lowercase kebab-case
  - Example: `squads/education`, `squads/deep-research`, `squads/squad-creator`
- Source directories: lowercase
  - Example: `web/server/`, `web/client/src/`
- Package directories: uppercase (npm convention)
  - None in this repo, follow package.json name

**Environment Variables:**

- Upper snake_case: `ANTHROPIC_API_KEY`, `WEB_PORTAL_API_KEY`, `RATE_LIMIT_ENABLED`, `CORS_ORIGIN`

## Where to Add New Code

**New Squad:**
- Create `squads/{squad-id}/` directory
- Structure: `agents/`, `tasks/`, `templates/`, `workflows/`, `data/`, `config.yaml`, `README.md`
- Run `*validate-squad {squad-id}` within AIOX to verify
- See templates in existing squads (education, deep-research) for patterns

**New Agent in Existing Squad:**
- Add `.md` file to `squads/{squad}/agents/{agent-id}.md`
- YAML frontmatter: name, id, persona, voice_dna, heuristics, examples, handoffs
- Register in `squads/{squad}/config.yaml` under `agents:` section
- Assign to a tier (Tier 0, Tier 1, Tier 2, or orchestrator)

**New Web Feature:**
- **Server route:** Add handler in `web/server/index.ts`, import utilities from `agents.ts`, `chatSession.ts`, `files.ts`
- **Client component:** Add to `web/client/src/`, export from same file or from new file
- **API types:** Define interfaces in `web/client/src/api.ts` (shared with server)
- **Build:** Ensure TypeScript compiles via `npm run build`

**New Task in Squad:**
- Add `.md` file to `squads/{squad}/tasks/{task-id}.md`
- Define: trigger condition, input format, orchestration steps, output format
- Reference agents from same squad
- Document in squad README.md

**Utilities/Helpers:**
- Shared code: Functions in existing utility files (agents.ts, files.ts, etc.)
- New utility module: Create in `web/server/` or `web/client/src/`, export typed functions

**Tests:**
- Smoke tests: `web/scripts/smoke-api.mjs` (basic API checks)
- Squad validation: `*validate-squad {name}` within AIOX (checks structure, quality gates)
- CI: `.github/workflows/validate-squads.yml` and `web.yml`

## Special Directories

**`.aiox/`:**
- Purpose: AIOX runtime cache for validation runs
- Generated: Yes (created by `*validate-squad` command)
- Committed: No (should be in .gitignore)
- Contains: Temporary validation artifacts

**`dist/` (built, not committed):**
- Purpose: Compiled output from build process
- Generated: Yes (created by `npm run build`)
- Committed: No
- Contains:
  - `dist/server/` — Compiled server TypeScript
  - `dist/client/` — Vite bundle (HTML, CSS, JS)
  - `dist/squads-bundle.json` — Bundled squads for Workers (if built with `npm run build:worker`)

**`node_modules/` (not committed):**
- Purpose: Installed npm dependencies
- Generated: Yes (created by npm install)
- Committed: No

**`web/dist/` (alternative build output):**
- Purpose: When building in web/ subdirectory specifically
- Created by Vite if building from web/ context

---

*Structure analysis: 2026-04-09*
