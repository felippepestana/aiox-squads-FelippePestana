import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadAnalysisForRequest } from "@/lib/auth";
import { extractDocumentText } from "@/lib/document-extraction";

// PDF/DOCX parsing and OCR rely on Node APIs; keep this route on the Node
// runtime. OCR (images/scanned docs) can be slow, so allow up to 5 minutes.
export const runtime = "nodejs";
export const maxDuration = 300;

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extraction = await extractDocumentText(file.name, file.type, buffer);

    const document = await prisma.document.create({
      data: {
        analysisId: id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath: `analyses/${id}/${file.name}`,
        extractedText: extraction.text,
        metadata: {
          textExtracted: Boolean(extraction.text),
          extractionMethod: extraction.method,
          needsOcr: extraction.needsOcr,
        },
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
