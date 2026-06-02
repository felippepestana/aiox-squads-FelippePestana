import { runJsonAgent } from "./shared";

export interface AdvisorInput {
  demand: string;
  processType?: string;
  strategy?: string;
  deadlinesSummary?: string;
}

export interface ActionItem {
  action: string;
  priority: "baixa" | "média" | "alta" | "urgente";
  deadline?: string;
  responsible?: string;
}

export interface AdvisorOutput {
  actionPlan: ActionItem[];
  urgentMeasures: string[];
  clientCommunication: string;
}

export class LegalActionAdvisor {
  name = "Advogado Orientador";
  description = "Plano de ação, prazos, medidas urgentes e comunicação ao cliente";

  async execute(input: AdvisorInput): Promise<AdvisorOutput> {
    const prompt = `Elabore o plano de ação jurídico.

DEMANDA: ${input.demand}
TIPO: ${input.processType || "não informado"}
${input.strategy ? `ESTRATÉGIA: ${input.strategy}` : ""}
${input.deadlinesSummary ? `PRAZOS: ${input.deadlinesSummary}` : ""}

Retorne JSON:
{
  "actionPlan": [
    {"action": "...", "priority": "alta", "deadline": "...", "responsible": "..."}
  ],
  "urgentMeasures": ["..."],
  "clientCommunication": "mensagem simplificada ao cliente em linguagem acessível"
}`;

    return runJsonAgent<AdvisorOutput>({
      complexity: "moderate",
      system:
        "Você é advogado orientador. Traduza estratégia em ações concretas e linguagem clara para o cliente.",
      prompt,
      temperature: 0.4,
      fallback: { actionPlan: [], urgentMeasures: [], clientCommunication: "" },
    });
  }
}

export const legalActionAdvisor = new LegalActionAdvisor();
