import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MoveRequestBody {
  targetAnalysisId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as MoveRequestBody;
    const { targetAnalysisId } = body;

    if (!targetAnalysisId) {
      return NextResponse.json(
        { error: "targetAnalysisId é obrigatório" },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Documento não encontrado" },
        { status: 404 }
      );
    }

    const targetAnalysis = await prisma.analysis.findUnique({
      where: { id: targetAnalysisId },
    });

    if (!targetAnalysis) {
      return NextResponse.json(
        { error: "Análise destino não encontrada" },
        { status: 404 }
      );
    }

    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        analysisId: targetAnalysisId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Documento movido com sucesso",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error moving document:", error);
    return NextResponse.json(
      { error: "Erro ao mover documento" },
      { status: 500 }
    );
  }
}
