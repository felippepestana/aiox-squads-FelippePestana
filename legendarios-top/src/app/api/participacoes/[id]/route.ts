import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: hakuna } = await supabase.from("hakunas").select("id").eq("email", user.email!).single();
  if (!hakuna) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabase.from("participacoes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
