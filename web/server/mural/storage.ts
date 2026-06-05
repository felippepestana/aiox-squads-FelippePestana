import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function muralOutputRoot(): string {
  const fromEnv = process.env.MURAL_OUTPUT_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.join(__dirname, "../../data/mural-output");
}

export function jobDir(jobId: string): string {
  return path.join(muralOutputRoot(), jobId);
}

export function ensureJobDir(jobId: string): string {
  const dir = jobDir(jobId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeJobAsset(
  jobId: string,
  filename: string,
  buffer: Buffer
): string {
  const dir = ensureJobDir(jobId);
  const full = path.join(dir, filename);
  fs.writeFileSync(full, buffer);
  return full;
}

export function writeJobManifest(jobId: string, data: unknown): string {
  const dir = ensureJobDir(jobId);
  const full = path.join(dir, "manifest.json");
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
  return full;
}

export function readJobAsset(jobId: string, filename: string): Buffer | null {
  const full = path.join(jobDir(jobId), filename);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full);
}

export function assetExists(jobId: string, filename: string): boolean {
  const full = path.join(jobDir(jobId), filename);
  return fs.existsSync(full);
}
