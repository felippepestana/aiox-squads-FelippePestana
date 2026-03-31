interface Phase {
  label: string;
  shortLabel: string;
}

const PHASES: Phase[] = [
  { label: "Classifica\u00E7\u00E3o", shortLabel: "CLS" },
  { label: "Execu\u00E7\u00E3o Jur\u00EDdica", shortLabel: "EXE" },
  { label: "An\u00E1lise Estrat\u00E9gica", shortLabel: "EST" },
  { label: "S\u00EDntese", shortLabel: "SIN" },
  { label: "Documenta\u00E7\u00E3o", shortLabel: "DOC" },
];

/** Map use case to the phases it actually uses (1-indexed). Defaults to all. */
function activePhases(useCase: string): Set<number> {
  switch (useCase) {
    case "UC-AP-001":
      return new Set([1, 2]);
    case "UC-AP-003":
      return new Set([1, 3, 4]);
    case "UC-AP-004":
      return new Set([1, 2, 4]);
    default:
      return new Set([1, 2, 3, 4, 5]);
  }
}

const pulseKeyframes = `
@keyframes ap-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
  50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
}
`;

const styles = {
  wrapper: {
    padding: "1rem",
    background: "#16213e",
    borderRadius: 10,
    marginBottom: "1rem",
  } as React.CSSProperties,
  title: {
    color: "#8892b0",
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "1rem",
    fontWeight: 600,
  } as React.CSSProperties,
  track: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    position: "relative",
  } as React.CSSProperties,
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
    zIndex: 1,
  } as React.CSSProperties,
  circle: (
    status: "done" | "active" | "upcoming" | "skipped"
  ): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 28,
      height: 28,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.7rem",
      fontWeight: 700,
      transition: "all 0.3s",
      color: "#fff",
    };
    switch (status) {
      case "done":
        return { ...base, background: "#10b981", color: "#fff" };
      case "active":
        return {
          ...base,
          background: "#3b82f6",
          animation: "ap-pulse 2s infinite",
        };
      case "skipped":
        return {
          ...base,
          background: "transparent",
          border: "2px dashed #334155",
          color: "#475569",
        };
      case "upcoming":
      default:
        return {
          ...base,
          background: "#334155",
          color: "#64748b",
        };
    }
  },
  label: (
    status: "done" | "active" | "upcoming" | "skipped"
  ): React.CSSProperties => ({
    marginTop: 6,
    fontSize: "0.68rem",
    textAlign: "center",
    color:
      status === "done"
        ? "#10b981"
        : status === "active"
          ? "#3b82f6"
          : "#64748b",
    fontWeight: status === "active" ? 600 : 400,
    lineHeight: 1.3,
    maxWidth: 72,
  }),
  connector: (filled: boolean): React.CSSProperties => ({
    position: "absolute",
    top: 14,
    left: "calc(50% + 14px)",
    right: "calc(-50% + 14px)",
    height: 2,
    background: filled ? "#10b981" : "#334155",
    zIndex: 0,
    transition: "background 0.3s",
  }),
};

interface Props {
  currentPhase: number;
  useCase: string;
}

export function PipelineTracker({ currentPhase, useCase }: Props) {
  const active = activePhases(useCase);

  return (
    <div style={styles.wrapper}>
      <style>{pulseKeyframes}</style>
      <div style={styles.title}>Pipeline</div>
      <div style={styles.track}>
        {PHASES.map((phase, i) => {
          const phaseNum = i + 1;
          const isActive = active.has(phaseNum);
          let status: "done" | "active" | "upcoming" | "skipped";
          if (!isActive) {
            status = "skipped";
          } else if (phaseNum < currentPhase) {
            status = "done";
          } else if (phaseNum === currentPhase) {
            status = "active";
          } else {
            status = "upcoming";
          }

          const showConnector = i < PHASES.length - 1;
          const connectorFilled = phaseNum < currentPhase;

          return (
            <div key={phaseNum} style={styles.step}>
              <div style={styles.circle(status)}>
                {status === "done" ? "\u2713" : phaseNum}
              </div>
              <div style={styles.label(status)}>{phase.label}</div>
              {showConnector && (
                <div style={styles.connector(connectorFilled)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
