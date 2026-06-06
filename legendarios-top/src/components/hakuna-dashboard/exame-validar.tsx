"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  exameId: string;
  validado: boolean | null;
}

export default function ExameValidar({ exameId, validado }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"aprovado" | "reprovado" | null>(null);
  const [showMotivo, setShowMotivo] = useState(false);
  const [motivo, setMotivo] = useState("");

  if (validado !== null) return null;

  async function validar(val: boolean, motivo_reprovacao?: string) {
    setLoading(val ? "aprovado" : "reprovado");
    const res = await fetch(`/api/exames/${exameId}/validar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ validado: val, motivo_reprovacao }),
    });
    setLoading(null);
    if (res.ok) {
      setShowMotivo(false);
      setMotivo("");
      router.refresh();
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => validar(true)}
          disabled={loading !== null}
          className="text-green-700 border-green-300 hover:bg-green-50"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {loading === "aprovado" ? "..." : "Aprovar"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMotivo(!showMotivo)}
          disabled={loading !== null}
          className="text-red-700 border-red-300 hover:bg-red-50"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Reprovar
        </Button>
      </div>
      {showMotivo && (
        <div className="space-y-2 border rounded p-2 bg-red-50">
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo da reprovação..."
            className="w-full border rounded px-2 py-1.5 text-xs min-h-[60px]"
          />
          <Button
            size="sm"
            variant="destructive"
            disabled={!motivo || loading === "reprovado"}
            onClick={() => validar(false, motivo)}
          >
            {loading === "reprovado" ? "..." : "Confirmar"}
          </Button>
        </div>
      )}
    </div>
  );
}
