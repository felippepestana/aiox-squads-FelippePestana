import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAnalysisPipeline } from "@/lib/analysis-runner";
import { loadAnalysisForRequest } from "@/lib/auth";
import { enqueueAnalysis, isQueueEnabled } from "@/lib/queue";

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

    // When a Redis-backed queue is configured, enqueue the job and return
    // immediately (the worker processes it out of band). Otherwise, run the
    // pipeline inline within the request (graceful degradation).
    //
    // Mark PROCESSING and record the event BEFORE enqueueing: the worker may
    // start (and even finish) as soon as the job is added, so writing the
    // status after enqueue could stomp the worker's terminal status.
    if (isQueueEnabled()) {
      await prisma.analysis.update({
        where: { id },
        data: { status: "PROCESSING" },
      });
      await prisma.analysisEvent.create({
        data: { analysisId: id, event: "ANALYSIS_QUEUED", metadata: {} },
      });
      await enqueueAnalysis({ analysisId: id, processType, analysisGoal });
      return NextResponse.json({
        analysisId: id,
        status: "QUEUED",
        queued: true,
        message: "Análise enfileirada para processamento.",
      });
    }

    const outcome = await runAnalysisPipeline(id, { processType, analysisGoal });

    return NextResponse.json({
      analysisId: id,
      status: outcome.status,
      queued: false,
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
