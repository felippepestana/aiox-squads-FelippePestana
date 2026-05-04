"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PIP_FALLBACK,
  PipCorner,
  PipSize,
  SCENES,
  SceneName,
} from "./scenes";

export type Mode = "manual" | "auto";

interface OperatorState {
  // Connection
  connected: boolean;
  setConnected: (v: boolean) => void;

  // Active scene
  activeScene: SceneName;
  setActiveScene: (s: SceneName) => void;

  // PiP
  pipCamera: SceneName;
  pipCorner: PipCorner;
  pipSize: PipSize;
  setPipCamera: (c: SceneName) => void;
  setPipCorner: (c: PipCorner) => void;
  setPipSize: (s: PipSize) => void;

  // Mode (auto/manual)
  mode: Mode;
  setMode: (m: Mode) => void;

  // Mixer state per channel
  micLevels: Record<string, number>; // inputName -> peakDb
  setMicLevel: (input: string, db: number) => void;
}

export const useOperator = create<OperatorState>()(
  persist(
    (set) => ({
      connected: false,
      setConnected: (v) => set({ connected: v }),

      activeScene: SCENES.STANDBY,
      setActiveScene: (s) => set({ activeScene: s }),

      pipCamera: SCENES.CAM1,
      pipCorner: PIP_FALLBACK.defaultCorner,
      pipSize: PIP_FALLBACK.defaultSizePercent,
      setPipCamera: (c) => set({ pipCamera: c }),
      setPipCorner: (c) => set({ pipCorner: c }),
      setPipSize: (s) => set({ pipSize: s }),

      mode: "manual",
      setMode: (m) => set({ mode: m }),

      micLevels: {},
      setMicLevel: (input, db) =>
        set((state) => ({
          micLevels: { ...state.micLevels, [input]: db },
        })),
    }),
    {
      name: "tx-multicam-operator",
      partialize: (state) => ({
        pipCamera: state.pipCamera,
        pipCorner: state.pipCorner,
        pipSize: state.pipSize,
        mode: state.mode,
      }),
    },
  ),
);
