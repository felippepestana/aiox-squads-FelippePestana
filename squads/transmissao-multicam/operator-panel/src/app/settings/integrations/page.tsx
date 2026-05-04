"use client";

import { useState, useTransition } from "react";

interface Credential {
  id: string;
  service_name: string;
  credential_type: string;
  value_hint: string;
  description: string;
  expires_at: string;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  docs_url: string;
  env_vars: string[];
  credential_type: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "supabase",
    name: "Supabase",
    icon: "🗄️",
    description: "Banco de dados PostgreSQL, logs de switch em tempo real e configurações persistentes.",
    docs_url: "https://supabase.com/docs",
    env_vars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    credential_type: "api_key",
  },
  {
    id: "obs_websocket",
    name: "OBS WebSocket v5",
    icon: "📡",
    description: "Controle total do OBS Studio: cenas, fontes, volume, câmera virtual.",
    docs_url: "https://github.com/obsproject/obs-websocket",
    env_vars: ["OBS_WS_HOST", "OBS_WS_PORT", "OBS_WS_PASSWORD"],
    credential_type: "other",
  },
  {
    id: "google_meet",
    name: "Google Meet API",
    icon: "📹",
    description: "Criar e gerenciar salas programaticamente via Google Meet REST API v2.",
    docs_url: "https://developers.google.com/meet",
    env_vars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    credential_type: "oauth_token",
  },
  {
    id: "prometheus",
    name: "Prometheus / Grafana",
    icon: "📊",
    description: "Engine F6 expõe métricas em /metrics (porta 9099). Adicionar como target no Prometheus.",
    docs_url: "https://prometheus.io/docs/prometheus/latest/getting_started/",
    env_vars: ["PROMETHEUS_ENDPOINT", "GRAFANA_API_KEY"],
    credential_type: "api_key",
  },
  {
    id: "webhook",
    name: "Webhooks",
    icon: "🔗",
    description: "Notificações de eventos de switch e status para sistemas externos.",
    docs_url: "",
    env_vars: ["WEBHOOK_URL", "WEBHOOK_SECRET"],
    credential_type: "webhook_secret",
  },
  {
    id: "mcp",
    name: "MCP Server",
    icon: "🤖",
    description: "Model Context Protocol server para integração com agentes IA do squad.",
    docs_url: "https://modelcontextprotocol.io",
    env_vars: ["MCP_SERVER_URL", "MCP_AUTH_TOKEN"],
    credential_type: "api_key",
  },
];

