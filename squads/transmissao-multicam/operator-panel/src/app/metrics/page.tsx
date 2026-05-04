"use client";

import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { SwitchLog } from "@/lib/supabase/types";

// ─── Types ──────────────────────────────────────────────────
interface MetricPoint {
  t: string;
  value: number;
}

interface SwitchCounts {
  scene: string;
  count: number;
  color: string;
}

const SCENE_COLORS: Record<string, string> = {
  CAM1:         "#4f90ff",
  CAM2:         "#3fb950",
  CAM3:         "#f0a843",
  CAM4:         "#d76bff",
  GRID:         "#58a6ff",
  SLIDES_FULL:  "#8b949e",
  SLIDES_PIP:   "#58a6ff",
  TELA_PIP:     "#8b949e",
  STANDBY:      "#4a5568",
  ENCERRAMENTO: "#4a5568",
};

function usePrometheusMetrics() {
  const [data, setData] = useState<{
    cpu: MetricPoint[];
    drops: MetricPoint[];
    switches: MetricPoint[];
  }>({ cpu: [], drops: [], switches: [] });

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/metrics/prometheus");
        if (!res.ok) return;
        const json = await res.json();
        if (!alive) return;

        const ts = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setData((prev) => {
          const trim = <T,>(arr: T[]) => arr.slice(-60);
          return {
            cpu:      trim([...prev.cpu,      { t: ts, value: json.cpu_pct      ?? 0 }]),
            drops:    trim([...prev.drops,    { t: ts, value: json.drops_pct    ?? 0 }]),
            switches: trim([...prev.switches, { t: ts, value: json.switch_count ?? 0 }]),
          };
        });
      } catch { /* engine offline */ }
    };

    poll();
    const id = setInterval(poll, 5_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return data;
}

function useSwitchLogs() {
  const [logs, setLogs] = useState<SwitchLog[]>([]);

  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    let alive = true;

    // Initial fetch (last 50 switches)
    sb.from("switch_logs")
      .select("*")
      .order("switched_at", { ascending: false })
      .limit(50)
      .then(({ data }) => { if (alive && data) setLogs(data); });

    // Real-time subscription
    const channel = sb
      .channel("switch_logs_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "switch_logs" }, (payload) => {
        if (!alive) return;
        setLogs((prev) => [payload.new as SwitchLog, ...prev].slice(0, 100));
      })
      .subscribe();

    return () => {
      alive = false;
      sb.removeChannel(channel);
    };
  }, []);

  return logs;
}

