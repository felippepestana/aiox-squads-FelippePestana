import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveOwnerId } from "@/lib/auth";
import {
  courtDataGateway,
  processToDocumentText,
} from "@/lib/integrations/court-data-gateway";
import { CnjNumberError } from "@/lib/integrations/tribunais";

// Fetching from official sources can be slow; never statically optimize.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Creates an Analysis from a CNJ case number by fetching official metadata
 * (DATAJUD in Phase 1) instead of requiring an upload. The metadata is also
 * stored as a synthetic Document so the existing multi-agent pipeline can run
 * unchanged via POST /api/analyses/:id/process.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { processNumber, userId } = body as {
      processNumber?: string;
      userId?: string;
    };

    if (!processNumber || typeof processNumber !== "string") {
      return NextResponse.json(
        { error: "Informe o número do processo (processNumber)." },
        { status: 400 }
      );
    }

    // Validate the CNJ number up front so we can derive the tribunal endpoint.
    let parsed;
    try {
      parsed = courtDataGateway.parseNumber(processNumber);
    } catch (error) {
      if (error instanceof CnjNumberError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    if (!courtDataGateway.isConfigured()) {
      return NextResponse.json(
        {
          error:
            "Consulta por número indisponível: nenhuma fonte oficial configurada. Defina DATAJUD_API_KEY (chave pública gratuita do CNJ).",
        },
        { status: 503 }
      );
    }

    const ownerId = await resolveOwnerId(userId);
    if (!ownerId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    let process_;
    try {
      process_ = await courtDataGateway.fetchByNumber(processNumber);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro na consulta";
      const status = /429/.test(message) ? 429 : 502;
      return NextResponse.json({ error: message }, { status });
    }

    if (!process_) {
      return NextResponse.json(
        {
          error: `Processo ${parsed.formatted} não encontrado no ${parsed.tribunalName} (DATAJUD). Verifique o número ou tente novamente mais tarde (lag de atualização).`,
        },
        { status: 404 }
      );
    }

    const documentText = processToDocumentText(process_);

    const analysis = await prisma.analysis.create({
      data: {
        userId: ownerId,
        processNumber: parsed.formatted,
        court: process_.court,
        processClass: process_.processClass,
        source: "DATAJUD",
        tribunalSigla: process_.tribunalSigla,
        lastSyncedAt: new Date(),
        status: "PENDING",
        documents: {
          create: {
            filename: `${parsed.digits}-datajud.txt`,
            fileType: "text/plain",
            fileSize: Buffer.byteLength(documentText, "utf8"),
            extractedText: documentText,
            metadata: {
              source: "datajud",
              tribunal: process_.tribunalSigla,
              textExtracted: true,
              movementsCount: process_.movements.length,
            },
          },
        },
      },
      include: { documents: true },
    });

    if (process_.movements.length > 0) {
      await prisma.processMovement.createMany({
        data: process_.movements.map((m) => ({
          analysisId: analysis.id,
          code: m.code ?? undefined,
          description: m.description,
          date: m.date ? new Date(m.date) : undefined,
          source: "DATAJUD" as const,
          raw: m as unknown as object,
        })),
      });
    }

    await prisma.analysisEvent.create({
      data: {
        analysisId: analysis.id,
        event: "ANALYSIS_CREATED",
        metadata: {
          source: "datajud",
          tribunal: process_.tribunalSigla,
          movements: process_.movements.length,
        },
      },
    });

    return NextResponse.json(
      {
        data: analysis,
        analysisId: analysis.id,
        process: {
          numeroProcesso: process_.formattedNumber,
          tribunal: process_.tribunalName,
          tribunalSigla: process_.tribunalSigla,
          classe: process_.processClass,
          assuntos: process_.subjects,
          movimentos: process_.movements.length,
          partes: process_.parties.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating analysis from process number:", error);
    return NextResponse.json(
      { error: "Erro ao consultar o processo" },
      { status: 500 }
    );
  }
}
