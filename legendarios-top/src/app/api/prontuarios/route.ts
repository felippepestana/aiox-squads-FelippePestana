import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid().optional(),
  senderista_id: z.string().uuid(),
  queixas: z.string().optional().nullable(),
  condutas: z.string().optional().nullable(),
  fotos_urls: z.array(z.string()).default([]),
  created_at: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { data, error } = await supabase.from("prontuarios").insert({
    id: parsed.data.id,
    senderista_id: parsed.data.senderista_id,
    queixas: parsed.data.queixas,
    condutas: parsed.data.condutas,
    fotos_urls: parsed.data.fotos_urls,
    created_at: parsed.data.created_at,
  }).select("id").single();

  if (error) {
    console.error("Prontuario insert error:", error);
    return NextResponse.json({ error: "Erro ao salvar prontuário" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
