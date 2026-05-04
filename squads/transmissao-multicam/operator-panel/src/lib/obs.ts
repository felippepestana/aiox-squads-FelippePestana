// OBS WebSocket client wrapper. Single instance per browser session.

"use client";

import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import {
  PIP_FALLBACK,
  PIP_MIRROR_SOURCE,
  PipConfig,
  PipCorner,
  PipSize,
  SceneName,
  pipGeometry,
} from "./scenes";

let client: OBSWebSocket | null = null;

export function getClient(): OBSWebSocket {
  if (!client) {
    client = new OBSWebSocket();
  }
  return client;
}

export interface ConnectOptions {
  url: string;
  password: string;
}

// obs-websocket v5 only delivers high-volume events (InputVolumeMeters,
// InputActiveStateChanged, etc.) when the client opts in. The panel's
// audio mixer depends on InputVolumeMeters, so we subscribe to All.
const EVENT_SUBSCRIPTIONS = EventSubscription.All;

export async function connect(opts: ConnectOptions): Promise<void> {
  const c = getClient();
  await c.connect(opts.url, opts.password, {
    eventSubscriptions: EVENT_SUBSCRIPTIONS,
  });
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.disconnect();
  }
}

export async function setProgramScene(scene: SceneName): Promise<void> {
  await getClient().call("SetCurrentProgramScene", { sceneName: scene });
}

export async function setInputMute(
  inputName: string,
  muted: boolean,
): Promise<void> {
  await getClient().call("SetInputMute", { inputName, inputMuted: muted });
}

export async function setInputVolumeDb(
  inputName: string,
  volumeDb: number,
): Promise<void> {
  await getClient().call("SetInputVolume", {
    inputName,
    inputVolumeDb: volumeDb,
  });
}

// Update the Source Mirror so SLIDES_PIP / TELA_PIP reflect the chosen camera.
// The scene_source_mirror plugin uses the "mirror_of" settings key — using
// "source" silently no-ops without erroring.
export async function setPipCamera(camera: SceneName): Promise<void> {
  await getClient().call("SetInputSettings", {
    inputName: PIP_MIRROR_SOURCE,
    inputSettings: { mirror_of: camera },
    overlay: true,
  });
}

// Reposition the mirror inside SLIDES_PIP / TELA_PIP scenes.
export async function setPipLayout(
  scene: "SLIDES_PIP" | "TELA_PIP",
  size: PipSize,
  corner: PipCorner,
  pipCfg: PipConfig = PIP_FALLBACK,
): Promise<void> {
  const c = getClient();
  const items = (await c.call("GetSceneItemList", { sceneName: scene })) as {
    sceneItems: Array<{ sceneItemId: number; sourceName: string }>;
  };
  const mirror = items.sceneItems.find(
    (it) => it.sourceName === PIP_MIRROR_SOURCE,
  );
  if (!mirror) return;
  const geo = pipGeometry(size, corner, pipCfg);
  await c.call("SetSceneItemTransform", {
    sceneName: scene,
    sceneItemId: mirror.sceneItemId,
    sceneItemTransform: {
      positionX: geo.x,
      positionY: geo.y,
      boundsWidth: geo.width,
      boundsHeight: geo.height,
      boundsType: "OBS_BOUNDS_SCALE_INNER",
    },
  });
}

// Broadcast operator override so the F6 engine suspends auto-switch.
export async function broadcastOperatorOverride(
  durationMs: number,
): Promise<void> {
  await getClient().call("BroadcastCustomEvent", {
    eventData: {
      type: "operator-override",
      expires_at: Date.now() + durationMs,
    },
  });
}

export type VolumeMetersHandler = (
  meters: Array<{ inputName: string; peakDb: number }>,
) => void;

export function subscribeToVolumeMeters(
  handler: VolumeMetersHandler,
): () => void {
  const c = getClient();
  const listener = (data: {
    inputs: Array<{
      inputName: string;
      inputLevelsMul: number[][];
    }>;
  }) => {
    const meters = data.inputs.map((input) => {
      const peakMul = Math.max(
        0,
        ...input.inputLevelsMul.flat().filter((v) => Number.isFinite(v)),
      );
      // Convert linear amplitude (multiplier) to dBFS. Floor at -60 dB.
      const peakDb = peakMul > 0 ? Math.max(20 * Math.log10(peakMul), -60) : -60;
      return { inputName: input.inputName, peakDb };
    });
    handler(meters);
  };
  c.on("InputVolumeMeters", listener);
  return () => c.off("InputVolumeMeters", listener);
}
