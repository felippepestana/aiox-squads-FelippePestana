"use client";

import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { SCENES } from "@/lib/scenes";

export function ShowFlowControls() {
  const connected = useOperator((s) => s.connected);
  const setActiveScene = useOperator((s) => s.setActiveScene);

  const goLive = async () => {
    if (!connected) return;
    try {
      await setProgramScene(SCENES.CAM1);
      setActiveScene(SCENES.CAM1);
    } catch (err) {
      console.error("GO LIVE failed:", err);
    }
  };

  const standby = async () => {
    if (!connected) return;
    try {
      await setProgramScene(SCENES.STANDBY);
      setActiveScene(SCENES.STANDBY);
    } catch (err) {
      console.error("Standby failed:", err);
    }
  };

  const encerrar = async () => {
    if (!connected) return;
    try {
      await setProgramScene(SCENES.ENCERRAMENTO);
      setActiveScene(SCENES.ENCERRAMENTO);
    } catch (err) {
      console.error("Encerramento failed:", err);
    }
  };

  return (
    <div className="panel col-3">
      <h2>Show flow</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={standby} disabled={!connected}>
          ⏱ STANDBY
        </button>
        <button
          onClick={goLive}
          disabled={!connected}
          className="primary"
          style={{ padding: 12 }}
        >
          🔴 GO LIVE
        </button>
        <button onClick={encerrar} disabled={!connected}>
          🎬 ENCERRAMENTO
        </button>
      </div>
    </div>
  );
}
