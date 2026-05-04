import Link from "next/link";

interface SettingCard {
  href: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
}

const CARDS: SettingCard[] = [
  {
    href: "/settings/obs",
    icon: "⚙️",
    title: "OBS WebSocket",
    description: "Conexão com o OBS Studio via obs-websocket v5",
    items: ["Host e porta", "Senha da sessão", "TLS (wss://)", "Teste de conectividade"],
  },
  {
    href: "/settings/meet",
    icon: "📹",
    title: "Google Meet",
    description: "Conta de transmissão e configuração do Workspace",
    items: ["Conta dedicada", "URL padrão da sala", "Gravação automática", "Desabilitar Studio Effects"],
  },
  {
    href: "/settings/cameras",
    icon: "🎥",
    title: "Câmeras",
    description: "Configuração individual das 4 câmeras OBSBOT",
    items: ["Nome e função por câmera", "Porta USB física", "Presets PTZ (1–3)", "Auto-Track on/off"],
  },
  {
    href: "/settings/audio",
    icon: "🎙️",
    title: "Áudio / Microfones",
    description: "Mapeamento de canais de áudio para câmeras",
    items: ["Canal → câmera vinculada", "Nome do input OBS", "Limiar VAD (dB)", "Função por canal"],
  },
  {
    href: "/settings/integrations",
    icon: "🔌",
    title: "Integrações",
    description: "APIs, credenciais e conectores externos",
    items: ["Supabase", "Google Meet API", "Prometheus / Grafana", "Webhooks", "MCP Server"],
  },
];

export default function SettingsHubPage() {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">Configurações</div>
      </div>

      <div className="page-content">
        <div className="grid grid-2" style={{ gap: "var(--sp-4)" }}>
          {CARDS.map((card) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{
                cursor: "pointer",
                transition: "all var(--t-fast)",
                borderColor: "var(--border-subtle)",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)"; }}
              >
                <div className="card-header" style={{ marginBottom: "var(--sp-3)" }}>
                  <div>
                    <div className="card-title" style={{ fontSize: 16 }}>
                      <span className="card-title-icon" style={{ fontSize: 20 }}>{card.icon}</span>
                      {card.title}
                    </div>
                    <div className="card-subtitle">{card.description}</div>
                  </div>
                  <span style={{ color: "var(--fg-faint)", fontSize: 18 }}>›</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", fontSize: 12, color: "var(--fg-muted)" }}>
                      <span style={{ color: "var(--ok)", fontSize: 10 }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <div className="alert alert-info" style={{ marginTop: "var(--sp-5)" }}>
          <span className="alert-icon">ℹ️</span>
          <div className="alert-body">
            <div className="alert-title">Supabase não configurado</div>
            Configure as variáveis <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            e <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            no <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>.env.local</code> para persistência de configurações.
            Sem Supabase o painel funciona em modo local (YAML + sessionStorage).
          </div>
        </div>
      </div>
    </>
  );
}
