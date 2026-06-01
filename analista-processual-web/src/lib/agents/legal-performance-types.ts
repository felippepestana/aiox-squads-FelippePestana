import type { ExtractorOutput } from "./agents/extractor";
import type { CalculatorOutput } from "./agents/calculator";
import type { RiskMapperOutput } from "./agents/risk-mapper";
import type { NavigatorOutput } from "./agents/navigator";
import type { ResearcherOutput } from "./agents/researcher";
import type { StrategistOutput } from "./agents/strategist";
import type { AdvisorOutput } from "./agents/advisor";
import type { AppealsOutput } from "./agents/appeals";
import type { PericiaData } from "./agents/forensic";
import type { UseCaseDefinition, DeliverableType, AgentStep } from "./use-cases";
import type { ClassificationResult } from "./legal-performance-router";

export interface DocumentInput {
  filename: string;
  content: string;
  type: string;
}

export interface HarmonizeInput {
  /** Free-text demand: goal, question or case description. */
  demand: string;
  documents?: DocumentInput[];
  processType?: string;
  processNumber?: string;
  court?: string;
  /** Forces a use case, bypassing automatic classification. */
  forceUseCase?: UseCaseDefinition["id"];
  /** Structured perícia data for UC-LP-007. */
  pericia?: PericiaData;
}

export interface StepTrace {
  step: AgentStep;
  agentName: string;
  status: "success" | "skipped" | "failed";
  detail?: string;
}

export interface QualityGateResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
  blocking: boolean;
}

/** Aggregated context populated as the pipeline runs. */
export interface HarmonizeContext {
  input: HarmonizeInput;
  classification: ClassificationResult;
  documentStructure?: NavigatorOutput;
  extractedData?: ExtractorOutput;
  deadlines?: CalculatorOutput;
  risks?: RiskMapperOutput;
  research?: ResearcherOutput;
  strategy?: StrategistOutput;
  advisory?: AdvisorOutput;
  appeals?: AppealsOutput;
  laudo?: string;
  processMap?: string;
  designBrief?: string;
}

export interface HarmonizeOutput {
  id: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  useCase: {
    id: string;
    name: string;
    confidence: number;
    method: string;
    rationale: string;
  };
  deliverableType: DeliverableType;
  deliverable: string;
  steps: StepTrace[];
  qualityGates: QualityGateResult[];
  context: HarmonizeContext;
  summary: string;
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export const HUMAN_REVIEW_DISCLAIMER =
  "Este material foi produzido com apoio de inteligência artificial e NÃO substitui a análise de advogado ou perito habilitado. Requer revisão humana antes de qualquer uso externo.";
