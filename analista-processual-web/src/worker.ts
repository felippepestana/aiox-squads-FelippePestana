/**
 * Standalone BullMQ worker that runs the multi-agent analysis pipeline out of
 * band from the web request. Start it with `npm run worker` (requires REDIS_URL).
 *
 * The worker shares the same `runAnalysisPipeline` used by the synchronous
 * fallback, so behavior is identical whether processing happens inline or here.
 */
// MUST be the first import: loads .env.local before any module that reads
// process.env at import time (e.g. the LLM gateway). ESM evaluates imported
// modules in order, so this runs before the imports below.
import "@/lib/load-env";

import { Worker, type Job } from "bullmq";
import {
  ANALYSIS_QUEUE_NAME,
  getRedisConnection,
  isQueueEnabled,
  type AnalysisJobData,
} from "@/lib/queue";
import { runAnalysisPipeline } from "@/lib/analysis-runner";

if (!isQueueEnabled()) {
  console.error(
    "[worker] REDIS_URL não definido. Defina REDIS_URL para rodar o worker " +
      "(ou rode sem worker — o processamento ocorre inline na rota /process)."
  );
  process.exit(1);
}

const concurrency = Number(process.env.WORKER_CONCURRENCY) || 2;

const worker = new Worker<AnalysisJobData>(
  ANALYSIS_QUEUE_NAME,
  async (job: Job<AnalysisJobData>) => {
    const { analysisId, processType, analysisGoal } = job.data;
    console.log(`[worker] processando análise ${analysisId} (job ${job.id})`);
    const outcome = await runAnalysisPipeline(analysisId, {
      processType,
      analysisGoal,
    });
    console.log(
      `[worker] análise ${analysisId} -> ${outcome.status}` +
        (outcome.message ? ` (${outcome.message})` : "")
    );
    return outcome;
  },
  {
    connection: getRedisConnection(),
    concurrency,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[worker] job ${job?.id} falhou:`, err?.message);
});

worker.on("ready", () => {
  console.log(
    `[worker] pronto — fila "${ANALYSIS_QUEUE_NAME}", concorrência ${concurrency}`
  );
});

async function shutdown() {
  console.log("[worker] encerrando...");
  await worker.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
