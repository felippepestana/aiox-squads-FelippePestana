import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  senderista_id: z.string().uuid(),
  status_presenca: z.enum(["presente", "ausente"]),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: hakuna } = await supabase
    .from("hakunas")
    .select("id")
    .eq("email", user.email!)
    .single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("senderistas")
    .update({ status_presenca: parsed.data.status_presenca, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.senderista_id);

  if (error) throw error;

  return NextResponse.json({ ok: true });
}

// GET /api/admin/checkin?q=nome_ou_cpf — search participants
export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Search by name OR CPF (normalized)
  const cpfQuery = q.replace(/\D/g, "");
  const { data } = await supabase
    .from("senderistas")
    .select("id, nome, cpf, telefone, classificacao_risco, status, status_presenca, status_ingresso, tipo_participante, igreja, cidade, tamanho_camisa, codigo_ingresso, mensagens_token")
    .or(
      cpfQuery.length >= 3
        ? `nome.ilike.%${q}%,cpf.ilike.%${cpfQuery}%`
        : `nome.ilike.%${q}%`
    )
    .order("nome")
    .limit(10);

  return NextResponse.json({ results: data ?? [] });
}
