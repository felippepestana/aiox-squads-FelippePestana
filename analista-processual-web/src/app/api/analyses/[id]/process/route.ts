import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "@/lib/analysis-runner";
import { loadAnalysisForRequest } from "@/lib/auth";

// The multi-agent pipeline can take a while; allow up to 5 minutes and never
// statically optimize this route.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const access = await loadAnalysisForRequest(id);
    if (!access.ok) {
      const messages = { 401: "Não autenticado", 403: "Acesso negado", 404: "Análise não encontrada" } as const;
      return NextResponse.json(
        { error: messages[access.status] },
        { status: access.status }
      );
    }

    let processType: string | undefined;
    let analysisGoal: string | undefined;
    try {
      const body = await request.json();
      processType = body?.processType;
      analysisGoal = body?.analysisGoal;
    } catch {
      // Body is optional.
    }

    const outcome = await runAnalysisPipeline(id, { processType, analysisGoal });

    return NextResponse.json({
      analysisId: id,
      status: outcome.status,
      message: outcome.message,
    });
  } catch (error) {
    console.error("Error processing analysis:", error);
    return NextResponse.json(
      { error: "Erro ao processar análise" },
      { status: 500 }
    );
  }
}
