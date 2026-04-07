import { llmGateway } from "./llm-gateway";

interface ExtractorInput {
  documents: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
  metadata?: {
    processNumber?: string;
    court?: string;
  };
}

interface Party {
  name: string;
  role: "author" | "defendant" | "third_party" | "witness" | "expert";
  document?: string;
  attorney?: string;
}

interface ExtractorOutput {
  success: boolean;
  parties: Party[];
  timeline: Array<{
    date: string;
    description: string;
    type: "filing" | "decision" | "hearing" | "motion" | "other";
  }>;
  claims: Array<{
    type: string;
    description: string;
    value?: number;
    status: "pending" | "granted" | "denied" | "partial";
  }>;
  documents: Array<{
    type: string;
    description: string;
    date?: string;
  }>;
  proceduralRequirements: string[];
}

export class ExtractorAgent {
  name = "Extrator de Documentos";
  description = "Extrai dados estruturados de petições e decisões processuais";

  async execute(input: ExtractorInput): Promise<ExtractorOutput> {
    const model = llmGateway.selectModel("moderate");

    const prompt = `Você é o Extrator de Documentos, um agente especializado em extração de dados estruturados de processos judiciais brasileiros.

Analise os documentos e extraia as seguintes informações:

DOCUMENTOS:
${input.documents.map(d => `--- ${d.filename} ---\n${d.content}`).join("\n\n")}

Retorne um JSON com:

{
  "success": true/false,
  "parties": [
    {
      "name": "nome da parte",
      "role": "author|defendant|third_party|witness|expert",
      "document": "CPF/CNPJ se disponível",
      "attorney": "advogado se disponível"
    }
  ],
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "description": "descrição do evento",
      "type": "filing|decision|hearing|motion|other"
    }
  ],
  "claims": [
    {
      "type": "tipo de pedido (ex: danos morais, eviction, etc)",
      "description": "descrição do pedido",
      "value": valor_se_houver,
      "status": "pending|granted|denied|partial"
    }
  ],
  "documents": [
    {
      "type": "tipo de documento",
      "description": "descrição",
      "date": "data se disponível"
    }
  ],
  "proceduralRequirements": [
    "requisito 1",
    "requisito 2"
  ]
}`;

    const response = await llmGateway.complete({
      model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em extração de dados jurídicos." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ExtractorOutput;
      }
      throw new Error("Could not parse response as JSON");
    } catch (error) {
      console.error("Extractor agent parse error:", error);
      return {
        success: false,
        parties: [],
        timeline: [],
        claims: [],
        documents: [],
        proceduralRequirements: [],
      };
    }
  }
}

export const extractorAgent = new ExtractorAgent();
