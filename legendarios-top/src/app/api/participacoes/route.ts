import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const postSchema = z.object({
  senderista_id: z.string().uuid(),
  atividade_id: z.string().uuid(),
  notas: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: hakuna } = await supabase.from("hakunas").select("id").eq("email", user.email!).single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const senderista_id = searchParams.get("senderista_id");
  if (!senderista_id) return NextResponse.json({ error: "senderista_id obrigatório" }, { status: 400 });

  const { data, error } = await supabase
    .from("participacoes")
    .select("id, atividade_id, tipo, registrado_em, notas")
    .eq("senderista_id", senderista_id)
    .eq("tipo", "entrada");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: hakuna } = await supabase.from("hakunas").select("id").eq("email", user.email!).single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const { data: existing } = await supabase
    .from("participacoes")
    .select("id")
    .eq("senderista_id", parsed.data.senderista_id)
    .eq("atividade_id", parsed.data.atividade_id)
    .eq("tipo", "entrada")
    .maybeSingle();

  if (existing) return NextResponse.json({ id: existing.id });

  const { data, error } = await supabase
    .from("participacoes")
    .insert({
      senderista_id: parsed.data.senderista_id,
      atividade_id: parsed.data.atividade_id,
      tipo: "entrada",
      hakuna_id: hakuna.id,
      notas: parsed.data.notas ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
