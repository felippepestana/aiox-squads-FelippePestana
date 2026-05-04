"use client";

import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { SCENES, SceneName } from "@/lib/scenes";

const LAYOUTS: { scene: SceneName; label: string; shortcut: string }[] = [
  { scene: SCENES.SLIDES_FULL, label: "Slides cheio", shortcut: "Ctrl+6" },
  { scene: SCENES.SLIDES_PIP, label: "Slides + PiP", shortcut: "Ctrl+7" },
  { scene: SCENES.TELA_PIP, label: "Tela + PiP", shortcut: "Ctrl+8" },
];

export function LayoutControls() {
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

  return (
    <div className="panel col-6">
      <h2>Conteúdo</h2>
      <div className="row">
        {LAYOUTS.map((l) => (
          <button
            key={l.scene}
            disabled={!connected}
            onClick={() => cut(l.scene)}
            className={activeScene === l.scene ? "active" : ""}
            title={l.shortcut}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
