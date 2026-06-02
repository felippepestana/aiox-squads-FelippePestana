export { llmGateway, MODELS, type TaskComplexity, type ModelTier } from "./llm-gateway";
export { chiefAgent, ChiefAgent } from "./chief";
export { navigatorAgent, NavigatorAgent } from "./agents/navigator";
export { extractorAgent, ExtractorAgent } from "./agents/extractor";
export { calculatorAgent, CalculatorAgent } from "./agents/calculator";
export { riskMapperAgent, RiskMapperAgent } from "./agents/risk-mapper";

// Legal Performance unified agents
export { jurisprudenceResearcher, JurisprudenceResearcher } from "./agents/researcher";
export { litigationStrategist, LitigationStrategist } from "./agents/strategist";
export { legalActionAdvisor, LegalActionAdvisor } from "./agents/advisor";
export { appealsAnalyst, AppealsAnalyst } from "./agents/appeals";
export {
  forensicDeviceSpecialist,
  ForensicDeviceSpecialist,
  generateLaudo,
  assistQuesito,
  type PericiaData,
} from "./agents/forensic";
export { legalReportWriter, LegalReportWriter } from "./agents/writer";

// Harmonization layer
export { harmonizeLegalRequest } from "./legal-performance-orchestrator";
export {
  classifyLegalDemand,
  classifyByKeywords,
  type ClassificationResult,
} from "./legal-performance-router";
export { USE_CASES, DEFAULT_USE_CASE } from "./use-cases";
export type { UseCaseId, UseCaseDefinition, DeliverableType, AgentStep } from "./use-cases";
export { evaluateQualityGates, gatesBlocked } from "./quality-gates";
export type {
  HarmonizeInput,
  HarmonizeOutput,
  HarmonizeContext,
  StepTrace,
  QualityGateResult,
} from "./legal-performance-types";

export { runAnalysisWorkflow, createAnalysisPayload } from "./workflow";
export type { WorkflowOptions, WorkflowResult } from "./workflow";
