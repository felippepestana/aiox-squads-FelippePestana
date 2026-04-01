import "./instrument.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import * as Sentry from "@sentry/node";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";

import { portalAuthMiddleware, portalAuthEnabled } from "./authPortal.js";
import { loadAllSquads, findAgent, type Agent, type Squad } from "./agents.js";
import { ChatSession } from "./chatSession.js";
import {
  uploadFileFromBuffer,
  supportedExtensions,
  mimeForExtension,
  type UploadedFile,
} from "./files.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT ?? "8787") || 8787;
const NODE_ENV = process.env.NODE_ENV ?? "development";

const rateLimitDisabled =
  process.env.RATE_LIMIT_ENABLED === "0" ||
  process.env.RATE_LIMIT_ENABLED === "false";

function corsOptions(): cors.CorsOptions {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) return {};
  const origin = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { origin: origin.length === 1 ? origin[0] : origin };
}

function trustProxyEnabled(): boolean {
  if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
    return true;
  }
  return NODE_ENV === "production";
}

let anthropicClient: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    const key = process.env.ANTHROPIC_API_KEY?.trim();
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY não definida");
    }
    anthropicClient = new Anthropic({ apiKey: key });
  }
  return anthropicClient;
}

interface SessionState {
  chat: ChatSession;
  filesById: Map<string, UploadedFile>;
}

const sessions = new Map<string, SessionState>();

function paramId(req: Request): string {
  const raw = req.params.id;
  return Array.isArray(raw) ? String(raw[0] ?? "") : String(raw ?? "");
}

function squadsSummary(squads: Squad[]) {
  return squads.map((s) => ({
    id: s.id,
    agents: s.agents.map((a) => ({
      id: a.id,
      name: a.name,
      squad: a.squad,
    })),
  }));
}

function newSession(agent: Agent): SessionState {
  return {
    chat: new ChatSession(getAnthropic(), agent),
    filesById: new Map(),
  };
}

const app = express();
if (trustProxyEnabled()) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(cors(corsOptions()));
app.use(express.json({ limit: "2mb" }));
app.use(portalAuthMiddleware);

if (!rateLimitDisabled) {
  app.use(
    "/api",
    rateLimit({
      windowMs: 60_000,
      max: Number(process.env.RATE_LIMIT_MAX ?? "200"),
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

const heavyLimiter = rateLimit({
  windowMs: 60_000,
  max: Number(process.env.RATE_LIMIT_HEAVY_MAX ?? "30"),
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 32 * 1024 * 1024 },
});

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res, next).catch(next);
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/status", (_req, res) => {
  res.json({ portalAuthRequired: portalAuthEnabled() });
});

app.get("/api/squads", (_req, res) => {
  const squads = loadAllSquads();
  res.json(squadsSummary(squads));
});

app.post(
  "/api/sessions",
  asyncHandler(async (req, res) => {
    const squadId = String(req.body?.squadId ?? "").trim();
    const agentId = String(req.body?.agentId ?? "").trim();
    if (!squadId || !agentId) {
      res.status(400).json({ error: "squadId e agentId são obrigatórios" });
      return;
    }
    const squads = loadAllSquads();
    const agent = findAgent(squads, squadId, agentId);
    if (!agent) {
      res.status(400).json({ error: "Squad ou agente inválido" });
      return;
    }
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, newSession(agent));
    res.json({
      sessionId,
      agent: { id: agent.id, name: agent.name, squad: agent.squad },
    });
  })
);

app.get("/api/sessions/:id", (req, res) => {
  const state = sessions.get(paramId(req));
  if (!state) {
    res.status(404).json({ error: "Sessão não encontrada" });
    return;
  }
  res.json({ ok: true });
});

