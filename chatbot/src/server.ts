/**
 * AIOX Squads — Web Server
 *
 * Servidor Express com:
 *  - SSE para streaming de respostas
 *  - Upload de arquivos via Multer → Files API
 *  - Frontend HTML embutido (chat UI responsivo)
 *  - API REST para listagem de agentes e sessões
 */

import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";
import Anthropic from "@anthropic-ai/sdk";

import { loadAllSquads, flatAgentList, loadSquadsMeta, Squad, Agent, SquadMeta } from "./agents";
import { uploadFile, deleteFile } from "./files";
import { ChatSession } from "./chat";

// ── Config ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

// ── State ──────────────────────────────────────────────────────────────────────
const client = new Anthropic({ apiKey: API_KEY });
const squads: Squad[] = loadAllSquads();
const agents: Agent[] = flatAgentList(squads);
const squadsMeta: SquadMeta[] = loadSquadsMeta(squads);

// sessionId → ChatSession + uploaded file IDs
const sessions = new Map<
  string,
  { session: ChatSession; fileIds: string[] }
>();

function getOrCreateSession(sessionId: string, agentId: string) {
  if (!sessions.has(sessionId)) {
    const agent =
      agents.find((a) => a.id === agentId) ?? agents[0];
    sessions.set(sessionId, {
      session: new ChatSession(client, agent),
      fileIds: [],
    });
  }
  return sessions.get(sessionId)!;
}

// ── Upload (tmp disk) ──────────────────────────────────────────────────────────
const upload = multer({ dest: os.tmpdir() });

// ── App ────────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// ── API: listar squads/agentes ─────────────────────────────────────────────────
app.get("/api/agents", (_req: Request, res: Response) => {
  const list = squads.map((s) => ({
    id: s.id,
    agents: s.agents.map((a) => ({ id: a.id, name: a.name, squad: a.squad })),
  }));
  res.json(list);
});

// ── API: metadados enriquecidos dos squads (dashboard UI) ─────────────────────
app.get("/api/squads/meta", (_req: Request, res: Response) => {
  const enriched = squadsMeta.map((meta) => {
    const squad = squads.find((s) => s.id === meta.id);
    return {
      ...meta,
      agentCount: squad?.agents.length ?? 0,
      agents: squad?.agents.map((a) => ({ id: a.id, name: a.name })) ?? [],
    };
  });
  res.json(enriched);
});

// ── API: trocar agente ────────────────────────────────────────────────────────
app.post("/api/session/agent", (req: Request, res: Response) => {
  const { sessionId, agentId } = req.body as {
    sessionId: string;
    agentId: string;
  };
  const newAgent = agents.find((a) => a.id === agentId);
  if (!newAgent) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }
  const entry = sessions.get(sessionId);
  if (entry) {
    entry.session.switchAgent(newAgent);
  }
  res.json({ ok: true, agent: { id: newAgent.id, name: newAgent.name } });
});

// ── API: resetar histórico ────────────────────────────────────────────────────
app.post("/api/session/reset", (req: Request, res: Response) => {
  const { sessionId } = req.body as { sessionId: string };
  const entry = sessions.get(sessionId);
  if (entry) entry.session.resetHistory();
  res.json({ ok: true });
});

// ── API: upload de arquivo → Files API ────────────────────────────────────────
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const sessionId = req.body.sessionId as string;
    const agentId = (req.body.agentId as string) ?? agents[0].id;

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // Renomeia o arquivo temporário para preservar a extensão
    const ext = path.extname(req.file.originalname);
    const tmpWithExt = req.file.path + ext;
    fs.renameSync(req.file.path, tmpWithExt);

    try {
      const uploaded = await uploadFile(client, tmpWithExt);
      const entry = getOrCreateSession(sessionId, agentId);
      entry.fileIds.push(uploaded.fileId);
      fs.unlinkSync(tmpWithExt);
      res.json({
        ok: true,
        fileId: uploaded.fileId,
        filename: uploaded.filename,
        sizeKb: (uploaded.sizeBytes / 1024).toFixed(1),
      });
    } catch (err: any) {
      fs.unlinkSync(tmpWithExt);
      res.status(500).json({ error: err.message });
    }
  }
);

