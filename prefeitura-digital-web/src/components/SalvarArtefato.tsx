"use client";

import { useState } from "react";
import { ModuloArtefato } from "@/lib/artefatos";

interface Props {
  modulo: ModuloArtefato;
  tipo: string;
  titulo: string;
  conteudo: string;
  degraded?: boolean;
  metadados?: Record<string, unknown>;
}

type Estado = "idle" | "salvando" | "ok" | "erro" | "indisponivel";

// Botão de salvamento de artefato. Degrada quando a persistência não está
// configurada (501) ou quando o usuário não está autenticado (401).
export default function SalvarArtefato({ modulo, tipo, titulo, conteudo, degraded, metadados }: Props) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [msg, setMsg] = useState("");

  async function salvar() {
    setEstado("salvando");
    setMsg("");
    try {
      const res = await fetch("/api/artefatos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modulo, tipo, titulo, conteudo, degraded, metadados }),
      });
      if (res.status === 501) {
        setEstado("indisponivel");
        setMsg("Persistência não configurada.");
        return;
      }
      if (res.status === 401) {
        setEstado("erro");
        setMsg("Entre para salvar.");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao salvar.");
      setEstado("ok");
      setMsg("Salvo em Meus artefatos.");
    } catch (e: any) {
      setEstado("erro");
      setMsg(e?.message || "Erro ao salvar.");
    }
  }

  return (
    <span className="flex items-center gap-2">
      <button
        onClick={salvar}
        disabled={estado === "salvando" || !conteudo}
        className="rounded bg-gray-100 px-3 py-1 text-xs disabled:opacity-50"
      >
        {estado === "salvando" ? "Salvando…" : "Salvar"}
      </button>
      {msg && (
        <span
          className={`text-xs ${
            estado === "ok" ? "text-green-700" : estado === "indisponivel" ? "text-amber-700" : "text-red-700"
          }`}
        >
          {estado === "erro" && msg === "Entre para salvar." ? (
            <a href="/login" className="underline">
              Entre para salvar
            </a>
          ) : (
            msg
          )}
        </span>
      )}
    </span>
  );
}
