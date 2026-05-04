// Scene pack constants. Must match config.yaml -> scene_pack.

export const SCENES = {
  STANDBY: "STANDBY",
  CAM1: "CAM1",
  CAM2: "CAM2",
  CAM3: "CAM3",
  CAM4: "CAM4",
  GRID: "GRID",
  SLIDES_FULL: "SLIDES_FULL",
  SLIDES_PIP: "SLIDES_PIP",
  TELA_PIP: "TELA_PIP",
  ENCERRAMENTO: "ENCERRAMENTO",
} as const;

export type SceneName = (typeof SCENES)[keyof typeof SCENES];

export const CAMERAS: SceneName[] = [
  SCENES.CAM1,
  SCENES.CAM2,
  SCENES.CAM3,
  SCENES.CAM4,
];

export const CONTENT_LAYOUTS: SceneName[] = [
  SCENES.SLIDES_FULL,
  SCENES.SLIDES_PIP,
  SCENES.TELA_PIP,
  SCENES.GRID,
];

export const SHOW_FLOW: SceneName[] = [SCENES.STANDBY, SCENES.ENCERRAMENTO];

// PiP corner presets (see data/mic-mapping.yaml -> pip).
export type PipCorner =
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right";

export type PipSize = 20 | 25 | 30;

export interface PipGeometry {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface PipConfig {
  canvasWidth: number;
  canvasHeight: number;
  defaultSizePercent: PipSize;
  defaultCorner: PipCorner;
  availableSizesPercent: PipSize[];
  marginPx: number;
}

// Hardcoded fallback used only when YAML loading fails (dev). Production
// loads from data/mic-mapping.yaml -> pip via mic-loader.ts.
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
