import { NextRequest, NextResponse } from "next/server";
import { harmonizeLegalRequest } from "@/lib/agents";
import type { DocumentInput } from "@/lib/agents/legal-performance-types";

/**
 * Unified conversational entry point. Mirrors the squad chat (web/ and chatbot/)
 * inside the Next.js product: a free-text message is classified and routed
 * through the Legal Performance pipeline, returning a single deliverable.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message: string = body.message ?? body.demand ?? "";
    const documents: DocumentInput[] = Array.isArray(body.documents)
      ? body.documents
      : [];

    if (!message.trim() && documents.length === 0) {
      return NextResponse.json(
        { error: "Informe uma mensagem ou anexe documentos." },
        { status: 400 }
      );
    }

    const result = await harmonizeLegalRequest({
      demand: message,
      documents,
      processType: body.processType,
      processNumber: body.processNumber,
      court: body.court,
      forceUseCase: body.forceUseCase,
      pericia: body.pericia,
    });

    return NextResponse.json({
      id: result.id,
      status: result.status,
      useCase: result.useCase,
      deliverableType: result.deliverableType,
      reply: result.deliverable,
      summary: result.summary,
      qualityGates: result.qualityGates,
      disclaimer: result.disclaimer,
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Erro ao processar a mensagem." },
      { status: 500 }
    );
  }
}
