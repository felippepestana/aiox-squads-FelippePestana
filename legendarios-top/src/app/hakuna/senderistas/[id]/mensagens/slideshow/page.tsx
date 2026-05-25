import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SlideshowClient from "./slideshow-client";

interface Message {
  id: string;
  tipo: string;
  titulo: string | null;
  conteudo: string | null;
  enviado_por: string;
  arquivo_url: string | null;
  visualizado: boolean;
  signedUrl?: string;
  created_at: string;
}

export default async function SlideshowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: senderista }, { data: rawMensagens }] = await Promise.all([
    supabase.from("senderistas").select("id, nome").eq("id", id).single(),
    supabase
      .from("mensagens_apoio")
      .select("*")
      .eq("senderista_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!senderista) notFound();

  // Generate signed URLs for file-based messages
  const mensagens: Message[] = await Promise.all(
    (rawMensagens ?? []).map(async (m) => {
      if (m.arquivo_url) {
        const { data } = await supabase.storage
          .from("mensagens")
          .createSignedUrl(m.arquivo_url, 7200); // 2h for slideshow session
        return { ...m, signedUrl: data?.signedUrl ?? undefined };
      }
      return { ...m, signedUrl: undefined };
    })
  );

  // Mark all as visualized
  const unread = mensagens.filter(m => !m.visualizado).map(m => m.id);
  if (unread.length > 0) {
    await supabase
      .from("mensagens_apoio")
      .update({ visualizado: true, visualizado_em: new Date().toISOString() })
      .in("id", unread);
  }

  return <SlideshowClient nome={senderista.nome} mensagens={mensagens} />;
}
