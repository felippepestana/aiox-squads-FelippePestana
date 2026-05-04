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

// PiP corner presets (see templates/pip-layout.yaml).
export type PipCorner =
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right";

export type PipSize = 20 | 25 | 30;

export const PIP_DEFAULT_CORNER: PipCorner = "bottom_right";
export const PIP_DEFAULT_SIZE: PipSize = 25;

export interface PipGeometry {
  width: number;
  height: number;
  x: number;
  y: number;
}

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const MARGIN_PX = 30;

export function pipGeometry(
  size: PipSize,
  corner: PipCorner,
): PipGeometry {
  const width = Math.round((CANVAS_WIDTH * size) / 100);
  const height = Math.round((CANVAS_HEIGHT * size) / 100);
  const x =
    corner === "top_left" || corner === "bottom_left"
      ? MARGIN_PX
      : CANVAS_WIDTH - width - MARGIN_PX;
  const y =
    corner === "top_left" || corner === "top_right"
      ? MARGIN_PX
      : CANVAS_HEIGHT - height - MARGIN_PX;
  return { width, height, x, y };
}

// The shared mirror source that SLIDES_PIP/TELA_PIP scenes use to display
// whichever camera is currently selected by the operator (or AI engine).
export const PIP_MIRROR_SOURCE = "CamAtivaMirror";
