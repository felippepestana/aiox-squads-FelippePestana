"use client";

import { useEffect } from "react";
import Link from "next/link";
import { connect, getClient } from "@/lib/obs";
import { useOperator } from "@/lib/store";

const OBS_URL = process.env.NEXT_PUBLIC_OBS_WS_URL ?? "ws://localhost:4455";

export function ConnectionStatus() {
  const connected = useOperator((s) => s.connected);
  const setConnected = useOperator((s) => s.setConnected);

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
    } catch {
      // Redirect to settings on failure
    }
  };

  if (connected) {
    return (
      <span className="conn-pill conn-pill-connected">
        <span className="dot dot-live" />
        OBS conectado
      </span>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
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
    </div>
  );
}
