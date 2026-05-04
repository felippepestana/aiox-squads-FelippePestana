import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

import type { OscMapping } from "@/lib/osc-types";

const DEFAULT_PATH =
  process.env.OSC_MAPPING_PATH ??
  resolve(process.cwd(), "..", "data", "osc-mapping.yaml");

/**
 * Read the OSC mapping file. Throws on parse errors so the bridge fails fast
 * rather than starting with an empty command set (which would silently
 * ignore every operator action).
 */
export function loadOscMapping(path: string = DEFAULT_PATH): OscMapping {
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