// ── API: chat com SSE streaming ───────────────────────────────────────────────
app.get("/api/chat", async (req: Request, res: Response) => {
  const q = req.query;
  const sessionId = String(q.sessionId ?? "");
  const agentId = String(q.agentId ?? "");
  const message = String(q.message ?? "");
  const rawFileIds = q.fileIds ? String(q.fileIds) : undefined;

  if (!sessionId || !message) {
    res.status(400).json({ error: "sessionId and message required" });
    return;
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const entry = getOrCreateSession(sessionId, agentId ?? agents[0].id);
  const { session } = entry;

  // Constrói lista de UploadedFile a partir dos fileIds enviados
  const pendingFileIds: string[] = rawFileIds
    ? rawFileIds.split(",").filter(Boolean)
    : [];

  const pendingFiles = pendingFileIds.map((id) => ({
    fileId: id,
    filename: id,
    mimeType: "application/octet-stream",
    sizeBytes: 0,
  }));

  try {
    send("start", { agent: session.getAgent().name });

    await session.send(message, pendingFiles, (chunk) => {
      send("chunk", { text: chunk });
    });

    send("done", { ok: true });
  } catch (err: any) {
    send("error", { message: err.message });
  } finally {
    res.end();
  }
});

// ── API: limpar sessão e arquivos ─────────────────────────────────────────────
app.delete("/api/session/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const entry = sessions.get(id);
  if (entry) {
    for (const fid of entry.fileIds) {
      await deleteFile(client, fid).catch(() => {});
    }
    sessions.delete(id);
  }
  res.json({ ok: true });
});

// ── Frontend HTML ──────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(HTML_UI);
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  const ip = Object.values(os.networkInterfaces())
    .flat()
    .find((i) => i?.family === "IPv4" && !i.internal)?.address;

  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║   AIOX Squads — Web Chatbot              ║`);
  console.log(`  ╠══════════════════════════════════════════╣`);
  console.log(`  ║  Local:   http://localhost:${PORT}          ║`);
  if (ip) {
    console.log(`  ║  Rede:    http://${ip}:${PORT}       ║`);
  }
  console.log(`  ╠══════════════════════════════════════════╣`);
  console.log(`  ║  Squads:  ${squads.length}                               ║`);
  console.log(`  ║  Agentes: ${agents.length}                              ║`);
  console.log(`  ╚══════════════════════════════════════════╝\n`);
});

// ── HTML UI (embutido) ─────────────────────────────────────────────────────────
// ── HTML UI — Squad Dashboard + Workspace (SPA) ────────────────────────────────
const HTML_UI = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="theme-color" content="#161b22"/>
<title>AIOX Squads</title>
<style>
:root{
  --bg:#0d1117;--bg2:#161b22;--bg3:#21262d;--border:#30363d;
  --text:#e6edf3;--dim:#8b949e;--accent:#58a6ff;--green:#3fb950;
  --yellow:#d29922;--red:#f85149;--user-bg:#1f3a5f;--agent-bg:#1a2433;
  --r:12px;--font:'Segoe UI',system-ui,sans-serif;
  --safe-bottom:env(safe-area-inset-bottom,0px);
  --safe-top:env(safe-area-inset-top,0px);
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;overflow:hidden;}
body{background:var(--bg);color:var(--text);font-family:var(--font);
  display:flex;flex-direction:column;overscroll-behavior:none;}

/* ══════════════════════════════════
   GLOBAL HEADER
══════════════════════════════════ */
header{background:var(--bg2);border-bottom:1px solid var(--border);
  padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;
  padding-top:calc(10px + var(--safe-top));z-index:10;}
#back-btn{background:none;border:none;color:var(--dim);font-size:18px;
  cursor:pointer;padding:4px 8px;border-radius:8px;display:none;flex-shrink:0;}
