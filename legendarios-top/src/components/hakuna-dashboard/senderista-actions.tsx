"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, MessageCircle, Link as LinkIcon } from "lucide-react";
import { EXAM_LABELS, type ExamType } from "@/lib/triage";

interface Senderista {
  id: string;
  nome: string;
  telefone: string;
  status: string;
  exames_exigidos: string[];
  classificacao_risco: string;
}

interface Props {
  senderista: Senderista;
  uploadLink: string;
}

export default function SenderistActions({ senderista, uploadLink }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showReprovar, setShowReprovar] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function updateStatus(status: string, extra?: object) {
    setLoading(status);
    const res = await fetch(`/api/senderistas/${senderista.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    setLoading(null);
    if (res.ok) {
      router.refresh();
    } else {
      showToast("Erro ao atualizar status");
    }
  }

  function whatsappLink(text: string) {
    const phone = senderista.telefone.replace(/\D/g, "");
    return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`;
  }

  const msgExames = `Olá ${senderista.nome}! Para participar do Legendários TOP, você precisa enviar os seguintes exames:\n\n${
    senderista.exames_exigidos.map((e) => EXAM_LABELS[e as ExamType] ?? e).join("\n")
  }\n\nEnvie aqui: ${uploadLink}`;

  const msgLink = `Olá ${senderista.nome}! Use este link para enviar seus exames: ${uploadLink}`;

  const msgAprovado = `Olá ${senderista.nome}! Seus exames foram validados pela equipe médica do Legendários TOP. Você está APROVADO(A) para participar do evento! Até lá!`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp stubs (v1) */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">WhatsApp (abre no seu celular)</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={whatsappLink(msgExames)} target="_blank">
                <MessageCircle className="w-4 h-4 mr-1" />
                Enviar exames exigidos
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={whatsappLink(msgLink)} target="_blank">
                <LinkIcon className="w-4 h-4 mr-1" />
                Enviar link de upload
              </a>
            </Button>
            {senderista.status === "aprovado" && (
              <Button variant="outline" size="sm" asChild>
                <a href={whatsappLink(msgAprovado)} target="_blank">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mensagem de aprovação
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Validação */}
        {senderista.status === "exames_enviados" && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Validação de exames</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateStatus("aprovado")}
                disabled={loading === "aprovado"}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {loading === "aprovado" ? "..." : "Aprovar"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowReprovar(!showReprovar)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reprovar
              </Button>
            </div>

            {showReprovar && (
              <div className="space-y-2 border rounded p-3 bg-red-50">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Motivo da reprovação *</label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Ex: Atestado fora da validade, exame incompleto..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Orientações ao participante</label>
                  <textarea
                    value={orientacoes}
                    onChange={(e) => setOrientacoes(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
                    placeholder="Ex: Renove o atestado e reenvie até..."
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!motivo || loading === "reprovado"}
                  onClick={() => updateStatus("reprovado", { motivo_reprovacao: motivo, orientacoes })}
                >
                  {loading === "reprovado" ? "..." : "Confirmar reprovação"}
                </Button>
              </div>
            )}
          </div>
        )}

        {toastMsg && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{toastMsg}</p>
        )}
      </CardContent>
    </Card>
  );
}
