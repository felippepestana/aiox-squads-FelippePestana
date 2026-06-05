import type { Express, Request, Response, NextFunction } from "express";
import type Anthropic from "@anthropic-ai/sdk";
import type { RateLimitRequestHandler } from "express-rate-limit";
import { getJob } from "./jobs.js";
import { runAnalyzePipeline, runComposePipeline, runComposeAsync } from "./pipeline.js";
import { assetExists, readJobAsset } from "./storage.js";
import { isMuralDemoMode } from "./demo.js";
import type { MuralComposeRequest } from "./types.js";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res, next).catch(next);
  };
}

function parseComposeBody(body: unknown): MuralComposeRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Corpo JSON inválido");
  }
  const b = body as Record<string, unknown>;
  return {
    prompt: String(b.prompt ?? ""),
    references: Array.isArray(b.references)
      ? (b.references as MuralComposeRequest["references"])
      : [],
    options:
      b.options && typeof b.options === "object"
        ? (b.options as MuralComposeRequest["options"])
        : undefined,
  };
}

export function registerMuralRoutes(
  app: Express,
  deps: {
    getAnthropic: () => Anthropic;
    heavyLimiter: RateLimitRequestHandler | ((_req: Request, _res: Response, next: NextFunction) => void);
    rateLimitDisabled: boolean;
  }
): void {
  const limit = deps.rateLimitDisabled
    ? ((_req: Request, _res: Response, next: NextFunction) => next()) as RateLimitRequestHandler
    : deps.heavyLimiter;

  // In demo mode (no ANTHROPIC key) analysis is synthetic, so skip the client.
  const anthropicOrNull = (): Anthropic | null => {
    if (isMuralDemoMode() && !process.env.ANTHROPIC_API_KEY?.trim()) {
      return null;
    }
    try {
      return deps.getAnthropic();
    } catch {
      return null;
    }
  };

  app.post(
    "/api/mural/analyze",
    limit,
    asyncHandler(async (req, res) => {
      const request = parseComposeBody(req.body);
      const { brief, analyses } = await runAnalyzePipeline(
        anthropicOrNull(),
        request
      );
      res.json({ brief, analyses });
    })
  );

  app.post(
    "/api/mural/compose",
    limit,
    asyncHandler(async (req, res) => {
      const request = parseComposeBody(req.body);
      const asyncMode =
        req.query.async === "1" || req.query.async === "true";

      if (asyncMode) {
        const job = await runComposeAsync(anthropicOrNull(), request);
        res.status(202).json({ jobId: job.id, status: job.status });
        return;
      }

      const job = await runComposePipeline(anthropicOrNull(), request);
      res.json(job);
    })
  );

  app.get(
    "/api/mural/jobs/:id",
    asyncHandler(async (req, res) => {
      const id = String(req.params.id ?? "");
      const job = getJob(id);
      if (!job) {
        res.status(404).json({ error: "Job não encontrado" });
        return;
      }
      res.json(job);
    })
  );

  app.get(
    "/api/mural/jobs/:id/assets/:file",
    asyncHandler(async (req, res) => {
      const jobId = String(req.params.id ?? "");
      const file = String(req.params.file ?? "");
      if (!file || file.includes("..") || file.includes("/")) {
        res.status(400).json({ error: "Nome de arquivo inválido" });
        return;
      }
      if (!getJob(jobId)) {
        res.status(404).json({ error: "Job não encontrado" });
        return;
      }
      if (!assetExists(jobId, file)) {
        res.status(404).json({ error: "Arquivo não encontrado" });
        return;
      }
      const buf = readJobAsset(jobId, file);
      if (!buf) {
        res.status(404).json({ error: "Arquivo não encontrado" });
        return;
      }
      const ext = file.split(".").pop()?.toLowerCase();
      const mime =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "webp"
            ? "image/webp"
            : ext === "svg"
              ? "image/svg+xml"
              : "image/png";
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(buf);
    })
  );
}