#back-btn.show{display:flex;}
#back-btn:hover{background:var(--bg3);color:var(--text);}
#menu-btn{background:none;border:none;color:var(--dim);font-size:22px;
  cursor:pointer;padding:4px 6px;border-radius:8px;line-height:1;flex-shrink:0;display:none;}
#menu-btn.show{display:flex;}
#menu-btn:hover{background:var(--bg3);color:var(--text);}
header h1{font-size:15px;font-weight:700;color:var(--accent);letter-spacing:-.3px;cursor:pointer;}
#header-subtitle{font-size:12px;color:var(--dim);}
#agent-pill{font-size:12px;font-weight:600;background:rgba(88,166,255,.15);
  color:var(--accent);padding:3px 10px;border-radius:20px;
  border:1px solid rgba(88,166,255,.3);white-space:nowrap;overflow:hidden;
  text-overflow:ellipsis;max-width:160px;display:none;}
#agent-pill.show{display:block;}
.hdr-spacer{flex:1;}
#hdr-badge{font-size:11px;color:var(--dim);white-space:nowrap;}

/* ══════════════════════════════════
   VIEWS (SPA router)
══════════════════════════════════ */
.view{flex:1;display:none;flex-direction:column;overflow:hidden;min-height:0;}
.view.active{display:flex;}

/* ══════════════════════════════════
   DASHBOARD VIEW
══════════════════════════════════ */
#view-dashboard{overflow-y:auto;padding:24px 16px;gap:0;}
.dash-hero{text-align:center;padding:24px 16px 32px;flex-shrink:0;}
.dash-hero h2{font-size:26px;font-weight:800;color:var(--text);margin-bottom:8px;}
.dash-hero p{font-size:14px;color:var(--dim);max-width:420px;margin:0 auto;line-height:1.6;}
.squad-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:14px;max-width:1100px;margin:0 auto;width:100%;padding-bottom:24px;}
.squad-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;
  padding:20px;cursor:pointer;transition:transform .15s,border-color .15s,box-shadow .15s;
  display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden;}
.squad-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--squad-color,var(--accent));border-radius:16px 16px 0 0;}
.squad-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4);
  border-color:var(--squad-color,var(--border));}
.squad-card:active{transform:translateY(0);}
.card-top{display:flex;align-items:flex-start;gap:12px;}
.card-icon{font-size:28px;line-height:1;flex-shrink:0;}
.card-info{flex:1;min-width:0;}
.card-title{font-size:14px;font-weight:700;color:var(--text);line-height:1.3;
  margin-bottom:4px;}
.card-ver{font-size:10px;color:var(--dim);font-weight:600;
  background:var(--bg3);padding:1px 6px;border-radius:4px;
  border:1px solid var(--border);display:inline-block;}
.card-desc{font-size:12px;color:var(--dim);line-height:1.5;flex:1;}
.card-footer{display:flex;align-items:center;justify-content:space-between;
  padding-top:8px;border-top:1px solid var(--border);}
.card-agents{font-size:11px;color:var(--dim);}
.card-cta{font-size:12px;font-weight:600;color:var(--squad-color,var(--accent));
  background:none;border:none;cursor:pointer;padding:4px 0;}

/* ══════════════════════════════════
   WORKSPACE VIEW
══════════════════════════════════ */
#view-workspace{flex-direction:row;}

/* Left info panel */
#squad-panel{width:280px;background:var(--bg2);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden;flex-shrink:0;}
.panel-hero{padding:16px;border-bottom:1px solid var(--border);flex-shrink:0;}
.panel-squad-icon{font-size:32px;margin-bottom:8px;display:block;}
.panel-squad-title{font-size:14px;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:6px;}
.panel-squad-desc{font-size:12px;color:var(--dim);line-height:1.55;}
.panel-section{padding:12px 14px;border-bottom:1px solid var(--border);flex-shrink:0;}
.panel-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;
  color:var(--dim);margin-bottom:8px;}
