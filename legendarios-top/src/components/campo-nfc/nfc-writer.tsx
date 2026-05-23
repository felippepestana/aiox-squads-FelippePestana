"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { writeNFCTag, isNFCSupported, type NFCTagData } from "@/lib/nfc";
import { RISK_LABELS, type RiskLevel } from "@/lib/triage";
import { Wifi, CheckCircle, AlertCircle } from "lucide-react";

interface Senderista {
  id: string;
  nome: string;
  tipo_sanguineo: string | null;
  peso_kg: number | null;
  altura_cm: number | null;
  imc: number | null;
  plano_saude: boolean;
  qual_plano: string | null;
  comorbidades: string[];
  classificacao_risco: string;
  status: string;
  telefone: string;
}

interface Props {
  senderistas: Senderista[];
}

export default function NFCWriter({ senderistas }: Props) {
  const [writing, setWriting] = useState<string | null>(null);
  const [written, setWritten] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nfcSupported = typeof window !== "undefined" && isNFCSupported();

  async function handleWrite(s: Senderista) {
    setWriting(s.id);
    setErrors((p) => { const n = { ...p }; delete n[s.id]; return n; });

    const tagData: NFCTagData = {
      id: s.id,
      nome: s.nome,
      sanguineo: s.tipo_sanguineo,
      plano: s.plano_saude ? (s.qual_plano ?? "Sim") : null,
      risco: s.classificacao_risco as "baixo" | "moderado" | "alto",
      imc: s.imc,
      peso: s.peso_kg,
      altura: s.altura_cm,
      comorbidades: s.comorbidades ?? [],
      status: s.status,
      telefone: s.telefone,
    };

    try {
      await writeNFCTag(tagData);

      // Record NFC tag write on server
      await fetch(`/api/senderistas/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s.status, nfc_tag_id: s.id }),
      });

      setWritten((p) => new Set([...p, s.id]));
    } catch (e) {
      setErrors((p) => ({ ...p, [s.id]: e instanceof Error ? e.message : "Erro ao gravar TAG" }));
    } finally {
      setWriting(null);
    }
  }

  if (!nfcSupported) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">NFC não disponível neste dispositivo</p>
            <p className="text-sm text-amber-700">Abra esta página no Chrome para Android para gravar as TAGs NFC.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-3 flex items-center gap-2 text-sm text-green-800">
          <Wifi className="w-4 h-4" />
          NFC disponível — aproxime a TAG ao celular quando solicitado
        </CardContent>
      </Card>

      {senderistas.map((s) => (
        <Card key={s.id}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{s.nome}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={s.classificacao_risco as RiskLevel}>
                  {RISK_LABELS[s.classificacao_risco as RiskLevel]}
                </Badge>
                {written.has(s.id) && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {s.tipo_sanguineo ?? "Tipo sanguíneo não informado"} · IMC {s.imc ?? "N/A"}
            </p>
            {errors[s.id] && <p className="text-sm text-destructive">{errors[s.id]}</p>}
            <Button
              size="sm"
              onClick={() => handleWrite(s)}
              disabled={writing === s.id}
              variant={written.has(s.id) ? "outline" : "default"}
            >
              {writing === s.id
                ? "Aguardando TAG..."
                : written.has(s.id)
                ? "Regravar TAG"
                : "Gravar TAG NFC"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
