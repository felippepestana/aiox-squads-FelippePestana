"use client";

import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { SCENES } from "@/lib/scenes";

export function ShowFlowControls() {
  const connected = useOperator((s) => s.connected);
  const setActiveScene = useOperator((s) => s.setActiveScene);

  const go = async (scene: (typeof SCENES)[keyof typeof SCENES]) => {
    if (!connected) return;
    try {
      await setProgramScene(scene);
      setActiveScene(scene);
    } catch (err) {
      console.error(`Switch to ${scene} failed:`, err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">📺</span>Show Flow</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        <button className="btn" onClick={() => go(SCENES.STANDBY)} disabled={!connected}
          style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}>
          <span>⏸️</span> STANDBY
        </button>
        <button className="btn btn-success btn-lg" onClick={() => go(SCENES.CAM1)} disabled={!connected}
          style={{ width: "100%", justifyContent: "center" }}>
          🔴 GO LIVE
        </button>
        <button className="btn" onClick={() => go(SCENES.ENCERRAMENTO)} disabled={!connected}
          style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}>
          <span>🎬</span> ENCERRAMENTO
        </button>
      </div>
    </div>
  );
}
