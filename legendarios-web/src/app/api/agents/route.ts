import { NextRequest } from "next/server";
import { streamAgent } from "@/lib/anthropic/client";
import { AGENT_SYSTEM_PROMPTS } from "@/lib/anthropic/agents";
import { createServerClient } from "@/lib/supabase/server";
import type { AgentMessage } from "@/lib/anthropic/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Auth check — skip in dev mode without Supabase
  if (process.env.NODE_ENV !== "development") {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const body = await req.json() as {
    agentId: string;
    message: string;
    eventoId?: string;
    history?: AgentMessage[];
  };

  const { agentId, message, eventoId, history = [] } = body;

  if (!agentId || !message) {
    return new Response("agentId and message are required", { status: 400 });
  }

  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId];
  if (!systemPrompt) {
    return new Response(`Unknown agent: ${agentId}`, { status: 400 });
  }

  // Fetch evento context if provided (only with live Supabase)
  let eventoContext = "";
  if (eventoId && process.env.NODE_ENV !== "development") {
    try {
      const supabase = await createServerClient();
      const { data: evento } = await supabase
        .from("eventos")
        .select("*, cidades(nome, estado)")
        .eq("id", eventoId)
        .single();

      if (evento) {
        eventoContext = `\n\nEVENTO ATIVO:\n- Nome: ${evento.nome}\n- Tipo: ${evento.tipo}\n- Status: ${evento.status}\n- Capacidade meta: ${evento.capacidade_meta}\n- Budget marketing: R$ ${evento.budget_marketing?.toLocaleString("pt-BR") ?? "não definido"}`;
      }
    } catch {}
  } else if (eventoId) {
    eventoContext = "\n\nEVENTO ATIVO: TOP - Destemidos Pioneiros | Porto Velho/RO | 400 participantes meta | Budget R$ 25.000";
  }

  // Stream response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const messages: AgentMessage[] = [
          ...history,
          { role: "user", content: message },
        ];

        for await (const chunk of streamAgent({
          agentId,
          systemPrompt: systemPrompt + eventoContext,
          messages,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }

        // Save conversation to Supabase in production (non-blocking)
        if (process.env.NODE_ENV !== "development") {
          const supabase = await createServerClient();
          supabase.from("conversas_ia").insert({
            evento_id: eventoId ?? null,
            agente: agentId,
            mensagens: messages as unknown as Parameters<typeof supabase.from>[0],
          }).then(() => {});
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\nErro: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
