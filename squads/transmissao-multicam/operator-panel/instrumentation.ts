/**
 * Next.js instrumentation hook — runs once on server startup.
 * Used to boot the OSC bridge so TouchOSC can talk to OBS while
 * the operator panel is running.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    // Edge / browser runtimes can't open UDP sockets — skip silently.
    return;
  }
  if (process.env.OSC_BRIDGE_ENABLED !== "true") {
    return;
  }
  // Lazy import keeps the bundle small when the bridge is disabled and
  // avoids pulling node-only deps into the edge runtime build.
  const { startOscBridge } = await import("./src/server/osc-bridge");
  try {
    await startOscBridge();
  } catch (err) {
    // Don't crash the panel if the bridge can't start — log and continue.
    console.error("[instrumentation] OSC bridge failed to start:", err);
  }
}
