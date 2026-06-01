/**
 * Legal Performance use cases (UC-LP-001..008).
 *
 * Mirrors the pipeline declared in
 * squads/squad-juridico-legal-performance/config.yaml so the web product routes
 * demands the same way the squad orchestrator (`legal-performance-chief`) does.
 */

export type UseCaseId =
  | "UC-LP-001"
  | "UC-LP-002"
  | "UC-LP-003"
  | "UC-LP-004"
  | "UC-LP-005"
  | "UC-LP-006"
  | "UC-LP-007"
  | "UC-LP-008";

/** Agent steps available to a pipeline route. */
export type AgentStep =
  | "intake"
  | "classifier"
  | "auditor"
  | "mapper"
  | "evaluator"
  | "reader"
  | "researcher"
  | "strategist"
  | "appeals"
  | "advisor"
  | "forensic"
  | "normative"
  | "ux"
  | "writer"
  | "validator";

/** Kind of final deliverable produced by a use case. */
export type DeliverableType =
  | "diagnostico"
  | "relatorio"
  | "estrategia-recursal"
  | "mapeamento"
  | "pesquisa"
  | "laudo"
  | "design-brief";

export interface UseCaseDefinition {
  id: UseCaseId;
  name: string;
  triggerPatterns: string[];
  route: AgentStep[];
  deliverable: DeliverableType;
}

export const USE_CASES: Record<UseCaseId, UseCaseDefinition> = {
  "UC-LP-001": {
    id: "UC-LP-001",
    name: "Triagem e Diagnóstico Processual",
    triggerPatterns: [
      "diagnosticar",
      "status do processo",
      "fase processual",
      "verificar prazos",
      "situação processual",
    ],
    route: ["intake", "classifier", "auditor", "writer", "validator"],
    deliverable: "diagnostico",
  },
  "UC-LP-002": {
    id: "UC-LP-002",
    name: "Análise Jurídica Completa",
    triggerPatterns: [
      "processo judicial",
      "peças",
      "petição",
      "sentença",
      "acórdão",
      "analisar autos",
    ],
    route: [
      "intake",
      "reader",
      "researcher",
      "strategist",
      "advisor",
      "writer",
      "validator",
    ],
    deliverable: "relatorio",
  },
  "UC-LP-003": {
    id: "UC-LP-003",
    name: "Análise Estratégica Processual Civil",
    triggerPatterns: [
      "processo cível",
      "cpc",
      "ação civil",
      "contestação",
      "defesa",
      "execução",
      "cumprimento de sentença",
    ],
    route: [
      "intake",
      "classifier",
      "auditor",
      "reader",
      "researcher",
      "strategist",
      "advisor",
      "writer",
      "validator",
    ],
    deliverable: "relatorio",
  },
  "UC-LP-004": {
    id: "UC-LP-004",
    name: "Estratégia Recursal",
    triggerPatterns: [
      "recurso",
      "apelação",
      "agravo",
      "resp",
      "recurso especial",
      "recurso extraordinário",
      "embargos de declaração",
      "prequestionamento",
    ],
    route: [
      "intake",
      "classifier",
      "auditor",
      "reader",
      "researcher",
      "appeals",
      "advisor",
      "writer",
      "validator",
    ],
    deliverable: "estrategia-recursal",
  },
  "UC-LP-005": {
    id: "UC-LP-005",
    name: "Mapeamento e Performance de Processo",
    triggerPatterns: [
      "mapear processo",
      "fluxo",
      "workflow",
      "bpmn",
      "gargalos",
      "maturidade",
    ],
    route: ["intake", "mapper", "evaluator", "ux", "writer", "validator"],
    deliverable: "mapeamento",
  },
  "UC-LP-006": {
    id: "UC-LP-006",
    name: "Pesquisa Jurisprudencial e Normativa",
    triggerPatterns: [
      "jurisprudência",
      "stj",
      "stf",
      "súmula",
      "precedente",
      "legislação",
      "tese repetitiva",
    ],
    route: ["intake", "researcher", "normative", "writer"],
    deliverable: "pesquisa",
  },
  "UC-LP-007": {
    id: "UC-LP-007",
    name: "Perícia Judicial Técnica",
    triggerPatterns: [
      "perícia",
      "laudo",
      "iphone",
      "imei",
      "cadeia de custódia",
      "quesitos",
      "abnt",
      "cdc",
    ],
    route: ["intake", "normative", "forensic", "writer", "validator"],
    deliverable: "laudo",
  },
  "UC-LP-008": {
    id: "UC-LP-008",
    name: "Design de Produto Jurídico",
    triggerPatterns: [
      "frontend",
      "interface",
      "usabilidade",
      "dashboard",
      "design",
      "produto jurídico",
      "experiência do usuário",
    ],
    route: ["intake", "ux", "writer", "validator"],
    deliverable: "design-brief",
  },
};

/** Default use case when classification is inconclusive. */
export const DEFAULT_USE_CASE: UseCaseId = "UC-LP-002";
