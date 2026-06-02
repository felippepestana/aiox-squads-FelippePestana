"use client";

import { setPipCamera, setPipLayout } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import { CAMERAS, PipConfig, PipCorner, PipSize, SCENES, SceneName } from "@/lib/scenes";

const CORNERS: { value: PipCorner; label: string }[] = [
  { value: "top_left",     label: "↖ Sup. esq." },
  { value: "top_right",    label: "↗ Sup. dir." },
  { value: "bottom_left",  label: "↙ Inf. esq." },
  { value: "bottom_right", label: "↘ Inf. dir." },
];

interface PipControlsProps {
  pip: PipConfig;
}

export function PipControls({ pip }: PipControlsProps) {
  const SIZES = pip.availableSizesPercent;
  const pipCamera       = useOperator((s) => s.pipCamera);
  const pipCorner       = useOperator((s) => s.pipCorner);
  const pipSize         = useOperator((s) => s.pipSize);
  const setPipCameraStore = useOperator((s) => s.setPipCamera);
  const setPipCornerStore = useOperator((s) => s.setPipCorner);
  const setPipSizeStore   = useOperator((s) => s.setPipSize);
  const connected       = useOperator((s) => s.connected);

  const onCamera = async (cam: SceneName) => {
    setPipCameraStore(cam);
    if (connected) {
      try { await setPipCamera(cam); }
      catch (err) { console.error("PiP camera update failed:", err); }
    }
  };

  const applyLayout = async (size: PipSize, corner: PipCorner) => {
    if (!connected) return;
    try {
      await setPipLayout(SCENES.SLIDES_PIP, size, corner, pip);
      await setPipLayout(SCENES.TELA_PIP,   size, corner, pip);
    } catch (err) {
      console.error("PiP layout update failed:", err);
    }
  };

  const onCorner = async (corner: PipCorner) => {
    setPipCornerStore(corner);
    await applyLayout(pipSize, corner);
  };

  const onSize = async (size: PipSize) => {
    setPipSizeStore(size);
    await applyLayout(size, pipCorner);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">🖼️</span>PiP</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <div>
          <label className="label" style={{ marginBottom: "var(--sp-2)" }}>Câmera no PiP</label>
          <div className="row">
            {CAMERAS.map((cam) => (
              <button key={cam} disabled={!connected}
                onClick={() => onCamera(cam)}
                className={`btn btn-sm${pipCamera === cam ? " btn-active" : ""}`}>
                {cam}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" style={{ marginBottom: "var(--sp-2)" }}>Canto</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)" }}>
            {CORNERS.map((c) => (
              <button key={c.value} disabled={!connected}
                onClick={() => onCorner(c.value)}
                className={`btn btn-sm${pipCorner === c.value ? " btn-active" : ""}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" style={{ marginBottom: "var(--sp-2)" }}>Tamanho</label>
          <div className="row">
            {SIZES.map((s) => (
              <button key={s} disabled={!connected}
                onClick={() => onSize(s)}
                className={`btn btn-sm${pipSize === s ? " btn-active" : ""}`}>
                {s}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
