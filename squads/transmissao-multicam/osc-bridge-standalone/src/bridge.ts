// OSC bridge core — ported from
// operator-panel/src/server/osc-bridge.ts.
//
// Differences vs the Next.js version:
//  - No `"server-only"` boundary
//  - Imports `osc` and `obs-websocket-js` directly (no defensive require)
//  - Path imports use ./ (no @/lib alias)
//  - `startBridge()` returns a handle so the entry point can keep the
//    process alive and shut down cleanly on SIGINT.

import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import { UDPPort } from "osc";

import { loadOperationConfig, loadOscMapping } from "./config-loader.js";
import { PIP_FALLBACK, PIP_MIRROR_SOURCE, pipGeometry } from "./scenes.js";
import type {
  OscArgValue,
  OscBridgeStatus,
  OscMapping,
  OperationConfig,
  PipCorner,
  PipSize,
} from "./types.js";

interface OscRawMessage {
  address: string;
  args: Array<{ type: string; value: OscArgValue }>;
}

export interface BridgeHandle {
  status: OscBridgeStatus;
  close(): Promise<void>;
}

let started = false;
const status: OscBridgeStatus = {
  enabled: false,
  listening: false,
  port: 0,
  feedback_target: null,
  last_messages: [],
  errors_total: 0,
};

export function getBridgeStatus(): OscBridgeStatus {
  return { ...status, last_messages: status.last_messages.slice(-5) };
}

