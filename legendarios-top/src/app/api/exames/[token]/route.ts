import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ token: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: senderista } = await supabase
    .from("senderistas")
    .select("id")
    .eq("upload_token", token)
    .single();

  if (!senderista) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const tipo = formData.get("tipo") as string | null;

  if (!file || !tipo) {
    return NextResponse.json({ error: "Arquivo e tipo são obrigatórios" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo deve ter no máximo 10MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `exames/${senderista.id}/${tipo}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("exames")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json({ error: "Erro ao armazenar arquivo" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("exames").getPublicUrl(path);

  const { error: dbError } = await supabase.from("exames").insert({
    senderista_id: senderista.id,
    tipo,
    arquivo_url: urlData.publicUrl,
  });

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: "Erro ao registrar exame" }, { status: 500 });
  }

  return NextResponse.json({ arquivo_url: urlData.publicUrl });
}

export async function PATCH(request: Request, { params }: Params) {
  const { token } = await params;
  const supabase = await createClient();

  const body = await request.json();
  if (body.status !== "exames_enviados") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const { error } = await supabase
    .from("senderistas")
    .update({ status: "exames_enviados", updated_at: new Date().toISOString() })
    .eq("upload_token", token);

  if (error) {
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
