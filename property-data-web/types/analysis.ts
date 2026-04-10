export type UseCase =
  | "UC-PD-001"
  | "UC-PD-002"
  | "UC-PD-003"
  | "UC-PD-004"
  | "UC-PD-005"
  | "UC-PD-006"
  | "UC-PD-007"
  | "UC-PD-ALL";

export type AnalysisStatus = "pending" | "running" | "done" | "error";
export type AgentStatus = "pending" | "running" | "done" | "error" | "skipped";

export interface AgentLog {
  agentId: string;
  agentName: string;
  tier: string;
  status: AgentStatus;
  startedAt?: string;
  finishedAt?: string;
  output?: string;
  error?: string;
  model?: string;
  tokensUsed?: number;
}

export interface PipelineEvent {
  type: "agent:start" | "agent:chunk" | "agent:done" | "agent:error" | "pipeline:done" | "error";
  agentId?: string;
  agentName?: string;
  text?: string;
  status?: AgentStatus;
  model?: string;
  tokensUsed?: number;
  message?: string;
}

export const USE_CASE_LABELS: Record<UseCase, string> = {
  "UC-PD-001": "Pesquisa Registral",
  "UC-PD-002": "Levantamento Legislativo",
  "UC-PD-003": "Analise Urbanistica",
  "UC-PD-004": "Verificacao Ambiental",
  "UC-PD-005": "Documentacao Condominial",
  "UC-PD-006": "Laudo de Avaliacao",
  "UC-PD-007": "Analise Visual/Geoespacial",
  "UC-PD-ALL": "Levantamento Completo",
};

export const USE_CASE_AGENTS: Record<UseCase, string[]> = {
  "UC-PD-001": ["leitor-documental", "pesquisador-registral"],
  "UC-PD-002": ["analista-legislativo"],
  "UC-PD-003": ["analista-urbanistico"],
  "UC-PD-004": ["analista-ambiental"],
  "UC-PD-005": ["analista-condominial"],
  "UC-PD-006": ["leitor-documental", "analista-visual", "avaliador-imovel"],
  "UC-PD-007": ["leitor-documental", "analista-visual"],
  "UC-PD-ALL": [
    "leitor-documental",
    "pesquisador-registral",
    "analista-legislativo",
    "analista-urbanistico",
    "analista-visual",
    "avaliador-imovel",
    "analista-ambiental",
    "analista-condominial",
  ],
};
