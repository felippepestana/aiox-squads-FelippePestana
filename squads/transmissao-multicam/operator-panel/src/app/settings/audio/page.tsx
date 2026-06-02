import { loadOperationConfig } from "@/lib/mic-loader";
import { AudioSettingsClient } from "./AudioSettingsClient";

// Server component: load YAML config and pass to client
export default function AudioSettingsPage() {
  let initialChannels: Channel[] = [];
  try {
    const op = loadOperationConfig();
    initialChannels = op.channels.map((c, i) => ({
      channel: i + 1,
      label: c.micLabel,
      input_name: c.obsSourceName,
      camera_id: c.cameraTarget ?? "",
      role: c.role,
      threshold_db: c.vadThresholdDbfs,
    }));
  } catch {
    initialChannels = [
      { channel: 1, label: "Mic Palestrante",  input_name: "Mic Palestrante",  camera_id: "CAM1", role: "speaker", threshold_db: -40 },
      { channel: 2, label: "Mic Apresentador", input_name: "Mic Apresentador", camera_id: "CAM2", role: "host",    threshold_db: -40 },
      { channel: 3, label: "Mic Aux",          input_name: "Mic Aux",          camera_id: "",     role: "aux",     threshold_db: -35 },
    ];
  }

  return <AudioSettingsClient initialChannels={initialChannels} />;
}

// Re-export type for server component usage
export type Channel = {
  channel: number;
  label: string;
  input_name: string;
  camera_id: string;
  role: string;
  threshold_db: number;
};
