"use client";

import { useEffect, useState } from "react";

interface Camera {
  camera_id: string;
  display_name: string;
  // API/DB use null for "not set"; align local type so we don't silently
  // assign null into non-nullable controlled-input props.
  usb_port: string | null;
  vid: string;
  role: string;
  preset_1_name: string;
  preset_2_name: string;
  preset_3_name: string;
  auto_track: boolean;
  notes: string | null;
}

const ROLES = [
  { value: "speaker", label: "Palestrante" },
  { value: "host",    label: "Apresentador" },
  { value: "slides",  label: "Slides / Lousa" },
  { value: "reserve", label: "Reserva" },
];

const BADGE_CLASS: Record<string, string> = {
  speaker: "badge-cam1",
  host:    "badge-cam2",
  slides:  "badge-cam3",
  reserve: "badge-cam4",
};

const DEFAULTS: Camera[] = [
  { camera_id: "CAM1", display_name: "Câmera 1 — Palestrante",  usb_port: "",  vid: "3564", role: "speaker", preset_1_name: "wide",  preset_2_name: "medium", preset_3_name: "close", auto_track: true,  notes: "" },
  { camera_id: "CAM2", display_name: "Câmera 2 — Apresentador", usb_port: "",  vid: "3564", role: "host",    preset_1_name: "wide",  preset_2_name: "medium", preset_3_name: "close", auto_track: true,  notes: "" },
  { camera_id: "CAM3", display_name: "Câmera 3 — Slides",       usb_port: "",  vid: "3564", role: "slides",  preset_1_name: "wide",  preset_2_name: "close",  preset_3_name: "close", auto_track: false, notes: "" },
  { camera_id: "CAM4", display_name: "Câmera 4 — Reserva",      usb_port: "",  vid: "3564", role: "reserve", preset_1_name: "wide",  preset_2_name: "medium", preset_3_name: "close", auto_track: true,  notes: "" },
];

