import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "node:crypto";
const serverDir = path.dirname(fileURLToPath(import.meta.url));
{
    let envPath = path.join(serverDir, "../.env");
    if (!fs.existsSync(envPath))
        envPath = path.join(serverDir, "../../.env");
    if (fs.existsSync(envPath))
        dotenv.config({ path: envPath });
    else
        dotenv.config();
}
import Anthropic from "@anthropic-ai/sdk";
import { findAgent, loadAllSquads } from "./agents.js";
import { portalAuthEnabled, portalAuthMiddleware } from "./authPortal.js";
import { ChatSession } from "./chatSession.js";
import { mimeForExtension, supportedExtensions, uploadFileFromBuffer, } from "./files.js";
const PORT = Number(process.env.PORT ?? 8787);
/** Vazio ou omisso = todas as interfaces (Docker/LAN). `127.0.0.1` = só máquina local. */
const HOST = process.env.HOST?.trim() || undefined;
const NODE_ENV = process.env.NODE_ENV ?? "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN?.trim();
const trustProxyRaw = process.env.TRUST_PROXY?.trim().toLowerCase();
const trustProxy = trustProxyRaw === "1" ||
    trustProxyRaw === "true" ||
    (NODE_ENV === "production" &&
        trustProxyRaw !== "0" &&
        trustProxyRaw !== "false");
