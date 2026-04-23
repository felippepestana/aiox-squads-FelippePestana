import { NextRequest } from "next/server";
import { streamAgent } from "@/lib/anthropic/client";
import { AGENT_SYSTEM_PROMPTS } from "@/lib/anthropic/agents";
import { createServerClient } from "@/lib/supabase/server";
import type { AgentMessage } from "@/lib/anthropic/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
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

  // Fetch evento context if provided
  let eventoContext = "";
  if (eventoId) {
    const { data: evento } = await supabase
      .from("eventos")
      .select("*, cidades(nome, estado)")
      .eq("id", eventoId)
      .single();

    if (evento) {
      eventoContext = `\n\nEVENTO ATIVO:\n- Nome: ${evento.nome}\n- Tipo: ${evento.tipo}\n- Status: ${evento.status}\n- Capacidade meta: ${evento.capacidade_meta}\n- Budget marketing: R$ ${evento.budget_marketing?.toLocaleString("pt-BR") ?? "não definido"}`;
    }
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

        // Save conversation to Supabase (non-blocking)
        supabase
          .from("conversas_ia")
          .insert({
            evento_id: eventoId ?? null,
            agente: agentId,
            mensagens: [
              ...messages,
              { role: "assistant", content: "[streaming]" },
            ] as unknown as Parameters<typeof supabase.from>[0],
          })
          .then(() => {});
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
