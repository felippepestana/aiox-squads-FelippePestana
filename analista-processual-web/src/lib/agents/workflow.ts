import { chiefAgent } from "./chief";
import { type DocumentInput } from "./chief";

export interface WorkflowOptions {
  onProgress?: (step: string, progress: number, details?: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  onComplete?: (result: Awaited<ReturnType<typeof chiefAgent.execute>>) => void;
}

export interface WorkflowResult {
  analysisId: string;
  status: "started" | "completed" | "failed";
  result?: Awaited<ReturnType<typeof chiefAgent.execute>>;
  error?: string;
}

export async function runAnalysisWorkflow(
  documents: DocumentInput[],
  options: WorkflowOptions = {}
): Promise<WorkflowResult> {
  const { onProgress, onError, onComplete } = options;
  const analysisId = `analysis-${Date.now()}`;

  try {
    onProgress?.("Iniciando workflow de análise...", 0);

    const result = await chiefAgent.execute(
      { documents },
      (step, progress) => {
        onProgress?.(step, progress, { analysisId });
      }
    );

    if (result.status === "completed") {
      onProgress?.("Workflow concluído com sucesso", 100);
      onComplete?.(result);
      return { analysisId, status: "completed", result };
    } else {
      const error = result.error || "Análise falhou";
      onError?.(new Error(error));
      return { analysisId, status: "failed", error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    onError?.(error instanceof Error ? error : new Error(errorMessage));
    return { analysisId, status: "failed", error: errorMessage };
  }
}

export function createAnalysisPayload(
  documents: DocumentInput[],
  metadata: {
    processNumber?: string;
    court?: string;
    processType?: string;
    analysisGoal?: string;
    userId: string;
  }
) {
  return {
    documents: documents.map((doc) => ({
      filename: doc.filename,
      type: doc.type,
      content: doc.content,
    })),
    processNumber: metadata.processNumber,
    court: metadata.court,
    processType: metadata.processType,
    analysisGoal: metadata.analysisGoal,
    userId: metadata.userId,
  };
}
