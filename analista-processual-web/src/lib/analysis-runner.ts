import { prisma } from "@/lib/prisma";
import { chiefAgent, llmGateway } from "@/lib/agents";
import type { ChiefOutput } from "@/lib/agents/chief";

export interface RunAnalysisOptions {
  processType?: string;
  analysisGoal?: string;
  /** Invoked on each pipeline step (for live SSE streaming). */
  onProgress?: (step: string, progress: number) => void;
}

/**
 * Normalizes the rich ChiefOutput into the flat shape the results UI reads
 * (`summary`, `score`, `partiesCount`, `risksCount`, `risks[]`, `extractedData`).
 * The full agent output is preserved under `raw` for debugging/export.
 */
function normalizeResult(chief: ChiefOutput) {
  const risks = (chief.risks?.risks ?? []).map((r) => ({
    type: r.title,
    description: r.description,
    severity: String(r.severity ?? "").toUpperCase(),
  }));

  return {
    status: chief.status,
    summary: chief.summary,
    score: chief.risks?.overallRiskScore ?? null,
    scoreDescription: "Score de risco geral (0-100)",
    partiesCount: chief.extractedData?.parties?.length ?? 0,
    risksCount: risks.length,
    risks,
    extractedData: chief.extractedData,
    documentStructure: chief.documentStructure,
    recommendations: chief.risks?.recommendations ?? [],
    createdAt: chief.createdAt,
    completedAt: chief.completedAt,
    raw: chief,
  };
}

async function markFailed(analysisId: string, message: string) {
  await prisma.analysis.update({
    where: { id: analysisId },
    data: { status: "FAILED", result: { error: message } },
  });
  await prisma.analysisEvent.create({
    data: {
      analysisId,
      event: "ANALYSIS_FAILED",
      metadata: { error: message },
    },
  });
}

/**
 * Loads the analysis documents from the database, runs the multi-agent pipeline
 * and persists the result, deadlines and lifecycle events. Designed to be
 * awaited inside the `/process` route so it completes within the request
 * lifecycle (safe for serverless). Never throws — failures are persisted as
 * FAILED with a human-readable message.
 */
export async function runAnalysisPipeline(
  analysisId: string,
  options: RunAnalysisOptions = {}
): Promise<{ status: "COMPLETED" | "FAILED"; message?: string }> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { documents: true },
  });

  if (!analysis) {
    return { status: "FAILED", message: "Análise não encontrada" };
  }

  await prisma.analysis.update({
    where: { id: analysisId },
    data: { status: "PROCESSING", progress: 0, currentStep: "Iniciando análise..." },
  });

  if (!llmGateway.isConfigured()) {
    const message =
      "Nenhum provedor LLM configurado. Defina OPENAI_API_KEY (ou outro provedor compatível) nas variáveis de ambiente para executar a análise.";
    await markFailed(analysisId, message);
    return { status: "FAILED", message };
  }

  const documents = analysis.documents
    .filter((d) => (d.extractedText ?? "").trim().length > 0)
    .map((d) => ({
      filename: d.filename,
      type: d.fileType || "text/plain",
      content: d.extractedText as string,
    }));

  if (documents.length === 0) {
    const message =
      "Nenhum texto pôde ser extraído dos documentos enviados. Envie arquivos de texto (.txt) ou habilite a extração de PDF/DOCX.";
    await markFailed(analysisId, message);
    return { status: "FAILED", message };
  }

  try {
    const chief = await chiefAgent.execute(
      {
        documents,
        processType: options.processType || analysis.processClass || undefined,
        analysisGoal: options.analysisGoal,
      },
      (step, progress) => {
        // Stream to the caller (SSE) and best-effort persist for polling/resume.
        options.onProgress?.(step, progress);
        void prisma.analysis
          .update({
            where: { id: analysisId },
            data: { progress, currentStep: step },
          })
          .catch(() => {
            // ignore transient progress-write failures
          });
      }
    );

    const normalized = normalizeResult(chief);
    const succeeded = chief.status === "completed";

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: succeeded ? "COMPLETED" : "FAILED",
        progress: 100,
        currentStep: succeeded ? "Concluído" : "Falhou",
        result: JSON.parse(JSON.stringify(normalized)),
      },
    });

    await prisma.analysisEvent.create({
      data: {
        analysisId,
        event: succeeded ? "ANALYSIS_COMPLETED" : "ANALYSIS_FAILED",
        metadata: { error: chief.error ?? null },
      },
    });

    if (succeeded && chief.deadlines?.deadlines?.length) {
      for (const deadline of chief.deadlines.deadlines) {
        const dueDate = new Date(deadline.dueDate);
        if (Number.isNaN(dueDate.getTime())) continue;
        await prisma.deadline.create({
          data: {
            analysisId,
            description: deadline.description,
            legalBasis: deadline.legalBasis,
            dueDate,
            businessDays: deadline.businessDays,
            calendarDays: deadline.calendarDays,
            isAutomatic: deadline.isAutomatic ?? false,
            urgency: (deadline.urgency?.toUpperCase() ?? "MEDIUM") as
              | "LOW"
              | "MEDIUM"
              | "HIGH"
              | "CRITICAL",
          },
        });
      }
    }

    return {
      status: succeeded ? "COMPLETED" : "FAILED",
      message: chief.error,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    await markFailed(analysisId, message);
    return { status: "FAILED", message };
  }
}
