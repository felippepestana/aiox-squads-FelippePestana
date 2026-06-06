import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  validado: z.boolean(),
  motivo_reprovacao: z.string().optional().nullable(),
});

interface Params {
  params: Promise<{ exameId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { exameId } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!user.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: hakuna } = await admin
    .from("hakunas")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();

  if (!hakuna) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: updated, error } = await admin
    .from("exames")
    .update({
      validado: parsed.data.validado,
      validado_por: hakuna.id,
      motivo_reprovacao: !parsed.data.validado
        ? (parsed.data.motivo_reprovacao ?? null)
        : null,
    })
    .eq("id", exameId)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Exame não encontrado" }, { status: 404 });
    }
    console.error("Exam validation error:", error);
    return NextResponse.json({ error: "Erro ao validar exame" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: updated.id });
}
