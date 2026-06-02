import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".html", ".xml", ".rtf"];

/**
 * Extracts plain text from text-based uploads. Binary formats (PDF, DOCX,
 * images) require dedicated parsers/OCR and are not extracted here — the
 * pipeline will report which documents lacked extractable text.
 */
function extractText(
  filename: string,
  fileType: string,
  buffer: Buffer
): string | null {
  const lower = filename.toLowerCase();
  const isTextType =
    fileType.startsWith("text/") ||
    fileType === "application/json" ||
    TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext));

  if (!isTextType) return null;

  const text = buffer.toString("utf-8").trim();
  return text.length > 0 ? text : null;
}

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
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extractedText = extractText(file.name, file.type, buffer);

    const document = await prisma.document.create({
      data: {
        analysisId: id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath: `analyses/${id}/${file.name}`,
        extractedText,
        metadata: {
          textExtracted: Boolean(extractedText),
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
