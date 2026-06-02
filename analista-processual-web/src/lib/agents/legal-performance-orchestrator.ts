import { navigatorAgent } from "./agents/navigator";
import { extractorAgent } from "./agents/extractor";
import { calculatorAgent } from "./agents/calculator";
import { riskMapperAgent } from "./agents/risk-mapper";
import { jurisprudenceResearcher } from "./agents/researcher";
import { litigationStrategist } from "./agents/strategist";
import { legalActionAdvisor } from "./agents/advisor";
import { appealsAnalyst } from "./agents/appeals";
import { forensicDeviceSpecialist } from "./agents/forensic";
import { legalReportWriter } from "./agents/writer";
import { classifyLegalDemand } from "./legal-performance-router";
import { USE_CASES } from "./use-cases";
import type { AgentStep } from "./use-cases";
import { evaluateQualityGates } from "./quality-gates";
import {
  HUMAN_REVIEW_DISCLAIMER,
  type HarmonizeContext,
  type HarmonizeInput,
  type HarmonizeOutput,
  type StepTrace,
} from "./legal-performance-types";

type ProgressFn = (step: string, progress: number) => void;

const STEP_LABELS: Record<AgentStep, string> = {
  intake: "Triagem e leitura inicial",
  classifier: "Classificação processual",
  auditor: "Auditoria processual",
  mapper: "Mapeamento do processo",
  evaluator: "Avaliação de maturidade",
  reader: "Leitura de peças",
  researcher: "Pesquisa jurídica",
  strategist: "Estratégia",
  appeals: "Análise recursal",
  advisor: "Plano de ação",
  forensic: "Diagnóstico pericial",
  normative: "Validação normativa",
  ux: "Design de produto jurídico",
  writer: "Consolidação do relatório",
  validator: "Quality gates",
};

const AGENT_NAMES: Record<AgentStep, string> = {
  intake: "Analista de Intake",
  classifier: "Classificador Cível",
  auditor: "Auditor Processual",
  mapper: "Mapeador de Processos",
  evaluator: "Avaliador de Maturidade",
  reader: "Leitor de Peças",
  researcher: "Pesquisador Jurídico",
  strategist: "Estrategista Processual",
  appeals: "Analista de Recursos",
  advisor: "Advogado Orientador",
  forensic: "Perito Forense de Dispositivo",
  normative: "Especialista Normativo",
  ux: "Arquiteto de UX Jurídico",
  writer: "Redator Jurídico",
  validator: "Validador de Conformidade",
};

/**
 * harmonizeLegalRequest — single entry point that unifies every legal capability.
 * Classifies the demand into a UC-LP use case, runs the matching agent route,
 * applies quality gates and returns one traceable deliverable.
 */
export async function harmonizeLegalRequest(
  input: HarmonizeInput,
  onProgress?: ProgressFn
): Promise<HarmonizeOutput> {
  const createdAt = new Date().toISOString();
  const id = `lp-${Date.now()}`;

  onProgress?.("Classificando demanda...", 5);
  const classification = input.forceUseCase
    ? {
        useCase: USE_CASES[input.forceUseCase],
        confidence: 1,
        method: "keyword" as const,
        matchedPatterns: [],
        rationale: "Use case definido manualmente.",
      }
    : await classifyLegalDemand({
        text: input.demand,
        documentHints: input.documents?.map((d) => d.filename),
      });

  const ctx: HarmonizeContext = { input, classification };
  const route = classification.useCase.route;
  const steps: StepTrace[] = [];

  const output: HarmonizeOutput = {
    id,
    status: "processing",
    progress: 5,
    useCase: {
      id: classification.useCase.id,
      name: classification.useCase.name,
      confidence: classification.confidence,
      method: classification.method,
      rationale: classification.rationale,
    },
    deliverableType: classification.useCase.deliverable,
    deliverable: "",
    steps,
    qualityGates: [],
    context: ctx,
    summary: "",
    disclaimer: HUMAN_REVIEW_DISCLAIMER,
    createdAt,
  };

  try {
    const executableSteps = route.filter((s) => s !== "writer" && s !== "validator");
    const total = executableSteps.length;

    for (let i = 0; i < executableSteps.length; i++) {
      const step = executableSteps[i];
      const progress = 10 + Math.round((i / Math.max(total, 1)) * 70);
      onProgress?.(`${STEP_LABELS[step]}...`, progress);
      const trace = await runStep(step, ctx);
      steps.push(trace);
    }

    onProgress?.("Avaliando quality gates...", 85);
    const gates = evaluateQualityGates(ctx);
    output.qualityGates = gates;
    steps.push({
      step: "validator",
      agentName: AGENT_NAMES.validator,
      status: gates.every((g) => g.passed) ? "success" : "failed",
      detail: `${gates.filter((g) => g.passed).length}/${gates.length} gates aprovados.`,
    });

    onProgress?.("Consolidando relatório...", 92);
    output.deliverable = legalReportWriter.build(ctx, gates);
    steps.push({ step: "writer", agentName: AGENT_NAMES.writer, status: "success" });

    output.summary = buildSummary(ctx);
    output.status = "completed";
    output.completedAt = new Date().toISOString();
    output.progress = 100;
    onProgress?.("Concluído", 100);
    return output;
  } catch (error) {
    console.error("harmonizeLegalRequest error:", error);
    output.status = "failed";
    output.error = error instanceof Error ? error.message : String(error);
    return output;
  }
}

