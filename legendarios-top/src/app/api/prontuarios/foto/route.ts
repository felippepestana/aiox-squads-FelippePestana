import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const prontuarioId = formData.get("prontuario_id") as string;
  const senderista_id = formData.get("senderista_id") as string;

  if (!file || !prontuarioId || !senderista_id) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  const path = `prontuarios/${senderista_id}/${prontuarioId}-${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("prontuarios")
    .upload(path, file, { contentType: "image/jpeg", upsert: false });

  if (error) {
    console.error("Foto upload error:", error);
    return NextResponse.json({ error: "Erro ao armazenar foto" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("prontuarios").getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
