import { useMemo } from "react";

interface Message {
  role: string;
  text: string;
}

interface RiskItem {
  description: string;
  severity: "alto" | "medio" | "baixo";
}

interface ScenarioData {
  label: string;
  percentage: number;
}

interface ParsedData {
  maturity: number | null;
  risks: RiskItem[];
  scenarios: ScenarioData[];
}

/** Parse assistant messages for structured risk/maturity/scenario data. */
function parseMessages(messages: Message[]): ParsedData {
  let maturity: number | null = null;
  const risks: RiskItem[] = [];
  const scenarios: ScenarioData[] = [];

  const assistantTexts = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.text);

  for (const text of assistantTexts) {
    // Maturity score: look for "Maturidade:" or "Score:" followed by number 0-5
    if (maturity === null) {
      const maturityMatch = text.match(
        /(?:Maturidade|Score|Maturidade\s+do\s+Processo)\s*:\s*(\d(?:[.,]\d)?)\s*(?:\/\s*5)?/i
      );
      if (maturityMatch) {
        const val = parseFloat(maturityMatch[1].replace(",", "."));
        if (val >= 0 && val <= 5) maturity = val;
      }
    }

    // Risk items: look for table rows with severity markers or bullet items
    const riskLinePattern =
      /[|\-*]\s*(alto|m[eé]dio|baixo)\s*[|\-:]\s*(.+?)(?:\||$)/gi;
    let riskMatch;
    while ((riskMatch = riskLinePattern.exec(text)) !== null) {
      const sevRaw = riskMatch[1].toLowerCase().replace("\u00E9", "e");
      const severity = (
        sevRaw === "alto" ? "alto" : sevRaw === "medio" ? "medio" : "baixo"
      ) as RiskItem["severity"];
      const desc = riskMatch[2].trim().replace(/\|/g, "").trim();
      if (desc && !risks.some((r) => r.description === desc)) {
        risks.push({ description: desc, severity });
      }
    }

    // Bullet-style risks: "- **Alto**: description"
    const bulletRiskPattern =
      /[-*]\s*\*{0,2}(Alto|M[eé]dio|Baixo)\*{0,2}\s*[:\-]\s*(.+)/gi;
    let bulletMatch;
    while ((bulletMatch = bulletRiskPattern.exec(text)) !== null) {
      const sevRaw = bulletMatch[1].toLowerCase().replace("\u00E9", "e");
      const severity = (
        sevRaw === "alto" ? "alto" : sevRaw === "medio" ? "medio" : "baixo"
      ) as RiskItem["severity"];
      const desc = bulletMatch[2].trim().replace(/\*+/g, "").trim();
      if (desc && !risks.some((r) => r.description === desc)) {
        risks.push({ description: desc, severity });
      }
    }

    // Scenarios: "otimista: 70%", "realista: 50%", "pessimista: 20%"
    const scenarioPattern =
      /(otimista|realista|pessimista)\s*[:\-]\s*(\d{1,3})\s*%/gi;
    let scenMatch;
    while ((scenMatch = scenarioPattern.exec(text)) !== null) {
      const label = scenMatch[1].charAt(0).toUpperCase() + scenMatch[1].slice(1).toLowerCase();
      const pct = parseInt(scenMatch[2], 10);
      if (!scenarios.some((s) => s.label === label)) {
        scenarios.push({ label, percentage: Math.min(100, pct) });
      }
    }
  }

  return { maturity, risks, scenarios };
}

const severityColors: Record<RiskItem["severity"], string> = {
  alto: "#ef4444",
  medio: "#f59e0b",
  baixo: "#10b981",
};

const severityLabels: Record<RiskItem["severity"], string> = {
  alto: "Alto",
  medio: "M\u00E9dio",
  baixo: "Baixo",
};

