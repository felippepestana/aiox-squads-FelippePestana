import { llmGateway } from "./llm-gateway";

interface RiskMapperInput {
  parties: Array<{
    name: string;
    role: "author" | "defendant" | "third_party" | "witness" | "expert";
    attorney?: string;
  }>;
  claims: Array<{
    type: string;
    description: string;
    value?: number;
    status: "pending" | "granted" | "denied" | "partial";
  }>;
  timeline: Array<{
    date: string;
    description: string;
    type: string;
  }>;
  processType: string;
  court?: string;
}

interface Risk {
  id: string;
  category: "probatory" | "procedural" | "substantive" | "economic" | "tactical";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  probability: number;
  impact: "low" | "medium" | "high";
  mitigation: string;
  opportunity?: string;
}

interface RiskMapperOutput {
  risks: Risk[];
  overallRiskScore: number;
  riskTrend: "increasing" | "stable" | "decreasing";
  summary: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: Array<{
    priority: "low" | "medium" | "high";
    action: string;
    rationale: string;
    timeline: string;
  }>;
}

export class RiskMapperAgent {
  name = "Mapeador de Riscos";
  description = "Identifica riscos, oportunidades e estratégias em processos judiciais";

  async execute(input: RiskMapperInput): Promise<RiskMapperOutput> {
    const model = llmGateway.selectModel("complex");

    const prompt = `Você é o Mapeador de Riscos, um agente especializado em análise de riscos processuais brasileiros.

Analise o processo e identifique riscos, oportunidades e recomendações:

TIPO DE PROCESSO: ${input.processType}
TRIBUNAL: ${input.court || "Não especificado"}

PARTES:
${input.parties.map(p => `- ${p.name} (${p.role})${p.attorney ? ` - Adv: ${p.attorney}` : ""}`).join("\n")}

PEDIDOS:
${input.claims.map(c => `- ${c.type}: ${c.description} (${c.status})${c.value ? ` - Valor: R$ ${c.value.toLocaleString("pt-BR")}` : ""}`).join("\n")}

CRONOLOGIA (últimos 5 eventos):
${input.timeline.slice(-5).map(t => `- ${t.date}: ${t.description}`).join("\n")}

Retorne um JSON com:

{
  "risks": [
    {
      "id": "R001",
      "category": "probatory|procedural|substantive|economic|tactical",
      "title": "título do risco",
      "description": "descrição detalhada",
      "severity": "low|medium|high|critical",
      "probability": 0.0-1.0,
      "impact": "low|medium|high",
      "mitigation": "estratégia de mitigação",
      "opportunity": "oportunidade relacionada se houver"
    }
  ],
  "overallRiskScore": 0-100,
  "riskTrend": "increasing|stable|decreasing",
  "summary": {
    "strengths": ["força 1", "força 2"],
    "weaknesses": ["fraqueza 1", "fraqueza 2"],
    "opportunities": ["oportunidade 1", "oportunidade 2"],
    "threats": ["ameaça 1", "ameaça 2"]
  },
  "recommendations": [
    {
      "priority": "low|medium|high",
      "action": "ação recomendada",
      "rationale": "justificativa",
      "timeline": "prazo sugerido"
    }
  ]
}`;

    const response = await llmGateway.complete({
      model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em análise de riscos processuais." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
    });

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as RiskMapperOutput;
      }
      throw new Error("Could not parse response as JSON");
    } catch (error) {
      console.error("RiskMapper agent parse error:", error);
      return {
        risks: [],
        overallRiskScore: 50,
        riskTrend: "stable",
        summary: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
        },
        recommendations: [],
      };
    }
  }
}

export const riskMapperAgent = new RiskMapperAgent();