.quick-prompt-btn{display:block;width:100%;text-align:left;background:var(--bg3);
  border:1px solid var(--border);color:var(--dim);font:12px var(--font);
  padding:8px 10px;border-radius:8px;cursor:pointer;line-height:1.4;
  transition:background .12s,border-color .12s,color .12s;margin-bottom:6px;}
.quick-prompt-btn:last-child{margin-bottom:0;}
.quick-prompt-btn:hover{background:var(--bg);border-color:var(--squad-color,var(--accent));
  color:var(--text);}
#agent-list-panel{flex:1;overflow-y:auto;padding:6px 0;}
.panel-agent-btn{display:flex;align-items:center;gap:8px;width:100%;text-align:left;
  background:none;border:none;color:var(--text);font:13px var(--font);
  padding:9px 14px;cursor:pointer;transition:background .12s;}
.panel-agent-btn:hover{background:var(--bg3);}
.panel-agent-btn.active{background:rgba(88,166,255,.12);color:var(--accent);
  border-left:3px solid var(--squad-color,var(--accent));padding-left:11px;}
.agent-dot{width:7px;height:7px;border-radius:50%;background:var(--dim);flex-shrink:0;}
.panel-agent-btn.active .agent-dot{background:var(--squad-color,var(--accent));}
.panel-footer{padding:12px 14px;border-top:1px solid var(--border);flex-shrink:0;
  padding-bottom:calc(12px + var(--safe-bottom));}
.btn-outline{background:var(--bg3);border:1px solid var(--border);color:var(--dim);
  font:12px var(--font);padding:8px 12px;border-radius:8px;cursor:pointer;
  width:100%;transition:background .12s;}
.btn-outline:hover{background:#2d333b;color:var(--text);}

/* Mobile drawer overlay for panel */
#overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:40;display:none;}
#overlay.show{display:block;}

/* ── Chat area ── */
.chat-area{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;}

/* ── Messages ── */
#messages{flex:1;overflow-y:auto;padding:16px;display:flex;
  flex-direction:column;gap:14px;scroll-behavior:smooth;
  overscroll-behavior:contain;}
.msg{max-width:82%;display:flex;flex-direction:column;gap:3px;}
.msg.user{align-self:flex-end;}
.msg.agent{align-self:flex-start;}
.msg-lbl{font-size:11px;color:var(--dim);padding:0 4px;}
.msg.user .msg-lbl{text-align:right;}
.msg-bbl{padding:10px 14px;border-radius:var(--r);line-height:1.65;
  font-size:14px;white-space:pre-wrap;word-break:break-word;}
.msg.user .msg-bbl{background:var(--user-bg);border-bottom-right-radius:3px;}
.msg.agent .msg-bbl{background:var(--agent-bg);border:1px solid var(--border);
  border-bottom-left-radius:3px;}
.msg-bbl.typing::after{content:'▋';animation:blink .7s infinite;color:var(--accent);}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── System msg ── */
.sys-msg{text-align:center;font-size:12px;color:var(--dim);padding:2px 0;}

/* ── Welcome ── */
.welcome{flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;padding:32px 20px;gap:10px;color:var(--dim);}
.welcome-icon{font-size:48px;margin-bottom:8px;}
.welcome h2{font-size:20px;font-weight:700;color:var(--text);}
.welcome p{font-size:14px;max-width:320px;line-height:1.5;}
.welcome .hint{font-size:12px;margin-top:4px;}

/* ── File chips ── */
#file-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 6px;min-height:0;}
.chip{background:rgba(88,166,255,.1);border:1px solid rgba(88,166,255,.25);
  border-radius:20px;padding:4px 10px 4px 8px;font-size:12px;color:var(--accent);
  display:flex;align-items:center;gap:5px;}
.chip button{background:none;border:none;color:var(--dim);cursor:pointer;
  font-size:15px;line-height:1;padding:0;}
.chip button:hover{color:var(--red);}

/* ── Input area ── */
.input-wrap{padding:8px 10px;border-top:1px solid var(--border);background:var(--bg2);
  flex-shrink:0;padding-bottom:calc(8px + var(--safe-bottom));}
