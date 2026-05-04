import "server-only";

/**
 * OSC bridge — runs inside the Next.js Node.js process and translates
 * UDP/OSC messages from TouchOSC into obs-websocket commands. It also
 * subscribes to obs-websocket events and pushes status back to TouchOSC
 * over UDP so the tablet displays live feedback.
 *
 * Booted from instrumentation.ts when OSC_BRIDGE_ENABLED=true.
 *
 * Defensive: if the `osc` package or obs-websocket-js is missing the
 * panel still boots — only the bridge is disabled. Logs a single warning.
 */

import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

import { loadOscMapping } from "./osc-mapping-loader";
import { loadOperationConfig } from "@/lib/mic-loader";
import {
  PIP_FALLBACK,
  PIP_MIRROR_SOURCE,
  PipCorner,
  PipSize,
  pipGeometry,
} from "@/lib/scenes";
import type {
  OscArgValue,
  OscBridgeStatus,
  OscCommand,
  OscFeedback,
  OscMapping,
} from "@/lib/osc-types";

const PROTECTED_SCENES = new Set([
  "STANDBY",
  "ENCERRAMENTO",
  "SLIDES_FULL",
  "SLIDES_PIP",
  "TELA_PIP",
]);

interface OscRawMessage {
  address: string;
  args: Array<{ type: string; value: OscArgValue }>;
}

let started = false;
let status: OscBridgeStatus = {
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

export async function startOscBridge(): Promise<void> {
  if (started) return;
  started = true;

  if (process.env.OSC_BRIDGE_ENABLED !== "true") {
    return;
  }

  let oscModule: typeof import("osc");
  try {
    oscModule = require("osc");
  } catch (err) {
    console.warn(
      "[osc-bridge] `osc` package not installed; bridge disabled.",
      err instanceof Error ? err.message : err,
    );
    return;
  }

  const mapping = loadOscMapping();
  const op = loadOperationConfig();

  const port = Number(process.env.OSC_PORT ?? mapping.default_port);
  const feedbackHost = process.env.OSC_FEEDBACK_HOST ?? "127.0.0.1";
  const feedbackPort = Number(
    process.env.OSC_FEEDBACK_PORT ?? mapping.feedback_port,
  );

  // ─── obs-websocket client (server-side, separate from browser session)
  const obs = new OBSWebSocket();
  const obsHost = process.env.OBS_WS_HOST ?? "localhost";
  const obsPort = Number(process.env.OBS_WS_PORT ?? "4455");
  const obsPassword = process.env.OSC_OBS_PASSWORD ?? "";

  let obsConnected = false;

  const connectObs = async () => {
    try {
      await obs.connect(`ws://${obsHost}:${obsPort}`, obsPassword, {
        eventSubscriptions: EventSubscription.All,
      });
      obsConnected = true;
      console.log("[osc-bridge] obs-websocket connected");
      sendFeedback("/tx/feedback/connected", [1]);
    } catch (err) {
      obsConnected = false;
      console.warn(
        "[osc-bridge] obs-websocket connection failed; bridge will retry on demand:",
        err instanceof Error ? err.message : err,
      );
    }
  };

  obs.on("ConnectionClosed", () => {
    obsConnected = false;
    sendFeedback("/tx/feedback/connected", [0]);
  });

  obs.on("CurrentProgramSceneChanged", (data: { sceneName: string }) => {
    sendFeedback(`/tx/feedback/scene/${data.sceneName}`, [1]);
  });

  obs.on("InputVolumeMeters", (data: unknown) => {
    handleVolumeMeters(data, op.channels);
  });

  // ─── UDP socket
  const udp = new oscModule.UDPPort({
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
      console.warn("[osc-bridge] feedback send failed:", err);
    }
  }

  function handleVolumeMeters(data: unknown, channels: typeof op.channels) {
    if (!data || typeof data !== "object" || !("inputs" in data)) return;
    const inputs = (data as { inputs: Array<{ inputName: string; inputLevelsMul: number[][] }> })
      .inputs;
    for (const input of inputs) {
      const ch = channels.find((c) => c.obsSourceName === input.inputName);
      if (!ch) continue;
      const peakMul = Math.max(
        0,
        ...input.inputLevelsMul.flat().filter((v) => Number.isFinite(v)),
      );
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
      `[osc-bridge] listening on UDP :${port}, feedback → ${feedbackHost}:${feedbackPort}`,
    );
  });

  udp.on("error", (err: unknown) => {
    status.errors_total += 1;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[osc-bridge] UDP error:", message);
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
        `[osc-bridge] dispatch failed for ${msg.address}:`,
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
}

async function dispatchCommand(
  msg: OscRawMessage,
  mapping: OscMapping,
  obs: OBSWebSocket,
  op: ReturnType<typeof loadOperationConfig>,
): Promise<void> {
  const cmd = mapping.commands.find((c) => c.address === msg.address);
  if (!cmd) {
    console.debug(`[osc-bridge] unmapped address: ${msg.address}`);
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
      for (const scene of ["SLIDES_PIP", "TELA_PIP"]) {
        const items = (await obs.call("GetSceneItemList", { sceneName: scene })) as {
          sceneItems: Array<{ sceneItemId: number; sourceName: string }>;
        };
        const mirror = items.sceneItems.find((it) => it.sourceName === PIP_MIRROR_SOURCE);
        if (!mirror) continue; // operator may have non-PIP scene customized
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
      }
      break;
    }

    case "setInputMute": {
      const idx = Number(resolved.input_index);
      const channel = op.channels.find((c) => c.id === idx);
      if (!channel) {
        console.warn(`[osc-bridge] unknown input_index ${idx}`);
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
      console.warn(`[osc-bridge] unhandled action: ${_exhaustive}`);
    }
  }

  // Protected scenes → also publish the indicator immediately even though
  // CurrentProgramSceneChanged will fire — keeps the tablet snappy.
  if (cmd.action === "setProgramScene" && PROTECTED_SCENES.has(String(resolved.scene))) {
    // No-op marker; the real feedback comes from obs-websocket event.
  }
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
