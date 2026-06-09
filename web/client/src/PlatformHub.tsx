// Apex-Talent — platform hub / catalog landing.
// Groups apex-talent modules by HR area, highlights the orchestrator and shows
// each module's maturity (status) + agent count. Picking a module launches a
// session with its entry agent (the *-chief, ordered first by the server).
import type { SquadSummary } from "./api";

/** Curated area label + order for each apex-talent module (by squad id). */
const AREA: Record<string, { area: string; order: number }> = {
  "talent-compass": { area: "Recrutamento & Seleção", order: 1 },
  "profiler-dna": { area: "Inteligência Comportamental", order: 2 },
  performa: { area: "Gestão de Desempenho", order: 3 },
  pulse: { area: "Clima & Engajamento", order: 4 },
  peopleops: { area: "DP & Folha", order: 5 },
  chronos: { area: "Ponto & Jornada", order: 6 },
  onboard: { area: "Onboarding", order: 7 },
  "org-architect": { area: "Cargos & Org Design", order: 8 },
  insights: { area: "People Analytics", order: 9 },
  academy: { area: "Treinamento & Desenvolvimento", order: 10 },
  "benefits-hub": { area: "Benefícios", order: 11 },
};

const ORCHESTRATOR_ID = "apex-talent";

function statusLabel(status?: string): { text: string; cls: string } {
  const s = (status ?? "").toUpperCase();
  if (s === "ACTIVE") return { text: "Ativo", cls: "hub-badge--active" };
  if (s === "DEVELOPING") return { text: "Em desenvolvimento", cls: "hub-badge--dev" };
  return { text: status || "—", cls: "hub-badge--muted" };
}

export function PlatformHub({
  squads,
  onLaunch,
  onClose,
}: {
  squads: SquadSummary[];
  onLaunch: (squadId: string) => void;
  onClose: () => void;
}) {
  // The orchestrator squad declares metadata.type: platform (not platform:),
  // so it is found by id; the modules declare metadata.platform: apex-talent.
  const orchestrator = squads.find((s) => s.id === ORCHESTRATOR_ID);
  const modules = squads
    .filter((s) => s.meta.platform === "apex-talent" && s.id !== ORCHESTRATOR_ID)
    .sort((a, b) => (AREA[a.id]?.order ?? 99) - (AREA[b.id]?.order ?? 99));

  const activeCount = modules.filter(
    (m) => (m.meta.status ?? "").toUpperCase() === "ACTIVE"
  ).length;

  return (
    <div className="hub" role="region" aria-label="Plataforma Apex-Talent">
      <div className="hub-head">
        <div>
          <h2 className="hub-title">Apex-Talent</h2>
          <p className="hub-sub">
            Plataforma de gestão de pessoas AI-native — {modules.length} módulos
            por área, {activeCount} ativos. Escolha um módulo para conversar com
            seu agente de entrada.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Fechar
        </button>
      </div>

      {orchestrator ? (
        <button
          type="button"
          className="hub-hero"
          onClick={() => onLaunch(orchestrator.id)}
        >
          <span className="hub-hero__icon">{orchestrator.meta.icon}</span>
          <span className="hub-hero__body">
            <span className="hub-hero__title">
              {orchestrator.meta.title}
              <span className="hub-badge hub-badge--orchestrator">
                Orquestrador
              </span>
            </span>
            <span className="hub-hero__desc">
              {orchestrator.meta.description ||
                "Ponto de entrada da plataforma — roteia para o módulo certo."}
            </span>
          </span>
          <span className="hub-hero__cta">Começar aqui →</span>
        </button>
      ) : null}

      <div className="hub-grid">
        {modules.map((m) => {
          const st = statusLabel(m.meta.status);
          const area = AREA[m.id]?.area;
          return (
            <button
              key={m.id}
              type="button"
              className="hub-card"
              onClick={() => onLaunch(m.id)}
            >
              <div className="hub-card__top">
                <span className="hub-card__icon">{m.meta.icon}</span>
                <span className={`hub-badge ${st.cls}`}>{st.text}</span>
              </div>
              {area ? <div className="hub-card__area">{area}</div> : null}
              <div className="hub-card__title">{m.meta.title}</div>
              <div className="hub-card__desc">{m.meta.description}</div>
              <div className="hub-card__foot">
                <span className="hub-card__agents">
                  {m.agents.length} agente{m.agents.length === 1 ? "" : "s"}
                </span>
                <span className="hub-card__open">Abrir →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
