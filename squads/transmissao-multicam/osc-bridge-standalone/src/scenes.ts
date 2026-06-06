// PiP geometry helpers — ported from operator-panel/src/lib/scenes.ts.
// Only the PiP-related pieces actually used by the bridge are included
// (no SCENES/CAMERAS enums; the bridge passes scene names as strings).

import type { PipConfig, PipCorner, PipGeometry, PipSize } from "./types.js";

// Fallback used only when YAML loading fails. Production loads from
// data/mic-mapping.yaml -> pip via config-loader.ts.
export const PIP_FALLBACK: PipConfig = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  defaultSizePercent: 25,
  defaultCorner: "bottom_right",
  availableSizesPercent: [20, 25, 30],
  marginPx: 30,
};

export function pipGeometry(
  size: PipSize,
  corner: PipCorner,
  cfg: PipConfig = PIP_FALLBACK,
): PipGeometry {
  const width = Math.round((cfg.canvasWidth * size) / 100);
  const height = Math.round((cfg.canvasHeight * size) / 100);
  const x =
    corner === "top_left" || corner === "bottom_left"
      ? cfg.marginPx
      : cfg.canvasWidth - width - cfg.marginPx;
  const y =
    corner === "top_left" || corner === "top_right"
      ? cfg.marginPx
      : cfg.canvasHeight - height - cfg.marginPx;
  return { width, height, x, y };
}

// The shared mirror source that SLIDES_PIP/TELA_PIP scenes use to display
// whichever camera is currently selected by the operator (or AI engine).
export const PIP_MIRROR_SOURCE = "CamAtivaMirror";
