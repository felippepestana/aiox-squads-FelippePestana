import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
};

const cartaSchema = z.object({
  tipo: z.literal("carta"),
  enviado_por: z.string().min(2).max(100),
  titulo: z.string().max(120).optional(),
  conteudo: z.string().min(1).max(5000),
});

// GET /api/mensagens/[token] — resolve token → senderista name + required exams
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: senderista, error } = await admin
    .from("senderistas")
    .select("id, nome, evento_nome")
    .eq("mensagens_token", token)
    .single();

  if (error || !senderista) {
    return NextResponse.json({ error: "Link inválido ou expirado" }, { status: 404 });
  }

  return NextResponse.json({
    nome: senderista.nome,
    evento: senderista.evento_nome,
  });
}

// POST /api/mensagens/[token] — submit carta (JSON) or file (multipart)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: senderista, error: lookupErr } = await admin
    .from("senderistas")
    .select("id")
    .eq("mensagens_token", token)
    .single();

  if (lookupErr || !senderista) {
    return NextResponse.json({ error: "Link inválido" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  // --- Carta (text) ---
  if (contentType.includes("application/json")) {
    const body = await request.json();
    const parsed = cartaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.errors }, { status: 400 });
    }
    const { error } = await supabase.from("mensagens_apoio").insert({
      senderista_id: senderista.id,
      tipo: "carta",
      enviado_por: parsed.data.enviado_por,
      titulo: parsed.data.titulo ?? null,
      conteudo: parsed.data.conteudo,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  }

  // --- File (foto / video / audio) ---
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const enviadoPor = String(formData.get("enviado_por") ?? "").trim();
    const tipo = String(formData.get("tipo") ?? "").trim() as "foto" | "video" | "audio";

    if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    if (!enviadoPor || enviadoPor.length < 2) return NextResponse.json({ error: "Nome do remetente obrigatório" }, { status: 400 });
    if (!["foto", "video", "audio"].includes(tipo)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Arquivo muito grande (máx 50 MB)" }, { status: 413 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = ALLOWED_MIME[ext];
    if (!mimeType) return NextResponse.json({ error: "Formato não permitido" }, { status: 415 });

    const path = `${senderista.id}/${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const admin = createAdminClient();
    const { error: uploadErr } = await admin.storage
      .from("mensagens")
      .upload(path, buffer, { contentType: mimeType, upsert: false });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      return NextResponse.json({ error: "Falha ao enviar arquivo" }, { status: 500 });
    }

    const { error: insertErr } = await supabase.from("mensagens_apoio").insert({
      senderista_id: senderista.id,
      tipo,
      enviado_por: enviadoPor,
      arquivo_url: path,
    });

    if (insertErr) {
      await admin.storage.from("mensagens").remove([path]);
      throw insertErr;
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Content-Type não suportado" }, { status: 415 });
}
