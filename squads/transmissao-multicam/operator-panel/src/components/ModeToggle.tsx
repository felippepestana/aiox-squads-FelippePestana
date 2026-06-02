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
    if (next === "manual" && connected) {
      try {
        await broadcastOperatorOverride(OVERRIDE_MS);
        setMode(next);
      } catch (err) {
        console.error("Override broadcast failed:", err);
        window.alert("Falha ao sincronizar modo manual com o motor de IA. Tente novamente.");
      }
      return;
    }
    setMode(next);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">🤖</span>Modo</div>
        <span className={`badge ${mode === "auto" ? "badge-ok" : "badge-info"}`}>
          {mode === "auto" ? "AUTO" : "MANUAL"}
        </span>
      </div>

      <button
        onClick={toggle}
        className={`btn btn-lg${mode === "auto" ? " btn-success" : " btn-primary"}`}
        style={{ width: "100%" }}
      >
        {mode === "auto" ? "🤖 AUTO — IA" : "🎛️ MANUAL"}
      </button>

      <p className="text-sm text-muted" style={{ marginTop: "var(--sp-3)" }}>
        {mode === "auto"
          ? "Motor de IA escolhe a câmera ativa por áudio/movimento."
          : `Comandos do operador. IA suspensa por ${OVERRIDE_MS / 1000}s ao trocar.`}
      </p>
    </div>
  );
}
