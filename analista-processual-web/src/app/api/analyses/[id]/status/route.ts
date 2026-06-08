import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Lightweight status endpoint for polling the live progress of an analysis
 * (fallback when the SSE connection is not available / reconnecting).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      select: { id: true, status: true, progress: true, currentStep: true },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error("Error fetching analysis status:", error);
    return NextResponse.json(
      { error: "Erro ao buscar status" },
      { status: 500 }
    );
  }
}
