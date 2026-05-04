"use client";

import { setPipCamera, setPipLayout } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import {
  CAMERAS,
  PipConfig,
  PipCorner,
  PipSize,
  SceneName,
} from "@/lib/scenes";

const CORNERS: { value: PipCorner; label: string }[] = [
  { value: "top_left", label: "↖" },
  { value: "top_right", label: "↗" },
  { value: "bottom_left", label: "↙" },
  { value: "bottom_right", label: "↘" },
];

interface PipControlsProps {
  pip: PipConfig;
}

export function PipControls({ pip }: PipControlsProps) {
  const SIZES = pip.availableSizesPercent;
  const pipCamera = useOperator((s) => s.pipCamera);
  const pipCorner = useOperator((s) => s.pipCorner);
  const pipSize = useOperator((s) => s.pipSize);
  const setPipCameraStore = useOperator((s) => s.setPipCamera);
  const setPipCornerStore = useOperator((s) => s.setPipCorner);
  const setPipSizeStore = useOperator((s) => s.setPipSize);
  const connected = useOperator((s) => s.connected);

  const onCamera = async (cam: SceneName) => {
    setPipCameraStore(cam);
    if (connected) {
      try {
        await setPipCamera(cam);
      } catch (err) {
        console.error("PiP camera update failed:", err);
      }
    }
  };

  const applyLayout = async (size: PipSize, corner: PipCorner) => {
    if (!connected) return;
    try {
      await setPipLayout("SLIDES_PIP", size, corner, pip);
      await setPipLayout("TELA_PIP", size, corner, pip);
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
    <div className="panel col-6">
      <h2>PiP</h2>

      <div style={{ marginBottom: 12 }}>
        <div className="muted" style={{ marginBottom: 4 }}>
          Câmera no PiP
        </div>
        <div className="row">
          {CAMERAS.map((cam) => (
            <button
              key={cam}
              disabled={!connected}
              onClick={() => onCamera(cam)}
              className={pipCamera === cam ? "active" : ""}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div className="muted" style={{ marginBottom: 4 }}>
          Canto
        </div>
        <div className="row">
          {CORNERS.map((c) => (
            <button
              key={c.value}
              disabled={!connected}
              onClick={() => onCorner(c.value)}
              className={pipCorner === c.value ? "active" : ""}
              style={{ fontSize: 18, minWidth: 40 }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="muted" style={{ marginBottom: 4 }}>
          Tamanho
        </div>
        <div className="row">
          {SIZES.map((s) => (
            <button
              key={s}
              disabled={!connected}
              onClick={() => onSize(s)}
              className={pipSize === s ? "active" : ""}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
