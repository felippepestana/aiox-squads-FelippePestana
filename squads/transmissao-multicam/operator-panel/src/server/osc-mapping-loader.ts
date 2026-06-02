import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

import type { OscMapping } from "@/lib/osc-types";

// Candidate paths probed in order when OSC_MAPPING_PATH is not set.
// Covers `next dev` from operator-panel/ (process.cwd() = operator-panel),
// `next start` from the same directory, and bundled production builds
// where __dirname lives under .next/server/. Falls through to a Vercel-
// style /app root layout as a last resort.
function defaultMappingPath(): string {
  const candidates: string[] = [];

  if (process.env.OSC_MAPPING_PATH) {
    candidates.push(process.env.OSC_MAPPING_PATH);
  }

  // Standard layout: started from operator-panel/
  candidates.push(resolve(process.cwd(), "..", "data", "osc-mapping.yaml"));
  // Started from repo root
  candidates.push(
    resolve(
      process.cwd(),
      "squads",
      "transmissao-multicam",
      "data",
      "osc-mapping.yaml",
    ),
  );
  // Module-relative (works in `next dev`; usually NOT in production builds
  // because __dirname relocates under .next/server, but harmless to try).
  if (typeof __dirname !== "undefined") {
    candidates.push(resolve(__dirname, "..", "..", "..", "data", "osc-mapping.yaml"));
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  // Nothing matched — return the first candidate so the loader's
  // readFileSync produces a meaningful ENOENT pointing at the most likely
  // intended path.
  return candidates[0];
}

/**
 * Read the OSC mapping file. Throws on parse errors so the bridge fails fast
 * rather than starting with an empty command set (which would silently
 * ignore every operator action).
 */
export function loadOscMapping(path: string = defaultMappingPath()): OscMapping {
  const raw = readFileSync(path, "utf-8");
  const doc = parseYaml(raw);
  if (!doc || typeof doc !== "object") {
    throw new Error(`OSC mapping at ${path} is empty or malformed`);
  }
  if (!Array.isArray(doc.commands)) {
    throw new Error(`OSC mapping at ${path} is missing required 'commands' list`);
  }
  return {
    version: doc.version ?? 1,
    default_port: doc.default_port ?? 9300,
    feedback_port: doc.feedback_port ?? 9301,
    commands: doc.commands,
    feedback: doc.feedback ?? [],
  };
}
