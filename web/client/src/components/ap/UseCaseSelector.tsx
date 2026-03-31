import { useState } from "react";

interface UseCase {
  id: string;
  icon: string;
  title: string;
  description: string;
  estimatedTime: string;
  agents: Array<{ icon: string; name: string }>;
}

const USE_CASES: UseCase[] = [
  {
    id: "UC-AP-001",
    icon: "\u{1F5FA}\uFE0F",
    title: "Mapeamento de Processo",
    description:
      "Identifica partes, prazos e fases processuais. Avalia a maturidade e os riscos do processo.",
    estimatedTime: "~5 min",
    agents: [
      { icon: "\u{1F4CB}", name: "Mapeador" },
      { icon: "\u{1F50D}", name: "Avaliador" },
    ],
  },
  {
    id: "UC-AP-002",
    icon: "\u2696\uFE0F",
    title: "An\u00E1lise Jur\u00EDdica Completa",
    description:
      "Executa todas as etapas de an\u00E1lise: mapeamento, pesquisa, estrat\u00E9gia e documenta\u00E7\u00E3o.",
    estimatedTime: "~15 min",
    agents: [
      { icon: "\u{1F4CB}", name: "Mapeador" },
      { icon: "\u{1F50D}", name: "Pesquisador" },
      { icon: "\u265F\uFE0F", name: "Estrategista" },
      { icon: "\u{1F4DD}", name: "Documentador" },
    ],
  },
  {
    id: "UC-AP-003",
    icon: "\u265F\uFE0F",
    title: "An\u00E1lise Estrat\u00E9gica",
    description:
      "Elabora cen\u00E1rios, recomenda\u00E7\u00F5es e estrat\u00E9gias de atua\u00E7\u00E3o processual.",
    estimatedTime: "~8 min",
    agents: [
      { icon: "\u265F\uFE0F", name: "Estrategista" },
      { icon: "\u{1F9ED}", name: "Orientador" },
    ],
  },
  {
    id: "UC-AP-004",
    icon: "\u{1F50D}",
    title: "Pesquisa Jurisprudencial",
    description:
      "Busca e organiza jurisprud\u00EAncia relevante para fundamentar teses e peti\u00E7\u00F5es.",
    estimatedTime: "~6 min",
    agents: [{ icon: "\u{1F50D}", name: "Pesquisador" }],
  },
];

const styles = {
  container: {
    padding: "2rem",
    maxWidth: 900,
    margin: "0 auto",
  } as React.CSSProperties,
  heading: {
    color: "#e94560",
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
    fontWeight: 700,
  } as React.CSSProperties,
  subtitle: {
    color: "#8892b0",
    fontSize: "0.95rem",
    marginBottom: "2rem",
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.25rem",
  } as React.CSSProperties,
  card: {
    background: "#16213e",
    borderRadius: 12,
    padding: "1.5rem",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "border-color 0.2s, transform 0.15s",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  } as React.CSSProperties,
  cardHover: {
    borderColor: "#0f3460",
    transform: "translateY(-2px)",
  } as React.CSSProperties,
  cardDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  } as React.CSSProperties,
  iconRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  } as React.CSSProperties,
  icon: {
    fontSize: "2rem",
    lineHeight: 1,
  } as React.CSSProperties,
  title: {
    color: "#e2e8f0",
    fontSize: "1.1rem",
    fontWeight: 600,
  } as React.CSSProperties,
  description: {
    color: "#8892b0",
    fontSize: "0.85rem",
    lineHeight: 1.5,
    flex: 1,
  } as React.CSSProperties,
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  } as React.CSSProperties,
  time: {
    color: "#64ffda",
    fontSize: "0.8rem",
    fontWeight: 500,
  } as React.CSSProperties,
  agentBadges: {
    display: "flex",
    gap: "0.35rem",
  } as React.CSSProperties,
  agentBadge: {
    background: "#0f3460",
    borderRadius: 6,
    padding: "0.15rem 0.45rem",
    fontSize: "0.75rem",
    color: "#cbd5e1",
  } as React.CSSProperties,
  ucId: {
    color: "#475569",
    fontSize: "0.7rem",
    fontFamily: "monospace",
  } as React.CSSProperties,
};

interface Props {
  onSelect: (useCase: string) => void;
  disabled?: boolean;
}

export function UseCaseSelector({ onSelect, disabled }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Analista Processual</h2>
      <p style={styles.subtitle}>
        Selecione o caso de uso para iniciar a an\u00E1lise:
      </p>
      <div style={styles.grid}>
        {USE_CASES.map((uc) => (
          <div
            key={uc.id}
            role="button"
            tabIndex={disabled ? -1 : 0}
            style={{
              ...styles.card,
              ...(hoveredId === uc.id && !disabled ? styles.cardHover : {}),
              ...(disabled ? styles.cardDisabled : {}),
            }}
            onMouseEnter={() => setHoveredId(uc.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => !disabled && onSelect(uc.id)}
            onKeyDown={(e) => {
              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(uc.id);
              }
            }}
          >
            <div style={styles.iconRow}>
              <span style={styles.icon}>{uc.icon}</span>
              <div>
                <div style={styles.title}>{uc.title}</div>
                <div style={styles.ucId}>{uc.id}</div>
              </div>
            </div>
            <div style={styles.description}>{uc.description}</div>
            <div style={styles.footer}>
              <span style={styles.time}>{uc.estimatedTime}</span>
              <div style={styles.agentBadges}>
                {uc.agents.map((a) => (
                  <span key={a.name} style={styles.agentBadge} title={a.name}>
                    {a.icon} {a.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
