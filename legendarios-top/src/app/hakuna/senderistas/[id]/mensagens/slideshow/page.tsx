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

  // Batch-sign all file URLs in one storage call (2h for slideshow session)
  const filePaths = (rawMensagens ?? []).map(m => m.arquivo_url).filter(Boolean) as string[];
  const { data: signedFiles } = filePaths.length
    ? await supabase.storage.from("mensagens").createSignedUrls(filePaths, 7200)
    : { data: [] };
  const signedUrlMap = Object.fromEntries(
    (signedFiles ?? []).map(s => [s.path, s.signedUrl])
  );

  const mensagens: Message[] = (rawMensagens ?? []).map(m => ({
    ...m,
    signedUrl: m.arquivo_url ? (signedUrlMap[m.arquivo_url] ?? undefined) : undefined,
  }));

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
