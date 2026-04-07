import { llmGateway } from "../llm-gateway";

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

    const prompt = `Você é o Extrator de Documentos, um agente especializado em extração estruturada de processos judiciais brasileiros.

TAREFA: Analise os documentos processuais fornecidos e extraia dados estruturados com máxima precisão.

DOCUMENTOS A PROCESSAR:
${input.documents.map(d => `\n--- DOCUMENTO: ${d.filename} (Tipo: ${d.type}) ---\n${d.content}`).join("\n")}

CONTEXTO PROCESSUAL:
- Número do processo: ${input.metadata?.processNumber || "não informado"}
- Tribunal: ${input.metadata?.court || "não informado"}

INSTRUÇÕES DE EXTRAÇÃO - CADEIA DE PENSAMENTO:

1. PARTES PROCESSUAIS:
   - Identifique autor, réu, terceiros, testemunhas, peritos
   - Procure por: CPF/CNPJ, nomes (geralmente em CAIXA ALTA), roles explícitos
   - REGRA: Se incerto, classifique como "third_party"
   - IMPORTANTE: Advogados aparecem como "assistido por", "representado por", "procurador"

2. CRONOLOGIA DE EVENTOS:
   - Procure por datas em formato DD/MM/AAAA ou similar
   - Mapeie: petição inicial, decisões, audiências, moções
   - VALIDAÇÃO: Se data > hoje, assume-se data futura (ex: prazos)
   - Ordene por data ascendente

3. PEDIDOS/PRETENSÕES:
   - Identifique cada "pedido" ou "pretensão" listado
   - Procure por valores monetários (R$ ou numéricos)
   - Determine status: pendente (padrão), concedido (se sentença/decisão), negado, parcialmente concedido
   - IMPORTANTE: Diferencie pedidos principais de pedidos liminares

4. DOCUMENTOS COMPROBATÓRIOS:
   - Cataloge documentos mencionados: contratos, recibos, fotos, testemunhos, laudos
   - Procure por referências de anexos: "em anexo", "anexo A", "documento I"
   - TIPO: contrato, comprovante, laudo, depoimento, fotografia, outro

5. REQUISITOS PROCEDIMENTAIS:
   - Procure por cláusulas de previsão legal (ex: "conforme art. 123 do CPC")
   - Identifique: custas processuais mencionadas, prazos legais, poderes especiais do juiz
   - EXEMPLO: "condenação ao pagamento de custas processuais", "depósito caução obrigatório"

EXEMPLO DE SAÍDA ESPERADA:
{
  "success": true,
  "parties": [
    {
      "name": "João Silva Santos",
      "role": "author",
      "document": "123.456.789-00",
      "attorney": "Dra. Maria Oliveira - OAB/SP 123456"
    },
    {
      "name": "Empresa XYZ Ltda",
      "role": "defendant",
      "document": "12.345.678/0001-90",
      "attorney": "Dr. Paulo Costa - OAB/RJ 654321"
    }
  ],
  "timeline": [
    {"date": "2024-03-15", "description": "Petição inicial ajuizada", "type": "filing"},
    {"date": "2024-04-20", "description": "Audiência de instrução e julgamento", "type": "hearing"},
    {"date": "2024-05-10", "description": "Sentença proferida", "type": "decision"}
  ],
  "claims": [
    {
      "type": "Danos morais",
      "description": "Compensação por danos morais causados por abuso de direito",
      "value": 50000.00,
      "status": "pending"
    }
  ],
  "documents": [
    {"type": "contrato", "description": "Contrato de prestação de serviços", "date": "2023-01-10"},
    {"type": "comprovante", "description": "Recibo de pagamento", "date": "2024-01-15"}
  ],
  "proceduralRequirements": [
    "Condenação ao pagamento de custas processuais e honorários advocatícios",
    "Depósito em caução de 10% do valor da causa"
  ]
}

REGRAS DE VALIDAÇÃO:
- Datas: formato YYYY-MM-DD, rejeitar se inválidas
- Valores: formato numérico com casas decimais
- Nomes: mínimo 3 caracteres, máximo 200
- Retorne "success": false apenas se documento vazio ou inelegível
- Se informação está ausente: OMITA do array (não use null/undefined)
- Se inseguro: ADICIONE comentário na descrição relevante

Retorne APENAS JSON válido, sem markdown, sem explicações adicionais:`;

    const response = await llmGateway.complete({
      model,
      messages: [
        {
          role: "system",
          content: "Você é um especialista em extração de dados jurídicos. Sempre retorne JSON válido e bem-formatado. Não adicione explicações ou markdown."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
    });

    try {
      // Extrair JSON da resposta
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON in response");
      }

      const parsed = JSON.parse(jsonMatch[0]) as ExtractorOutput;

      // Validação estrutural
      return this.validateAndSanitize(parsed);
    } catch (error) {
      console.error("Extractor agent parse error:", error);
      console.error("Raw response:", response.content.substring(0, 500));

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

  private validateAndSanitize(output: unknown): ExtractorOutput {
    const result: ExtractorOutput = {
      success: false,
      parties: [],
      timeline: [],
      claims: [],
      documents: [],
      proceduralRequirements: [],
    };

    if (!output || typeof output !== "object") {
      return result;
    }

    const o = output as Record<string, unknown>;

    // Validar success flag
    if (typeof o.success === "boolean") {
      result.success = o.success;
    }

    // Validar parties
    if (Array.isArray(o.parties)) {
      result.parties = o.parties
        .filter((p): p is Party => this.isValidParty(p))
        .slice(0, 50); // Limite máximo
    }

    // Validar timeline com ordenação por data
    if (Array.isArray(o.timeline)) {
      result.timeline = o.timeline
        .filter((t): t is ExtractorOutput["timeline"][0] => this.isValidTimelineEntry(t))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 100);
    }

    // Validar claims
    if (Array.isArray(o.claims)) {
      result.claims = o.claims
        .filter((c): c is ExtractorOutput["claims"][0] => this.isValidClaim(c))
        .slice(0, 50);
    }

    // Validar documents
    if (Array.isArray(o.documents)) {
      result.documents = o.documents
        .filter((d): d is ExtractorOutput["documents"][0] => this.isValidDocument(d))
        .slice(0, 100);
    }

    // Validar procedural requirements
    if (Array.isArray(o.proceduralRequirements)) {
      result.proceduralRequirements = o.proceduralRequirements
        .filter((r): r is string => typeof r === "string" && r.length > 0)
        .map(r => r.substring(0, 500))
        .slice(0, 20);
    }

    return result;
  }

  private isValidParty(obj: unknown): obj is Party {
    if (!obj || typeof obj !== "object") return false;
    const p = obj as Record<string, unknown>;
    return (
      typeof p.name === "string" &&
      p.name.length >= 3 &&
      p.name.length <= 200 &&
      ["author", "defendant", "third_party", "witness", "expert"].includes(
        String(p.role)
      )
    );
  }

  private isValidTimelineEntry(obj: unknown): obj is ExtractorOutput["timeline"][0] {
    if (!obj || typeof obj !== "object") return false;
    const t = obj as Record<string, unknown>;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    try {
      const dateValid = typeof t.date === "string" && dateRegex.test(t.date);
      const dateObj = new Date(t.date as string);
      const isValidDate = dateValid && !isNaN(dateObj.getTime());

      return (
        isValidDate &&
        typeof t.description === "string" &&
        t.description.length > 0 &&
        ["filing", "decision", "hearing", "motion", "other"].includes(String(t.type))
      );
    } catch {
      return false;
    }
  }

  private isValidClaim(obj: unknown): obj is ExtractorOutput["claims"][0] {
    if (!obj || typeof obj !== "object") return false;
    const c = obj as Record<string, unknown>;
    return (
      typeof c.type === "string" &&
      c.type.length > 0 &&
      typeof c.description === "string" &&
      c.description.length > 0 &&
      ["pending", "granted", "denied", "partial"].includes(String(c.status)) &&
      (c.value === undefined || typeof c.value === "number")
    );
  }

  private isValidDocument(obj: unknown): obj is ExtractorOutput["documents"][0] {
    if (!obj || typeof obj !== "object") return false;
    const d = obj as Record<string, unknown>;
    return (
      typeof d.type === "string" &&
      d.type.length > 0 &&
      typeof d.description === "string" &&
      d.description.length > 0
    );
  }
}

export const extractorAgent = new ExtractorAgent();
