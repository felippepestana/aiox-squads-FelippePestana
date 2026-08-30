# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

Use Node.js 22+. The root `package.json` is the canonical entry point for repository-wide setup and verification.

This is a monorepo with multiple products. The primary services for development are:

| Service | Path | Dev command | Port |
|---------|------|-------------|------|
| **Web Portal** (Express + React/Vite) | `web/` | `npm run dev` | Client: 5173, API: 8787 |
| **Chatbot** (Express) | `chatbot/` | `npm run dev` | 3000 |
| **Analista Processual Web** (Next.js 15) | `analista-processual-web/` | `npm run dev` | 3000 (conflicts with chatbot — run one at a time) |

### Root commands

```bash
npm run setup          # install all three primary applications
npm run validate       # validate repository and squad structure
npm run typecheck      # type-check every primary application
npm test               # run automated tests
npm run build          # production builds for every primary application
npm run dev:analista   # starts Next.js on 3001, avoiding the chatbot port
```

### Running the web portal (main product)

```bash
cd web
npm install
# Create .env with at minimum: ANTHROPIC_API_KEY=<your-key>
npm run dev
```

- Frontend at http://localhost:5173 (Vite proxy forwards `/api` to backend)
- API at http://localhost:8787
- Smoke test: `npm run test:smoke` (server must be running)

### Key gotchas

- The `web/` project uses ES modules (`"type": "module"` in package.json). Server TypeScript is compiled with `tsconfig.server.json`, client with `client/tsconfig.json`.
- The `SQUADS_ROOT` env var defaults to `../../squads` relative to the server directory — in this repo layout that resolves to `/workspace/squads` correctly.
- `analista-processual-web/` needs `DATABASE_URL` during `prisma generate`; use the development value documented in `.env.example`. It does not connect to the database during client generation.
- The `chatbot/` uses CommonJS (`"module": "CommonJS"` in tsconfig). Build with `npx tsc` in that directory.
- No root-level `package.json` exists — each service manages its own dependencies independently.

### TypeScript checks

```bash
# web/ server
cd web && npx tsc -p tsconfig.server.json --noEmit

# web/ client
cd web && npx tsc -p client/tsconfig.json --noEmit

# chatbot/
cd chatbot && npx tsc --noEmit

# analista-processual-web/
cd analista-processual-web && npx tsc --noEmit
```

### Build commands

```bash
# web/ (full build: server TS + client Vite)
cd web && npm run build

# chatbot/
cd chatbot && npx tsc
```

### Required secrets

- `ANTHROPIC_API_KEY` — required for `web/` and `chatbot/` chat functionality
- `OPENAI_API_KEY` — required for `analista-processual-web/` (optional for other services)
