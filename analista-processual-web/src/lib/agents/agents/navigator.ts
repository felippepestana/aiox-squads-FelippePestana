import { llmGateway, type TaskComplexity } from "../llm-gateway";

interface NavigatorInput {
  documents: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

interface NavigatorOutput {
  indexed: boolean;
  documentStructure: Array<{
    filename: string;
    pageCount: number;
    sections: string[];
    keyElements: string[];
  }>;
  navigationMap: {
    primaryDocument: string;
    supportingDocuments: string[];
    order: string[];
  };
  metadata: {
    processNumber?: string;
    court?: string;
    parties?: string[];
    judge?: string;
  };
}

export class NavigatorAgent {
  name = "Navegador de Arquivos";
  description = "Indexa e organiza documentos processuais, identificando estrutura e elementos-chave";
  
  async execute(input: NavigatorInput): Promise<NavigatorOutput> {
    const model = llmGateway.selectModel("moderate");
    
    const prompt = `Você é o Navegador de Arquivos, um agente especializado em análise documental jurídica brasileira.

Sua tarefa é analisar os documentos fornecidos e criar um mapa de navegação estruturado.

DOCUMENTOS:
${input.documents.map(d => `--- ${d.filename} ---\n${d.content}`).join("\n\n")}

Analise e retorne um JSON com:
{
  "indexed": true/false,
  "documentStructure": [
    {
      "filename": "nome do arquivo",
      "pageCount": número estimado de páginas,
      "sections": ["seção 1", "seção 2"],
      "keyElements": ["elemento 1", "elemento 2"]
    }
  ],
  "navigationMap": {
    "primaryDocument": "documento principal",
    "supportingDocuments": ["doc1", "doc2"],
    "order": ["ordem de leitura"]
  },
  "metadata": {
    "processNumber": "número do processo se encontrado",
    "court": "tribunal se identificado",
    "parties": ["parte 1", "parte 2"],
    "judge": "juiz se identificado"
  }
}`;

    const response = await llmGateway.complete({
      model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em análise documental jurídica." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as NavigatorOutput;
      }
      throw new Error("Could not parse response as JSON");
    } catch (error) {
      console.error("Navigator agent parse error:", error);
      return {
        indexed: false,
        documentStructure: [],
        navigationMap: {
          primaryDocument: input.documents[0]?.filename || "",
          supportingDocuments: [],
          order: input.documents.map(d => d.filename),
        },
        metadata: {},
      };
    }
  }
}

export const navigatorAgent = new NavigatorAgent();
export type { NavigatorOutput };
