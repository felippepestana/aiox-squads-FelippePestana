import { llmGateway } from "./llm-gateway";
import { navigatorAgent, type NavigatorOutput } from "./agents/navigator";
import { extractorAgent, type ExtractorOutput } from "./agents/extractor";
import { calculatorAgent, type CalculatorOutput } from "./agents/calculator";
import { riskMapperAgent, type RiskMapperOutput } from "./agents/risk-mapper";

export interface DocumentInput {
  filename: string;
  content: string;
  type: string;
}

export interface ChiefInput {
  documents: DocumentInput[];
  processType?: string;
  analysisGoal?: string;
}

export interface ChiefOutput {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  documentStructure: NavigatorOutput;
  extractedData: ExtractorOutput;
  deadlines: CalculatorOutput;
  risks: RiskMapperOutput;
  summary: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface StepResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ChiefAgent {
  name = "Analista Chief";
  description = "Orquestrador que coordena análise processual completa";

  private formatError(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  async execute(
    input: ChiefInput,
    onProgress?: (step: string, progress: number) => void
  ): Promise<ChiefOutput> {
    const startTime = Date.now();
    const result: ChiefOutput = {
      id: `analysis-${Date.now()}`,
      status: "processing",
      progress: 0,
      documentStructure: { indexed: false, documentStructure: [], navigationMap: { primaryDocument: "", supportingDocuments: [], order: [] }, metadata: {} },
      extractedData: { success: false, parties: [], timeline: [], claims: [], documents: [], proceduralRequirements: [] },
      deadlines: { deadlines: [], nextDeadline: { description: "", dueDate: "", daysRemaining: 0, urgency: "medium" }, criticalPath: [], warnings: [] },
      risks: { risks: [], overallRiskScore: 50, riskTrend: "stable", summary: { strengths: [], weaknesses: [], opportunities: [], threats: [] }, recommendations: [] },
      summary: "",
      createdAt: new Date().toISOString(),
    };

    try {
      onProgress?.("Iniciando análise processual...", 5);

      onProgress?.("📄 Navegando documentos...", 10);
      const navResult = await this.executeStep(
        () => navigatorAgent.execute({ documents: input.documents }),
        "Navegador"
      );
      if (navResult.success && navResult.data) {
        result.documentStructure = navResult.data;
      }
      onProgress?.("✅ Navegação concluída", 25);

      onProgress?.("🔍 Extraindo dados processuais...", 30);
      const extResult = await this.executeStep(
        () =>
          extractorAgent.execute({
            documents: input.documents,
            metadata: result.documentStructure.metadata,
          }),
        "Extrator"
      );
      if (extResult.success && extResult.data) {
        result.extractedData = extResult.data;
      }
      onProgress?.("✅ Extração concluída", 50);

      onProgress?.("📅 Calculando prazos...", 55);
      const calcResult = await this.executeStep(
        () =>
          calculatorAgent.execute({
            timeline: result.extractedData.timeline,
            proceduralRequirements: result.extractedData.proceduralRequirements,
            processType: input.processType || "Civil",
            court: result.documentStructure.metadata?.court,
          }),
        "Calculador"
      );
      if (calcResult.success && calcResult.data) {
        result.deadlines = calcResult.data;
      }
      onProgress?.("✅ Prazos calculados", 70);

      onProgress?.("⚠️ Mapeando riscos...", 75);
      const riskResult = await this.executeStep(
        () =>
          riskMapperAgent.execute({
            parties: result.extractedData.parties,
            claims: result.extractedData.claims,
            timeline: result.extractedData.timeline,
            processType: input.processType || "Civil",
            court: result.documentStructure.metadata?.court,
          }),
        "Mapeador de Riscos"
      );
      if (riskResult.success && riskResult.data) {
        result.risks = riskResult.data;
      }
      onProgress?.("✅ Riscos mapeados", 85);

      onProgress?.("📝 Gerando relatório final...", 90);
      result.summary = await this.generateSummary(result, input);
      onProgress?.("✅ Relatório gerado", 95);

      result.status = "completed";
      result.completedAt = new Date().toISOString();
      result.progress = 100;

      onProgress?.("🎉 Análise completa!", 100);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`ChiefAgent: Análise concluída em ${duration}s`);
      console.log(`ChiefAgent: Custo total -`, llmGateway.getCostSummary());

      return result;
    } catch (error) {
      console.error("ChiefAgent: Erro na análise:", error);
      result.status = "failed";
      result.error = this.formatError(error);
      return result;
    }
  }

  private async executeStep<T>(
    fn: () => Promise<T>,
    stepName: string
  ): Promise<StepResult<T>> {
    try {
      const data = await fn();
      return { success: true, data };
    } catch (error) {
      console.error(`ChiefAgent: Erro em ${stepName}:`, error);
      return { success: false, error: this.formatError(error) };
    }
  }

  private async generateSummary(
    result: ChiefOutput,
    input: ChiefInput
  ): Promise<string> {
    const model = llmGateway.selectModel("moderate");

    const prompt = `Gere um resumo executivo da análise processual em português brasileiro.

TIPO DE PROCESSO: ${input.processType || "Civil"}
OBJETIVO: ${input.analysisGoal || "Análise geral"}

RESULTADOS DA ANÁLISE:

1. DOCUMENTOS ANALISADOS:
${result.documentStructure.documentStructure?.map((d: { filename: string; pageCount: number }) => `- ${d.filename} (${d.pageCount} páginas)`).join("\n") || "Nenhum"}

2. PARTES IDENTIFICADAS:
${result.extractedData.parties?.map((p: { name: string; role: string }) => `- ${p.name} (${p.role})`).join("\n") || "Nenhuma"}

3. PEDIDOS:
${result.extractedData.claims?.map((c: { type: string; description: string; status: string }) => `- ${c.type}: ${c.description} (${c.status})`).join("\n") || "Nenhum"}

4. PRAZOS PRÓXIMOS:
${result.deadlines.deadlines?.slice(0, 3).map((d: { description: string; dueDate: string; urgency: string }) => `- ${d.description} - ${d.dueDate} (${d.urgency})`).join("\n") || "Nenhum"}

5. RISCOS IDENTIFICADOS:
${result.risks.risks?.slice(0, 5).map((r: { title: string; severity: string; probability: number }) => `- ${r.title} (${r.severity}, prob: ${(r.probability * 100).toFixed(0)}%)`).join("\n") || "Nenhum"}

6. RECOMENDAÇÕES:
${result.risks.recommendations?.slice(0, 3).map((r: { priority: string; action: string }) => `- [${r.priority.toUpperCase()}] ${r.action}`).join("\n") || "Nenhuma"}

Gere um resumo executivo conciso (3-4 parágrafos) que:
- Destaque os pontos mais importantes
- Identifique riscos críticos
- Forneça próximas ações recomendadas
- Seja profissional e objetivo`;

    try {
      const response = await llmGateway.complete({
        model,
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente jurídico especializado em análise processual. Forneça resumos claros e objetivos.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      });

      return response.content;
    } catch (error) {
      console.error("ChiefAgent: Erro ao gerar resumo:", error);
      return "Resumo não disponível devido a erro na geração.";
    }
  }
}

export const chiefAgent = new ChiefAgent();
