import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, Image, Video, Mic, ChevronLeft, Play } from "lucide-react";

const TIPO_ICON: Record<string, React.ReactNode> = {
  carta: <FileText className="w-4 h-4" />,
  foto: <Image className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  audio: <Mic className="w-4 h-4" />,
};

const TIPO_LABEL: Record<string, string> = {
  carta: "Carta",
  foto: "Foto",
  video: "Vídeo",
  audio: "Áudio",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function MensagensHakunaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: senderista }, { data: mensagens }] = await Promise.all([
    supabase.from("senderistas").select("id, nome, mensagens_token").eq("id", id).single(),
    supabase
      .from("mensagens_apoio")
      .select("*")
      .eq("senderista_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!senderista) notFound();

  const portalLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/mensagens/${senderista.mensagens_token}`;

  // Mark all unread as visualized
  const unreadIds = (mensagens ?? []).filter(m => !m.visualizado).map(m => m.id);
  if (unreadIds.length > 0) {
    await supabase
      .from("mensagens_apoio")
      .update({ visualizado: true, visualizado_em: new Date().toISOString() })
      .in("id", unreadIds);
  }

  return (
    <div className="space-y-6 py-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/hakuna/senderistas/${id}`} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" /> Mensagens — {senderista.nome.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">{mensagens?.length ?? 0} mensagem(ns) recebida(s)</p>
        </div>
      </div>

      {/* Slideshow button */}
      {(mensagens?.length ?? 0) > 0 && (
        <Link
          href="mensagens/slideshow"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-700 text-white py-3 font-medium text-sm hover:bg-green-800 transition-colors"
        >
          <Play className="w-4 h-4" /> Apresentar mensagens (slideshow)
        </Link>
      )}

      {/* Portal link */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4 space-y-2">
          <p className="text-sm font-medium text-green-900">Link de mensagens para compartilhar:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={portalLink}
              className="flex-1 text-xs border rounded px-2 py-1.5 bg-white font-mono"
            />
          </div>
          <p className="text-xs text-green-700">
            Compartilhe este link com familiares para que possam enviar mensagens de apoio.
          </p>
        </CardContent>
      </Card>

      {/* Messages list */}
      {!mensagens?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma mensagem recebida ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mensagens.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">{TIPO_ICON[m.tipo]}</span>
                    <CardTitle className="text-base">
                      {m.tipo === "carta" && m.titulo ? m.titulo : TIPO_LABEL[m.tipo]}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">{TIPO_LABEL[m.tipo]}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground">De: <strong>{m.enviado_por}</strong></p>
              </CardHeader>
              <CardContent>
                {m.tipo === "carta" && m.conteudo && (
                  <p className="text-sm whitespace-pre-wrap bg-amber-50 border border-amber-100 rounded p-3 italic">
                    {m.conteudo}
                  </p>
                )}
                {(m.tipo === "foto" || m.tipo === "video" || m.tipo === "audio") && m.arquivo_url && (
                  <FileViewer tipo={m.tipo} path={m.arquivo_url} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Server component: generates signed URL for private bucket file
async function FileViewer({ tipo, path }: { tipo: string; path: string }) {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("mensagens")
    .createSignedUrl(path, 3600);

  if (!data?.signedUrl) {
    return <p className="text-sm text-muted-foreground italic">Arquivo não disponível</p>;
  }

  if (tipo === "foto") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data.signedUrl} alt="Foto" className="rounded-lg max-h-80 object-contain" />;
  }
  if (tipo === "video") {
    return (
      <video controls className="rounded-lg max-h-80 w-full">
        <source src={data.signedUrl} />
      </video>
    );
  }
  if (tipo === "audio") {
    return (
      <audio controls className="w-full">
        <source src={data.signedUrl} />
      </audio>
    );
  }
  return null;
}
