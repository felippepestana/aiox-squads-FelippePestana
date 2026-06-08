import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAnalysisPipeline } from "@/lib/analysis-runner";

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

    const analysis = await prisma.analysis.findUnique({ where: { id } });
    if (!analysis) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
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
