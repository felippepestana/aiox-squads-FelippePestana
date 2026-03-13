# AIOX Legal Squad — Deployment Guide

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Anthropic API key (`sk-ant-...`) |
| `PORT` | No | `3000` | HTTP port the server binds to |
| `NODE_ENV` | No | `development` | Set to `production` to enable static file serving |
| `VITE_API_URL` | Frontend only | `http://localhost:3000` | Backend URL used by the Vite frontend build |

Copy `.env.example` to `.env` and fill in your values before running any deployment option.

---

## 1. Local Development

### Backend only (built-in chat UI)

```bash
cd chatbot
npm install
ANTHROPIC_API_KEY=sk-ant-... npm run dev       # ts-node, hot-reload
# or after build:
npm run build && ANTHROPIC_API_KEY=sk-ant-... npm start
```

The built-in HTML chat UI is served at `http://localhost:3000`.

### With a separate frontend (Vite)

```bash
# Terminal 1 — backend
cd chatbot
ANTHROPIC_API_KEY=sk-ant-... npm run dev

# Terminal 2 — frontend
cd frontend
VITE_API_URL=http://localhost:3000 npm run dev
# Open http://localhost:5173
```

---

## 2. Docker — Self-Hosted

### Chatbot-only image (existing, no frontend build required)

```bash
# Build from repo root
docker build -f chatbot/Dockerfile -t aiox-chatbot .

# Run
docker run -d \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  --name aiox-chatbot \
  aiox-chatbot

# Or via docker-compose (chatbot only)
ANTHROPIC_API_KEY=sk-ant-... docker-compose -f docker-compose.chatbot.yml up -d
```

### Full production image (backend + frontend)

```bash
# Build (requires a frontend/ directory)
docker build -t aiox-legal .

# Run
docker run -d \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e NODE_ENV=production \
  --name aiox-legal \
  aiox-legal
```

### Production docker-compose (recommended)

```bash
# Copy and edit environment file
cp .env.example .env
# Set ANTHROPIC_API_KEY in .env

docker-compose up -d
```

Health check: `http://localhost:3000/health`

---

## 3. Free Tier: Vercel (frontend) + Render (backend)

This splits the app: the React/Vite frontend is hosted on Vercel's CDN and the
Express API runs on Render's free web service tier.

### Step 1 — Deploy backend to Render

1. Push this repository to GitHub.
2. Go to [render.com](https://render.com) → New → Web Service.
3. Connect your GitHub repo; Render will auto-detect `render.yaml`.
4. Set the `ANTHROPIC_API_KEY` environment variable in the Render dashboard
   (it is marked `sync: false` so it is never stored in source control).
5. Deploy. Note the service URL, e.g. `https://aiox-legal-api.onrender.com`.

Health check endpoint: `https://aiox-legal-api.onrender.com/health`

### Step 2 — Deploy frontend to Vercel

1. Edit `vercel.json` and replace `YOUR_RENDER_URL` with your Render service URL.
2. In the Vercel dashboard, add a secret called `render_api_url` containing
   your Render URL (e.g. `https://aiox-legal-api.onrender.com`).
3. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
4. Vercel picks up `vercel.json` automatically.
5. Set `VITE_API_URL` to your Render URL in the Vercel Environment Variables UI
   so the frontend build knows where the API lives.

### Notes on free-tier limits

- Render free tier spins down after 15 minutes of inactivity. The first request
  after a cold start may take 30–60 seconds.
- Vercel free tier has generous bandwidth and build limits for static sites.

---

## 4. Hostinger VPS (future migration)

When you are ready to move off free tiers to a Hostinger VPS:

1. **Provision the VPS** with Ubuntu 22.04 LTS.
2. **Install Docker & Compose**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```
3. **Clone the repo** and copy your `.env` file to the server.
4. **Run the production compose stack**:
   ```bash
   docker-compose up -d
   ```
5. **Set up a reverse proxy** (nginx or Caddy) to terminate TLS and forward
   traffic on port 443 to `localhost:3000`.

   Example Caddy snippet:
   ```
   aiox.yourdomain.com {
     reverse_proxy localhost:3000
   }
   ```
6. **Enable automatic restarts** — the `restart: unless-stopped` policy in
   `docker-compose.yml` handles this.
7. **Update DNS** — point your domain's A record to the VPS IP.

---

## Health Check URLs

| Environment | URL |
|---|---|
| Local Docker | `http://localhost:3000/health` |
| Render | `https://aiox-legal-api.onrender.com/health` |
| VPS | `https://aiox.yourdomain.com/health` |

The `/health` endpoint returns:
```json
{ "ok": true, "squads": 1, "agents": 3 }
```
