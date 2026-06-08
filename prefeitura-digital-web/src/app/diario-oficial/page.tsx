"use client";

import { useState } from "react";
import SalvarArtefato from "@/components/SalvarArtefato";

type TipoAtoDO =
  | "lei"
  | "decreto"
  | "portaria"
  | "extrato-contrato"
  | "aviso-licitacao"
  | "nomeacao"
  | "exoneracao"
  | "aposentadoria";

const ATOS: { id: TipoAtoDO; rotulo: string; caderno: string; pncp: boolean }[] = [
  { id: "lei", rotulo: "Lei", caderno: "Poder Executivo", pncp: false },
  { id: "decreto", rotulo: "Decreto", caderno: "Poder Executivo", pncp: false },
  { id: "portaria", rotulo: "Portaria", caderno: "Poder Executivo / Pessoal", pncp: false },
  { id: "extrato-contrato", rotulo: "Extrato de contrato/aditivo", caderno: "Licitações e Contratos", pncp: true },
  { id: "aviso-licitacao", rotulo: "Aviso de licitação", caderno: "Licitações e Contratos", pncp: true },
  { id: "nomeacao", rotulo: "Nomeação", caderno: "Pessoal", pncp: false },
  { id: "exoneracao", rotulo: "Exoneração", caderno: "Pessoal", pncp: false },
  { id: "aposentadoria", rotulo: "Aposentadoria (RPPS)", caderno: "Pessoal", pncp: false },
];

export default function DiarioOficialPage() {
  const [tipo, setTipo] = useState<TipoAtoDO>("portaria");
  const [ementa, setEmenta] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autoridade, setAutoridade] = useState("");

  const [doc, setDoc] = useState("");
  const [degraded, setDegraded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const meta = ATOS.find((a) => a.id === tipo)!;

  async function gerar() {
    setLoading(true);
    setErro("");
    setDoc("");
    try {
      const res = await fetch("/api/diario-oficial", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tipo, ementa, conteudo, autoridade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na geração.");
      setDoc(data.text);
      setDegraded(Boolean(data.degraded));
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Diário Oficial — editor de atos</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Elaboração de atos por tipo e caderno a partir de informações mínimas. Fundamentos: CF art. 37,
          LAI, Lei 14.129/2021 e assinatura ICP-Brasil (Lei 14.063/2020). Inspiração: SIGPub/AROM.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <label className="mb-1 block text-sm font-medium">Tipo de ato</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoAtoDO)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {ATOS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.rotulo}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Caderno: <span className="font-medium">{meta.caderno}</span>
              {meta.pncp && (
                <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                  também no PNCP
                </span>
              )}
            </p>

            <label className="mt-4 mb-1 block text-sm font-medium">Ementa / objeto</label>
            <input
              value={ementa}
              onChange={(e) => setEmenta(e.target.value)}
              placeholder="Ex.: nomeia servidor para cargo em comissão"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />

            <label className="mt-3 mb-1 block text-sm font-medium">Conteúdo / dados</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={5}
              placeholder="Informe os dados essenciais do ato (sem dados pessoais excedentes)"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />

            <label className="mt-3 mb-1 block text-sm font-medium">Autoridade signatária</label>
            <input
              value={autoridade}
              onChange={(e) => setAutoridade(e.target.value)}
              placeholder="Ex.: Prefeito Municipal"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />

            <button
              onClick={gerar}
              disabled={loading || (!ementa && !conteudo)}
              className="mt-4 w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Gerando…" : "Gerar ato"}
            </button>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            Roadmap: assinatura digital ICP-Brasil, publicação automática no PNCP quando exigível e
            biblioteca eletrônica pesquisável com verificação de autenticidade.
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Ato gerado</h2>
            {doc && (
              <div className="flex items-center gap-2">
                <SalvarArtefato
                  modulo="diario-oficial"
                  tipo={meta.rotulo}
                  titulo={`${meta.rotulo} — ${ementa || "sem ementa"}`}
                  conteudo={doc}
                  degraded={degraded}
                  metadados={{ caderno: meta.caderno, pncp: meta.pncp }}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(doc)}
                  className="rounded bg-gray-100 px-3 py-1 text-xs"
                >
                  Copiar
                </button>
              </div>
            )}
          </div>
          {erro && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
          {degraded && doc && (
            <p className="mb-3 rounded bg-amber-50 p-2 text-xs text-amber-800">
              Modo rascunho (sem IA). Configure <code>ANTHROPIC_API_KEY</code> para geração assistida.
            </p>
          )}
          {!doc && !erro && (
            <p className="text-sm text-gray-400">
              Preencha os campos e clique em “Gerar ato”. O ato aparece aqui em Markdown.
            </p>
          )}
          {doc && <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{doc}</pre>}
        </div>
      </div>
    </div>
  );
}