export default function CamerasSettingsPage() {
  const [cameras, setCameras] = useState<Camera[]>(DEFAULTS);
  const [selected, setSelected] = useState<string>("CAM1");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate from the API on mount so previously saved camera config is shown.
  useEffect(() => {
    let alive = true;
    fetch("/api/settings/cameras")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Camera[] | null) => {
        if (!alive) return;
        if (Array.isArray(data) && data.length > 0) setCameras(data);
      })
      .catch(() => { /* offline: keep DEFAULTS */ });
    return () => { alive = false; };
  }, []);

  const cam = cameras.find((c) => c.camera_id === selected)!;

  const update = <K extends keyof Camera>(key: K, value: Camera[K]) => {
    setCameras((prev) =>
      prev.map((c) => c.camera_id === selected ? { ...c, [key]: value } : c),
    );
    setSaved(false);
    setError(null);
  };

  // Plain async handler — `startTransition(async ...)` resolves isPending too
  // early in React 18, which would re-enable the button mid-flight.
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // The API's Zod schema uses `z.string().transform(v => v || null)`,
      // and `.transform()` runs AFTER validation — so a literal null in the
      // payload makes z.string() fail before the transform can normalize it.
      // Round-tripping through Supabase persists nulls, so without this
      // normalization the second PUT would always 400.
      const payload = cameras.map((c) => ({
        ...c,
        usb_port: c.usb_port ?? "",
        notes:    c.notes    ?? "",
      }));
      const res = await fetch("/api/settings/cameras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null) as
        | { mode?: string; saved?: boolean; error?: unknown }
        | null;
      if (!res.ok) {
        const msg =
          (typeof body?.error === "string" ? body.error : null) ??
          `HTTP ${res.status}`;
        throw new Error(msg);
      }
      setSaved(true);
      if (body?.mode === "local") {
        // Supabase wasn't configured. Don't pretend the change is durable.
        setError("Salvo localmente — Supabase indisponível, dados não persistidos no BD.");
      }
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
        <div className="top-bar-title">🎥 Câmeras</div>
        <div className="top-bar-actions">
          {saved && !error && <span className="badge badge-ok">Salvo</span>}
          {error && (
            <span className="badge badge-danger" role="alert" title={error}>
              {error.length > 60 ? `${error.slice(0, 60)}…` : error}
            </span>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando…" : "Salvar todas"}
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "var(--sp-4)" }}>

          {/* Camera selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {cameras.map((c) => (
              <button
                key={c.camera_id}
                className={`btn${selected === c.camera_id ? " btn-active" : ""}`}
                style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}
                onClick={() => setSelected(c.camera_id)}
              >
                <span className={`badge ${BADGE_CLASS[c.role]}`}>{c.camera_id}</span>
                <span style={{ fontSize: 12 }}>{c.display_name.split("—")[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Camera editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <span className={`badge ${BADGE_CLASS[cam.role]}`}>{cam.camera_id}</span>
                    {cam.display_name}
                  </div>
                  <div className="card-subtitle">OBSBOT Tiny 2 / Tiny 2 Lite · VID {cam.vid}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Nome de exibição</label>
                    <input type="text" className="input" value={cam.display_name}
                      onChange={(e) => update("display_name", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">Função</label>
                    <select className="input" value={cam.role}
                      onChange={(e) => update("role", e.target.value)}>
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Porta USB</label>
                    <input type="text" className="input" value={cam.usb_port ?? ""}
                      placeholder="ex: USB-A traseira esquerda"
                      onChange={(e) => update("usb_port", e.target.value || null)} />
                    <span className="form-hint">Identificação física para facilitar reconexão</span>
                  </div>
                  <div className="form-group">
                    <label className="label">VID USB (hex)</label>
                    <input type="text" className="input" value={cam.vid}
                      placeholder="3564"
                      onChange={(e) => update("vid", e.target.value)} />
                    <span className="form-hint">OBSBOT Tiny 2: 3564 (Remo Tech)</span>
                  </div>
                </div>

                <div className="card-header" style={{ marginTop: "var(--sp-2)" }}>
                  <div className="card-title text-sm">🎯 Presets PTZ</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-3)" }}>
                  {(["preset_1_name", "preset_2_name", "preset_3_name"] as const).map((key, i) => (
                    <div className="form-group" key={key}>
                      <label className="label">Preset {i + 1}</label>
                      <input type="text" className="input" value={cam[key]}
                        placeholder={["wide", "medium", "close"][i]}
                        onChange={(e) => update(key, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">Auto-Track (rastreamento automático)</div>
                    <div className="toggle-desc">A câmera segue o sujeito usando IA interna do OBSBOT.</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={cam.auto_track}
                      onChange={(e) => update("auto_track", e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="form-group">
                  <label className="label">Notas</label>
                  <textarea className="input" rows={2} value={cam.notes ?? ""}
                    placeholder="Posicionamento, ângulo preferido, calibrações especiais…"
                    onChange={(e) => update("notes", e.target.value || null)} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title"><span className="card-title-icon">📋</span>Checklist de validação</div>
              </div>
              {[
                `Câmera aparece em Gerenciador de Dispositivos → Câmeras como "OBSBOT Tiny 2"`,
                "Negociou SuperSpeed (5 Gbps) — verificar em USBTreeView",
                "Resolução 1080p30 MJPEG disponível no OBS",
                "Preset 1/2/3 salvos via OBSBOT OBS Plugin",
                `Auto-Track: ${cam.auto_track ? "habilitado" : "desabilitado"} conforme configurado acima`,
                "OBSBOT Center NÃO instalado nesta máquina",
              ].map((item, i) => (
                <label key={i} className="toggle-row" style={{ cursor: "pointer" }}>
                  <div className="toggle-info">
                    <div className="toggle-label" style={{ fontWeight: 400, fontSize: 13 }}>{item}</div>
                  </div>
                  <input type="checkbox" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
