// Server-only loader for data/mic-mapping.yaml.
// Falls back to MIC_CHANNELS defaults if the YAML cannot be read so that
// `npm run dev` works out of the box even before the squad data is wired up.

import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

import { MIC_CHANNELS, MicChannel } from "./mic-config";

const DEFAULT_PATH = resolve(process.cwd(), "..", "data", "mic-mapping.yaml");

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

interface RawDoc {
  channels?: RawChannel[];
}

export function loadMicChannels(path: string = DEFAULT_PATH): MicChannel[] {
  try {
    const raw = readFileSync(path, "utf-8");
    const doc = parseYaml(raw) as RawDoc;
    if (!doc?.channels?.length) {
      return MIC_CHANNELS;
    }
    return doc.channels.map((c) => ({
      id: c.id,
      obsSourceName: c.obs_source_name,
      micLabel: c.mic_label,
      role: c.role,
      cameraTarget: c.camera_target,
      faderDb: c.fader_db,
      muteDefault: c.mute_default,
      vadThresholdDbfs: c.vad_threshold_dbfs,
    }));
  } catch (err) {
    console.warn(
      `mic-mapping.yaml not loaded from ${path}: falling back to defaults.`,
      err instanceof Error ? err.message : err,
    );
    return MIC_CHANNELS;
  }
}
