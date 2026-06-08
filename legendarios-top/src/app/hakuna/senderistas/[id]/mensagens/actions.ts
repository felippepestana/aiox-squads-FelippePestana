"use server";
import { createClient } from "@/lib/supabase/server";

export async function marcarLidas(ids: string[]) {
  if (!ids.length) return;
  const supabase = await createClient();
  await supabase
    .from("mensagens_apoio")
    .update({ visualizado: true, visualizado_em: new Date().toISOString() })
    .in("id", ids);
}
