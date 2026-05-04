"use client";

import { useEffect } from "react";
import { connect, getClient } from "@/lib/obs";
import { useOperator } from "@/lib/store";

const URL = process.env.NEXT_PUBLIC_OBS_WS_URL ?? "ws://localhost:4455";
const PASSWORD = process.env.NEXT_PUBLIC_OBS_WS_PASSWORD ?? "";

export function ConnectionStatus() {
  const connected = useOperator((s) => s.connected);
  const setConnected = useOperator((s) => s.setConnected);

  useEffect(() => {
    const client = getClient();
    const onOpen = () => setConnected(true);
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
      await connect({ url: URL, password: PASSWORD });
    } catch (err) {
      console.error("OBS connection failed:", err);
      alert(
        `Falha ao conectar ao OBS em ${URL}.\nVerifique obs-websocket habilitado e senha em .env.local.`,
      );
    }
  };

  return (
    <div className="row" style={{ alignItems: "center" }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: connected ? "var(--ok)" : "var(--danger)",
          display: "inline-block",
        }}
      />
      <span className="muted">
        {connected ? `OBS conectado (${URL})` : `Desconectado (${URL})`}
      </span>
      {!connected && (
        <button onClick={handleConnect} className="primary">
          Conectar
        </button>
      )}
    </div>
  );
}