.input-row{display:flex;gap:6px;align-items:flex-end;}
#msg-input{flex:1;background:var(--bg3);border:1px solid var(--border);
  border-radius:10px;color:var(--text);font:15px var(--font);padding:11px 13px;
  resize:none;min-height:46px;max-height:140px;outline:none;
  transition:border-color .15s;-webkit-appearance:none;}
#msg-input:focus{border-color:var(--accent);}
#msg-input::placeholder{color:var(--dim);}
.icon-btn{background:none;border:none;cursor:pointer;color:var(--dim);
  font-size:22px;padding:6px;border-radius:8px;height:46px;width:46px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  transition:color .15s,background .15s;}
.icon-btn:hover,.icon-btn:active{color:var(--accent);background:var(--bg3);}
#send-btn{background:var(--accent);color:#0d1117;border:none;border-radius:10px;
  padding:0 16px;height:46px;font:600 15px var(--font);cursor:pointer;
  flex-shrink:0;transition:opacity .15s;white-space:nowrap;}
#send-btn:disabled{opacity:.38;cursor:default;}
#send-btn:not(:disabled):hover{opacity:.85;}
#file-input{display:none;}

/* ── Toast ── */
#toast{position:fixed;bottom:calc(80px + var(--safe-bottom));left:50%;
  transform:translateX(-50%);background:var(--bg3);border:1px solid var(--border);
  border-radius:10px;padding:9px 18px;font-size:13px;display:none;z-index:99;
  white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.5);}
#toast.err{border-color:var(--red);color:var(--red);}
#toast.ok{border-color:var(--green);color:var(--green);}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}

/* ══════════════════════════════════
   RESPONSIVE
══════════════════════════════════ */
@media(max-width:767px){
  #menu-btn.show{display:flex;}
  #squad-panel{position:fixed;top:0;left:0;bottom:0;z-index:50;
    transform:translateX(-100%);transition:transform .25s ease;
    padding-top:var(--safe-top);}
  #squad-panel.open{transform:translateX(0);}
  .msg{max-width:90%;}
}
@media(min-width:768px){
  #menu-btn{display:none!important;}
  #agent-pill.show{max-width:200px;}
}
</style>
</head>
<body>

<!-- ── Global Header ────────────────────────────────────────────────── -->
<header>
  <button id="back-btn" onclick="showDashboard()" title="Voltar ao início">← Squads</button>
  <button id="menu-btn" onclick="togglePanel()" aria-label="Menu">☰</button>
  <h1 onclick="showDashboard()">⬡ AIOX</h1>
  <span id="header-subtitle">Squads Platform</span>
  <span id="agent-pill"></span>
  <span class="hdr-spacer"></span>
  <span id="hdr-badge"></span>
</header>

<!-- ── Dashboard View ──────────────────────────────────────────────── -->
<div id="view-dashboard" class="view active">
  <div class="dash-hero">
    <h2>⬡ AIOX Squads Platform</h2>
    <p>Escolha um squad especializado para começar. Cada squad possui agentes com expertise específica, pipelines otimizados e interfaces adaptadas ao seu caso de uso.</p>
  </div>
  <div class="squad-grid" id="squad-grid">
    <!-- Cards injected by JS -->
  </div>
</div>

