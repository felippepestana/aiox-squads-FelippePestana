import { runJsonAgent, type TraceableSource } from "./shared";

export interface ResearcherInput {
  demand: string;
  processType?: string;
  claims?: Array<{ type: string; description: string }>;
}

export interface ResearcherOutput {
  legislation: TraceableSource[];
  jurisprudence: TraceableSource[];
  summary: string;
}

export class JurisprudenceResearcher {
  name = "Pesquisador Jurídico";
  description =
    "Pesquisa legislação, CPC, STF/STJ, súmulas e repetitivos com rastreabilidade";

  async execute(input: ResearcherInput): Promise<ResearcherOutput> {
    const prompt = `Pesquise fundamentos jurídicos brasileiros para a demanda abaixo.

DEMANDA: ${input.demand}
TIPO DE PROCESSO: ${input.processType || "não informado"}
${
  input.claims?.length
    ? `PEDIDOS:\n${input.claims.map((c) => `- ${c.type}: ${c.description}`).join("\n")}`
    : ""
}

Retorne JSON com legislação e jurisprudência aplicáveis. Toda fonte deve indicar referência, data (se conhecida) e confiabilidade. NUNCA invente número de processo, súmula ou tese; se não tiver certeza, use reliability "baixa" e diga na referência que requer verificação.

{
  "legislation": [
    {"kind": "lei", "reference": "CPC, art. 300", "detail": "tutela de urgência", "reliability": "alta"}
  ],
  "jurisprudence": [
    {"kind": "jurisprudência", "reference": "STJ, Tema X (verificar)", "detail": "...", "reliability": "baixa"}
  ],
  "summary": "síntese da fundamentação"
}`;

    return runJsonAgent<ResearcherOutput>({
      complexity: "complex",
      system:
        "Você é pesquisador jurídico. Priorize precisão e rastreabilidade. Não fabrique precedentes.",
      prompt,
      temperature: 0.2,
      fallback: { legislation: [], jurisprudence: [], summary: "" },
    });
  }
}

export const jurisprudenceResearcher = new JurisprudenceResearcher();
