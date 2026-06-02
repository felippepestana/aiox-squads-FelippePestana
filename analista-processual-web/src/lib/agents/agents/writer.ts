import type {
  HarmonizeContext,
  QualityGateResult,
} from "../legal-performance-types";
import { HUMAN_REVIEW_DISCLAIMER } from "../legal-performance-types";
import type { TraceableSource } from "./shared";

/**
 * Legal report writer — consolidates the aggregated context into a single
 * traceable Markdown deliverable. Deterministic (no LLM) so it always produces
 * output even without API keys; layered per DESIGN_GUIDE "complexidade progressiva".
 */
export class LegalReportWriter {
  name = "Redator Jurídico";
  description = "Consolida relatórios/laudos com citações rastreadas e quality gates";

  build(ctx: HarmonizeContext, gates: QualityGateResult[]): string {
    const uc = ctx.classification.useCase;

    if (uc.deliverable === "laudo" && ctx.laudo) {
      return `${ctx.laudo}\n\n---\n\n${this.gatesSection(gates)}\n\n> ${HUMAN_REVIEW_DISCLAIMER}`;
    }

    const sections: string[] = [];
    sections.push(`# ${uc.name}`);
    sections.push(
      `> **Use case:** ${uc.id} · **Confiança:** ${(
        ctx.classification.confidence * 100
      ).toFixed(0)}% · **Método:** ${ctx.classification.method}\n>\n> ${ctx.classification.rationale}`
    );

    if (ctx.input.processNumber || ctx.input.court) {
      sections.push(
        `**Processo:** ${ctx.input.processNumber || "—"} · **Juízo:** ${ctx.input.court || "—"}`
      );
    }

    sections.push(`## Demanda\n\n${ctx.input.demand}`);

    if (ctx.extractedData && ctx.extractedData.parties.length) {
      sections.push(this.partiesSection(ctx));
    }
    if (ctx.deadlines && ctx.deadlines.deadlines.length) {
      sections.push(this.deadlinesSection(ctx));
    }
    if (ctx.risks && ctx.risks.risks.length) {
      sections.push(this.risksSection(ctx));
    }
    if (ctx.research) {
      sections.push(this.researchSection(ctx));
    }
    if (ctx.strategy) {
      sections.push(this.strategySection(ctx));
    }
    if (ctx.appeals) {
      sections.push(this.appealsSection(ctx));
    }
    if (ctx.processMap) {
      sections.push(`## Mapeamento do Processo\n\n${ctx.processMap}`);
    }
    if (ctx.designBrief) {
      sections.push(`## Brief de Produto Jurídico\n\n${ctx.designBrief}`);
    }
    if (ctx.advisory) {
      sections.push(this.advisorySection(ctx));
    }

    sections.push(this.gatesSection(gates));
    sections.push(`---\n\n> ${HUMAN_REVIEW_DISCLAIMER}`);

    return sections.join("\n\n");
  }

  private partiesSection(ctx: HarmonizeContext): string {
    const rows = ctx.extractedData!.parties
      .map((p) => `| ${p.name} | ${p.role} | ${p.attorney || "—"} |`)
      .join("\n");
    return `## Partes\n\n| Nome | Polo | Advogado |\n|---|---|---|\n${rows}`;
  }

  private deadlinesSection(ctx: HarmonizeContext): string {
    const rows = ctx
      .deadlines!.deadlines.slice(0, 10)
      .map((d) => `| ${d.description} | ${d.dueDate} | ${d.urgency} |`)
      .join("\n");
    return `## Prazos\n\n| Descrição | Vencimento | Urgência |\n|---|---|---|\n${rows}`;
  }

  private risksSection(ctx: HarmonizeContext): string {
    const rows = ctx
      .risks!.risks.slice(0, 8)
      .map(
        (r) =>
          `| ${r.title} | ${r.severity} | ${(r.probability * 100).toFixed(0)}% |`
      )
      .join("\n");
    return `## Riscos (score geral: ${ctx.risks!.overallRiskScore})\n\n| Risco | Severidade | Probabilidade |\n|---|---|---|\n${rows}`;
  }

  private researchSection(ctx: HarmonizeContext): string {
    const fmt = (s: TraceableSource) =>
      `- **${s.reference}** ${s.detail ? `— ${s.detail}` : ""} _(confiabilidade: ${s.reliability})_`;
    const leg = ctx.research!.legislation.map(fmt).join("\n") || "_Nenhuma._";
    const jur = ctx.research!.jurisprudence.map(fmt).join("\n") || "_Nenhuma._";
    return `## Fundamentação Jurídica\n\n### Legislação\n\n${leg}\n\n### Jurisprudência\n\n${jur}\n\n${ctx.research!.summary}`;
  }

  private strategySection(ctx: HarmonizeContext): string {
    const rows = ctx
      .strategy!.scenarios.map(
        (s) => `| ${s.label} | ${(s.probability * 100).toFixed(0)}% | ${s.outcome} |`
      )
      .join("\n");
    return `## Estratégia\n\n| Cenário | Probabilidade | Desfecho |\n|---|---|---|\n${rows}\n\n**Acordo:** ${ctx.strategy!.settlementViability}\n\n**Recomendação:** ${ctx.strategy!.recommendedStrategy}`;
  }

  private appealsSection(ctx: HarmonizeContext): string {
    const a = ctx.appeals!;
    return `## Análise Recursal — ${a.appealType}\n\n- **Tempestividade:** ${a.admissibility.timeliness}\n- **Legitimidade:** ${a.admissibility.standing}\n- **Prequestionamento:** ${a.admissibility.prequestioning}\n- **Admissível:** ${a.admissibility.admissible ? "Sim" : "Não"}\n\n**Mérito:** ${a.meritAnalysis}\n\n**Recomendação:** ${a.recommendation}`;
  }

  private advisorySection(ctx: HarmonizeContext): string {
    const plan = ctx
      .advisory!.actionPlan.map(
        (a) => `| ${a.action} | ${a.priority} | ${a.deadline || "—"} | ${a.responsible || "—"} |`
      )
      .join("\n");
    const urgent = ctx.advisory!.urgentMeasures.map((m) => `- ${m}`).join("\n");
    return `## Plano de Ação\n\n| Ação | Prioridade | Prazo | Responsável |\n|---|---|---|---|\n${plan}\n\n### Medidas Urgentes\n\n${urgent || "_Nenhuma._"}\n\n### Comunicação ao Cliente\n\n${ctx.advisory!.clientCommunication}`;
  }

  private gatesSection(gates: QualityGateResult[]): string {
    const rows = gates
      .map(
        (g) =>
          `| ${g.id} | ${g.name} | ${g.passed ? "✅" : "❌"} | ${g.blocking ? "Sim" : "Não"} | ${g.detail} |`
      )
      .join("\n");
    return `## Quality Gates\n\n| ID | Gate | Aprovado | Bloqueante | Detalhe |\n|---|---|---|---|---|\n${rows}`;
  }
}

export const legalReportWriter = new LegalReportWriter();
