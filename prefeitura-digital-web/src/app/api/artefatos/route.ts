import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { MODULOS_VALIDOS, ModuloArtefato } from "@/lib/artefatos";

export const runtime = "nodejs";

// Resposta padrão quando a persistência não está configurada.
function semPersistencia() {
  return NextResponse.json(
    { error: "Persistência não configurada (defina NEXT_PUBLIC_SUPABASE_URL/ANON_KEY).", disabled: true },
    { status: 501 }
  );
}

// GET /api/artefatos — lista os artefatos do usuário autenticado.
export async function GET() {
  const supabase = await getServerSupabase();
  if (!supabase) return semPersistencia();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("artefatos")
    .select("id, modulo, tipo, titulo, conteudo, degraded, metadados, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ artefatos: data ?? [] });
}

// POST /api/artefatos — salva um novo artefato para o usuário autenticado.
export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase();
  if (!supabase) return semPersistencia();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const modulo = body.modulo as ModuloArtefato;
  const tipo = String(body.tipo || "").trim();
  const titulo = String(body.titulo || "").trim();
  const conteudo = String(body.conteudo || "");

  if (!MODULOS_VALIDOS.includes(modulo)) {
    return NextResponse.json({ error: "Módulo inválido." }, { status: 400 });
  }
  if (!tipo || !titulo || !conteudo) {
    return NextResponse.json(
      { error: "Informe tipo, título e conteúdo." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("artefatos")
    .insert({
      user_id: user.id,
      modulo,
      tipo,
      titulo,
      conteudo,
      degraded: Boolean(body.degraded),
      metadados: body.metadados ?? {},
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id }, { status: 201 });
}
