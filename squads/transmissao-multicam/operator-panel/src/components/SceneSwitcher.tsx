"use client";

import { useCallback, useEffect } from "react";
import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { CAMERAS, SCENES, SceneName } from "@/lib/scenes";

const SCENE_META: { scene: SceneName; icon: string; label: string; shortcut: string }[] = [
  { scene: SCENES.CAM1,       icon: "📷", label: "CAM 1",      shortcut: "1" },
  { scene: SCENES.CAM2,       icon: "📷", label: "CAM 2",      shortcut: "2" },
  { scene: SCENES.CAM3,       icon: "📷", label: "CAM 3",      shortcut: "3" },
  { scene: SCENES.CAM4,       icon: "📷", label: "CAM 4",      shortcut: "4" },
  { scene: SCENES.GRID,       icon: "⊞",  label: "GRID 2×2",  shortcut: "5" },
  { scene: SCENES.SLIDES_FULL,icon: "🖥️", label: "Slides",     shortcut: "6" },
  { scene: SCENES.SLIDES_PIP, icon: "🖼️", label: "Slides+PiP", shortcut: "7" },
  { scene: SCENES.TELA_PIP,   icon: "💻", label: "Tela+PiP",  shortcut: "8" },
  { scene: SCENES.STANDBY,    icon: "⏸️", label: "Standby",   shortcut: "0" },
  { scene: SCENES.ENCERRAMENTO,icon:"🎬", label: "Encerrar",  shortcut: "" },
];

const SHORTCUTS: Record<string, SceneName> = {
  "1": SCENES.CAM1, "2": SCENES.CAM2, "3": SCENES.CAM3, "4": SCENES.CAM4,
  "5": SCENES.GRID, "6": SCENES.SLIDES_FULL, "7": SCENES.SLIDES_PIP,
  "8": SCENES.TELA_PIP, "0": SCENES.STANDBY,
};

export function SceneSwitcher() {
  const activeScene = useOperator((s) => s.activeScene);
  const setActiveScene = useOperator((s) => s.setActiveScene);
  const connected = useOperator((s) => s.connected);

  const cut = useCallback(async (scene: SceneName) => {
    if (!connected) return;
    try {
      await setProgramScene(scene);
      setActiveScene(scene);
    } catch (err) {
      console.error("Cut failed:", err);
    }
  }, [connected, setActiveScene]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.metaKey || e.altKey) return;
      const scene = SHORTCUTS[e.key];
      if (scene) { e.preventDefault(); void cut(scene); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cut]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">🎬</span>Cenas</div>
        {!connected && <span className="badge badge-warn">OBS desconectado</span>}
      </div>
      <div className="scene-grid">
        {SCENE_META.map((m) => (
          <button
            key={m.scene}
            disabled={!connected}
            onClick={() => cut(m.scene)}
            className={`scene-btn${activeScene === m.scene ? " active" : ""}`}
            title={m.shortcut ? `Ctrl+${m.shortcut}` : m.label}
          >
            {m.shortcut && (
              <span className="scene-btn-shortcut">Ctrl+{m.shortcut}</span>
            )}
            <span className="scene-btn-icon">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
