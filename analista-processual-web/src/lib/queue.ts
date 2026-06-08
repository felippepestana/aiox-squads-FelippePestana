import { Queue, type ConnectionOptions } from "bullmq";

/**
 * Optional async processing via BullMQ + Redis. When REDIS_URL is not set, the
 * queue is disabled and the app falls back to running the analysis pipeline
 * synchronously inside the request (graceful degradation, same pattern as the
 * Supabase/LLM gates). This keeps local dev and the smoke test working without
 * Redis.
 */

export const ANALYSIS_QUEUE_NAME = "analysis";

export interface AnalysisJobData {
  analysisId: string;
  processType?: string;
  analysisGoal?: string;
}

export function isQueueEnabled(): boolean {
  return Boolean(process.env.REDIS_URL);
}

/**
 * Shared connection options for Queue and Worker. `maxRetriesPerRequest: null`
 * is required by BullMQ for blocking commands.
 */
export function getRedisConnection(): ConnectionOptions {
  return {
    url: process.env.REDIS_URL as string,
    maxRetriesPerRequest: null,
  } as ConnectionOptions;
}

let queue: Queue<AnalysisJobData> | null = null;

/** Returns the singleton analysis queue, or null when Redis is not configured. */
export function getAnalysisQueue(): Queue<AnalysisJobData> | null {
  if (!isQueueEnabled()) return null;
  if (!queue) {
    queue = new Queue<AnalysisJobData>(ANALYSIS_QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 200 },
      },
    });
  }
  return queue;
}

/**
 * Enqueues an analysis job. Returns true when the job was queued, false when the
 * queue is disabled (caller should then process synchronously).
 */
export async function enqueueAnalysis(data: AnalysisJobData): Promise<boolean> {
  const q = getAnalysisQueue();
  if (!q) return false;
  await q.add("process-analysis", data, { jobId: data.analysisId });
  return true;
}