function parseLimitEnv(name, def) {
    const v = process.env[name];
    if (v === undefined || v === "")
        return def;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : def;
}
const rateLimitOn = process.env.RATE_LIMIT_ENABLED !== "0" &&
    process.env.RATE_LIMIT_ENABLED !== "false";
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: parseLimitEnv("RATE_LIMIT_MAX", 200),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiados pedidos. Tente novamente dentro de instantes.",
    },
    skip: () => !rateLimitOn,
});
const heavyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: parseLimitEnv("RATE_LIMIT_HEAVY_MAX", 30),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Limite de mensagens ou uploads por minuto atingido. Aguarde um instante.",
    },
    skip: () => !rateLimitOn,
});
const sessions = new Map();
function stripAgent(agent) {
    return { id: agent.id, name: agent.name, squad: agent.squad };
}
function routeSessionId(req) {
    const v = req.params.id;
    if (Array.isArray(v))
        return v[0] ?? "";
    return typeof v === "string" ? v : "";
}
function sseSend(res, obj) {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
}
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 32 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (supportedExtensions().includes(ext)) {
            cb(null, true);
            return;
        }
        cb(new Error(`Extensão não suportada: ${ext}`));
    },
});
function requireApiKey(res) {
    const key = process.env.ANTHROPIC_API_KEY?.trim();
    if (!key) {
        res.status(503).json({
            error: "ANTHROPIC_API_KEY não configurada. Defina no ambiente ou em web/.env",
        });
        return null;
    }
    return key;
}
const app = express();
if (trustProxy) {
    app.set("trust proxy", 1);
}
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({
    origin: CORS_ORIGIN
        ? CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
        : true,
    credentials: false,
}));
app.use(express.json({ limit: "2mb" }));
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "aiox-squads-web" });
});
app.get("/api/auth/status", (_req, res) => {
    res.json({ portalAuthRequired: portalAuthEnabled() });
});
app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
        next();
        return;
    }
    apiLimiter(req, res, next);
});
app.use(portalAuthMiddleware);
app.get("/api/squads", (_req, res) => {
    const squads = loadAllSquads();
    res.json(squads.map((s) => ({
        id: s.id,
        agents: s.agents.map((a) => stripAgent(a)),
    })));
});
app.get("/api/sessions/:id", (req, res) => {
    const id = routeSessionId(req);
    if (!sessions.has(id)) {
        res.status(404).json({ error: "Sessão não encontrada" });
        return;
    }
    res.json({ ok: true });
});
app.post("/api/sessions", (req, res) => {
    const apiKey = requireApiKey(res);
    if (!apiKey)
        return;
    const squadId = String(req.body?.squadId ?? "");
    const agentId = String(req.body?.agentId ?? "");
    const squads = loadAllSquads();
    const agent = findAgent(squads, squadId, agentId);
    if (!agent) {
        res.status(404).json({ error: "Agente não encontrado" });
        return;
    }
    const client = new Anthropic({ apiKey });
    const sessionId = randomUUID();
    sessions.set(sessionId, { chat: new ChatSession(client, agent) });
    res.json({ sessionId, agent: stripAgent(agent) });
});
app.post("/api/sessions/:id/switch-agent", (req, res) => {
    const state = sessions.get(routeSessionId(req));
    if (!state) {
        res.status(404).json({ error: "Sessão não encontrada" });
        return;
    }
    const squadId = String(req.body?.squadId ?? "");
    const agentId = String(req.body?.agentId ?? "");
    const agent = findAgent(loadAllSquads(), squadId, agentId);
    if (!agent) {
        res.status(404).json({ error: "Agente não encontrado" });
        return;
    }
    state.chat.switchAgent(agent);
    res.json({ agent: stripAgent(agent) });
});
app.post("/api/sessions/:id/reset", (req, res) => {
    const state = sessions.get(routeSessionId(req));
    if (!state) {
        res.status(404).json({ error: "Sessão não encontrada" });
        return;
    }
    state.chat.resetHistory();
    res.json({ ok: true });
});
app.post("/api/sessions/:id/upload", heavyLimiter, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        next();
    });
}, async (req, res) => {
    const apiKey = requireApiKey(res);
    if (!apiKey)
        return;
    const state = sessions.get(routeSessionId(req));
    if (!state) {
        res.status(404).json({ error: "Sessão não encontrada" });
        return;
    }
    const file = req.file;
    if (!file?.buffer) {
        res.status(400).json({ error: "Envie um arquivo no campo file" });
        return;
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype && file.mimetype !== "application/octet-stream"
        ? file.mimetype
        : mimeForExtension(ext);
    try {
        const client = new Anthropic({ apiKey });
        const uploaded = await uploadFileFromBuffer(client, file.buffer, file.originalname, mimeType);
        res.json(uploaded);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
app.post("/api/sessions/:id/chat", heavyLimiter, async (req, res) => {
    const state = sessions.get(routeSessionId(req));
    if (!state) {
        res.status(404).json({ error: "Sessão não encontrada" });
        return;
    }
    const text = String(req.body?.text ?? "");
    const files = (req.body?.files ?? []);
    if (!Array.isArray(files)) {
        res.status(400).json({ error: "files deve ser um array" });
        return;
    }
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (typeof res.flushHeaders === "function") {
        res.flushHeaders();
    }
    try {
        await state.chat.send(text, files, (chunk) => {
            sseSend(res, { type: "chunk", text: chunk });
        });
        sseSend(res, { type: "done" });
    }
    catch (e) {
        sseSend(res, { type: "error", message: String(e) });
    }
    res.end();
});
const isCompiledBundle = /[/\\]dist[/\\]server$/i.test(serverDir);
const clientDist = isCompiledBundle
    ? path.resolve(serverDir, "../client")
    : path.resolve(serverDir, "../dist/client");
if (fs.existsSync(path.join(clientDist, "index.html"))) {
    app.use(express.static(clientDist));
    app.use((req, res, next) => {
        if (req.path.startsWith("/api")) {
            next();
            return;
        }
        if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
        }
        res.sendFile(path.join(clientDist, "index.html"));
    });
}
const listen = () => {
    const who = HOST ?? "0.0.0.0 (todas as interfaces)";
    console.log(`AIOX Squads web — http://127.0.0.1:${PORT}  (bind: ${who})`);
};
if (HOST) {
    app.listen(PORT, HOST, listen);
}
else {
    app.listen(PORT, listen);
}
