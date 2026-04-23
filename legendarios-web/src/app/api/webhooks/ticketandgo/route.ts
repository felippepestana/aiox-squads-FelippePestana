import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature, type TnGWebhookEvent } from "@/lib/ticketandgo/client";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-ticketandgo-signature") ?? "";
  const body = await req.text();

  // Validate webhook signature (HMAC-SHA256)
  if (process.env.TICKET_AND_GO_WEBHOOK_SECRET) {
    if (!validateWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: TnGWebhookEvent;
  try {
    event = JSON.parse(body) as TnGWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Log the webhook
  await supabase.from("webhooks_log").insert({
    fonte: "ticket_and_go",
    evento: event.type,
    payload: event as unknown as Record<string, unknown>,
    processado: false,
  });

  try {
    await processWebhookEvent(event, supabase);

    // Mark as processed
    await supabase
      .from("webhooks_log")
      .update({ processado: true })
      .eq("evento", event.type)
      .order("received_at", { ascending: false })
      .limit(1);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await supabase
      .from("webhooks_log")
      .update({ erro: msg })
      .eq("evento", event.type)
      .order("received_at", { ascending: false })
      .limit(1);
    console.error("[webhook/ticketandgo] Error:", msg);
  }

  return NextResponse.json({ ok: true });
}

async function processWebhookEvent(
  event: TnGWebhookEvent,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  switch (event.type) {
    case "inscricao.confirmada": {
      const { data } = event;
      const campos = data.participante.campos_extras;

      // Upsert participante
      const { data: participante } = await supabase
        .from("participantes")
        .upsert(
          {
            nome: data.participante.nome,
            email: data.participante.email,
            telefone: data.participante.telefone,
            whatsapp: data.participante.telefone,
            status_conjugal: campos.status_conjugal as "casado" | "solteiro" | "divorciado" | "viuvo" | null,
            tem_filhos: campos.tem_filhos === "Sim",
            como_conheceu: campos.como_conheceu,
            lgpd_comunicacao: campos.lgpd_comunicacao === "true",
            lgpd_imagem: campos.lgpd_imagem === "true",
            lgpd_data_consentimento: new Date().toISOString(),
            lgpd_data_expiracao: new Date(
              Date.now() + 6 * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (!participante) break;

      // Find matching evento via ticket_and_go_event_id
      const { data: evento } = await supabase
        .from("eventos")
        .select("id")
        .eq("ticket_and_go_event_id", data.evento_id)
        .single();

      if (!evento) break;

      // Find lote
      const { data: lote } = await supabase
        .from("lotes")
        .select("id")
        .eq("ticket_and_go_lote_id", data.lote_id)
        .single();

      // Create inscrição
      if (lote) {
        await supabase.from("inscricoes").upsert(
          {
            participante_id: participante.id,
            evento_id: evento.id,
            lote_id: lote.id,
            status: "confirmada",
            valor_pago: data.valor_pago,
            metodo_pagamento: data.metodo_pagamento as "pix" | "cartao_credito" | "cartao_debito" | "boleto",
            ticket_and_go_ticket_id: data.id,
          },
          { onConflict: "ticket_and_go_ticket_id" }
        );

        // Increment lote.vendidas
        await supabase.rpc("incrementar_vendidas", { lote_id: lote.id });
      }
      break;
    }

    case "inscricao.cancelada": {
      await supabase
        .from("inscricoes")
        .update({ status: "cancelada" })
        .eq("ticket_and_go_ticket_id", event.data.id);
      break;
    }

    case "lote.esgotado":
    case "lote.encerrado": {
      await supabase
        .from("lotes")
        .update({ status: "encerrado" })
        .eq("ticket_and_go_lote_id", event.data.id);
      break;
    }

    case "checkin.realizado": {
      if (!event.data.sucesso || !event.data.inscricao) break;
      await supabase
        .from("inscricoes")
        .update({
          status: "presente",
          checkin_realizado_at: new Date().toISOString(),
        })
        .eq("ticket_and_go_ticket_id", event.data.inscricao.id);
      break;
    }

    case "pagamento.aprovado": {
      await supabase
        .from("inscricoes")
        .update({ status: "confirmada", valor_pago: event.data.valor })
        .eq("ticket_and_go_ticket_id", event.data.inscricao_id);
      break;
    }

    case "pagamento.estornado": {
      await supabase
        .from("inscricoes")
        .update({ status: "estornada" })
        .eq("ticket_and_go_ticket_id", event.data.inscricao_id);
      break;
    }

    default:
      break;
  }
}