const scenarioColors: Record<string, string> = {
  Otimista: "#10b981",
  Realista: "#3b82f6",
  Pessimista: "#ef4444",
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  } as React.CSSProperties,
  section: {
    background: "#16213e",
    borderRadius: 10,
    padding: "1rem",
  } as React.CSSProperties,
  sectionTitle: {
    color: "#8892b0",
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.75rem",
    fontWeight: 600,
  } as React.CSSProperties,
  empty: {
    color: "#475569",
    fontSize: "0.8rem",
    fontStyle: "italic",
  } as React.CSSProperties,
  // Maturity gauge
  gaugeTrack: {
    height: 10,
    background: "#1e293b",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  } as React.CSSProperties,
  gaugeFill: (value: number): React.CSSProperties => {
    const pct = (value / 5) * 100;
    const color =
      value <= 1.5 ? "#ef4444" : value <= 3 ? "#f59e0b" : "#10b981";
    return {
      height: "100%",
      width: `${pct}%`,
      background: color,
      borderRadius: 5,
      transition: "width 0.5s ease",
    };
  },
  gaugeLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  } as React.CSSProperties,
  gaugeValue: (value: number): React.CSSProperties => ({
    fontSize: "1.5rem",
    fontWeight: 700,
    color: value <= 1.5 ? "#ef4444" : value <= 3 ? "#f59e0b" : "#10b981",
  }),
  gaugeMax: {
    fontSize: "0.8rem",
    color: "#64748b",
  } as React.CSSProperties,
  // Risk cards
  riskList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  } as React.CSSProperties,
  riskCard: (severity: RiskItem["severity"]): React.CSSProperties => ({
    background: "#1a1a2e",
    borderLeft: `3px solid ${severityColors[severity]}`,
    borderRadius: 6,
    padding: "0.6rem 0.75rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
  }),
  riskBadge: (severity: RiskItem["severity"]): React.CSSProperties => ({
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    color: severityColors[severity],
    minWidth: 42,
    flexShrink: 0,
    paddingTop: 1,
  }),
  riskDesc: {
    color: "#cbd5e1",
    fontSize: "0.82rem",
    lineHeight: 1.4,
  } as React.CSSProperties,
  // Scenarios
  scenarioRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.6rem",
  } as React.CSSProperties,
  scenarioLabel: {
    fontSize: "0.8rem",
    color: "#cbd5e1",
    width: 80,
    flexShrink: 0,
  } as React.CSSProperties,
  scenarioBarTrack: {
    flex: 1,
    height: 8,
    background: "#1e293b",
    borderRadius: 4,
    overflow: "hidden",
  } as React.CSSProperties,
  scenarioBarFill: (pct: number, color: string): React.CSSProperties => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: 4,
    transition: "width 0.5s ease",
  }),
  scenarioPct: (color: string): React.CSSProperties => ({
    fontSize: "0.8rem",
    fontWeight: 600,
    color,
    width: 40,
    textAlign: "right",
    flexShrink: 0,
  }),
};

interface Props {
  messages: Array<{ role: string; text: string }>;
}

export function RiskDashboard({ messages }: Props) {
  const { maturity, risks, scenarios } = useMemo(
    () => parseMessages(messages),
    [messages]
  );

  const hasData = maturity !== null || risks.length > 0 || scenarios.length > 0;

  if (!hasData) {
    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Painel de Riscos</div>
        <div style={styles.empty}>
          Aguardando dados de an\u00E1lise nas mensagens do assistente...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {maturity !== null && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Maturidade do Processo</div>
          <div style={styles.gaugeLabel}>
            <span style={styles.gaugeValue(maturity)}>
              {maturity.toFixed(1)}
            </span>
            <span style={styles.gaugeMax}>/ 5.0</span>
          </div>
          <div style={styles.gaugeTrack}>
            <div style={styles.gaugeFill(maturity)} />
          </div>
        </div>
      )}

      {risks.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            Riscos Identificados ({risks.length})
          </div>
          <div style={styles.riskList}>
            {risks.map((risk, i) => (
              <div key={i} style={styles.riskCard(risk.severity)}>
                <span style={styles.riskBadge(risk.severity)}>
                  {severityLabels[risk.severity]}
                </span>
                <span style={styles.riskDesc}>{risk.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {scenarios.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Cen\u00E1rios</div>
          {scenarios.map((s) => {
            const color = scenarioColors[s.label] ?? "#8892b0";
            return (
              <div key={s.label} style={styles.scenarioRow}>
                <span style={styles.scenarioLabel}>{s.label}</span>
                <div style={styles.scenarioBarTrack}>
                  <div
                    style={styles.scenarioBarFill(s.percentage, color)}
                  />
                </div>
                <span style={styles.scenarioPct(color)}>
                  {s.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
