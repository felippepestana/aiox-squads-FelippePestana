"use client";

import { setProgramScene } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { SCENES, SceneName } from "@/lib/scenes";

const LAYOUTS: { scene: SceneName; icon: string; label: string; shortcut: string }[] = [
  { scene: SCENES.SLIDES_FULL, icon: "🖥️", label: "Slides cheio",  shortcut: "Ctrl+6" },
  { scene: SCENES.SLIDES_PIP,  icon: "🖼️", label: "Slides + PiP", shortcut: "Ctrl+7" },
  { scene: SCENES.TELA_PIP,    icon: "💻", label: "Tela + PiP",   shortcut: "Ctrl+8" },
  { scene: SCENES.GRID,        icon: "⊞",  label: "Grade 2×2",   shortcut: "Ctrl+5" },
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
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">🖥️</span>Conteúdo</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {LAYOUTS.map((l) => (
          <button
            key={l.scene}
            disabled={!connected}
            onClick={() => cut(l.scene)}
            className={`btn${activeScene === l.scene ? " btn-active" : ""}`}
            style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}
            title={l.shortcut}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--fg-faint)" }}>{l.shortcut}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