app.post(
  "/api/sessions/:id/switch-agent",
  asyncHandler(async (req, res) => {
    const state = sessions.get(paramId(req));
    if (!state) {
      res.status(404).json({ error: "Sessão não encontrada" });
      return;
    }
    const squadId = String(req.body?.squadId ?? "").trim();
    const agentId = String(req.body?.agentId ?? "").trim();
    if (!squadId || !agentId) {
      res.status(400).json({ error: "squadId e agentId são obrigatórios" });
      return;
    }
    const squads = loadAllSquads();
    const agent = findAgent(squads, squadId, agentId);
    if (!agent) {
      res.status(400).json({ error: "Squad ou agente inválido" });
      return;
    }
    state.chat.switchAgent(agent);
    res.json({ agent: { id: agent.id, name: agent.name, squad: agent.squad } });
  })
);

app.post(
  "/api/sessions/:id/reset",
  asyncHandler(async (req, res) => {
    const state = sessions.get(paramId(req));
    if (!state) {
      res.status(404).json({ error: "Sessão não encontrada" });
      return;
    }
    state.chat.resetHistory();
    res.status(204).end();
  })
);

app.post(
  "/api/sessions/:id/upload",
  rateLimitDisabled ? ((_req, _res, next) => next()) : heavyLimiter,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const state = sessions.get(paramId(req));
    if (!state) {
      res.status(404).json({ error: "Sessão não encontrada" });
      return;
    }
    const file = req.file;
    if (!file?.buffer) {
      res.status(400).json({ error: "Campo multipart \"file\" é obrigatório" });
      return;
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = new Set(supportedExtensions());
    if (!allowed.has(ext)) {
      res.status(400).json({
        error: `Extensão não suportada. Use: ${[...allowed].sort().join(", ")}`,
      });
      return;
    }
    const mimeType = file.mimetype || mimeForExtension(ext);
    try {
      const uploaded = await uploadFileFromBuffer(
        getAnthropic(),
        file.buffer,
        file.originalname || "upload",
        mimeType
      );
      state.filesById.set(uploaded.fileId, uploaded);
      res.json({
        fileId: uploaded.fileId,
        filename: uploaded.filename,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
      });
    } catch (e) {
      Sentry.captureException(e);
      const message = e instanceof Error ? e.message : String(e);
      res.status(502).json({ error: message });
    }
  })
);

type StreamEvent =
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

app.post(
  "/api/sessions/:id/chat",
  rateLimitDisabled ? ((_req, _res, next) => next()) : heavyLimiter,
  asyncHandler(async (req, res) => {
    const state = sessions.get(paramId(req));
    if (!state) {
      res.status(404).json({ error: "Sessão não encontrada" });
      return;
    }
    const text = String(req.body?.text ?? "");
    const filesBody = req.body?.files;
    if (!Array.isArray(filesBody)) {
      res.status(400).json({ error: "files deve ser um array" });
      return;
    }

    const resolved: UploadedFile[] = [];
    for (const item of filesBody) {
      const fileId =
        item && typeof item === "object" && "fileId" in item
          ? String((item as { fileId: unknown }).fileId)
          : "";
      if (!fileId) {
        res.status(400).json({ error: "Cada arquivo precisa de fileId" });
        return;
      }
      const meta = state.filesById.get(fileId);
      if (!meta) {
        res.status(400).json({ error: `Arquivo desconhecido: ${fileId}` });
        return;
      }
      resolved.push(meta);
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    const send = (ev: StreamEvent) => {
      res.write(`data: ${JSON.stringify(ev)}\n\n`);
    };

    try {
      await state.chat.send(text, resolved, (chunk) => {
        send({ type: "chunk", text: chunk });
      });
      send({ type: "done" });
    } catch (e) {
      Sentry.captureException(e);
      const message = e instanceof Error ? e.message : String(e);
      send({ type: "error", message });
    }
    res.end();
  })
);

const clientDir = path.join(__dirname, "../client");
if (NODE_ENV === "production" && fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

Sentry.setupExpressErrorHandler(app);

app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    const status =
      err && typeof err === "object" && "status" in err
        ? Number((err as { status: unknown }).status) || 500
        : 500;
    if (status >= 500) {
      Sentry.captureException(err);
    }
    const message =
      err instanceof Error ? err.message : "Erro interno do servidor";
    if (!res.headersSent) {
      res.status(status).json({ error: message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`AIOX web API em http://127.0.0.1:${PORT} (${NODE_ENV})`);
});
