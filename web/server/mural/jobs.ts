import crypto from "crypto";
import type { MuralBrief, MuralGeneratedAsset, MuralJob, MuralJobStatus } from "./types.js";

const jobs = new Map<string, MuralJob>();

export function createJob(): MuralJob {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const job: MuralJob = {
    id,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    assets: [],
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): MuralJob | undefined {
  return jobs.get(id);
}

export function updateJob(
  id: string,
  patch: Partial<
    Pick<MuralJob, "status" | "error" | "brief" | "assets" | "manifestPath">
  >
): MuralJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  Object.assign(job, patch, { updatedAt: new Date().toISOString() });
  return job;
}

export function setJobStatus(id: string, status: MuralJobStatus): void {
  updateJob(id, { status });
}

export function appendAssets(
  id: string,
  assets: MuralGeneratedAsset[]
): void {
  const job = jobs.get(id);
  if (!job) return;
  job.assets.push(...assets);
  job.updatedAt = new Date().toISOString();
}

export function setBrief(id: string, brief: MuralBrief): void {
  updateJob(id, { brief });
}
