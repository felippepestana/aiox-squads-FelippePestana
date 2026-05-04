"use client";

import { useEffect } from "react";
import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { CAMERAS, SCENES, SceneName } from "@/lib/scenes";

const SHORTCUTS: Record<string, SceneName> = {
  "1": SCENES.CAM1,
  "2": SCENES.CAM2,
  "3": SCENES.CAM3,
  "4": SCENES.CAM4,
  "5": SCENES.GRID,
  "6": SCENES.SLIDES_FULL,
  "7": SCENES.SLIDES_PIP,
  "8": SCENES.TELA_PIP,
  "0": SCENES.STANDBY,
};

export function SceneSwitcher() {
  const activeScene = useOperator((s) => s.activeScene);
  const setActiveScene = useOperator((s) => s.setActiveScene);
  const connected = useOperator((s) => s.connected);

  const cut = async (scene: SceneName) => {
    if (!connected) return;
    try {
      await setProgramScene(scene);
      setActiveScene(scene);
    } catch (err) {
      console.error("Cut failed:", err);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.metaKey || e.altKey) return;
      const scene = SHORTCUTS[e.key];
      if (scene) {
        e.preventDefault();
        void cut(scene);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="panel col-6">
      <h2>Câmeras</h2>
      <div className="row">
        {CAMERAS.map((cam, idx) => (
          <button
            key={cam}
            disabled={!connected}
            onClick={() => cut(cam)}
            className={activeScene === cam ? "active" : ""}
            title={`Ctrl+${idx + 1}`}
          >
            {cam}
          </button>
        ))}
        <button
          disabled={!connected}
          onClick={() => cut(SCENES.GRID)}
          className={activeScene === SCENES.GRID ? "active" : ""}
          title="Ctrl+5"
        >
          GRID
        </button>
      </div>
    </div>
  );
}
