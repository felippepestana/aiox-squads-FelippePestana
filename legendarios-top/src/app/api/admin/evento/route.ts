import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// GET — dashboard stats + participant list
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [
    { data: senderistas },
    { data: atividades },
    { data: participacoes },
    { data: mensagens },
  ] = await Promise.all([
    supabase
      .from("senderistas")
      .select("id, nome, classificacao_risco, status, status_presenca, status_ingresso, tipo_participante, cidade, telefone, tamanho_camisa, codigo_ingresso")
      .order("nome"),
    supabase
      .from("atividades_top")
      .select("*")
      .order("hora_planejada", { ascending: true }),
    supabase
      .from("participacoes")
      .select("*")
      .order("registrado_em", { ascending: false })
      .limit(200),
    supabase
      .from("mensagens_apoio")
      .select("id, senderista_id, visualizado")
      .eq("visualizado", false),
  ]);

  const ativos = (senderistas ?? []).filter(s => s.status_ingresso !== "cancelado");
  const stats = {
    total: ativos.length,
    presente: ativos.filter(s => s.status_presenca === "presente").length,
    ausente: ativos.filter(s => s.status_presenca === "ausente").length,
    risco_alto: ativos.filter(s => s.classificacao_risco === "alto").length,
    risco_alto_presente: ativos.filter(s => s.classificacao_risco === "alto" && s.status_presenca === "presente").length,
    aprovados: ativos.filter(s => s.status === "aprovado").length,
    pendentes: ativos.filter(s => s.status === "pendente" || s.status === "exames_enviados").length,
    mensagens_nao_lidas: mensagens?.length ?? 0,
  };

  return NextResponse.json({
    stats,
    senderistas: ativos,
    atividades: atividades ?? [],
    participacoes: participacoes ?? [],
  });
}

// POST — create or update atividade
const atividadeSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2),
  tipo: z.enum(["predica", "hidratacao", "acampamento", "checkpoint", "chegada", "saida", "outro"]),
  descricao: z.string().optional().nullable(),
  hora_planejada: z.string().optional().nullable(),
  hora_real: z.string().optional().nullable(),
  evento_nome: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: hakuna } = await supabase.from("hakunas").select("id").eq("email", user.email!).single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = atividadeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const { id, ...fields } = parsed.data;

  if (id) {
    const { data, error } = await supabase
      .from("atividades_top")
      .update({ ...fields, hora_real: fields.hora_real ?? new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from("atividades_top")
      .insert(fields)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  }
}