export async function startBridge(): Promise<BridgeHandle> {
  if (started) {
    return { status, close: async () => undefined };
  }
  started = true;

  const mapping = loadOscMapping();
  const op = loadOperationConfig();

  const port = Number(process.env.OSC_PORT ?? mapping.default_port);
  const feedbackHost = process.env.OSC_FEEDBACK_HOST ?? "127.0.0.1";
  const feedbackPort = Number(
    process.env.OSC_FEEDBACK_PORT ?? mapping.feedback_port,
  );

  // ─── obs-websocket client
  const obs = new OBSWebSocket();
  const obsHost = process.env.OBS_WS_HOST ?? "localhost";
  const obsPort = Number(process.env.OBS_WS_PORT ?? "4455");
  const obsPassword = process.env.OSC_OBS_PASSWORD ?? "";
  const RECONNECT_DELAY_MS = 5000;

  // Set to true by close() so the reconnect timer doesn't fire after
  // intentional shutdown.
  let closed = false;

  const connectObs = async () => {
    if (closed) return;
    try {
      await obs.connect(`ws://${obsHost}:${obsPort}`, obsPassword, {
        eventSubscriptions: EventSubscription.All,
      });
      console.log("[bridge] obs-websocket connected");
      sendFeedback("/tx/feedback/connected", [1]);
    } catch (err) {
      console.warn(
        `[bridge] obs-websocket connection failed; retrying in ${RECONNECT_DELAY_MS / 1000}s:`,
        err instanceof Error ? err.message : err,
      );
      setTimeout(() => void connectObs(), RECONNECT_DELAY_MS);
    }
  };

  obs.on("ConnectionClosed", () => {
    sendFeedback("/tx/feedback/connected", [0]);
    if (!closed) {
      console.log(
        `[bridge] obs-websocket connection closed; retrying in ${RECONNECT_DELAY_MS / 1000}s`,
      );
      setTimeout(() => void connectObs(), RECONNECT_DELAY_MS);
    }
  });

  obs.on("CurrentProgramSceneChanged", (data: { sceneName: string }) => {
    sendFeedback(`/tx/feedback/scene/${data.sceneName}`, [1]);
  });

  obs.on("InputVolumeMeters", (data: unknown) => {
    handleVolumeMeters(data, op.channels);
  });

  // ─── UDP socket
  // The `osc` package's UDPPort handles both inbound and outbound traffic
  // on the same socket; we set the remote endpoint to the tablet so
  // `udp.send` reaches it.
  const udp = new UDPPort({
    localAddress: "0.0.0.0",
    localPort: port,
    remoteAddress: feedbackHost,
    remotePort: feedbackPort,
    metadata: true,
  });

  function sendFeedback(address: string, values: OscArgValue[]) {
    if (!status.listening) return;
    try {
      udp.send({
        address,
        args: values.map((v) => {
          if (typeof v === "number") return { type: "f", value: v };
          if (typeof v === "boolean") return { type: "i", value: v ? 1 : 0 };
          return { type: "s", value: String(v) };
        }),
      });
    } catch (err) {
      console.warn("[bridge] feedback send failed:", err);
    }
  }

  function handleVolumeMeters(data: unknown, channels: typeof op.channels) {
    if (!data || typeof data !== "object" || !("inputs" in data)) return;
    const inputs = (data as { inputs: Array<{ inputName: string; inputLevelsMul: number[][] }> })
      .inputs;
    for (const input of inputs) {
      const ch = channels.find((c) => c.obsSourceName === input.inputName);
      if (!ch) continue;
      // OBS may omit inputLevelsMul during pauses; guard so `.flat()` doesn't
      // throw and kill the whole meter pipeline for the other channels.
      const levels = input.inputLevelsMul;
      const peakMul = Array.isArray(levels)
        ? Math.max(0, ...levels.flat().filter((v) => Number.isFinite(v)))
        : 0;
      const peakDb = peakMul > 0 ? Math.max(20 * Math.log10(peakMul), -60) : -60;
      sendFeedback(`/tx/feedback/audio/level/${ch.id}`, [peakDb]);
    }
  }

  udp.on("ready", () => {
    status.listening = true;
    status.port = port;
    status.feedback_target = `${feedbackHost}:${feedbackPort}`;
    status.enabled = true;
    console.log(
      `[bridge] listening on UDP :${port}, feedback → ${feedbackHost}:${feedbackPort}`,
    );
  });

  udp.on("error", (err: unknown) => {
    status.errors_total += 1;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[bridge] UDP error:", message);
  });

  udp.on("message", (raw: unknown) => {
    const msg = raw as OscRawMessage;
    if (!msg || typeof msg.address !== "string" || !Array.isArray(msg.args)) {
      return;
    }
    rememberMessage(msg);
    void dispatchCommand(msg, mapping, obs, op).catch((err) => {
      status.errors_total += 1;
      console.error(
        `[bridge] dispatch failed for ${msg.address}:`,
        err instanceof Error ? err.message : err,
      );
    });
  });

  function rememberMessage(msg: OscRawMessage) {
    status.last_messages.push({
      at: Date.now(),
      address: msg.address,
      args: msg.args.map((a) => a.value),
    });
    if (status.last_messages.length > 20) {
      status.last_messages.splice(0, status.last_messages.length - 20);
    }
  }

  udp.open();
  await connectObs();

  return {
    status,
    close: async () => {
      // Stop the auto-reconnect loop before tearing down so we don't
      // race with a pending setTimeout reconnecting after disconnect().
      closed = true;
      try {
        udp.close();
      } catch { /* socket may already be closed */ }
      try {
        await obs.disconnect();
      } catch { /* already disconnected */ }
    },
  };
}

