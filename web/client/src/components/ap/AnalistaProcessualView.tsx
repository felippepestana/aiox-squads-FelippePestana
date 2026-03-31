import type { ReactNode } from "react";
import { useMemo } from "react";
import { UseCaseSelector } from "./UseCaseSelector";
import { PipelineTracker } from "./PipelineTracker";
import { RiskDashboard } from "./RiskDashboard";
import { ReportExporter } from "./ReportExporter";

interface Message {
  role: string;
  text: string;
}

interface Props {
  sessionId: string | null;
  messages: Message[];
  onSelectUseCase: (uc: string) => void;
  currentAgent: { id: string; name: string } | null;
  children?: ReactNode;
}

/** Infer the current pipeline phase (1-5) from assistant messages. 0 = not started. */
function inferPhase(messages: Message[]): number {
  if (messages.length === 0) return 0;

  // Walk messages in reverse for latest signal
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;
    const t = msg.text.toLowerCase();

    // Phase 5: Documentation
    if (
      /relat[oó]rio\s+(final|gerado|salvo)/i.test(t) ||
      /COMPLETE:\s*relat[oó]rio/i.test(msg.text) ||
      /documenta[cç][aã]o\s+(conclu[ií]da|finalizada)/i.test(t)
    ) {
      return 5;
    }
    // Phase 4: Synthesis
    if (
      /s[ií]ntese/i.test(t) &&
      (/conclu[ií]d/i.test(t) || /resultado/i.test(t))
    ) {
      return 4;
    }
    // Phase 3: Strategic analysis
    if (
      /an[aá]lise\s+estrat[eé]gica/i.test(t) ||
      /cen[aá]rio/i.test(t) ||
      /estrat[eé]gia/i.test(t)
    ) {
      return 3;
    }
    // Phase 2: Legal execution
    if (
      /execu[cç][aã]o\s+jur[ií]dica/i.test(t) ||
      /jurisprud[eê]ncia/i.test(t) ||
      /pesquisa\s+jur/i.test(t) ||
      /mapeamento\s+(conclu[ií]do|finalizado)/i.test(t)
    ) {
      return 2;
    }
    // Phase 1: Classification
    if (
      /classifica[cç][aã]o/i.test(t) ||
      /mapeamento/i.test(t) ||
      /identificando/i.test(t)
    ) {
      return 1;
    }
  }

  // If there are assistant messages but no phase markers, assume classification started
  return messages.some((m) => m.role === "assistant") ? 1 : 0;
}

/** Infer the selected use case from messages if not explicitly tracked. */
function inferUseCase(messages: Message[]): string {
  for (const msg of messages) {
    const ucMatch = msg.text.match(/UC-AP-00[1-4]/);
    if (ucMatch) return ucMatch[0];
  }
  return "UC-AP-002"; // default to full analysis
}

const styles = {
  // Full-width use case selector (no active session)
  selectorWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
    padding: "2rem",
  } as React.CSSProperties,

  // Active session layout
  sessionLayout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  } as React.CSSProperties,

  // Top header bar with agent info and export
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    background: "#16213e",
    borderBottom: "1px solid #0f3460",
    flexShrink: 0,
    gap: "1rem",
    flexWrap: "wrap",
  } as React.CSSProperties,

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    minWidth: 0,
  } as React.CSSProperties,

  agentIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#8892b0",
    fontSize: "0.82rem",
  } as React.CSSProperties,

  agentDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
    flexShrink: 0,
  } as React.CSSProperties,

  agentName: {
    color: "#e2e8f0",
    fontWeight: 600,
  } as React.CSSProperties,

  // Body: sidebar + main content
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  } as React.CSSProperties,

  sidebar: {
    width: 260,
    flexShrink: 0,
    background: "#1a1a2e",
    borderRight: "1px solid #0f3460",
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
};

export function AnalistaProcessualView({
  sessionId,
  messages,
  onSelectUseCase,
  currentAgent,
  children,
}: Props) {
  const useCase = useMemo(() => inferUseCase(messages), [messages]);
  const currentPhase = useMemo(() => inferPhase(messages), [messages]);

  // No active session: show the use case selector full-width
  if (!sessionId) {
    return (
      <div style={styles.selectorWrapper}>
        <UseCaseSelector onSelect={onSelectUseCase} />
      </div>
    );
  }

  // Active session: composite layout
  return (
    <div style={styles.sessionLayout}>
      {/* Header bar */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {currentAgent && (
            <div style={styles.agentIndicator}>
              <div style={styles.agentDot} />
              <span style={styles.agentName}>{currentAgent.name}</span>
              <span>ativo</span>
            </div>
          )}
        </div>
        <ReportExporter
          messages={messages}
          sessionId={sessionId}
          useCase={useCase}
        />
      </div>

      {/* Body: sidebar + main */}
      <div style={styles.body}>
        {/* Left sidebar: pipeline + risk dashboard */}
        <div style={styles.sidebar}>
          <PipelineTracker currentPhase={currentPhase} useCase={useCase} />
          <RiskDashboard messages={messages} />
        </div>

        {/* Main content area (chat messages passed as children) */}
        <div style={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}
