"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXAM_LABELS, RISK_LABELS, type ExamType, type RiskLevel } from "@/lib/triage";
import { Upload, CheckCircle, Clock, XCircle } from "lucide-react";

interface Senderista {
  id: string;
  nome: string;
  exames_exigidos: string[];
  status: string;
  classificacao_risco: string;
  motivo_reprovacao: string | null;
  orientacoes: string | null;
}

interface Props {
  senderista: Senderista;
  token: string;
}

const STATUS_BADGE_VARIANT: Record<string, "aprovado" | "reprovado" | "pendente" | "exames_enviados"> = {
  aprovado: "aprovado",
  reprovado: "reprovado",
  pendente: "pendente",
  exames_enviados: "exames_enviados",
};

const STATUS_LABELS: Record<string, string> = {
  pendente: "Aguardando envio de exames",
  exames_enviados: "Exames enviados — aguardando validação",
  aprovado: "Aprovado para participar",
  reprovado: "Não aprovado",
};

export default function ExameUpload({ senderista, token }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpload(tipo: string, file: File) {
    setUploading((p) => ({ ...p, [tipo]: true }));
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", tipo);
      formData.append("token", token);

      const res = await fetch(`/api/exames/${token}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Erro ao enviar arquivo");
      }

      const body = await res.json();
      setUploaded((p) => ({ ...p, [tipo]: body.arquivo_url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar");
    } finally {
      setUploading((p) => ({ ...p, [tipo]: false }));
    }
  }

  const allUploaded = senderista.exames_exigidos.every((e) => uploaded[e]);

  async function finalizarEnvio() {
    setUploading((p) => ({ ...p, finalizar: true }));
    try {
      const res = await fetch(`/api/exames/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "exames_enviados" }),
      });
      if (!res.ok) throw new Error("Erro ao finalizar");
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setUploading((p) => ({ ...p, finalizar: false }));
    }
  }

  if (success || senderista.status === "exames_enviados" || senderista.status === "aprovado" || senderista.status === "reprovado") {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {senderista.status === "aprovado" ? <CheckCircle className="text-green-600" /> :
             senderista.status === "reprovado" ? <XCircle className="text-red-600" /> :
             <Clock className="text-blue-600" />}
            {STATUS_LABELS[senderista.status] ?? "Processando..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant={STATUS_BADGE_VARIANT[senderista.status] ?? "pendente"}>
            {STATUS_LABELS[senderista.status]}
          </Badge>
          {senderista.status === "reprovado" && senderista.motivo_reprovacao && (
            <div className="rounded border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">Motivo:</p>
              <p className="text-sm text-red-700">{senderista.motivo_reprovacao}</p>
              {senderista.orientacoes && (
                <>
                  <p className="text-sm font-medium text-red-800 mt-2">Orientações:</p>
                  <p className="text-sm text-red-700">{senderista.orientacoes}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classificação de Risco</CardTitle>
          <Badge variant={STATUS_BADGE_VARIANT[senderista.classificacao_risco as string] ?? "pendente"}>
            {RISK_LABELS[senderista.classificacao_risco as RiskLevel] ?? senderista.classificacao_risco}
          </Badge>
        </CardHeader>
      </Card>

      {senderista.exames_exigidos.map((tipo) => (
        <Card key={tipo}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {uploaded[tipo] ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Upload className="w-5 h-5 text-gray-400" />}
              {EXAM_LABELS[tipo as ExamType] ?? tipo}
            </CardTitle>
            <CardDescription>PDF, JPG ou PNG (máx. 10MB)</CardDescription>
          </CardHeader>
          <CardContent>
            {uploaded[tipo] ? (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Arquivo enviado
              </p>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  disabled={uploading[tipo]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(tipo, file);
                  }}
                />
                <Button variant="outline" size="sm" disabled={uploading[tipo]} asChild>
                  <span>{uploading[tipo] ? "Enviando..." : "Selecionar arquivo"}</span>
                </Button>
              </label>
            )}
          </CardContent>
        </Card>
      ))}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {allUploaded && (
        <Button onClick={finalizarEnvio} disabled={uploading.finalizar} className="w-full">
          {uploading.finalizar ? "Finalizando..." : "Confirmar envio de todos os exames"}
        </Button>
      )}
    </div>
  );
}
