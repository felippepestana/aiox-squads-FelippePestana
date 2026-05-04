// Server-only loader for data/mic-mapping.yaml.
// Centralizes mic channels, protected scenes, and PiP config so the panel
// and the F6 engine share a single source of truth. Falls back to typed
// defaults if the YAML cannot be read so `npm run dev` works out of the box.

import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

import { MIC_CHANNELS, MicChannel } from "./mic-config";
import { PIP_FALLBACK, PipConfig, PipCorner, PipSize } from "./scenes";

const DEFAULT_PATH = resolve(process.cwd(), "..", "data", "mic-mapping.yaml");

const PROTECTED_FALLBACK: string[] = [
  "SLIDES_FULL",
  "SLIDES_PIP",
  "TELA_PIP",
  "STANDBY",
  "ENCERRAMENTO",
];

interface RawChannel {
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

interface RawDoc {
  channels?: RawChannel[];
  protected_scenes?: string[];
  pip?: RawPip;
}

export interface OperationConfig {
  channels: MicChannel[];
  protectedScenes: string[];
  pip: PipConfig;
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
    defaultSizePercent:
      (raw.default_size_percent as PipSize) ?? PIP_FALLBACK.defaultSizePercent,
    defaultCorner: corner,
    availableSizesPercent: sizes,
    marginPx: raw.margin_px ?? PIP_FALLBACK.marginPx,
  };
}

export function loadOperationConfig(path: string = DEFAULT_PATH): OperationConfig {
  try {
    const raw = readFileSync(path, "utf-8");
    const doc = parseYaml(raw) as RawDoc;

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
        : MIC_CHANNELS;

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
      `mic-mapping.yaml not loaded from ${path}: falling back to defaults.`,
      err instanceof Error ? err.message : err,
    );
    return {
      channels: MIC_CHANNELS,
      protectedScenes: PROTECTED_FALLBACK,
      pip: PIP_FALLBACK,
    };
  }
}

// Backwards-compatible helper used by older callers; prefer loadOperationConfig.
export function loadMicChannels(path: string = DEFAULT_PATH): MicChannel[] {
  return loadOperationConfig(path).channels;
}