function SceneDistribution({ logs }: { logs: SwitchLog[] }) {
  const counts: Record<string, number> = {};
  for (const l of logs) {
    counts[l.to_scene] = (counts[l.to_scene] ?? 0) + 1;
  }
  const data: SwitchCounts[] = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([scene, count]) => ({ scene, count, color: SCENE_COLORS[scene] ?? "#8b949e" }));

  if (!data.length) return (
    <div className="empty-state">
      <div className="empty-state-icon">📊</div>
      <div className="empty-state-desc">Sem logs de switch ainda. Inicie uma transmissão.</div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="scene" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
        <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "var(--fg-primary)" }}
        />
        <Bar dataKey="count" name="Trocas" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TriggerChart({ logs }: { logs: SwitchLog[] }) {
  const counts: Record<string, number> = {};
  for (const l of logs) {
    counts[l.trigger] = (counts[l.trigger] ?? 0) + 1;
  }
  const colors: Record<string, string> = {
    audio: "#4f90ff", motion: "#3fb950", manual: "#f0a843",
    operator: "#d76bff", failover: "#f85149", standby: "#8b949e",
  };
  const data = Object.entries(counts).map(([trigger, count]) => ({ trigger, count, color: colors[trigger] ?? "#8b949e" }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
        <YAxis dataKey="trigger" type="category" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} width={70} />
        <Tooltip contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="count" name="Trocas" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const TRIGGER_LABELS: Record<string, string> = {
  audio: "Áudio", motion: "Movimento", manual: "Manual",
  operator: "Operador", failover: "Failover", standby: "Standby",
};

export default function MetricsPage() {
  const prometheus = usePrometheusMetrics();
  const logs = useSwitchLogs();
  const latencySamples = logs.filter((l) => l.latency_ms != null);

  const chartProps = {
    margin: { top: 4, right: 4, left: -10, bottom: 0 },
    style: { fontSize: 11 },
  };
  const tooltipStyle = {
    contentStyle: { background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 },
    labelStyle: { color: "var(--fg-primary)" },
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">📊 Métricas</div>
        <div className="top-bar-actions">
          <span className="text-xs text-muted">Atualização: 5s · Fonte: F6 engine + Supabase</span>
        </div>
      </div>

      <div className="page-content">
        {/* Summary KPIs */}
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          {[
            // Logs is the most recent N entries from Supabase, not a global
            // total — label accordingly so the operator isn't misled.
            { label: "Trocas (recentes)", value: logs.length, unit: "" },
            { label: "CPU OBS",   value: prometheus.cpu.at(-1)?.value?.toFixed(1) ?? "—", unit: "%" },
            { label: "Frame drops", value: prometheus.drops.at(-1)?.value?.toFixed(2) ?? "—", unit: "%" },
            {
              label: "Latência avg",
              // Average only over rows that actually have a latency sample;
              // otherwise null entries skew the average toward 0.
              value: latencySamples.length
                ? (
                    latencySamples.reduce((a, l) => a + (l.latency_ms ?? 0), 0) /
                    latencySamples.length
                  ).toFixed(0)
                : "—",
              unit: " ms",
            },
          ].map(({ label, value, unit }) => (
            <div className="card" key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {value}{unit}
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Time-series charts */}
        <div className="grid grid-2" style={{ marginBottom: "var(--sp-4)" }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><span className="card-title-icon">🖥️</span>CPU OBS (%)</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={prometheus.cpu} {...chartProps}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4f90ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f90ff" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="t" tick={{ fill: "var(--fg-faint)", fontSize: 10 }} interval={9} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--fg-muted)", fontSize: 11 }} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#4f90ff" fill="url(#cpuGrad)" name="CPU" unit="%" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><span className="card-title-icon">⚡</span>Frame Drops OBS (%)</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={prometheus.drops} {...chartProps}>
                <defs>
                  <linearGradient id="dropsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f85149" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f85149" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="t" tick={{ fill: "var(--fg-faint)", fontSize: 10 }} interval={9} />
                <YAxis domain={[0, 2]} tick={{ fill: "var(--fg-muted)", fontSize: 11 }} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#f85149" fill="url(#dropsGrad)" name="Drops" unit="%" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scene distribution + trigger breakdown */}
        <div className="grid grid-2" style={{ marginBottom: "var(--sp-4)" }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><span className="card-title-icon">🎬</span>Distribuição de cenas</div>
              <span className="text-sm text-muted">{logs.length} trocas</span>
            </div>
            <SceneDistribution logs={logs} />
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><span className="card-title-icon">🔀</span>Gatilhos de troca</div>
            </div>
            <TriggerChart logs={logs} />
          </div>
        </div>

        {/* Switch log table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">📋</span>Log de trocas (tempo real)</div>
            <span className="badge badge-info">
              <span className="dot dot-live" style={{ width: 6, height: 6 }} /> Live
            </span>
          </div>
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Sem logs</div>
              <div className="empty-state-desc">O Supabase real-time populará esta tabela assim que o engine F6 estiver rodando.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>De</th>
                    <th>Para</th>
                    <th>Gatilho</th>
                    <th>Latência</th>
                    <th>Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="td-mono text-muted text-sm">
                        {new Date(log.switched_at).toLocaleTimeString("pt-BR")}
                      </td>
                      <td>
                        {log.from_scene ? (
                          <span className="badge" style={{ background: `${SCENE_COLORS[log.from_scene] ?? "#8b949e"}22`, color: SCENE_COLORS[log.from_scene] ?? "var(--fg-muted)" }}>
                            {log.from_scene}
                          </span>
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${SCENE_COLORS[log.to_scene] ?? "#8b949e"}22`, color: SCENE_COLORS[log.to_scene] ?? "var(--fg-muted)" }}>
                          {log.to_scene}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-muted">{TRIGGER_LABELS[log.trigger] ?? log.trigger}</span>
                      </td>
                      <td className="td-mono text-sm">
                        {log.latency_ms != null ? `${log.latency_ms} ms` : "—"}
                      </td>
                      <td className="text-sm text-muted">{log.operator_name ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
