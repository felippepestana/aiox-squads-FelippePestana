import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid().optional(),
  senderista_id: z.string().uuid(),
  hakuna_email: z.string().email().optional().nullable(),
  queixas: z.string().optional().nullable(),
  condutas: z.string().optional().nullable(),
  fotos_urls: z.array(z.string()).default([]),
  created_at: z.string().datetime().optional(),
});

export async function POST(request: Request) {
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

  const { data: hakuna, error: hakunaError } = await supabase
    .from("hakunas")
    .select("id")
    .eq("email", user.email!)
    .maybeSingle();

  if (hakunaError) {
    console.error("Hakuna lookup error:", hakunaError);
    return NextResponse.json({ error: "Erro ao verificar permissão" }, { status: 500 });
  }

  if (!hakuna) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase.from("prontuarios").upsert({
    id: parsed.data.id,
    senderista_id: parsed.data.senderista_id,
    hakuna_id: hakuna.id,
    queixas: parsed.data.queixas,
    condutas: parsed.data.condutas,
    fotos_urls: parsed.data.fotos_urls,
    created_at: parsed.data.created_at,
  }, { onConflict: "id" }).select("id").single();

  if (error) {
    console.error("Prontuario insert error:", error);
    return NextResponse.json({ error: "Erro ao salvar prontuário" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
