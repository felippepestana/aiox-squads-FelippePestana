// Database row types — keep in sync with supabase/migrations/001_initial_schema.sql

export interface ObsSettings {
  id: string;
  host: string;
  port: number;
  use_tls: boolean;
  updated_at: string;
}

export interface MeetSettings {
  id: string;
  account_email: string | null;
  default_room_url: string | null;
  auto_record: boolean;
  studio_effects_disabled: boolean;
  live_streaming_enabled: boolean;
  workspace_admin_email: string | null;
  max_participants: number | null;
  notes: string | null;
  updated_at: string;
}

export type CameraRole = "speaker" | "host" | "slides" | "reserve";

export interface CameraConfig {
  id: string;
  camera_id: string;
  display_name: string;
  usb_port: string | null;
  vid: string;
  role: CameraRole;
  preset_1_name: string;
  preset_2_name: string;
  preset_3_name: string;
  auto_track: boolean;
  notes: string | null;
  updated_at: string;
}

export type MicRole = "speaker" | "host" | "aux";

export interface MicChannel {
  id: string;
  channel: number;
  label: string;
  input_name: string;
  camera_id: string | null;
  role: MicRole;
  threshold_db: number;
  updated_at: string;
}

export type CredentialType = "api_key" | "oauth_token" | "webhook_secret" | "other";

export interface ApiCredential {
  id: string;
  service_name: string;
  credential_type: CredentialType;
  value_hint: string | null;
  description: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type EventStatus = "planned" | "live" | "completed" | "cancelled";

export interface BroadcastEvent {
  id: string;
  title: string;
  session_topic: string | null;
  scheduled_at: string | null;
  duration_min: number | null;
  status: EventStatus;
  standby_countdown_min: number;
  meet_room_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SwitchTrigger = "audio" | "motion" | "manual" | "operator" | "failover" | "standby";

export interface SwitchLog {
  id: string;
  event_id: string | null;
  switched_at: string;
  from_scene: string | null;
  to_scene: string;
  trigger: SwitchTrigger;
  operator_name: string | null;
  latency_ms: number | null;
}

export interface Database {
  public: {
    Tables: {
      obs_settings:   { Row: ObsSettings;    Insert: Partial<ObsSettings>;    Update: Partial<ObsSettings>;    };
      meet_settings:  { Row: MeetSettings;   Insert: Partial<MeetSettings>;   Update: Partial<MeetSettings>;   };
      camera_configs: { Row: CameraConfig;   Insert: Partial<CameraConfig>;   Update: Partial<CameraConfig>;   };
      mic_channels:   { Row: MicChannel;     Insert: Partial<MicChannel>;     Update: Partial<MicChannel>;     };
      api_credentials:{ Row: ApiCredential;  Insert: Partial<ApiCredential>;  Update: Partial<ApiCredential>;  };
      events:         { Row: BroadcastEvent; Insert: Partial<BroadcastEvent>; Update: Partial<BroadcastEvent>; };
      switch_logs:    { Row: SwitchLog;      Insert: Partial<SwitchLog>;      Update: Partial<SwitchLog>;      };
    };
  };
}
