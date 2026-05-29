"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, X, FileText, Image, Video, Mic } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Message {
  id: string;
  tipo: string;
  titulo: string | null;
  conteudo: string | null;
  enviado_por: string;
  signedUrl?: string;
  created_at: string;
}

const TIPO_ICON: Record<string, React.ReactNode> = {
  carta: <FileText className="w-5 h-5" />,
  foto: <Image className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  audio: <Mic className="w-5 h-5" />,
};

const TIPO_BG: Record<string, string> = {
  carta: "bg-amber-50",
  foto: "bg-black",
  video: "bg-black",
  audio: "bg-green-900",
};

export default function SlideshowClient({
  nome,
  mensagens,
}: {
  nome: string;
  mensagens: Message[];
}) {
  const [idx, setIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (mensagens.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Heart className="w-16 h-16 text-gray-300" />
        <p className="text-lg text-muted-foreground">Nenhuma mensagem recebida</p>
        <Link href="../mensagens" className="text-green-700 underline text-sm">Voltar</Link>
      </div>
    );
  }

  const msg = mensagens[idx];
  const isFirst = idx === 0;
  const isLast = idx === mensagens.length - 1;

  function prev() { if (!isFirst) setIdx(i => i - 1); }
  function next() { if (!isLast) setIdx(i => i + 1); }

  return (
    <div className={`min-h-screen flex flex-col ${TIPO_BG[msg.tipo] ?? "bg-gray-900"} transition-colors duration-500`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="font-medium">{nome.split(" ")[0]}</span>
          <span className="text-white/50 text-sm">— mensagem {idx + 1} de {mensagens.length}</span>
        </div>
        <Link href="../mensagens">
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </Link>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-2">
        {mensagens.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white w-4" : "bg-white/30"}`}
          />
        ))}
      </div>

      {/* Message content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">

        {/* Carta */}
        {msg.tipo === "carta" && (
          <div className="w-full max-w-lg bg-amber-50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-100 px-6 py-4 border-b border-amber-200">
              <div className="flex items-center gap-2 text-amber-800">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Carta de {msg.enviado_por}</span>
              </div>
              {msg.titulo && <p className="text-lg font-bold text-amber-900 mt-1">{msg.titulo}</p>}
            </div>
            <div className="px-6 py-6 max-h-[55vh] overflow-y-auto">
              <p className="text-amber-900 text-base leading-relaxed whitespace-pre-wrap italic">
                {msg.conteudo}
              </p>
            </div>
            <div className="px-6 py-3 bg-amber-100 text-right">
              <p className="text-amber-700 text-sm">Com amor, {msg.enviado_por} ❤️</p>
            </div>
          </div>
        )}

        {/* Foto */}
        {msg.tipo === "foto" && msg.signedUrl && (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={msg.signedUrl}
              alt={`Foto de ${msg.enviado_por}`}
              className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white/80 text-sm">Foto de {msg.enviado_por}</p>
          </div>
        )}

        {/* Vídeo */}
        {msg.tipo === "video" && msg.signedUrl && (
          <div className="flex flex-col items-center gap-3 w-full max-w-lg">
            <video
              controls
              autoPlay
              className="max-h-[60vh] w-full rounded-xl shadow-2xl bg-black"
              src={msg.signedUrl}
            />
            <p className="text-white/80 text-sm">Vídeo de {msg.enviado_por}</p>
          </div>
        )}

        {/* Áudio */}
        {msg.tipo === "audio" && msg.signedUrl && (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="w-32 h-32 rounded-full bg-green-700 flex items-center justify-center shadow-2xl">
              <Mic className="w-16 h-16 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-lg">Mensagem de voz</p>
              <p className="text-white/60 text-sm">de {msg.enviado_por}</p>
            </div>
            <audio controls autoPlay className="w-full" src={msg.signedUrl} />
          </div>
        )}

        {/* Fallback if file not available */}
        {(msg.tipo !== "carta") && !msg.signedUrl && (
          <div className="text-white/50 text-center">
            <p>Arquivo não disponível</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-6 gap-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={prev}
          disabled={isFirst}
          className="text-white hover:bg-white/10 disabled:opacity-20 flex-1"
        >
          <ChevronLeft className="w-6 h-6 mr-1" /> Anterior
        </Button>

        <div className="text-center text-white/50 text-xs">
          {TIPO_ICON[msg.tipo]}
        </div>

        <Button
          variant="ghost"
          size="lg"
          onClick={next}
          disabled={isLast}
          className="text-white hover:bg-white/10 disabled:opacity-20 flex-1"
        >
          Próxima <ChevronRight className="w-6 h-6 ml-1" />
        </Button>
      </div>

      {isLast && (
        <div className="pb-6 px-6 text-center">
          <p className="text-white/60 text-sm">Fim das mensagens ❤️</p>
          <Link href="../mensagens" className="text-white underline text-sm mt-1 block">
            Voltar para lista
          </Link>
        </div>
      )}
    </div>
  );
}
