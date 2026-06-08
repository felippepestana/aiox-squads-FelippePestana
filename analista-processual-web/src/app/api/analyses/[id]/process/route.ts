import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAnalysisPipeline } from "@/lib/analysis-runner";

// The multi-agent pipeline can take a while; allow up to 5 minutes and never
// statically optimize this route.
export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Runs the multi-agent pipeline and streams progress as Server-Sent Events.
 * The client (detail page) consumes this via fetch + ReadableStream and renders
 * a live pipeline. Progress is also persisted, so a reconnect can fall back to
 * polling GET /api/analyses/[id]/status.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let processType: string | undefined;
  let analysisGoal: string | undefined;
  try {
    const body = await request.json();
    processType = body?.processType;
    analysisGoal = body?.analysisGoal;
  } catch {
    // body optional
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const analysis = await prisma.analysis.findUnique({ where: { id } });
        if (!analysis) {
          send("error", { message: "Análise não encontrada" });
          controller.close();
          return;
        }

        if (analysis.status === "COMPLETED") {
          send("done", { status: "COMPLETED" });
          controller.close();
          return;
        }

        send("progress", { step: "Iniciando análise...", progress: 0 });

        const outcome = await runAnalysisPipeline(id, {
          processType,
          analysisGoal,
          onProgress: (step, progress) => send("progress", { step, progress }),
        });

        send("done", { status: outcome.status, message: outcome.message });
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
