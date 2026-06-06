// Types — ported from operator-panel/src/lib/{osc-types,mic-config,scenes}.ts
//
// Keep in sync with the operator-panel versions; protocol changes must be
// applied to both bridges in the same PR.

// ─── OSC protocol ─────────────────────────────────────────

export type OscArgValue = string | number | boolean;

export type OscAction =
  | "setProgramScene"
  | "setPipCamera"
  | "setPipLayout"
  | "setInputMute"
  | "setInputVolumeNormalized"
  | "muteAllInputs"
  | "broadcastOperatorOverride"
  | "clearOperatorOverride";

export interface OscCommand {
  address: string;
  action: OscAction;
  args?: Record<string, OscArgValue>;
}

export type FeedbackEvent =
  | "CurrentProgramSceneChanged"
  | "InputVolumeMeters"
  | "ConnectionOpened"
  | "ConnectionClosed"
  | "EngineSwitchDecided"
  | "EngineModeChanged"
  | "EngineHealthChanged";

export interface OscFeedback {
  event: FeedbackEvent;
  address?: string;
  address_template?: string;
  payload: number | string;
  payload_min?: number;
  payload_max?: number;
  reset_others_template?: string;
  reset_value?: number;
  bridge_handles?: boolean;
}

export interface OscMapping {
  version: number;
  default_port: number;
  feedback_port: number;
  commands: OscCommand[];
  feedback: OscFeedback[];
}

export interface OscBridgeStatus {
  enabled: boolean;
  listening: boolean;
  port: number;
  feedback_target: string | null;
  last_messages: Array<{ at: number; address: string; args: OscArgValue[] }>;
  errors_total: number;
}

// ─── Mic mapping ──────────────────────────────────────────

export interface MicChannel {
  id: number;
  obsSourceName: string;
  micLabel: string;
  role: string;
  cameraTarget: string | null;
  faderDb: number;
  muteDefault: boolean;
  vadThresholdDbfs: number;
}

// ─── PiP / scenes ────────────────────────────────────────

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

// ─── Aggregated operation config ─────────────────────────

export interface OperationConfig {
  channels: MicChannel[];
  protectedScenes: string[];
  pip: PipConfig;
}
