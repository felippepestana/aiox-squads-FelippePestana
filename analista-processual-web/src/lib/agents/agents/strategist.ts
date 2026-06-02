import { runJsonAgent } from "./shared";

export interface StrategistInput {
  demand: string;
  processType?: string;
  claims?: Array<{ type: string; description: string }>;
  risksSummary?: string;
}

export interface Scenario {
  label: "otimista" | "realista" | "pessimista";
  probability: number;
  outcome: string;
}

export interface StrategistOutput {
  scenarios: Scenario[];
  settlementViability: string;
  recommendedStrategy: string;
}

export class LitigationStrategist {
  name = "Estrategista Processual";
  description = "Produz cenários quantificados, viabilidade de acordo e tática";

  async execute(input: StrategistInput): Promise<StrategistOutput> {
    const prompt = `Defina a estratégia processual para a demanda.

DEMANDA: ${input.demand}
TIPO: ${input.processType || "não informado"}
${input.risksSummary ? `RISCOS: ${input.risksSummary}` : ""}
${
  input.claims?.length
    ? `PEDIDOS:\n${input.claims.map((c) => `- ${c.type}: ${c.description}`).join("\n")}`
    : ""
}

Retorne JSON. Os três cenários DEVEM somar 100% de probabilidade e indicar premissas no campo outcome.

{
  "scenarios": [
    {"label": "otimista", "probability": 0.25, "outcome": "..."},
    {"label": "realista", "probability": 0.55, "outcome": "..."},
    {"label": "pessimista", "probability": 0.20, "outcome": "..."}
  ],
  "settlementViability": "análise de acordo",
  "recommendedStrategy": "tática recomendada"
}`;

    const result = await runJsonAgent<StrategistOutput>({
      complexity: "complex",
      system:
        "Você é estrategista jurídico. Quantifique cenários com honestidade probabilística.",
      prompt,
      temperature: 0.4,
      fallback: {
        scenarios: [],
        settlementViability: "",
        recommendedStrategy: "",
      },
    });

    return this.normalizeScenarios(result);
  }

  /** QG-LP-004: scenarios must sum to 100%. Renormalizes if the model drifts. */
  private normalizeScenarios(output: StrategistOutput): StrategistOutput {
    const total = output.scenarios.reduce((s, c) => s + (c.probability || 0), 0);
    if (total > 0 && Math.abs(total - 1) > 0.01) {
      output.scenarios = output.scenarios.map((c) => ({
        ...c,
        probability: Math.round((c.probability / total) * 100) / 100,
      }));
    }
    return output;
  }
}

export const litigationStrategist = new LitigationStrategist();
