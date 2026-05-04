// Types shared between the OSC bridge (server) and any client UI that
// surfaces bridge state. Kept free of Node-only imports so it can be
// imported from either runtime.

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
  // Static args declared in the YAML mapping. Values can be literals or
  // the placeholder string "$1", "$2", … indicating that the value should
  // be taken from the OSC message arguments at that 1-based position.
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
  /** Plain address used when no template substitution is needed. */
  address?: string;
  /** Template like "/tx/feedback/scene/{scene_name}". */
  address_template?: string;
  /** Constant value, or the name of a payload field to extract. */
  payload: number | string;
  payload_min?: number;
  payload_max?: number;
  /** Glob template to zero-out other indicators after a switch. */
  reset_others_template?: string;
  reset_value?: number;
}

export interface OscMapping {
  version: number;
  default_port: number;
  feedback_port: number;
  commands: OscCommand[];
  feedback: OscFeedback[];
}

/** Status surfaced to the panel UI so the operator can see if OSC is alive. */
export interface OscBridgeStatus {
  enabled: boolean;
  listening: boolean;
  port: number;
  feedback_target: string | null;
  /** Last 5 OSC messages received, for debugging. */
  last_messages: Array<{ at: number; address: string; args: OscArgValue[] }>;
  errors_total: number;
}
