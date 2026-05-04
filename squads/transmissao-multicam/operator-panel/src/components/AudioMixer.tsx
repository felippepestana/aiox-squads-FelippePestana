"use client";

import { useEffect, useState } from "react";
import { setInputMute, setInputVolumeDb, subscribeToVolumeMeters } from "@/lib/obs";
import { useOperator } from "@/lib/store";
import type { MicChannel } from "@/lib/mic-config";

interface AudioMixerProps {
  channels: MicChannel[];
}

export function AudioMixer({ channels }: AudioMixerProps) {
  const connected   = useOperator((s) => s.connected);
  const micLevels   = useOperator((s) => s.micLevels);
  const setMicLevel = useOperator((s) => s.setMicLevel);

  const [muted, setMuted] = useState<Record<string, boolean>>(
    Object.fromEntries(channels.map((c) => [c.obsSourceName, c.muteDefault])),
  );
  const [faders, setFaders] = useState<Record<string, number>>(
    Object.fromEntries(channels.map((c) => [c.obsSourceName, c.faderDb])),
  );

  // Resync local mixer state when the channels list changes (e.g. after the
  // operator edits the mic mapping). Preserve existing per-channel state for
  // unchanged sources; seed new sources from their declared defaults.
  useEffect(() => {
    setMuted((prev) =>
      Object.fromEntries(
        channels.map((c) => [c.obsSourceName, prev[c.obsSourceName] ?? c.muteDefault]),
      ),
    );
    setFaders((prev) =>
      Object.fromEntries(
        channels.map((c) => [c.obsSourceName, prev[c.obsSourceName] ?? c.faderDb]),
      ),
    );
  }, [channels]);

  useEffect(() => {
    if (!connected) return;
    const unsubscribe = subscribeToVolumeMeters((meters) => {
      meters.forEach((m) => setMicLevel(m.inputName, m.peakDb));
    });
    return unsubscribe;
  }, [connected, setMicLevel]);

  // All three handlers below apply optimistic updates first and roll the
  // local state back when the OBS write fails, so the UI never displays a
  // value that the actual OBS mixer rejected.

  const onFader = async (input: string, db: number) => {
    const prev = faders[input] ?? 0;
    setFaders((s) => ({ ...s, [input]: db }));
    if (!connected) return;
    try {
      await setInputVolumeDb(input, db);
    } catch (err) {
      setFaders((s) => ({ ...s, [input]: prev }));
      console.error("Fader update failed:", err);
    }
  };

  const onMute = async (input: string) => {
    const prev = muted[input] ?? false;
    const next = !prev;
    setMuted((s) => ({ ...s, [input]: next }));
    if (!connected) return;
    try {
      await setInputMute(input, next);
    } catch (err) {
      setMuted((s) => ({ ...s, [input]: prev }));
      console.error("Mute update failed:", err);
    }
  };

  const muteAll = async () => {
    const prev = muted;
    const next = Object.fromEntries(channels.map((c) => [c.obsSourceName, true]));
    setMuted(next);
    if (!connected) return;
    const results = await Promise.allSettled(
      channels.map((c) => setInputMute(c.obsSourceName, true)),
    );
    // Repair any channels whose mute call was rejected by OBS.
    setMuted((state) => {
      const repaired = { ...state };
      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          const source = channels[idx].obsSourceName;
          repaired[source] = prev[source] ?? false;
          console.error(`MuteAll: failed to mute "${source}":`, result.reason);
        }
      });
      return repaired;
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span className="card-title-icon">🎙️</span>Mixer de áudio</div>
        <button className="btn btn-danger btn-sm" onClick={muteAll} disabled={!connected}>
          🔇 MUTE TODOS
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${channels.length}, 1fr)`, gap: "var(--sp-3)" }}>
        {channels.map((ch) => {
          const level   = micLevels[ch.obsSourceName] ?? -60;
          const isMuted = muted[ch.obsSourceName];
          const pct     = Math.max(0, Math.min(100, ((level + 60) / 60) * 100));
          const threshPct = Math.max(0, Math.min(100, ((ch.vadThresholdDbfs + 60) / 60) * 100));
          const fillClass = level >= -3 ? "vu-fill-hot" : level >= -6 ? "vu-fill-warn" : "vu-fill-ok";

          return (
            <div key={ch.obsSourceName} style={{
              background: "var(--bg-raised)",
              padding: "var(--sp-4)",
              borderRadius: "var(--r-md)",
              border: `1px solid ${isMuted ? "var(--danger)" : "var(--border-default)"}`,
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-3)",
              transition: "border-color var(--t-fast)",
            }}>
              <div>
                <div className="font-semi text-sm">{ch.obsSourceName}</div>
                <div className="text-xs text-muted">
                  {ch.micLabel}
                  {ch.cameraTarget && <span style={{ color: "var(--accent)" }}> → {ch.cameraTarget}</span>}
                </div>
              </div>

              {/* VU meter */}
              <div className="vu-track"
                title={`Peak: ${level.toFixed(1)} dB · VAD threshold: ${ch.vadThresholdDbfs} dBFS`}>
                <div className={`vu-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                {/* VAD threshold marker */}
                <div style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: `${threshPct}%`, width: 2,
                  background: "var(--accent)", opacity: 0.6,
                }} />
              </div>

              <div className="text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                {level > -59 ? `${level.toFixed(1)} dB` : "— dB"}
              </div>

              {/* Fader */}
              <div>
                <label className="label" style={{ marginBottom: 4 }}>
                  Fader: {(faders[ch.obsSourceName] ?? ch.faderDb).toFixed(1)} dB
                </label>
                <input type="range" min={-60} max={6} step={0.5}
                  value={faders[ch.obsSourceName] ?? ch.faderDb}
                  disabled={!connected}
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                  onChange={(e) => void onFader(ch.obsSourceName, Number(e.target.value))} />
              </div>

              <button
                onClick={() => onMute(ch.obsSourceName)}
                disabled={!connected}
                className={`btn btn-sm${isMuted ? " btn-danger" : ""}`}
                style={{ width: "100%" }}>
                {isMuted ? "🔇 MUDO" : "🔊 ATIVO"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
