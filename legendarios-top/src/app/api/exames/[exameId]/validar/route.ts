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

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: hakuna } = await admin
    .from("hakunas")
    .select("id")
    .eq("email", user.email!)
    .maybeSingle();

  const { error } = await admin
    .from("exames")
    .update({
      validado: parsed.data.validado,
      validado_por: hakuna?.id ?? null,
      motivo_reprovacao: !parsed.data.validado
        ? (parsed.data.motivo_reprovacao ?? null)
        : null,
    })
    .eq("id", exameId);

  if (error) {
    console.error("Exam validation error:", error);
    return NextResponse.json({ error: "Erro ao validar exame" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
