import { llmGateway } from "../llm-gateway";

interface CalculatorInput {
  timeline: Array<{
    date: string;
    description: string;
    type: "filing" | "decision" | "hearing" | "motion" | "other";
  }>;
  proceduralRequirements: string[];
  processType: string;
  court?: string;
}

interface Deadline {
  description: string;
  legalBasis: string;
  dueDate: string;
  businessDays: number;
  calendarDays: number;
  urgency: "low" | "medium" | "high" | "critical";
  isAutomatic: boolean;
}

interface CalculatorOutput {
  deadlines: Deadline[];
  nextDeadline: {
    description: string;
    dueDate: string;
    daysRemaining: number;
    urgency: "low" | "medium" | "high" | "critical";
  };
  criticalPath: string[];
  warnings: string[];
}

const BUSINESS_DAYS_PERIODS: Record<string, number> = {
  "contestação": 15,
  "replica": 15,
  "tríplica": 15,
  "apelação": 15,
  "agravo": 10,
  "recurso": 15,
  "manifestação": 15,
  "audiência": 30,
  "perícia": 30,
  "execução": 30,
};

export class CalculatorAgent {
  name = "Calculador de Prazos";
  description = "Calcula prazos processuais com base na legislação brasileira (CPC 2015)";

  private isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  private addBusinessDays(startDate: Date, days: number): Date {
    const result = new Date(startDate);
    let daysAdded = 0;
    
    while (daysAdded < days) {
      result.setDate(result.getDate() + 1);
      if (this.isBusinessDay(result)) {
        daysAdded++;
      }
    }
    
    return result;
  }

  private calculateCalendarDays(startDate: Date, endDate: Date): number {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private getUrgency(businessDays: number): "low" | "medium" | "high" | "critical" {
    if (businessDays <= 3) return "critical";
    if (businessDays <= 7) return "high";
    if (businessDays <= 15) return "medium";
    return "low";
  }

  async execute(input: CalculatorInput): Promise<CalculatorOutput> {
    const model = llmGateway.selectModel("simple");
    
    const lastEvent = input.timeline[input.timeline.length - 1];
    const startDate = lastEvent ? new Date(lastEvent.date) : new Date();

    const prompt = `Você é o Calculador de Prazos, um agente especializado em prazos processuais brasileiros conforme CPC 2015.

Com base nos seguintes dados:

TIPO DE PROCESSO: ${input.processType}
TRIBUNAL: ${input.court || "Não especificado"}

EVENTOS PROCESSUAIS:
${input.timeline.map(e => `- ${e.date}: ${e.description} (${e.type})`).join("\n")}

REQUISITOS PROCESSUAIS:
${input.proceduralRequirements.map(r => `- ${r}`).join("\n")}

Analise e retorne um JSON com:

{
  "deadlines": [
    {
      "description": "descrição do prazo",
      "legalBasis": "fundamentação legal (ex: CPC art. 335)",
      "dueDate": "YYYY-MM-DD",
      "businessDays": número de dias úteis,
      "calendarDays": número de dias corridos,
      "urgency": "low|medium|high|critical",
      "isAutomatic": true/false
    }
  ],
  "nextDeadline": {
    "description": "próximo prazo mais urgente",
    "dueDate": "YYYY-MM-DD",
    "daysRemaining": número de dias restantes,
    "urgency": "low|medium|high|critical"
  },
  "criticalPath": ["evento1", "evento2"],
  "warnings": ["alerta1", "alerta2"]
}`;

    const response = await llmGateway.complete({
      model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em prazos processuais brasileiros." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]) as CalculatorOutput;
        
        result.deadlines = result.deadlines.map((deadline) => {
          const dueDate = new Date(deadline.dueDate);
          const businessDays = deadline.businessDays;
          const calendarDays = this.calculateCalendarDays(startDate, dueDate);
          
          return {
            ...deadline,
            dueDate: dueDate.toISOString().split("T")[0],
            calendarDays,
            urgency: this.getUrgency(businessDays),
          };
        });

        return result;
      }
      throw new Error("Could not parse response as JSON");
    } catch (error) {
      console.error("Calculator agent parse error:", error);
      return {
        deadlines: [],
        nextDeadline: {
          description: "Não foi possível calcular",
          dueDate: new Date().toISOString().split("T")[0],
          daysRemaining: 0,
          urgency: "medium",
        },
        criticalPath: [],
        warnings: ["Erro ao processar prazos"],
      };
    }
  }
}

export const calculatorAgent = new CalculatorAgent();
export type { CalculatorOutput };
