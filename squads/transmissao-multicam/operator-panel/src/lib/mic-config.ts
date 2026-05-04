// Channel configuration consumed by the panel. In production this is read
// from data/mic-mapping.yaml at build time (or via API). This file gives a
// typed default so the UI works out of the box during F5 development.

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

export const MIC_CHANNELS: MicChannel[] = [
  {
    id: 1,
    obsSourceName: "MIC_1",
    micLabel: "Lapela palestrante principal",
    role: "principal_speaker",
    cameraTarget: "CAM1",
    faderDb: 0.0,
    muteDefault: false,
    vadThresholdDbfs: -32,
  },
  {
    id: 2,
    obsSourceName: "MIC_2",
    micLabel: "Mesa de plateia",
    role: "audience",
    cameraTarget: "CAM2",
    faderDb: -3.0,
    muteDefault: true,
    vadThresholdDbfs: -28,
  },
  {
    id: 3,
    obsSourceName: "MIC_3",
    micLabel: "Lapela co-apresentador",
    role: "co_speaker",
    cameraTarget: "CAM3",
    faderDb: 0.0,
    muteDefault: false,
    vadThresholdDbfs: -32,
  },
  {
    id: 4,
    obsSourceName: "MIC_4",
    micLabel: "Ambiente",
    role: "ambient",
    cameraTarget: null,
    faderDb: -12.0,
    muteDefault: false,
    vadThresholdDbfs: -20,
  },
];
