"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connect, getClient } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import type { OscBridgeStatus } from "@/lib/osc-types";

const OBS_URL = process.env.NEXT_PUBLIC_OBS_WS_URL ?? "ws://localhost:4455";

/**
 * Polls /api/osc/status every 5s to surface the OSC bridge health (TouchOSC).
 * Returns null when the bridge is disabled, so the indicator only renders
 * when it's relevant.
 */
function useOscBridgeStatus(): OscBridgeStatus | null {
  const [status, setStatus] = useState<OscBridgeStatus | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/osc/status", { cache: "no-store" });
        if (!alive) return;
        if (res.ok) setStatus(await res.json());
      } catch {
        // Bridge route unreachable; leave previous state untouched.
      }
    };
    poll();
    const id = setInterval(poll, 5_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return status;
}

export function ConnectionStatus() {
  const router = useRouter();
  const connected = useOperator((s) => s.connected);
  const setConnected = useOperator((s) => s.setConnected);
  const osc = useOscBridgeStatus();

  useEffect(() => {
    const client = getClient();
    const onOpen  = () => setConnected(true);
    const onClose = () => setConnected(false);
    client.on("ConnectionOpened", onOpen);
    client.on("ConnectionClosed", onClose);
    return () => {
      client.off("ConnectionOpened", onOpen);
      client.off("ConnectionClosed", onClose);
    };
  }, [setConnected]);

  const handleConnect = async () => {
    try {
      await connect({ url: OBS_URL, password: "" });
    } catch (err) {
      // The default connection attempt has no password — most failures here
      // are because the operator hasn't filled credentials yet. Push them to
      // settings instead of leaving the pill silently red.
      console.warn("OBS connection failed; redirecting to settings:", err);
      router.push("/settings/obs");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
      {connected ? (
        <span className="conn-pill conn-pill-connected">
          <span className="dot dot-live" />
          OBS conectado
        </span>
      ) : (
        <>
          <span className="conn-pill conn-pill-disconnected">
            <span className="dot dot-danger" />
            Desconectado
          </span>
          <button className="btn btn-sm btn-primary" onClick={handleConnect}>
            Conectar
          </button>
          <Link href="/settings/obs" className="btn btn-ghost btn-sm">
            ⚙️ Configurar
          </Link>
        </>
      )}

      {osc?.enabled && (
        <span
          className={`conn-pill ${osc.listening ? "conn-pill-connected" : "conn-pill-connecting"}`}
          title={
            osc.listening
              ? `OSC :${osc.port} → ${osc.feedback_target ?? "?"} · ${osc.errors_total} erros`
              : "OSC bridge habilitado mas socket não está escutando"
          }
        >
          🎛️ TouchOSC {osc.listening ? `:${osc.port}` : "off"}
        </span>
      )}
    </div>
  );
}
