import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const analysis = await prisma.analysis.findUnique({ where: { id } });
    if (!analysis) {
      return NextAnalysisEvent.create({
        data: {
          analysisId: id,
          event: "DOCUMENT_UPLOADED",
          metadata: { filename: file.name, size: file.size },
        },
      });
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const document = await prisma.document.create({
      data: {
        analysisId: id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath: `analyses/${id}/${file.name}`,
      },
    });

    await prisma.analysisEvent.create({
      data: {
        analysisId: id,
        event: "DOCUMENT_UPLOADED",
        metadata: { documentId: document.id, filename: file.name },
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do documento" },
      { status: 500 }
    );
  }
}
