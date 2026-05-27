import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TIPOS = ["atestado_cg", "atestado_cardio", "teste_esteira"] as const;
type TipoExame = typeof ALLOWED_TIPOS[number];

const ALLOWED_EXTS = ["pdf", "jpg", "jpeg", "png"];
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];

interface Params {
  params: Promise<{ token: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: senderista, error: lookupError } = await supabase
    .from("senderistas")
    .select("id")
    .eq("upload_token", token)
    .single();

  if (lookupError || !senderista) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const tipo = formData.get("tipo") as string | null;

  if (!file || !tipo) {
    return NextResponse.json({ error: "Arquivo e tipo são obrigatórios" }, { status: 400 });
  }

  if (!ALLOWED_TIPOS.includes(tipo as TipoExame)) {
    return NextResponse.json({ error: "Tipo de exame inválido" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo deve ter no máximo 10MB" }, { status: 400 });
  }

  const rawExt = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_EXTS.includes(rawExt)) {
    return NextResponse.json({ error: "Formato inválido. Use PDF, JPG ou PNG." }, { status: 400 });
  }

  // Derive content-type from extension, ignoring the client-supplied file.type
  const MIME_MAP: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  const contentType = MIME_MAP[rawExt];
  if (!ALLOWED_MIME.includes(contentType)) {
    return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
  }

  const path = `exames/${senderista.id}/${tipo}-${Date.now()}.${rawExt}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("exames")
    .upload(path, file, { contentType, upsert: true });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json({ error: "Erro ao armazenar arquivo" }, { status: 500 });
  }

  const { error: dbError } = await supabase.from("exames").insert({
    senderista_id: senderista.id,
    tipo,
    arquivo_url: path,
  });

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: "Erro ao registrar exame" }, { status: 500 });
  }

  return NextResponse.json({ arquivo_url: path });
}

export async function PATCH(request: Request, { params }: Params) {
  const { token } = await params;
  const supabase = await createClient();

  const body = await request.json();
  if (body.status !== "exames_enviados") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  // Only allow status change if participant is still pending — prevent downgrade from aprovado/reprovado
  const { data: current, error: readError } = await supabase
    .from("senderistas")
    .select("status")
    .eq("upload_token", token)
    .single();

  if (readError || !current) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (current.status !== "pendente") {
    return NextResponse.json({ error: "Status não pode ser alterado" }, { status: 409 });
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
