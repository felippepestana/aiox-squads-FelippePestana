import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const prontuarioId = formData.get("prontuario_id") as string;
  const senderista_id = formData.get("senderista_id") as string;

  if (!file || !prontuarioId || !senderista_id) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Foto deve ter no máximo 10MB" }, { status: 400 });
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de arquivo inválido. Use JPEG, PNG ou WebP." }, { status: 400 });
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const path = `prontuarios/${senderista_id}/${prontuarioId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("prontuarios")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Foto upload error:", error);
    return NextResponse.json({ error: "Erro ao armazenar foto" }, { status: 500 });
  }

  return NextResponse.json({ url: path });
}
