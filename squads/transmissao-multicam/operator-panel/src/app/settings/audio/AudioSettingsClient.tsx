"use client";

import { useState } from "react";
import type { Channel } from "./page";

const CAMERA_OPTIONS = [
  { value: "",     label: "— Nenhuma —" },
  { value: "CAM1", label: "CAM1 — Palestrante" },
  { value: "CAM2", label: "CAM2 — Apresentador" },
  { value: "CAM3", label: "CAM3 — Slides" },
  { value: "CAM4", label: "CAM4 — Reserva" },
];

const ROLE_OPTIONS = [
  { value: "speaker", label: "Palestrante" },
  { value: "host",    label: "Apresentador" },
  { value: "aux",     label: "Auxiliar" },
];

export function AudioSettingsClient({ initialChannels }: { initialChannels: Channel[] }) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateChannel = <K extends keyof Channel>(index: number, key: K, value: Channel[K]) => {
    setChannels((prev) =>
      prev.map((ch, i) => i === index ? { ...ch, [key]: value } : ch),
    );
    setSaved(false);
    setError(null);
  };

  const addChannel = () => {
    setChannels((prev) => [
      ...prev,
      { channel: prev.length + 1, label: `Canal ${prev.length + 1}`, input_name: "", camera_id: "", role: "aux", threshold_db: -40 },
    ]);
  };

  const removeChannel = (index: number) => {
    setChannels((prev) =>
      prev.filter((_, i) => i !== index).map((ch, i) => ({ ...ch, channel: i + 1 })),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/audio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(channels),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json().catch(() => null);
      // The API returns { saved: true, ... } on success.
      setSaved(body?.saved === true);
    } catch (err) {
      setSaved(false);
      setError(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">🎙️ Áudio / Microfones</div>
        <div className="top-bar-actions">
          {saved && <span className="badge badge-ok">Salvo</span>}
          {error && <span className="badge badge-danger" title={error}>Erro</span>}
          <button className="btn" onClick={addChannel}>+ Canal</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: 980 }}>
        <div className="alert alert-info" style={{ marginBottom: "var(--sp-4)" }}>
          <span className="alert-icon">ℹ️</span>
          <div className="alert-body">
            <div className="alert-title">Single source of truth</div>
            Este mapeamento é compartilhado entre o painel do operador e o engine de auto-switch (F6).
            Alterações aqui atualizam o Supabase; o engine recarrega na próxima inicialização.
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">🎙️</span>Mapeamento Canal → Câmera</div>
            <span className="text-sm text-muted">{channels.length} canais</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome do canal</th>
                  <th>Input OBS (nome exato)</th>
                  <th>Câmera vinculada</th>
                  <th>Função</th>
                  <th>Limiar VAD (dB)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {channels.map((ch, i) => (
                  <tr key={i}>
                    <td>
                      <span className="badge badge-muted font-mono">{ch.channel}</span>
                    </td>
                    <td>
                      <input type="text" className="input" value={ch.label}
                        style={{ width: 160 }}
                        onChange={(e) => updateChannel(i, "label", e.target.value)} />
                    </td>
                    <td>
                      <input type="text" className="input" value={ch.input_name}
                        style={{ width: 190 }}
                        placeholder="Nome exato no OBS"
                        onChange={(e) => updateChannel(i, "input_name", e.target.value)} />
                    </td>
                    <td>
                      <select className="input" value={ch.camera_id} style={{ width: 190 }}
                        onChange={(e) => updateChannel(i, "camera_id", e.target.value)}>
                        {CAMERA_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="input" value={ch.role} style={{ width: 130 }}
                        onChange={(e) => updateChannel(i, "role", e.target.value)}>
                        {ROLE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" className="input font-mono" value={ch.threshold_db}
                        style={{ width: 80 }} min={-80} max={0}
                        onChange={(e) => updateChannel(i, "threshold_db", Number(e.target.value))} />
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeChannel(i)}
                        style={{ color: "var(--danger)" }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">📋</span>Referência de parâmetros VAD</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {[
              ["Limiar de ativação",   "−40 dB", "Nível acima do qual o canal considera que há fala"],
              ["Cooldown de switch",   "1.5 s",  "Mínimo entre trocas automáticas consecutivas"],
              ["Fallback por silêncio","3 s",     "Tempo sem fala antes de ativar detecção de movimento"],
              ["VID OBSBOT Tiny 2",    "3564",   "Hexadecimal; used em validate_cameras.sh"],
            ].map(([label, value, desc]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr 100px 2fr", gap: "var(--sp-4)", alignItems: "center", padding: "var(--sp-2) 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="font-semi text-sm">{label}</span>
                <span className="badge badge-info font-mono">{value}</span>
                <span className="text-sm text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
