"use client";

import { broadcastOperatorOverride } from "@/lib/obs";
import { useOperator } from "@/lib/store";

const OVERRIDE_MS = 10_000;

export function ModeToggle() {
  const mode = useOperator((s) => s.mode);
  const setMode = useOperator((s) => s.setMode);
  const connected = useOperator((s) => s.connected);

  const toggle = async () => {
    const next = mode === "auto" ? "manual" : "auto";
    setMode(next);
    if (next === "manual" && connected) {
      try {
        await broadcastOperatorOverride(OVERRIDE_MS);
      } catch (err) {
        console.error("Override broadcast failed:", err);
      }
    }
  };

  return (
    <div className="panel col-3">
      <h2>Modo</h2>
      <button
        onClick={toggle}
        className={mode === "auto" ? "primary" : "active"}
        style={{ width: "100%", padding: 12 }}
      >
        {mode === "auto" ? "AUTO (IA)" : "MANUAL"}
      </button>
      <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
        {mode === "auto"
          ? "Motor de IA escolhe a câmera ativa. Operador supervisiona."
          : `Comandos do operador. IA suspensa por ${OVERRIDE_MS / 1000}s ao trocar.`}
      </p>
    </div>
  );
}
