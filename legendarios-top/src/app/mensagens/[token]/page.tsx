"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, FileText, Image, Video, Mic, CheckCircle, AlertCircle, Upload, ChevronLeft } from "lucide-react";

type ModoEnvio = "escolha" | "carta" | "foto" | "video" | "audio" | "enviado";

interface SenderistaMeta {
  nome: string;
  evento: string | null;
}

export default function MensagensPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  const [meta, setMeta] = useState<SenderistaMeta | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [modo, setModo] = useState<ModoEnvio>("escolha");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // carta
  const [enviadoPor, setEnviadoPor] = useState("");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");

  // file
  const [file, setFile] = useState<File | null>(null);
  const [fileEnviadoPor, setFileEnviadoPor] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/mensagens/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setMeta)
      .catch(() => setNotFound(true));
  }, [token]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="font-semibold text-lg">Link inválido</p>
            <p className="text-sm text-muted-foreground">Este link não existe ou já expirou.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (modo === "enviado") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-green-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <div>
              <p className="text-xl font-bold text-green-800">Mensagem enviada!</p>
              <p className="text-sm text-green-700 mt-1">
                {meta.nome} receberá sua mensagem durante o TOP.
              </p>
            </div>
            <Button variant="outline" onClick={() => setModo("escolha")} className="w-full">
              Enviar outra mensagem
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function submitCarta() {
    if (!enviadoPor.trim()) { setError("Informe seu nome"); return; }
    if (!conteudo.trim()) { setError("Escreva sua mensagem"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/mensagens/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "carta", enviado_por: enviadoPor, titulo, conteudo }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error); }
      setModo("enviado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar");
    } finally { setLoading(false); }
  }

  async function submitFile(tipoArquivo: "foto" | "video" | "audio") {
    if (!fileEnviadoPor.trim()) { setError("Informe seu nome"); return; }
    if (!file) { setError("Selecione um arquivo"); return; }
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("enviado_por", fileEnviadoPor);
      fd.append("tipo", tipoArquivo);
      const res = await fetch(`/api/mensagens/${token}`, { method: "POST", body: fd });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error); }
      setModo("enviado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar");
    } finally { setLoading(false); }
  }

  const nomeParticipante = meta.nome.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-lg mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Heart className="w-10 h-10 text-green-600 mx-auto" />
          <h1 className="text-2xl font-bold text-green-900">Mensagem para {nomeParticipante}</h1>
          {meta.evento && (
            <p className="text-sm text-muted-foreground">{meta.evento}</p>
          )}
          <p className="text-sm text-green-700">
            Envie uma mensagem de apoio que será entregue durante o TOP.
          </p>
        </div>

        {/* Escolha do tipo */}
        {modo === "escolha" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { tipo: "carta" as const, icon: FileText, label: "Carta", desc: "Escreva uma mensagem de texto" },
              { tipo: "foto" as const, icon: Image, label: "Foto", desc: "Envie uma foto especial" },
              { tipo: "video" as const, icon: Video, label: "Vídeo", desc: "Grave um vídeo de apoio" },
              { tipo: "audio" as const, icon: Mic, label: "Áudio", desc: "Mande um recado em voz" },
            ].map(({ tipo, icon: Icon, label, desc }) => (
              <button
                key={tipo}
                onClick={() => { setModo(tipo); setError(null); }}
                className="rounded-xl border-2 border-green-200 bg-white p-4 text-left hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Icon className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Carta */}
        {modo === "carta" && (
          <Card>
            <CardHeader>
              <button onClick={() => setModo("escolha")} className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <CardTitle>Escrever carta</CardTitle>
              <CardDescription>Sua mensagem será lida por {nomeParticipante} durante o TOP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="enviado_por">Seu nome *</Label>
                <Input id="enviado_por" placeholder="Ex: Ana Paula" value={enviadoPor} onChange={e => setEnviadoPor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="titulo">Título (opcional)</Label>
                <Input id="titulo" placeholder="Ex: Com amor da sua esposa" value={titulo} onChange={e => setTitulo(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="conteudo">Mensagem *</Label>
                <textarea
                  id="conteudo"
                  rows={6}
                  placeholder={`Escreva aqui sua mensagem para ${nomeParticipante}...`}
                  value={conteudo}
                  onChange={e => setConteudo(e.target.value)}
                  maxLength={5000}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{conteudo.length}/5000</p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={submitCarta} disabled={loading} className="w-full bg-green-700 hover:bg-green-800">
                {loading ? "Enviando..." : "Enviar carta"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Foto / Vídeo / Áudio */}
        {(modo === "foto" || modo === "video" || modo === "audio") && (
          <Card>
            <CardHeader>
              <button onClick={() => { setModo("escolha"); setFile(null); }} className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <CardTitle>
                {modo === "foto" ? "Enviar foto" : modo === "video" ? "Enviar vídeo" : "Enviar áudio"}
              </CardTitle>
              <CardDescription>
                {modo === "foto" && "Formatos aceitos: JPG, PNG, WEBP, HEIC (máx 50 MB)"}
                {modo === "video" && "Formatos aceitos: MP4, MOV, WEBM (máx 50 MB)"}
                {modo === "audio" && "Formatos aceitos: MP3, M4A, OGG, WAV (máx 50 MB)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="file_enviado_por">Seu nome *</Label>
                <Input
                  id="file_enviado_por"
                  placeholder="Ex: Ana Paula"
                  value={fileEnviadoPor}
                  onChange={e => setFileEnviadoPor(e.target.value)}
                />
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-green-600 mx-auto" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto" />
                    <p className="text-sm">Toque para selecionar o arquivo</p>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={
                  modo === "foto" ? ".jpg,.jpeg,.png,.webp,.heic" :
                  modo === "video" ? ".mp4,.mov,.webm" :
                  ".mp3,.m4a,.ogg,.wav"
                }
                onChange={e => { setFile(e.target.files?.[0] ?? null); setError(null); }}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={() => submitFile(modo as "foto" | "video" | "audio")}
                disabled={loading || !file}
                className="w-full bg-green-700 hover:bg-green-800"
              >
                {loading ? "Enviando..." : `Enviar ${modo}`}
              </Button>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Mensagens são entregues com carinho pela equipe Hakuna durante o TOP.
        </p>
      </div>
    </div>
  );
}
