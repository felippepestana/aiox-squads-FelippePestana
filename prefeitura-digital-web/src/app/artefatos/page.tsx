"use client";

import { useEffect, useState } from "react";
import { Artefato } from "@/lib/artefatos";

const MODULO_ROTULO: Record<string, string> = {
  contratacoes: "Contratações",
  "diario-oficial": "Diário Oficial",
  orcamento: "Orçamento",
  rh: "Recursos Humanos",
  transparencia: "Transparência",
};

type Status = "carregando" | "ok" | "indisponivel" | "naoAutenticado" | "erro";

export default function ArtefatosPage() {
  const [status, setStatus] = useState<Status>("carregando");
  const [itens, setItens] = useState<Artefato[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    setStatus("carregando");
    try {
      const res = await fetch("/api/artefatos");
      if (res.status === 501) return setStatus("indisponivel");
      if (res.status === 401) return setStatus("naoAutenticado");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao carregar.");
      setItens(data.artefatos || []);
      setStatus("ok");
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
      setStatus("erro");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id: string) {
    const res = await fetch(`/api/artefatos/${id}`, { method: "DELETE" });
    if (res.ok) setItens((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Meus artefatos</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Documentos gerados e salvos (ETP/TR/PB, atos do Diário Oficial e outros). O acesso é isolado por
          usuário (RLS).
        </p>
      </div>

      {status === "indisponivel" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Persistência não configurada. Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para habilitar o salvamento de artefatos.
        </div>
      )}
      {status === "naoAutenticado" && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          Você precisa{" "}
          <a href="/login" className="text-brand underline">
            entrar
          </a>{" "}
          para ver seus artefatos salvos.
        </div>
      )}
      {status === "erro" && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
      {status === "carregando" && <p className="text-sm text-gray-400">Carregando…</p>}

      {status === "ok" && itens.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhum artefato salvo ainda. Gere um documento e clique em “Salvar”.
        </p>
      )}

      {status === "ok" && itens.length > 0 && (
        <ul className="space-y-3">
          {itens.map((a) => (
            <li key={a.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-800">{a.titulo}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-gray-100 px-2 py-0.5">
                      {MODULO_ROTULO[a.modulo] || a.modulo}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-0.5">{a.tipo}</span>
                    {a.degraded && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">rascunho</span>
                    )}
                    <span>{new Date(a.created_at).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setAberto(aberto === a.id ? null : a.id)}
                    className="rounded bg-gray-100 px-3 py-1 text-xs"
                  >
                    {aberto === a.id ? "Ocultar" : "Ver"}
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(a.conteudo)}
                    className="rounded bg-gray-100 px-3 py-1 text-xs"
                  >
                    Copiar
                  </button>
                  <button
                    onClick={() => excluir(a.id)}
                    className="rounded bg-red-50 px-3 py-1 text-xs text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              {aberto === a.id && (
                <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words border-t border-gray-100 pt-3 text-sm text-gray-800">
                  {a.conteudo}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
