import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendMensagensLink, sendBatchMensagensLinks } from "@/lib/whatsapp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

// POST — trigger WhatsApp sends manually from Hakuna panel
const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("mensagens_link"),
    senderista_id: z.string().uuid(),
  }),
  z.object({
    action: z.literal("batch_mensagens_links"),
    // Send to all participants that have whatsapp_conjuge but haven't been notified
    evento_nome: z.string().optional(),
  }),
]);

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: hakuna } = await supabase.from("hakunas").select("id").eq("email", user.email!).single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  if (parsed.data.action === "mensagens_link") {
    const { data: s } = await supabase
      .from("senderistas")
      .select("nome, whatsapp_conjuge, mensagens_token")
      .eq("id", parsed.data.senderista_id)
      .single();

    if (!s?.whatsapp_conjuge) {
      return NextResponse.json({ error: "Senderista sem WhatsApp de cônjuge cadastrado" }, { status: 400 });
    }

    const ok = await sendMensagensLink({
      phoneConjuge: s.whatsapp_conjuge,
      nomeParticipante: s.nome,
      mensagensToken: s.mensagens_token,
      appUrl: APP_URL,
    });

    return NextResponse.json({ ok, sent: ok ? 1 : 0 });
  }

  if (parsed.data.action === "batch_mensagens_links") {
    let query = supabase
      .from("senderistas")
      .select("nome, whatsapp_conjuge, mensagens_token")
      .not("whatsapp_conjuge", "is", null)
      .eq("status_ingresso", "ativo");

    if (parsed.data.evento_nome) {
      query = query.eq("evento_nome", parsed.data.evento_nome);
    }

    const { data: participants } = await query;

    if (!participants?.length) {
      return NextResponse.json({ sent: 0, failed: 0, message: "Nenhum participante com WhatsApp de cônjuge" });
    }

    const result = await sendBatchMensagensLinks(participants, APP_URL);
    return NextResponse.json({ ...result, total: participants.length });
  }
}
