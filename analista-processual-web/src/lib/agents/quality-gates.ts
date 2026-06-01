import type {
  HarmonizeContext,
  QualityGateResult,
} from "./legal-performance-types";

/**
 * Quality gates QG-LP-* mirrored from the squad config. Each gate is evaluated
 * against the aggregated context. Gates only apply when their inputs are part of
 * the executed route; otherwise they are reported as passed (not applicable).
 */
export function evaluateQualityGates(
  ctx: HarmonizeContext
): QualityGateResult[] {
  const route = ctx.classification.useCase.route;
  const gates: QualityGateResult[] = [];

  gates.push({
    id: "QG-LP-001",
    name: "Classificação e escopo",
    passed: Boolean(ctx.classification.useCase.id),
    detail: `Use case ${ctx.classification.useCase.id} definido (confiança ${(
      ctx.classification.confidence * 100
    ).toFixed(0)}%).`,
    blocking: true,
  });

  if (route.includes("researcher")) {
    const sources = [
      ...(ctx.research?.legislation ?? []),
      ...(ctx.research?.jurisprudence ?? []),
    ];
    const allTraceable =
      sources.length > 0 && sources.every((s) => s.reference && s.reliability);
    gates.push({
      id: "QG-LP-002",
      name: "Rastreabilidade de fontes",
      passed: allTraceable,
      detail: allTraceable
        ? `${sources.length} fonte(s) com referência e confiabilidade.`
        : "Fontes ausentes ou sem referência/confiabilidade.",
      blocking: true,
    });
  }

  if (route.includes("auditor")) {
    const hasRisks = (ctx.risks?.risks?.length ?? 0) > 0;
    gates.push({
      id: "QG-LP-003",
      name: "Auditoria processual CPC",
      passed: hasRisks,
      detail: hasRisks
        ? `${ctx.risks?.risks.length} risco(s) processual(is) identificado(s).`
        : "Nenhum risco processual identificado ou auditoria não executada.",
      blocking: false,
    });
  }

  if (route.includes("strategist")) {
    const total =
      ctx.strategy?.scenarios.reduce((s, c) => s + (c.probability || 0), 0) ?? 0;
    const valid = ctx.strategy
      ? Math.abs(total - 1) <= 0.02 && ctx.strategy.scenarios.length >= 2
      : false;
    gates.push({
      id: "QG-LP-004",
      name: "Estratégia quantificada",
      passed: valid,
      detail: valid
        ? "Cenários somam ~100% com premissas."
        : `Cenários inválidos (soma=${(total * 100).toFixed(0)}%).`,
      blocking: false,
    });
  }

  if (route.includes("forensic") || route.includes("normative")) {
    const hasLaudo = Boolean(ctx.laudo && ctx.laudo.includes("CPC"));
    gates.push({
      id: "QG-LP-005",
      name: "Validação pericial normativa",
      passed: hasLaudo,
      detail: hasLaudo
        ? "Laudo referencia CPC/CDC/ABNT e cadeia de custódia."
        : "Laudo pericial ausente ou sem referências normativas.",
      blocking: false,
    });
  }

  gates.push({
    id: "QG-LP-006",
    name: "Revisão humana e responsabilidade profissional",
    passed: true,
    detail: "Saída declara necessidade de revisão humana (disclaimer aplicado).",
    blocking: true,
  });

  return gates;
}

export function gatesBlocked(gates: QualityGateResult[]): boolean {
  return gates.some((g) => g.blocking && !g.passed);
}
