// YAML loaders for OSC mapping + mic mapping.
//
// Ported from operator-panel/src/lib/mic-loader.ts and
// operator-panel/src/server/osc-mapping-loader.ts, simplified:
// - no Next.js `server-only` boundary
// - no `@/lib/*` aliases (relative imports only)
// - path resolution: env var → relative to dist/ → squad data/ fallback

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

import { PIP_FALLBACK } from "./scenes.js";
import type { MicChannel, OperationConfig, OscMapping, PipConfig, PipCorner, PipSize } from "./types.js";

// import.meta.url resolves to dist/config-loader.js at runtime.
const HERE = dirname(fileURLToPath(import.meta.url));

const PROTECTED_FALLBACK: string[] = [
  "SLIDES_FULL",
  "SLIDES_PIP",
  "TELA_PIP",
  "STANDBY",
  "ENCERRAMENTO",
];

const MIC_CHANNELS_FALLBACK: MicChannel[] = [
  { id: 1, obsSourceName: "MIC_1", micLabel: "Lapela palestrante principal",  role: "principal_speaker", cameraTarget: "CAM1", faderDb: 0,    muteDefault: false, vadThresholdDbfs: -32 },
  { id: 2, obsSourceName: "MIC_2", micLabel: "Mesa de plateia (audiência)",   role: "audience",          cameraTarget: "CAM2", faderDb: -3,   muteDefault: true,  vadThresholdDbfs: -28 },
  { id: 3, obsSourceName: "MIC_3", micLabel: "Lapela co-apresentador",        role: "co_speaker",        cameraTarget: "CAM3", faderDb: 0,    muteDefault: false, vadThresholdDbfs: -32 },
  { id: 4, obsSourceName: "MIC_4", micLabel: "Mesa geral / ambiente",         role: "ambient",           cameraTarget: null,   faderDb: -12,  muteDefault: false, vadThresholdDbfs: -20 },
];

// ─── Path resolution ──────────────────────────────────────

function resolveDataPath(envVar: string, defaultRelative: string): string {
  const fromEnv = process.env[envVar];
  if (fromEnv) {
    // Allow absolute or working-dir-relative paths from env
    return resolve(fromEnv);
  }
  const candidates = [
    // Default: ../../data/* relative to dist/config-loader.js
    resolve(HERE, defaultRelative),
    // Fallback: same path but from CWD (in case someone runs from src/)
    resolve(process.cwd(), defaultRelative),
    // Fallback: squad data/ from repo root
    resolve(process.cwd(), "squads", "transmissao-multicam", "data", defaultRelative.split("/").pop()!),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  // Return the first candidate so the readFileSync error points at the
  // most likely intended location.
  return candidates[0];
}

// ─── OSC mapping ──────────────────────────────────────────

interface RawOscDoc {
  version?: number;
  default_port?: number;
  feedback_port?: number;
  commands?: OscMapping["commands"];
  feedback?: OscMapping["feedback"];
}

export function loadOscMapping(path?: string): OscMapping {
  const resolved = path ?? resolveDataPath("OSC_MAPPING_PATH", "../../data/osc-mapping.yaml");
  const raw = readFileSync(resolved, "utf-8");
  const doc = parseYaml(raw) as RawOscDoc | null;
  if (!doc || typeof doc !== "object") {
    throw new Error(`OSC mapping at ${resolved} is empty or malformed`);
  }
  if (!Array.isArray(doc.commands)) {
    throw new Error(`OSC mapping at ${resolved} missing required 'commands' list`);
  }
  return {
    version: doc.version ?? 1,
    default_port: doc.default_port ?? 9300,
    feedback_port: doc.feedback_port ?? 9301,
    commands: doc.commands,
    feedback: doc.feedback ?? [],
  };
}

// ─── Mic mapping / operation config ──────────────────────

interface RawMicChannel {
  id: number;
  obs_source_name: string;
  mic_label: string;
  role: string;
  camera_target: string | null;
  fader_db: number;
  mute_default: boolean;
  vad_threshold_dbfs: number;
}

interface RawPip {
  canvas?: { width?: number; height?: number };
  default_size_percent?: number;
  default_corner?: string;
  available_sizes_percent?: number[];
  margin_px?: number;
}

interface RawOpDoc {
  channels?: RawMicChannel[];
  protected_scenes?: string[];
  pip?: RawPip;
}

function parsePip(raw: RawPip | undefined): PipConfig {
  if (!raw) return PIP_FALLBACK;
  const corner = (raw.default_corner ?? PIP_FALLBACK.defaultCorner) as PipCorner;
  const sizes =
    raw.available_sizes_percent && raw.available_sizes_percent.length > 0
      ? (raw.available_sizes_percent as PipSize[])
      : PIP_FALLBACK.availableSizesPercent;
  return {
    canvasWidth: raw.canvas?.width ?? PIP_FALLBACK.canvasWidth,
    canvasHeight: raw.canvas?.height ?? PIP_FALLBACK.canvasHeight,
    defaultSizePercent: (raw.default_size_percent as PipSize) ?? PIP_FALLBACK.defaultSizePercent,
    defaultCorner: corner,
    availableSizesPercent: sizes,
    marginPx: raw.margin_px ?? PIP_FALLBACK.marginPx,
  };
}

export function loadOperationConfig(path?: string): OperationConfig {
  const resolved = path ?? resolveDataPath("MIC_MAPPING_PATH", "../../data/mic-mapping.yaml");
  try {
    const raw = readFileSync(resolved, "utf-8");
    const doc = parseYaml(raw) as RawOpDoc | null;

    const channels =
      doc?.channels && doc.channels.length > 0
        ? doc.channels.map((c) => ({
            id: c.id,
            obsSourceName: c.obs_source_name,
            micLabel: c.mic_label,
            role: c.role,
            cameraTarget: c.camera_target,
            faderDb: c.fader_db,
            muteDefault: c.mute_default,
            vadThresholdDbfs: c.vad_threshold_dbfs,
          }))
        : MIC_CHANNELS_FALLBACK;

    const protectedScenes =
      doc?.protected_scenes && doc.protected_scenes.length > 0
        ? doc.protected_scenes
        : PROTECTED_FALLBACK;

    return {
      channels,
      protectedScenes,
      pip: parsePip(doc?.pip),
    };
  } catch (err) {
    console.warn(
      `[config-loader] mic-mapping.yaml not loaded from ${resolved}: falling back to defaults.`,
      err instanceof Error ? err.message : err,
    );
    return {
      channels: MIC_CHANNELS_FALLBACK,
      protectedScenes: PROTECTED_FALLBACK,
      pip: PIP_FALLBACK,
    };
  }
}
