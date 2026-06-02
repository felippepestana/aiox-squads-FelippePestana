"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { BroadcastEvent, EventStatus } from "@/lib/supabase/types";

const schema = z.object({
  title:                  z.string().min(1, "Título obrigatório"),
  session_topic:          z.string().default(""),
  scheduled_at:           z.string().default(""),
  duration_min:           z.coerce.number().int().min(1).default(60),
  standby_countdown_min:  z.coerce.number().int().min(1).max(60).default(5),
  meet_room_url:          z.string().url("URL inválida").or(z.literal("")).default(""),
  notes:                  z.string().default(""),
});

type FormData = z.infer<typeof schema>;

const STATUS_BADGE: Record<EventStatus, string> = {
  planned:   "badge-info",
  live:      "badge-ok",
  completed: "badge-muted",
  cancelled: "badge-danger",
};

const STATUS_LABEL: Record<EventStatus, string> = {
  planned:   "Planejado",
  live:      "⬤ Ao vivo",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const EMPTY_FORM: FormData = {
  title: "", session_topic: "", scheduled_at: "",
  duration_min: 60, standby_countdown_min: 5, meet_room_url: "", notes: "",
};

export default function EventsPage() {
  const [events, setEvents] = useState<BroadcastEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load events from Supabase or use local state
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    sb.from("events")
      .select("*")
      .order("scheduled_at", { ascending: false })
      .limit(50)
      .then(({ data }) => { if (data) setEvents(data); });

    const channel = sb
      .channel("events_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        sb.from("events").select("*").order("scheduled_at", { ascending: false }).limit(50)
          .then(({ data }) => { if (data) setEvents(data); });
      })
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, []);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: typeof errors = {};
      for (const issue of result.error.issues) errs[issue.path[0] as keyof FormData] = issue.message;
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    try {
      // Status is managed exclusively via the action buttons; never overwrite
      // it on edit (would knock a live broadcast offline mid-stream).
      const basePayload = {
        ...result.data,
        scheduled_at:  result.data.scheduled_at  || null,
        meet_room_url: result.data.meet_room_url || null,
        notes:         result.data.notes         || null,
        session_topic: result.data.session_topic || null,
      };

      const sb = getSupabaseClient();
      if (sb) {
        if (editId) {
          const { data } = await sb.from("events").update(basePayload).eq("id", editId).select().single();
          if (data) setEvents((prev) => prev.map((e) => e.id === editId ? data : e));
        } else {
          const { data } = await sb
            .from("events")
            .insert({ ...basePayload, status: "planned" as EventStatus })
            .select()
            .single();
          if (data) setEvents((prev) => [data, ...prev]);
        }
      } else {
        // Offline: preserve current status when editing, otherwise default to planned
        const currentStatus: EventStatus = editId
          ? events.find((e) => e.id === editId)?.status ?? "planned"
          : "planned";
        const fake: BroadcastEvent = {
          id: editId ?? Date.now().toString(),
          ...basePayload,
          status:     currentStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (editId) setEvents((prev) => prev.map((e) => e.id === editId ? fake : e));
        else setEvents((prev) => [fake, ...prev]);
      }

      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (ev: BroadcastEvent) => {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      session_topic: ev.session_topic ?? "",
      scheduled_at: ev.scheduled_at ? ev.scheduled_at.slice(0, 16) : "",
      duration_min: ev.duration_min ?? 60,
      standby_countdown_min: ev.standby_countdown_min,
      meet_room_url: ev.meet_room_url ?? "",
      notes: ev.notes ?? "",
    });
    setShowForm(true);
  };

  const updateStatus = async (id: string, status: EventStatus) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    const sb = getSupabaseClient();
    if (sb) await sb.from("events").update({ status }).eq("id", id);
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">🎬 Eventos</div>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}>
            + Novo evento
          </button>
        </div>
      </div>

      <div className="page-content">
        {showForm && (
          <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
            <div className="card-header">
              <div className="card-title">
                <span className="card-title-icon">🎬</span>
                {editId ? "Editar evento" : "Novo evento"}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null); }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="label label-required">Título da transmissão</label>
                  <input type="text" className="input" value={form.title}
                    placeholder="Workshop Avançado de TypeScript"
                    onChange={(e) => set("title", e.target.value)} />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="label">Tópico / Subtítulo da sessão</label>
                <input type="text" className="input" value={form.session_topic}
                  placeholder="Módulo 3 — Generics e Utility Types"
                  onChange={(e) => set("session_topic", e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Data e hora de início</label>
                  <input type="datetime-local" className="input" value={form.scheduled_at}
                    onChange={(e) => set("scheduled_at", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Duração prevista (min)</label>
                  <input type="number" className="input" value={form.duration_min}
                    min={1} onChange={(e) => set("duration_min", Number(e.target.value))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Cronômetro STANDBY (min)</label>
                  <input type="number" className="input" value={form.standby_countdown_min}
                    min={1} max={60} onChange={(e) => set("standby_countdown_min", Number(e.target.value))} />
                  <span className="form-hint">Tempo exibido na tela de espera antes do início</span>
                </div>
                <div className="form-group">
                  <label className="label">URL da sala Meet</label>
                  <input type="url" className="input" value={form.meet_room_url}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    onChange={(e) => set("meet_room_url", e.target.value)} />
                  {errors.meet_room_url && <span className="form-error">{errors.meet_room_url}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="label">Notas</label>
                <textarea className="input" rows={3} value={form.notes}
                  placeholder="Informações de backstage, contatos, agenda interna…"
                  onChange={(e) => set("notes", e.target.value)} />
              </div>

              <div className="row">
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Salvando…" : editId ? "Atualizar" : "Criar evento"}
                </button>
                <button className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {events.length === 0 && !showForm ? (
          <div className="empty-state" style={{ marginTop: "var(--sp-8)" }}>
            <div className="empty-state-icon">🎬</div>
            <div className="empty-state-title">Sem eventos cadastrados</div>
            <div className="empty-state-desc">Crie o primeiro evento para começar a rastrear transmissões e logs de switch.</div>
            <button className="btn btn-primary" style={{ marginTop: "var(--sp-4)" }}
              onClick={() => setShowForm(true)}>
              + Criar primeiro evento
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {events.map((ev) => (
              <div className="card" key={ev.id}>
                <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-2)" }}>
                      <span className={`badge ${STATUS_BADGE[ev.status]}`}>{STATUS_LABEL[ev.status]}</span>
                      <span className="font-semi" style={{ fontSize: 15 }}>{ev.title}</span>
                    </div>
                    {ev.session_topic && (
                      <div className="text-sm text-muted" style={{ marginBottom: "var(--sp-2)" }}>{ev.session_topic}</div>
                    )}
                    <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap" }}>
                      {ev.scheduled_at && (
                        <span className="text-xs text-muted">
                          📅 {new Date(ev.scheduled_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      )}
                      <span className="text-xs text-muted">⏱ {ev.duration_min} min</span>
                      <span className="text-xs text-muted">⏳ Standby {ev.standby_countdown_min} min</span>
                      {ev.meet_room_url && (
                        <a href={ev.meet_room_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs" style={{ color: "var(--accent)" }}>
                          📹 Sala Meet ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="row" style={{ flexShrink: 0 }}>
                    {ev.status === "planned" && (
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(ev.id, "live")}>
                        ▶ Iniciar
                      </button>
                    )}
                    {ev.status === "live" && (
                      <button className="btn btn-sm" onClick={() => updateStatus(ev.id, "completed")}>
                        ⏹ Encerrar
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(ev)}>✏️</button>
                    {ev.status !== "live" && (
                      <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}
                        onClick={() => updateStatus(ev.id, "cancelled")}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
