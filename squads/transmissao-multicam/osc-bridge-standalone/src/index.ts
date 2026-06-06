// Entry point — loads .env, starts the bridge, holds the process open
// until SIGINT/SIGTERM, then closes the socket and obs-websocket cleanly.

import "dotenv/config";

import { startBridge, type BridgeHandle } from "./bridge.js";

async function main(): Promise<void> {
  const handle: BridgeHandle = await startBridge();
  console.log(`[index] bridge running on UDP :${handle.status.port}`);

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[index] received ${signal}, shutting down`);
    try {
      await handle.close();
    } catch (err) {
      console.warn("[index] close raised:", err instanceof Error ? err.message : err);
    }
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  // Keep the event loop alive. The UDP socket and obs-websocket already
  // do this, but an unrefed timer guarantees the process survives even
  // if both close (e.g. transient OBS restart).
  setInterval(() => undefined, 1 << 30);
}

main().catch((err) => {
  console.error("[index] fatal:", err);
  process.exit(1);
});
