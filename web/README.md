# Portal web AIOX Squads

Interface no browser para conversar com os mesmos agentes definidos em `squads/*/agents/*.md`, com paridade funcional ao CLI em `chatbot/` (streaming Anthropic, Files API para anexos).

## Pré-requisitos

- Node.js 20+
- Chave `ANTHROPIC_API_KEY` (somente no servidor; nunca exposta ao frontend)

O ficheiro [`.npmrc`](.npmrc) força `package-lock=true` nesta pasta (útil se o teu npm global tiver `package-lock=false`).

## Guia rápido (acesso e uso)

1. **Instalação:** `cd web`, `npm install`, copie [`.env.example`](.env.example) para `.env` e defina `ANTHROPIC_API_KEY`.
2. **Desenvolvimento:** `npm run dev` → abra **http://127.0.0.1:5173** (Vite; o proxy encaminha `/api` para **http://127.0.0.1:8787**).
3. **Produção local (um só processo):** `npm run build` e `node dist/server/index.js` → abra **http://127.0.0.1:8787** (API + interface estática).
4. **Portal com chave:** com `WEB_PORTAL_API_KEY` no servidor, a UI pede a chave uma vez (guardada em `sessionStorage` como `X-Portal-Key` nas chamadas).
5. **No chat:** escolha squad e agente → **Iniciar sessão** → escreva e **Enter** para enviar (**Shift+Enter** nova linha). **Esc** interrompe a geração; **Alt+M** foca a caixa. **Exportar Markdown** e **Sessões recentes** ficam na barra lateral.

## Desenvolvimento

Na pasta `web/`:

```bash
npm install
cp .env.example .env
# Edite .env e defina ANTHROPIC_API_KEY

npm run dev
```

- Frontend: http://127.0.0.1:5173 (Vite; proxy `/api` → backend)
- API: http://127.0.0.1:8787

O texto da caixa de mensagem é guardado automaticamente em `sessionStorage` por `sessionId` (rascunho por sessão).

## Produção (build único)

```bash
npm run build
NODE_ENV=production node dist/server/index.js
```

Abra http://127.0.0.1:8787 — o Express passa a servir o bundle estático em `dist/client/` se existir.

## Docker Compose (raiz do repositório)

Na raiz do repo (onde está `squads/`):

```bash
cp .env.example .env
# Edite .env: ANTHROPIC_API_KEY e, se quiser, WEB_PORTAL_API_KEY

docker compose --profile web up -d --build
```

Chatbot no mesmo ficheiro: `docker compose --profile chatbot up -d --build`. Ambos: `--profile web --profile chatbot`.

O Compose lê o `.env` junto ao `docker-compose.yml` para substituir `${ANTHROPIC_API_KEY}`, etc.

- URL: http://127.0.0.1:8787 (ou a porta em `WEB_PORT`)
- Os agentes vêm da imagem em `/app/squads` (cópia no build). Para alterar squads, reconstrua a imagem.

### Smoke test da API

Com o backend a correr (`npm run dev` ou `node dist/server/index.js`):

```bash
npm run test:smoke
```

Com portal protegido: `SMOKE_PORTAL_KEY=sua_chave npm run test:smoke`

Outro host/porta: `SMOKE_BASE_URL=http://127.0.0.1:3000 npm run test:smoke`

Sem chave, com o servidor **com** `WEB_PORTAL_API_KEY` ativa: o smoke valida `401` em `/api/squads` e em `/api/sessions/:id` (acesso negado sem header).

**Windows:** ao lançar o `node` noutro processo (por exemplo `Start-Process`), as variáveis de ambiente por vezes **não são herdadas**. Se o smoke sem `SMOKE_PORTAL_KEY` ainda responder `ok /api/squads`, o portal não ficou ativo nesse processo. Use, por exemplo:

`cmd /c "set PORT=8787&& set WEB_PORTAL_API_KEY=sua_chave&& cd /d caminho\\para\\web && node dist/server/index.js"`

### CI

Em repositórios no GitHub, o workflow [`.github/workflows/web.yml`](../.github/workflows/web.yml) executa `npm ci`, `npm run build` e o smoke da API em cada push/PR que altere `web/`.

## Autenticação opcional do portal

Se `WEB_PORTAL_API_KEY` estiver definida no servidor, todas as rotas `/api/*` exigem um dos headers:

- `X-Portal-Key: <valor>`
- `Authorization: Bearer <valor>`

Rotas públicas: `GET /api/health`, `GET /api/auth/status`.

A interface React obtém `portalAuthRequired` em `/api/auth/status` e pede a chave uma vez; o valor fica em `sessionStorage` (não use como único controlo de segurança em redes abertas).

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_API_KEY` | Obrigatória para chat e upload |
| `WEB_PORTAL_API_KEY` | Opcional; ativa proteção por header nas rotas da API |
| `CORS_ORIGIN` | Opcional; origens permitidas (lista CSV). Vazio = comportamento permissivo (adequado só em dev) |
| `TRUST_PROXY` | `1` ou `true` para confiar em `X-Forwarded-*` (atrás de reverse proxy). Em `production` o padrão do servidor é ativar trust proxy |
| `RATE_LIMIT_ENABLED` | `0` ou `false` desativa limitadores. Por omissão ativos |
| `RATE_LIMIT_MAX` | Máx. pedidos `/api/*` por IP por minuto (padrão `200`) |
| `RATE_LIMIT_HEAVY_MAX` | Máx. `chat` + `upload` por IP por minuto (padrão `30`) |
| `SQUADS_ROOT` | Caminho absoluto para a pasta `squads` (opcional; padrão: `../../squads` a partir de `server/`) |
| `PORT` | Porta do servidor (padrão `8787`) |

## API (resumo)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/auth/status` | `{ portalAuthRequired: boolean }` (sem chave) |
| GET | `/api/squads` | Lista squads e agentes (sem system prompt) |
| GET | `/api/sessions/:id` | `{ ok: true }` se a sessão existir no servidor; `404` se não |
| POST | `/api/sessions` | Corpo: `{ squadId, agentId }` → `{ sessionId, agent }` |
| POST | `/api/sessions/:id/switch-agent` | Troca de agente mantendo histórico |
| POST | `/api/sessions/:id/reset` | Limpa histórico |
| POST | `/api/sessions/:id/upload` | `multipart/form-data` campo `file` |
| POST | `/api/sessions/:id/chat` | Corpo: `{ text, files }` — resposta `text/event-stream` (SSE) |

O modelo e o streaming seguem `server/chatSession.ts` (equivalente a `chatbot/src/chat.ts`).
