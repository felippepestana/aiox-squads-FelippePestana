import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  status: z.enum(["aprovado", "reprovado", "pendente", "exames_enviados"]),
  motivo_reprovacao: z.string().optional(),
  orientacoes: z.string().optional(),
  nfc_tag_id: z.string().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.errors }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.motivo_reprovacao !== undefined) update.motivo_reprovacao = parsed.data.motivo_reprovacao;
  if (parsed.data.orientacoes !== undefined) update.orientacoes = parsed.data.orientacoes;
  if (parsed.data.nfc_tag_id !== undefined) update.nfc_tag_id = parsed.data.nfc_tag_id;

  const { error } = await supabase.from("senderistas").update(update).eq("id", id);

  if (error) {
    console.error("PATCH senderista error:", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data, error } = await supabase
    .from("senderistas")
    .select("id, nome, tipo_sanguineo, peso_kg, altura_cm, imc, plano_saude, qual_plano, comorbidades, classificacao_risco, status")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(data);
}