async function dispatchCommand(
  msg: OscRawMessage,
  mapping: OscMapping,
  obs: OBSWebSocket,
  op: OperationConfig,
): Promise<void> {
  const cmd = mapping.commands.find((c) => c.address === msg.address);
  if (!cmd) {
    console.debug(`[bridge] unmapped address: ${msg.address}`);
    return;
  }
  const argValues = msg.args.map((a) => a.value);
  const resolved = resolveArgs(cmd.args ?? {}, argValues);

  switch (cmd.action) {
    case "setProgramScene":
      await obs.call("SetCurrentProgramScene", { sceneName: String(resolved.scene) });
      break;

    case "setPipCamera":
      await obs.call("SetInputSettings", {
        inputName: PIP_MIRROR_SOURCE,
        inputSettings: { mirror_of: String(resolved.scene) },
        overlay: true,
      });
      break;

    case "setPipLayout": {
      const corner = (resolved.corner as PipCorner | undefined) ?? op.pip.defaultCorner;
      const size = (Number(resolved.size) as PipSize | undefined) ?? op.pip.defaultSizePercent;
      const cfg = op.pip ?? PIP_FALLBACK;
      const geo = pipGeometry(size, corner, cfg);
      // Per-scene try/catch: if SLIDES_PIP is missing in this OBS scene
      // collection, we still want TELA_PIP to be updated, and vice versa.
      for (const scene of ["SLIDES_PIP", "TELA_PIP"]) {
        try {
          const items = (await obs.call("GetSceneItemList", { sceneName: scene })) as {
            sceneItems: Array<{ sceneItemId: number; sourceName: string }>;
          };
          const mirror = items.sceneItems.find((it) => it.sourceName === PIP_MIRROR_SOURCE);
          if (!mirror) continue;
          await obs.call("SetSceneItemTransform", {
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
        } catch (err) {
          console.warn(
            `[bridge] Failed to set PiP layout for scene ${scene}:`,
            err instanceof Error ? err.message : err,
          );
        }
      }
      break;
    }

    case "setInputMute": {
      const idx = Number(resolved.input_index);
      const channel = op.channels.find((c) => c.id === idx);
      if (!channel) {
        console.warn(`[bridge] unknown input_index ${idx}`);
        return;
      }
      const muted = toBool(resolved.muted);
      await obs.call("SetInputMute", {
        inputName: channel.obsSourceName,
        inputMuted: muted,
      });
      break;
    }

    case "setInputVolumeNormalized": {
      const idx = Number(resolved.input_index);
      const channel = op.channels.find((c) => c.id === idx);
      if (!channel) return;
      const normalized = clamp01(Number(resolved.normalized));
      const db = -60 + normalized * 66; // [-60..+6]
      await obs.call("SetInputVolume", {
        inputName: channel.obsSourceName,
        inputVolumeDb: db,
      });
      break;
    }

    case "muteAllInputs":
      await Promise.allSettled(
        op.channels.map((c) =>
          obs.call("SetInputMute", { inputName: c.obsSourceName, inputMuted: true }),
        ),
      );
      break;

    case "broadcastOperatorOverride": {
      const durationMs = Number(resolved.duration_ms ?? 10_000);
      await obs.call("BroadcastCustomEvent", {
        eventData: { type: "operator-override", duration_ms: durationMs },
      });
      break;
    }

    case "clearOperatorOverride":
      await obs.call("BroadcastCustomEvent", {
        eventData: { type: "operator-override", duration_ms: 0 },
      });
      break;

    default: {
      const _exhaustive: never = cmd.action;
      console.warn(`[bridge] unhandled action: ${_exhaustive as string}`);
    }
  }
  // Note: scene-active feedback is published from the
  // CurrentProgramSceneChanged listener above, not here. We rely on OBS
  // confirming the switch before lighting up the tablet indicator so a
  // failed/refused switch doesn't show a false-positive on the surface.
}

function resolveArgs(
  declared: Record<string, OscArgValue>,
  oscValues: OscArgValue[],
): Record<string, OscArgValue> {
  const out: Record<string, OscArgValue> = {};
  for (const [key, val] of Object.entries(declared)) {
    if (typeof val === "string" && /^\$(\d+)$/.test(val)) {
      const idx = Number(val.slice(1)) - 1;
      out[key] = oscValues[idx] ?? "";
    } else {
      out[key] = val;
    }
  }
  return out;
}

function toBool(v: OscArgValue | undefined): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v >= 0.5;
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  return false;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
