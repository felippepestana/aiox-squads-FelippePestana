import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PDF/DOCX parsing relies on Node APIs; keep this route on the Node runtime.
export const runtime = "nodejs";
export const maxDuration = 60;

const TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".html", ".xml", ".rtf"];

function isTextLike(filename: string, fileType: string): boolean {
  const lower = filename.toLowerCase();
  return (
    fileType.startsWith("text/") ||
    fileType === "application/json" ||
    TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext))
  );
}

function isPdf(filename: string, fileType: string): boolean {
  return fileType === "application/pdf" || filename.toLowerCase().endsWith(".pdf");
}

function isDocx(filename: string, fileType: string): boolean {
  return (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.toLowerCase().endsWith(".docx")
  );
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n\n") : text;
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

/**
 * Extracts plain text from uploads. Supports text formats, PDF (via unpdf) and
 * DOCX (via mammoth). Other binary formats (legacy .doc, images) require OCR and
 * return null — the pipeline reports which documents lacked extractable text.
 */
async function extractDocumentText(
  filename: string,
  fileType: string,
  buffer: Buffer
): Promise<string | null> {
  try {
    let text: string | null = null;

    if (isTextLike(filename, fileType)) {
      text = buffer.toString("utf-8");
    } else if (isPdf(filename, fileType)) {
      text = await extractPdf(buffer);
    } else if (isDocx(filename, fileType)) {
      text = await extractDocx(buffer);
    }

    const trimmed = text?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
  } catch (error) {
    console.error(`Failed to extract text from ${filename}:`, error);
    return null;
  }
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

    const extractedText = await extractDocumentText(file.name, file.type, buffer);

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
