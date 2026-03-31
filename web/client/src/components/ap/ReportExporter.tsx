import { useCallback, useMemo, useState } from "react";

interface Message {
  role: string;
  text: string;
}

interface Props {
  messages: Message[];
  sessionId: string;
  useCase: string;
}

/** Check if the documentador-processual has produced a final report. */
function detectFinalReport(messages: Message[]): {
  found: boolean;
  reportText: string;
} {
  // Walk messages in reverse to find the latest report
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;

    const text = msg.text;

    // Check for completion markers
    const hasComplete =
      /COMPLETE:\s*relat[oó]rio\s+salvo/i.test(text) ||
      /##\s*Relat[oó]rio/i.test(text);

    if (!hasComplete) continue;

    // Extract report section starting from "## Relatorio" heading
    const reportHeadingMatch = text.match(/##\s*Relat[oó]rio/i);
    if (reportHeadingMatch && reportHeadingMatch.index !== undefined) {
      return { found: true, reportText: text.slice(reportHeadingMatch.index) };
    }

    // If no heading found but the completion marker exists, return entire message
    return { found: true, reportText: text };
  }

  return { found: false, reportText: "" };
}

const useCaseLabels: Record<string, string> = {
  "UC-AP-001": "Mapeamento",
  "UC-AP-002": "Analise-Completa",
  "UC-AP-003": "Analise-Estrategica",
  "UC-AP-004": "Pesquisa-Jurisprudencial",
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  } as React.CSSProperties,
  button: (enabled: boolean): React.CSSProperties => ({
    background: enabled ? "#0f3460" : "#1e293b",
    color: enabled ? "#e2e8f0" : "#475569",
    border: enabled ? "1px solid #3b82f6" : "1px solid #334155",
    borderRadius: 8,
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: enabled ? "pointer" : "not-allowed",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap",
  }),
  buttonHover: {
    background: "#1a4a8a",
    borderColor: "#60a5fa",
  } as React.CSSProperties,
  badge: {
    background: "#10b981",
    color: "#fff",
    fontSize: "0.6rem",
    fontWeight: 700,
    borderRadius: 4,
    padding: "0.1rem 0.35rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,
  pendingBadge: {
    background: "#334155",
    color: "#64748b",
    fontSize: "0.6rem",
    fontWeight: 600,
    borderRadius: 4,
    padding: "0.1rem 0.35rem",
  } as React.CSSProperties,
  feedbackMsg: {
    color: "#10b981",
    fontSize: "0.8rem",
    fontWeight: 500,
  } as React.CSSProperties,
};

export function ReportExporter({ messages, sessionId, useCase }: Props) {
  const [hovered, setHovered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { found, reportText } = useMemo(
    () => detectFinalReport(messages),
    [messages]
  );

  const handleExport = useCallback(() => {
    if (!found || !reportText) return;

    const ucLabel = useCaseLabels[useCase] ?? useCase;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `relatorio-${ucLabel}-${ts}.md`;

    let md = `# Relatorio - Analista Processual\n\n`;
    md += `**Caso de Uso:** ${useCase} - ${ucLabel}\n`;
    md += `**Sessao:** ${sessionId}\n`;
    md += `**Data:** ${new Date().toLocaleString("pt-BR")}\n\n---\n\n`;
    md += reportText;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  }, [found, reportText, sessionId, useCase]);

  const buttonEnabled = found && reportText.length > 0;

  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        style={{
          ...styles.button(buttonEnabled),
          ...(hovered && buttonEnabled ? styles.buttonHover : {}),
        }}
        disabled={!buttonEnabled}
        onClick={handleExport}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={
          buttonEnabled
            ? "Baixar relatorio gerado pelo documentador-processual"
            : "Aguardando geracao do relatorio pelo documentador-processual"
        }
      >
        <span role="img" aria-label="documento">
          {"\uD83D\uDCC4"}
        </span>
        Exportar Relatorio
      </button>
      {found ? (
        <span style={styles.badge}>Pronto</span>
      ) : (
        <span style={styles.pendingBadge}>Aguardando relatorio</span>
      )}
      {downloaded && (
        <span style={styles.feedbackMsg}>Download iniciado!</span>
      )}
    </div>
  );
}