<!-- ── Workspace View ───────────────────────────────────────────────── -->
<div id="view-workspace" class="view">
  <!-- Overlay (mobile) -->
  <div id="overlay" onclick="togglePanel()"></div>

  <!-- Squad Info Panel -->
  <nav id="squad-panel">
    <div class="panel-hero" id="panel-hero">
      <span class="panel-squad-icon" id="panel-icon">🤖</span>
      <div class="panel-squad-title" id="panel-title">Squad</div>
      <div class="panel-squad-desc" id="panel-desc"></div>
    </div>
    <div class="panel-section" id="quick-prompts-section">
      <div class="panel-label">Prompts rápidos</div>
      <div id="quick-prompts-list"></div>
    </div>
    <div class="panel-section" style="flex-shrink:0;">
      <div class="panel-label">Agentes</div>
    </div>
    <div id="agent-list-panel"></div>
    <div class="panel-footer">
      <button class="btn-outline" onclick="resetHistory()">🗑 Limpar histórico</button>
    </div>
  </nav>

  <!-- Chat -->
  <div class="chat-area">
    <div id="messages">
      <div class="welcome" id="welcome">
        <div class="welcome-icon" id="welcome-icon">🤖</div>
        <h2 id="welcome-title">Pronto para começar</h2>
        <p id="welcome-desc">Use os prompts rápidos ou escreva sua mensagem.</p>
        <p class="hint">📎 Suporta PDF, imagens, CSV e JSON.</p>
      </div>
    </div>
    <div id="file-chips"></div>
    <div class="input-wrap">
      <div class="input-row">
        <label for="file-input" class="icon-btn" title="Anexar arquivo">📎</label>
        <input type="file" id="file-input"
          accept=".pdf,.txt,.md,.json,.csv,.png,.jpg,.jpeg,.webp,.gif" multiple/>
        <textarea id="msg-input" placeholder="Mensagem…" rows="1"
          autocomplete="off" autocorrect="on" autocapitalize="sentences"
          spellcheck="true"></textarea>
        <button id="send-btn" onclick="sendMessage()">↑</button>
      </div>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
// ── State ─────────────────────────────────────────────────────────────────────
const SESSION_ID='sess-'+Math.random().toString(36).slice(2,10);
let activeAgent=null,activeSquadMeta=null,pendingFiles=[],msgCount=0,streaming=false;
let allSquadsMeta=[];

// ── Router ────────────────────────────────────────────────────────────────────
function showDashboard(){
  document.getElementById('view-dashboard').classList.add('active');
  document.getElementById('view-workspace').classList.remove('active');
  document.getElementById('back-btn').classList.remove('show');
  document.getElementById('menu-btn').classList.remove('show');
  document.getElementById('agent-pill').classList.remove('show');
  document.getElementById('header-subtitle').textContent='Squads Platform';
  document.getElementById('hdr-badge').textContent='';
  activeSquadMeta=null;
  activeAgent=null;
}

