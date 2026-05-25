"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { connect, disconnect } from "@/lib/obs";
import { useOperator } from "@/lib/store";

const schema = z.object({
  host:     z.string().min(1, "Host obrigatório"),
  port:     z.coerce.number().int().min(1024).max(65535),
  password: z.string(),
  use_tls:  z.boolean(),
});

type FormData = z.infer<typeof schema>;

const STORAGE_KEY = "obs-connection-settings";

function loadSaved(): Partial<FormData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export default function ObsSettingsPage() {
  const { connected, setConnected } = useOperator();
  const [form, setForm] = useState<FormData>({
    host: "localhost",
    port: 4455,
    password: "",
    use_tls: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "ok" | "fail">("idle");
  const [testMsg, setTestMsg] = useState("");

  // Load saved settings from sessionStorage on mount
  useEffect(() => {
    const saved = loadSaved();
    setForm((prev) => ({ ...prev, ...saved }));
  }, []);

  const handleChange = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      setTestResult("idle");
    },
    [],
  );

  const validate = (): boolean => {
    const result = schema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const errs: typeof errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormData;
      errs[key] = issue.message;
    }
    setErrors(errs);
    return false;
  };

  const handleTest = async () => {
    if (!validate()) return;
    setTesting(true);
    setTestResult("idle");
    try {
      const proto = form.use_tls ? "wss" : "ws";
      const url = `${proto}://${form.host}:${form.port}`;

      if (connected) await disconnect();
      await connect({ url, password: form.password });
      setConnected(true);

      // Persist non-sensitive fields in sessionStorage for reuse
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ host: form.host, port: form.port, use_tls: form.use_tls }),
      );

      setTestResult("ok");
      setTestMsg("Conectado com sucesso!");
    } catch (err) {
      setConnected(false);
      setTestResult("fail");
      setTestMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setConnected(false);
    setTestResult("idle");
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">⚙️ OBS WebSocket</div>
      </div>

      <div className="page-content" style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <span className="card-title-icon">⚙️</span>
                Conexão OBS WebSocket v5
              </div>
              <div className="card-subtitle">
                Credenciais do OBS → Ferramentas → WebSocket Server Settings
              </div>
            </div>
            {connected ? (
              <span className="badge badge-ok">● Conectado</span>
            ) : (
              <span className="badge badge-muted">● Desconectado</span>
            )}
          </div>

          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="form-row">
              <div className="form-group">
                <label className="label label-required">Host</label>
                <input
                  type="text"
                  className="input"
                  value={form.host}
                  placeholder="localhost"
                  onChange={(e) => handleChange("host", e.target.value)}
                />
                {errors.host && <span className="form-error">{errors.host}</span>}
              </div>

              <div className="form-group">
                <label className="label label-required">Porta</label>
                <input
                  type="number"
                  className="input"
                  value={form.port}
                  min={1024}
                  max={65535}
                  onChange={(e) => handleChange("port", Number(e.target.value))}
                />
                {errors.port && <span className="form-error">{errors.port}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="label label-required">Senha</label>
              <input
                type="password"
                className="input"
                value={form.password}
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <span className="form-hint">Armazenada apenas na sessão do navegador (sessionStorage).</span>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Usar TLS (wss://)</div>
                <div className="toggle-desc">Necessário quando o OBS está em servidor remoto com certificado.</div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={form.use_tls}
                  onChange={(e) => handleChange("use_tls", e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="row" style={{ marginTop: "var(--sp-2)" }}>
              {connected ? (
                <>
                  <button className="btn btn-danger" onClick={handleDisconnect}>
                    Desconectar
                  </button>
                  <button className="btn btn-primary" onClick={handleTest} disabled={testing}>
                    {testing ? "Reconectando…" : "Reconectar"}
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleTest} disabled={testing}>
                  {testing ? "Conectando…" : "Testar e Conectar"}
                </button>
              )}
            </div>

            {testResult !== "idle" && (
              <div className={`alert alert-${testResult === "ok" ? "ok" : "danger"}`}>
                <span className="alert-icon">{testResult === "ok" ? "✅" : "❌"}</span>
                <div className="alert-body">{testMsg}</div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title">🔒 Segurança</div>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <span className="alert-icon">ℹ️</span>
              <div className="alert-body">
                <div className="alert-title">A senha nunca é persistida no repositório</div>
                Ela fica apenas em memória durante a sessão. Configure as variáveis de ambiente
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginLeft: 4 }}>
                  OBS_WS_HOST, OBS_WS_PORT
                </code>
                {" "}no <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>.env.local</code>
                {" "}para pré-preencher campos não-sensíveis.
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-4)" }}>
          <div className="card-header">
            <div className="card-title">📋 Configuração OBS recomendada</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", padding: "var(--sp-2) 0" }}>
            {[
              ["Canvas", "1920 × 1080 px"],
              ["Output", "1920 × 1080 px, 30 fps"],
              ["Encoder", "NVIDIA NVENC H.264, CBR, 6000 kbps"],
              ["WebSocket", "Porta 4455, senha forte"],
              ["Studio Mode", "Habilitado (preview/program separados)"],
            ].map(([k, v]) => (
              <div key={k} className="row" style={{ justifyContent: "space-between", padding: "var(--sp-2) 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="text-muted text-sm">{k}</span>
                <span className="font-mono text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
