"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

const schema = z.object({
  account_email:          z.string().email("E-mail inválido").or(z.literal("")),
  default_room_url:       z.string().url("URL inválida").or(z.literal("")),
  auto_record:            z.boolean(),
  studio_effects_disabled:z.boolean(),
  live_streaming_enabled: z.boolean(),
  workspace_admin_email:  z.string().email("E-mail inválido").or(z.literal("")),
  max_participants:       z.coerce.number().int().min(1).max(10000).default(300),
  notes:                  z.string().default(""),
});

type FormData = z.infer<typeof schema>;

const DEFAULTS: FormData = {
  account_email: "",
  default_room_url: "",
  auto_record: true,
  studio_effects_disabled: true,
  live_streaming_enabled: false,
  workspace_admin_email: "",
  max_participants: 300,
  notes: "",
};

export default function MeetSettingsPage() {
  const [form, setForm] = useState<FormData>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate from the API on mount
  useEffect(() => {
    let alive = true;
    fetch("/api/settings/meet")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setForm((prev) => ({
          ...prev,
          account_email:           data.account_email           ?? prev.account_email,
          default_room_url:        data.default_room_url        ?? prev.default_room_url,
          auto_record:             data.auto_record             ?? prev.auto_record,
          studio_effects_disabled: data.studio_effects_disabled ?? prev.studio_effects_disabled,
          live_streaming_enabled:  data.live_streaming_enabled  ?? prev.live_streaming_enabled,
          workspace_admin_email:   data.workspace_admin_email   ?? prev.workspace_admin_email,
          max_participants:        data.max_participants        ?? prev.max_participants,
          notes:                   data.notes                   ?? prev.notes,
        }));
      })
      .catch(() => { /* offline */ });
    return () => { alive = false; };
  }, []);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSaved(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: typeof errors = {};
      for (const issue of result.error.issues) {
        errs[issue.path[0] as keyof FormData] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/settings/meet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaved(true);
    } catch (err) {
      setSaved(false);
      setSaveError(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">📹 Google Meet</div>
        <div className="top-bar-actions">
          {saveError && <span className="badge badge-danger" title={saveError}>Erro</span>}
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: 700 }}>
        {saved && (
          <div className="alert alert-ok" style={{ marginBottom: "var(--sp-4)" }}>
            <span className="alert-icon">✅</span>
            <div className="alert-body">Configurações salvas.</div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><span className="card-title-icon">📹</span>Conta de Transmissão</div>
              <div className="card-subtitle">Conta Google Workspace dedicada para transmissões</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="form-group">
              <label className="label">E-mail da conta de transmissão</label>
              <input type="email" className="input" value={form.account_email}
                placeholder="transmissao@seudominio.com"
                onChange={(e) => set("account_email", e.target.value)} />
              {errors.account_email && <span className="form-error">{errors.account_email}</span>}
            </div>

            <div className="form-group">
              <label className="label">URL padrão da sala Meet</label>
              <input type="url" className="input" value={form.default_room_url}
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                onChange={(e) => set("default_room_url", e.target.value)} />
              {errors.default_room_url && <span className="form-error">{errors.default_room_url}</span>}
            </div>

            <div className="form-group">
              <label className="label">E-mail do Admin Workspace</label>
              <input type="email" className="input" value={form.workspace_admin_email}
                placeholder="admin@seudominio.com"
                onChange={(e) => set("workspace_admin_email", e.target.value)} />
              <span className="form-hint">Necessário para habilitar live streaming via Admin Console</span>
            </div>

            <div className="form-group">
              <label className="label">Máximo de participantes</label>
              <input type="number" className="input" value={form.max_participants}
                min={1} max={10000}
                onChange={(e) => set("max_participants", Number(e.target.value))} />
              <span className="form-hint">Enterprise Plus suporta até 1.000 participantes em vídeo</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">🎛️</span>Comportamento da Sala</div>
          </div>

          <div>
            {([
              ["auto_record", "Gravação automática", "Inicia a gravação ao entrar na sala. Arquivo salvo no Google Drive."],
              ["studio_effects_disabled", "Desabilitar Studio (Look/Lighting/Sound)", "Evita processamento duplicado — a câmera virtual já entrega vídeo tratado pelo OBS."],
              ["live_streaming_enabled", "Habilitar streaming simultâneo (YouTube / etc)", "Requer configuração no Admin Console do Workspace."],
            ] as [keyof FormData, string, string][]).map(([key, label, desc]) => (
              <div className="toggle-row" key={key}>
                <div className="toggle-info">
                  <div className="toggle-label">{label}</div>
                  <div className="toggle-desc">{desc}</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={!!form[key]}
                    onChange={(e) => set(key, e.target.checked as FormData[typeof key])} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">📝</span>Notas Operacionais</div>
          </div>
          <div className="form-group">
            <textarea
              className="input"
              rows={4}
              value={form.notes}
              placeholder="Links de backup, contatos de suporte, procedimentos de emergência…"
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">📋</span>Checklist Workspace Enterprise Plus</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {[
              "Admin Console → Apps → Google Meet → Configurações de vídeo → habilitar câmera virtual",
              "Admin Console → Apps → Google Meet → Streaming → ativar live streaming",
              "Admin Console → Apps → Google Meet → Gravação → ativar gravação para a OU de transmissão",
              "Conta de transmissão: Studio Look OFF · Studio Lighting OFF · Studio Sound OFF",
              "Câmera selecionada no Meet: OBS Virtual Camera",
              "Testar sala de 30 participantes antes do evento real",
            ].map((item, i) => (
              <label key={i} style={{ display: "flex", gap: "var(--sp-3)", alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
