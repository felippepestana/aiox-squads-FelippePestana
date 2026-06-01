import { runJsonAgent, type TraceableSource } from "./shared";

export interface AppealsInput {
  demand: string;
  decisionContext?: string;
  processType?: string;
}

export interface AppealsOutput {
  appealType: string;
  admissibility: {
    timeliness: string;
    standing: string;
    prequestioning: string;
    otherRequirements: string[];
    admissible: boolean;
  };
  meritAnalysis: string;
  recommendation: "interpor" | "não interpor" | "interpor com cautelas";
  sources: TraceableSource[];
}

export class AppealsAnalyst {
  name = "Analista de Recursos";
  description =
    "Avalia admissibilidade e mérito recursal (apelação, agravo, REsp, RE, embargos)";

  async execute(input: AppealsInput): Promise<AppealsOutput> {
    const prompt = `Analise a estratégia recursal.

DEMANDA: ${input.demand}
TIPO DE PROCESSO: ${input.processType || "não informado"}
${input.decisionContext ? `DECISÃO IMPUGNADA: ${input.decisionContext}` : ""}

Avalie admissibilidade (tempestividade, legitimidade, prequestionamento, preparo) e mérito. Retorne JSON:
{
  "appealType": "apelação|agravo|recurso especial|...",
  "admissibility": {
    "timeliness": "...", "standing": "...", "prequestioning": "...",
    "otherRequirements": ["..."], "admissible": true
  },
  "meritAnalysis": "...",
  "recommendation": "interpor|não interpor|interpor com cautelas",
  "sources": [{"kind": "lei", "reference": "CPC, art. 1.010", "reliability": "alta"}]
}`;

    return runJsonAgent<AppealsOutput>({
      complexity: "complex",
      system:
        "Você é analista de recursos. Seja rigoroso com requisitos de admissibilidade e cite o CPC.",
      prompt,
      temperature: 0.3,
      fallback: {
        appealType: "",
        admissibility: {
          timeliness: "",
          standing: "",
          prequestioning: "",
          otherRequirements: [],
          admissible: false,
        },
        meritAnalysis: "",
        recommendation: "interpor com cautelas",
        sources: [],
      },
    });
  }
}

export const appealsAnalyst = new AppealsAnalyst();