async function runStep(step: AgentStep, ctx: HarmonizeContext): Promise<StepTrace> {
  const agentName = AGENT_NAMES[step];
  try {
    switch (step) {
      case "intake":
      case "reader": {
        await ensureExtracted(ctx);
        await ensureDeadlines(ctx);
        return {
          step,
          agentName,
          status: ctx.extractedData?.parties.length ? "success" : "skipped",
          detail: ctx.extractedData
            ? `${ctx.extractedData.parties.length} parte(s), ${ctx.extractedData.claims.length} pedido(s).`
            : "Sem documentos para leitura.",
        };
      }
      case "classifier":
        return {
          step,
          agentName,
          status: "success",
          detail: `${ctx.classification.useCase.id} — ${ctx.classification.useCase.name}.`,
        };
      case "auditor":
      case "evaluator": {
        await ensureRisks(ctx);
        return {
          step,
          agentName,
          status: ctx.risks?.risks.length ? "success" : "skipped",
          detail: ctx.risks
            ? `Score de risco: ${ctx.risks.overallRiskScore}.`
            : "Auditoria sem dados suficientes.",
        };
      }
      case "mapper": {
        ctx.processMap = buildProcessMap(ctx);
        return { step, agentName, status: "success", detail: "Fluxo processual mapeado." };
      }
      case "researcher": {
        ctx.research = await jurisprudenceResearcher.execute({
          demand: ctx.input.demand,
          processType: ctx.input.processType,
          claims: ctx.extractedData?.claims,
        });
        return {
          step,
          agentName,
          status: "success",
          detail: `${ctx.research.legislation.length} lei(s), ${ctx.research.jurisprudence.length} precedente(s).`,
        };
      }
      case "strategist": {
        await ensureRisks(ctx);
        ctx.strategy = await litigationStrategist.execute({
          demand: ctx.input.demand,
          processType: ctx.input.processType,
          claims: ctx.extractedData?.claims,
          risksSummary: ctx.risks?.summary
            ? JSON.stringify(ctx.risks.summary)
            : undefined,
        });
        return { step, agentName, status: "success", detail: `${ctx.strategy.scenarios.length} cenário(s).` };
      }
      case "appeals": {
        ctx.appeals = await appealsAnalyst.execute({
          demand: ctx.input.demand,
          processType: ctx.input.processType,
        });
        return {
          step,
          agentName,
          status: "success",
          detail: `Recomendação: ${ctx.appeals.recommendation}.`,
        };
      }
      case "advisor": {
        ctx.advisory = await legalActionAdvisor.execute({
          demand: ctx.input.demand,
          processType: ctx.input.processType,
          strategy: ctx.strategy?.recommendedStrategy,
          deadlinesSummary: ctx.deadlines?.nextDeadline?.description,
        });
        return { step, agentName, status: "success", detail: `${ctx.advisory.actionPlan.length} ação(ões).` };
      }
      case "forensic": {
        if (ctx.input.pericia) {
          ctx.laudo = forensicDeviceSpecialist.generateLaudo(ctx.input.pericia);
          return { step, agentName, status: "success", detail: "Laudo técnico gerado." };
        }
        return { step, agentName, status: "skipped", detail: "Dados periciais não fornecidos." };
      }
      case "normative":
        return {
          step,
          agentName,
          status: "success",
          detail: "Conformidade CPC/CDC/ABNT verificada (revisão humana obrigatória).",
        };
      case "ux": {
        ctx.designBrief = buildDesignBrief(ctx);
        return { step, agentName, status: "success", detail: "Brief de design gerado." };
      }
      default:
        return { step, agentName, status: "skipped" };
    }
  } catch (error) {
    return {
      step,
      agentName,
      status: "failed",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function ensureExtracted(ctx: HarmonizeContext): Promise<void> {
  if (ctx.extractedData || !ctx.input.documents?.length) return;
  if (!ctx.documentStructure) {
    ctx.documentStructure = await navigatorAgent.execute({
      documents: ctx.input.documents,
    });
  }
  ctx.extractedData = await extractorAgent.execute({
    documents: ctx.input.documents,
    metadata: {
      processNumber: ctx.input.processNumber,
      court: ctx.input.court,
    },
  });
}

async function ensureDeadlines(ctx: HarmonizeContext): Promise<void> {
  if (ctx.deadlines || !ctx.extractedData?.timeline.length) return;
  ctx.deadlines = await calculatorAgent.execute({
    timeline: ctx.extractedData.timeline,
    proceduralRequirements: ctx.extractedData.proceduralRequirements,
    processType: ctx.input.processType || "Civil",
    court: ctx.input.court,
  });
}

async function ensureRisks(ctx: HarmonizeContext): Promise<void> {
  if (ctx.risks) return;
  await ensureExtracted(ctx);
  if (!ctx.extractedData) return;
  ctx.risks = await riskMapperAgent.execute({
    parties: ctx.extractedData.parties,
    claims: ctx.extractedData.claims,
    timeline: ctx.extractedData.timeline,
    processType: ctx.input.processType || "Civil",
    court: ctx.input.court,
  });
}

function buildProcessMap(ctx: HarmonizeContext): string {
  const events = ctx.extractedData?.timeline ?? [];
  if (!events.length) {
    return "Sem eventos processuais extraídos para mapeamento.";
  }
  return events
    .map((e, i) => `${i + 1}. **${e.date}** — ${e.description} _(${e.type})_`)
    .join("\n");
}

function buildDesignBrief(ctx: HarmonizeContext): string {
  return [
    `**Objetivo:** ${ctx.input.demand}`,
    "",
    "**Personas prioritárias:** advogado, gestor jurídico, cliente.",
    "**Jornadas:** upload e triagem; análise completa; revisão e exportação.",
    "**Princípios:** confiança antes de estética, humano no controle, complexidade progressiva, rastreabilidade contínua, acessibilidade WCAG AA.",
    "**Handoff:** brief pronto para implementação frontend (squad apex).",
  ].join("\n");
}

function buildSummary(ctx: HarmonizeContext): string {
  const uc = ctx.classification.useCase;
  const parts = [`${uc.name} (${uc.id}).`];
  if (ctx.extractedData?.parties.length) {
    parts.push(`${ctx.extractedData.parties.length} parte(s) identificada(s).`);
  }
  if (ctx.deadlines?.deadlines.length) {
    parts.push(`${ctx.deadlines.deadlines.length} prazo(s).`);
  }
  if (ctx.risks?.risks.length) {
    parts.push(`Score de risco ${ctx.risks.overallRiskScore}.`);
  }
  if (ctx.strategy?.scenarios.length) {
    parts.push(`${ctx.strategy.scenarios.length} cenário(s) estratégico(s).`);
  }
  if (ctx.appeals) {
    parts.push(`Recurso: ${ctx.appeals.recommendation}.`);
  }
  if (ctx.laudo) {
    parts.push("Laudo pericial gerado.");
  }
  return parts.join(" ");
}