export default function IntegrationsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const handleSaveCredential = (integrationId: string) => {
    if (!newValue) return;
    startTransition(async () => {
      const hint = newValue.slice(-4);
      const cred: Credential = {
        id: `${integrationId}-${Date.now()}`,
        service_name: integrationId,
        credential_type: INTEGRATIONS.find((i) => i.id === integrationId)?.credential_type ?? "other",
        value_hint: hint,
        description: newDesc,
        expires_at: "",
      };
      setCredentials((prev) => [...prev.filter((c) => c.service_name !== integrationId), cred]);
      setShowAddForm(null);
      setNewValue("");
      setNewDesc("");
      setSaved(integrationId);
      setTimeout(() => setSaved(null), 3000);
    });
  };

  const removeCred = (id: string) => setCredentials((prev) => prev.filter((c) => c.id !== id));

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">🔌 Integrações</div>
      </div>

      <div className="page-content">
        <div className="alert alert-info" style={{ marginBottom: "var(--sp-5)" }}>
          <span className="alert-icon">🔒</span>
          <div className="alert-body">
            <div className="alert-title">Segurança de credenciais</div>
            Valores de API keys nunca são armazenados em texto plano. Apenas os últimos 4 caracteres (hint) são salvos no banco.
            Use variáveis de ambiente (<code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>.env.local</code>) para
            valores que o servidor precisa ler. Para produção, use o Supabase Vault.
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: "var(--sp-4)" }}>
          {INTEGRATIONS.map((integ) => {
            const cred = credentials.find((c) => c.service_name === integ.id);
            const isConfigured = !!cred;

            return (
              <div className="card" key={integ.id}>
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      <span className="card-title-icon">{integ.icon}</span>
                      {integ.name}
                    </div>
                    <div className="card-subtitle">{integ.description}</div>
                  </div>
                  {isConfigured ? (
                    <span className="badge badge-ok">● Configurado</span>
                  ) : (
                    <span className="badge badge-muted">● Pendente</span>
                  )}
                </div>

                {/* Env vars */}
                {integ.env_vars.length > 0 && (
                  <div style={{ marginBottom: "var(--sp-3)" }}>
                    <div className="text-xs text-muted" style={{ marginBottom: "var(--sp-2)" }}>
                      Variáveis de ambiente (.env.local):
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {integ.env_vars.map((v) => (
                        <code key={v} className="font-mono text-xs" style={{
                          background: "var(--bg-overlay)",
                          padding: "2px 8px",
                          borderRadius: "var(--r-sm)",
                          color: "var(--fg-muted)",
                          display: "block",
                        }}>{v}=…</code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credential display */}
                {isConfigured && (
                  <div className="row" style={{ marginBottom: "var(--sp-3)" }}>
                    <span className="text-sm text-muted">Hint:</span>
                    <span className="font-mono text-sm">••••{cred.value_hint}</span>
                    <span className="spacer" />
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}
                      onClick={() => removeCred(cred.id)}>Remover</button>
                  </div>
                )}

                {/* Add form */}
                {showAddForm === integ.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", padding: "var(--sp-3)", background: "var(--bg-canvas)", borderRadius: "var(--r-md)" }}>
                    <div className="form-group">
                      <label className="label">Valor da credencial</label>
                      <input type="password" className="input" value={newValue}
                        placeholder="sk-… / eyJ… / seu-token"
                        autoComplete="off"
                        onChange={(e) => setNewValue(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">Descrição (opcional)</label>
                      <input type="text" className="input" value={newDesc}
                        placeholder="Produção / Teste / Staging"
                        onChange={(e) => setNewDesc(e.target.value)} />
                    </div>
                    <div className="row">
                      <button className="btn btn-primary" onClick={() => handleSaveCredential(integ.id)} disabled={isPending}>
                        Salvar hint
                      </button>
                      <button className="btn btn-ghost" onClick={() => setShowAddForm(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="row" style={{ marginTop: "var(--sp-2)" }}>
                    <button className="btn btn-sm" onClick={() => setShowAddForm(integ.id)}>
                      {isConfigured ? "Atualizar credencial" : "Adicionar credencial"}
                    </button>
                    {integ.docs_url && (
                      <a href={integ.docs_url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm">
                        Docs ↗
                      </a>
                    )}
                  </div>
                )}

                {saved === integ.id && (
                  <div className="alert alert-ok" style={{ marginTop: "var(--sp-2)" }}>
                    <span className="alert-icon">✅</span>
                    <div className="alert-body">Hint salvo. Configure o valor real no .env.local.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card-header">
            <div className="card-title"><span className="card-title-icon">📄</span>Template .env.local</div>
          </div>
          <pre style={{
            background: "var(--bg-canvas)",
            padding: "var(--sp-4)",
            borderRadius: "var(--r-md)",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
            overflowX: "auto",
            lineHeight: 1.8,
          }}>
{`# OBS WebSocket
OBS_WS_HOST=localhost
OBS_WS_PORT=4455
# OBS_WS_PASSWORD= # set manually in settings/obs

# Supabase (required for persistent config + real-time logs)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # F6 engine only

# Google Meet API (optional — direct Meet API access)
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_REFRESH_TOKEN=<refresh-token>

# Prometheus (optional — F6 metrics scraping)
PROMETHEUS_ENDPOINT=http://localhost:9099/metrics

# Webhooks (optional)
WEBHOOK_URL=https://your-system/webhooks/multicam
WEBHOOK_SECRET=<secret>`}
          </pre>
        </div>
      </div>
    </>
  );
}