function showWorkspace(squadMeta){
  document.getElementById('view-dashboard').classList.remove('active');
  document.getElementById('view-workspace').classList.add('active');
  document.getElementById('back-btn').classList.add('show');
  document.getElementById('menu-btn').classList.add('show');
  document.getElementById('agent-pill').classList.add('show');
  document.getElementById('header-subtitle').textContent=\`\${squadMeta.icon} \${squadMeta.id}\`;
  badge();
}

// ── Panel toggle (mobile) ─────────────────────────────────────────────────────
function togglePanel(){
  const p=document.getElementById('squad-panel');
  const o=document.getElementById('overlay');
  const open=p.classList.toggle('open');
  o.classList.toggle('show',open);
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init(){
  const res=await fetch('/api/squads/meta');
  allSquadsMeta=await res.json();
  renderDashboard();
}

function renderDashboard(){
  const grid=document.getElementById('squad-grid');
  grid.innerHTML='';
  allSquadsMeta.forEach(meta=>{
    const card=document.createElement('div');
    card.className='squad-card';
    card.style.setProperty('--squad-color',meta.color);
    card.innerHTML=\`
      <div class="card-top">
        <div class="card-icon">\${meta.icon}</div>
        <div class="card-info">
          <div class="card-title">\${meta.title}</div>
          <span class="card-ver">\${meta.agentCount} agentes</span>
        </div>
      </div>
      <div class="card-desc">\${meta.description}</div>
      <div class="card-footer">
        <span class="card-agents">\${meta.id}</span>
        <button class="card-cta" style="color:\${meta.color}">Entrar →</button>
      </div>\`;
    card.onclick=()=>enterSquad(meta);
    grid.appendChild(card);
  });
}

// ── Enter squad ───────────────────────────────────────────────────────────────
async function enterSquad(meta){
  activeSquadMeta=meta;
  showWorkspace(meta);

  // Set CSS color variable for squad panel
  document.getElementById('squad-panel').style.setProperty('--squad-color',meta.color);

  // Update panel hero
  document.getElementById('panel-icon').textContent=meta.icon;
  document.getElementById('panel-title').textContent=meta.title;
  document.getElementById('panel-desc').textContent=meta.description;

  // Quick prompts
  const qpList=document.getElementById('quick-prompts-list');
  qpList.innerHTML='';
  (meta.quickPrompts||[]).forEach(prompt=>{
    const btn=document.createElement('button');
    btn.className='quick-prompt-btn';
    btn.textContent=prompt;
    btn.onclick=()=>useQuickPrompt(prompt);
    qpList.appendChild(btn);
  });

  // Agents list
  const agentList=document.getElementById('agent-list-panel');
  agentList.innerHTML='';
  (meta.agents||[]).forEach(a=>{
    const btn=document.createElement('button');
    btn.className='panel-agent-btn';
    btn.dataset.id=a.id;
    btn.innerHTML=\`<span class="agent-dot"></span>\${a.name}\`;
    btn.onclick=()=>selectAgent(a.id,a.name,meta.id,btn);
    agentList.appendChild(btn);
  });

  // Update welcome screen
  document.getElementById('welcome-icon').textContent=meta.icon;
  document.getElementById('welcome-title').textContent=meta.title;
  document.getElementById('welcome-desc').textContent=\`Use os prompts rápidos ou escreva sua mensagem. \${meta.agentCount} agentes disponíveis.\`;

  // Auto-select chief agent
  const chiefBtn=agentList.querySelector(\`[data-id="\${meta.chiefAgent}"]\`);
  if(chiefBtn){
    chiefBtn.click();
  } else if(agentList.firstChild){
    agentList.firstChild.click();
  }
}

// ── Select agent ──────────────────────────────────────────────────────────────
async function selectAgent(id,name,squad,btn){
  if(streaming)return;
  document.querySelectorAll('.panel-agent-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('agent-pill').textContent=name;
  document.getElementById('welcome')?.remove();
  activeAgent={id,name};

  await fetch('/api/session/agent',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({sessionId:SESSION_ID,agentId:id})
  });
  appendSys(\`\${name} [\${squad}] ativado\`);

  // Fecha panel no mobile
  if(window.innerWidth<768){
    const p=document.getElementById('squad-panel');
    if(p.classList.contains('open'))togglePanel();
  }
}

// ── Quick prompt ──────────────────────────────────────────────────────────────
function useQuickPrompt(prompt){
  const inp=document.getElementById('msg-input');
  inp.value=prompt;
  resize(inp);
  inp.focus();
  if(window.innerWidth<768){
    const p=document.getElementById('squad-panel');
    if(p.classList.contains('open'))togglePanel();
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────
async function resetHistory(){
  if(!activeAgent)return;
  await fetch('/api/session/reset',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({sessionId:SESSION_ID})
  });
  msgCount=0;badge();
  appendSys('Histórico limpo.');
  if(window.innerWidth<768){
    const p=document.getElementById('squad-panel');
    if(p.classList.contains('open'))togglePanel();
  }
}

// ── Upload ────────────────────────────────────────────────────────────────────
document.getElementById('file-input').addEventListener('change',async e=>{
  for(const f of Array.from(e.target.files))await uploadFile(f);
  e.target.value='';
});

async function uploadFile(file){
  toast('Enviando '+file.name+'…');
  const fd=new FormData();
  fd.append('file',file);
  fd.append('sessionId',SESSION_ID);
  if(activeAgent)fd.append('agentId',activeAgent.id);
  try{
    const r=await fetch('/api/upload',{method:'POST',body:fd});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error);
    pendingFiles.push({fileId:d.fileId,filename:d.filename});
    renderChips();
    toast(d.filename+' ('+d.sizeKb+' KB)','ok');
  }catch(e){toast('Erro: '+e.message,'err');}
}

function renderChips(){
  const c=document.getElementById('file-chips');
  c.innerHTML='';
  pendingFiles.forEach((f,i)=>{
    const d=document.createElement('div');
    d.className='chip';
    d.innerHTML=\`📄 \${f.filename} <button onclick="removeFile(\${i})">×</button>\`;
    c.appendChild(d);
  });
}

function removeFile(i){pendingFiles.splice(i,1);renderChips();}

// ── Enviar ────────────────────────────────────────────────────────────────────
async function sendMessage(){
  if(streaming)return;
  if(!activeAgent){toast('Selecione um agente.','err');return;}
  const inp=document.getElementById('msg-input');
  const text=inp.value.trim();
  if(!text)return;
  inp.value='';resize(inp);

  appendMsg('user','Você',text);
  const fids=pendingFiles.map(f=>f.fileId).join(',');
  pendingFiles=[];renderChips();

  const bubble=appendMsg('agent',activeAgent.name,'',true);
  streaming=true;
  document.getElementById('send-btn').disabled=true;

  const url='/api/chat?'+new URLSearchParams({
    sessionId:SESSION_ID,agentId:activeAgent.id,message:text,fileIds:fids
  });
  const es=new EventSource(url);
  let full='';

  es.addEventListener('chunk',e=>{
    full+=JSON.parse(e.data).text;
    bubble.textContent=full;
    scrollBot();
  });
  es.addEventListener('done',()=>{
    es.close();finish(bubble);
    msgCount+=2;badge();
  });
  es.addEventListener('error',e=>{
    es.close();
    if(e.data){bubble.textContent='⚠ '+JSON.parse(e.data).message;bubble.style.color='var(--red)';}
    finish(bubble);
  });
  es.onerror=()=>{if(es.readyState===EventSource.CLOSED)return;es.close();finish(bubble);};
}

function finish(b){
  b.classList.remove('typing');
  streaming=false;
  document.getElementById('send-btn').disabled=false;
  scrollBot();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function appendMsg(role,label,text,typing=false){
  const m=document.getElementById('messages');
  const d=document.createElement('div');
  d.className='msg '+role;
  const l=document.createElement('div');l.className='msg-lbl';l.textContent=label;
  const b=document.createElement('div');
  b.className='msg-bbl'+(typing?' typing':'');
  b.textContent=text;
  d.appendChild(l);d.appendChild(b);m.appendChild(d);
  scrollBot();return b;
}
function appendSys(t){
  const m=document.getElementById('messages');
  const d=document.createElement('div');d.className='sys-msg';d.textContent='— '+t+' —';
  m.appendChild(d);scrollBot();
}
function scrollBot(){
  const m=document.getElementById('messages');
  m.scrollTo({top:m.scrollHeight,behavior:'smooth'});
}
function badge(){
  document.getElementById('hdr-badge').textContent=msgCount>0?msgCount+' msgs':'';
}
function toast(msg,type=''){
  const el=document.getElementById('toast');
  el.textContent=msg;el.className=type;el.style.display='block';
  clearTimeout(el._t);el._t=setTimeout(()=>{el.style.display='none';},2800);
}

// ── Textarea auto-resize ──────────────────────────────────────────────────────
const ta=document.getElementById('msg-input');
function resize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,140)+'px';}
ta.addEventListener('input',()=>resize(ta));
ta.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey&&window.innerWidth>=768){
    e.preventDefault();sendMessage();
  }
});

// ── Swipe-to-close panel (mobile) ────────────────────────────────────────────
let tx0=null;
document.getElementById('squad-panel').addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;},{passive:true});
document.getElementById('squad-panel').addEventListener('touchend',e=>{
  if(tx0===null)return;
  const dx=e.changedTouches[0].clientX-tx0;
  if(dx<-50)togglePanel();
  tx0=null;
},{passive:true});

// ── Cleanup ───────────────────────────────────────────────────────────────────
window.addEventListener('beforeunload',()=>{
  navigator.sendBeacon('/api/session/'+SESSION_ID);
});

init();
</script>
</body>
</html>`;

