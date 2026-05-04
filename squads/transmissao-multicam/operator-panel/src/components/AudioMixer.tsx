"use client";

import { useEffect, useState } from "react";
import {
  setInputMute,
  setInputVolumeDb,
  subscribeToVolumeMeters,
} from "@/lib/obs";
import { useOperator } from "@/lib/store";
import type { MicChannel } from "@/lib/mic-config";

interface AudioMixerProps {
  channels: MicChannel[];
}

export function AudioMixer({ channels }: AudioMixerProps) {
  const MIC_CHANNELS = channels;
  const connected = useOperator((s) => s.connected);
  const micLevels = useOperator((s) => s.micLevels);
  const setMicLevel = useOperator((s) => s.setMicLevel);

  const [muted, setMuted] = useState<Record<string, boolean>>(
    Object.fromEntries(
      MIC_CHANNELS.map((c) => [c.obsSourceName, c.muteDefault]),
    ),
  );
  const [faders, setFaders] = useState<Record<string, number>>(
    Object.fromEntries(MIC_CHANNELS.map((c) => [c.obsSourceName, c.faderDb])),
  );

  useEffect(() => {
    if (!connected) return;
    const unsubscribe = subscribeToVolumeMeters((meters) => {
      meters.forEach((m) => setMicLevel(m.inputName, m.peakDb));
    });
    return unsubscribe;
  }, [connected, setMicLevel]);

  const onFader = async (input: string, db: number) => {
    setFaders((s) => ({ ...s, [input]: db }));
    if (connected) {
      try {
        await setInputVolumeDb(input, db);
      } catch (err) {
        console.error("Fader update failed:", err);
      }
    }
  };

  const onMute = async (input: string) => {
    const next = !muted[input];
    setMuted((s) => ({ ...s, [input]: next }));
    if (connected) {
      try {
        await setInputMute(input, next);
      } catch (err) {
        console.error("Mute update failed:", err);
      }
    }
  };

  const muteAll = async () => {
    const next = Object.fromEntries(
      MIC_CHANNELS.map((c) => [c.obsSourceName, true]),
    );
    setMuted(next);

    if (!connected) {
      return;
    }

    // Use allSettled so that a single failed mute does not cancel the rest
    // and so we never raise an unhandled promise rejection.
    const results = await Promise.allSettled(
      MIC_CHANNELS.map((c) => setInputMute(c.obsSourceName, true)),
    );
    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        const ch = MIC_CHANNELS[idx];
        console.error(
          `MuteAll: failed to mute "${ch.obsSourceName}":`,
          result.reason,
        );
      }
    });
  };

  return (
    <div className="panel col-12">
      <h2>
        Mixer de áudio
        <button
          onClick={muteAll}
          disabled={!connected}
          className="danger"
          style={{ marginLeft: 12, fontSize: 11, padding: "4px 8px" }}
        >
          MUTE TODOS
        </button>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MIC_CHANNELS.length}, 1fr)`,
          gap: 12,
        }}
      >
        {MIC_CHANNELS.map((ch) => {
          const level = micLevels[ch.obsSourceName] ?? -60;
          const isMuted = muted[ch.obsSourceName];
          return (
            <div
              key={ch.obsSourceName}
              style={{
                background: "var(--panel-2)",
                padding: 12,
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ marginBottom: 6 }}>
                <strong>{ch.obsSourceName}</strong>
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                {ch.micLabel}
                {ch.cameraTarget && (
                  <span> → {ch.cameraTarget}</span>
                )}
              </div>

              <VuMeter level={level} threshold={ch.vadThresholdDbfs} />

              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  Fader: {faders[ch.obsSourceName].toFixed(1)} dB
                </label>
                <input
                  type="range"
                  min={-60}
                  max={6}
                  step={0.5}
                  value={faders[ch.obsSourceName]}
                  onChange={(e) =>
                    void onFader(ch.obsSourceName, Number(e.target.value))
                  }
                  disabled={!connected}
                  style={{ width: "100%" }}
                />
              </div>

              <button
                onClick={() => onMute(ch.obsSourceName)}
                disabled={!connected}
                className={isMuted ? "danger" : ""}
                style={{ width: "100%", marginTop: 8 }}
              >
                {isMuted ? "🔇 MUDO" : "🔊 ATIVO"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VuMeter({
  level,
  threshold,
}: {
  level: number;
  threshold: number;
}) {
  // -60..0 dB → 0..100 %
  const pct = Math.max(0, Math.min(100, ((level + 60) / 60) * 100));
  const thresholdPct = Math.max(0, Math.min(100, ((threshold + 60) / 60) * 100));
  const color =
    level >= -3 ? "var(--danger)" : level >= -6 ? "var(--warn)" : "var(--ok)";

  return (
    <div
      style={{
        position: "relative",
        height: 14,
        background: "#0b0e13",
        border: "1px solid var(--border)",
        borderRadius: 3,
        overflow: "hidden",
      }}
      title={`Peak: ${level.toFixed(1)} dB · Threshold VAD: ${threshold.toFixed(0)} dB`}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          transition: "width 80ms linear",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${thresholdPct}%`,
          width: 2,
          background: "var(--accent)",
          opacity: 0.7,
        }}
        title={`Threshold VAD: ${threshold} dBFS`}
      />
    </div>
  );
}
