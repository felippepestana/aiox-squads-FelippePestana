"use client";

import { useState } from "react";
import SalvarArtefato from "@/components/SalvarArtefato";
import { brl } from "@/lib/format";

interface PrecoItem {
  descricao: string;
  orgao?: string;
  valorEstimado?: number; // valor total estimado da contratação (não é preço unitário)
  data?: string;
  fonte: string;
  link?: string;
}

// Resumo textual das contratações de referência, para alimentar a seção de
// estimativa de valor do ETP (o backend aceita body.precos como texto).
function resumoPrecos(itens: PrecoItem[]): string {
  if (itens.length === 0) return "";
  return itens
    .map((p) => `- ${p.descricao} — ${p.orgao || "órgão não informado"} — ${brl(p.valorEstimado)} (PNCP${p.data ? `, ${p.data.slice(0, 10)}` : ""})`)
    .join("\n");
}

export default function ContratacoesPage() {
  const [tipo, setTipo] = useState<"ETP" | "TR" | "PB">("ETP");
  const [objeto, setObjeto] = useState("");
  const [secretaria, setSecretaria] = useState("");
  const [necessidade, setNecessidade] = useState("");
  const [dotacao, setDotacao] = useState("");

  const [doc, setDoc] = useState("");
  const [degraded, setDegraded] = useState(false);
  const [aviso, setAviso] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [precos, setPrecos] = useState<PrecoItem[]>([]);
  const [buscandoPrecos, setBuscandoPrecos] = useState(false);

  async function gerar() {
    setLoading(true);
    setErro("");
    setDoc("");
    setDegraded(false);
    setAviso("");
    try {
      const res = await fetch("/api/etp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tipo,
          objeto,
          secretaria,
          necessidade,
          dotacao,
          precos: resumoPrecos(precos), // alimenta a estimativa de valor (PNCP)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na geração.");
      setDoc(data.text);
      setDegraded(Boolean(data.degraded));
      setAviso(data.aviso || "");
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function buscarPrecos() {
    setBuscandoPrecos(true);
    try {
      const res = await fetch(`/api/precos?q=${encodeURIComponent(objeto)}`);
      const data = await res.json();
      setPrecos(data.itens || []);
    } finally {
      setBuscandoPrecos(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-fg">Planejamento da contratação</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="mb-1 block text-sm font-medium">Documento</label>
          <div className="flex gap-2">
            {(["ETP", "TR", "PB"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`rounded px-3 py-1 text-sm ${
                  tipo === t ? "bg-brand text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {t === "ETP" ? "ETP" : t === "TR" ? "Termo de Ref." : "Projeto Básico"}
              </button>
            ))}
          </div>

          <label className="mt-4 mb-1 block text-sm font-medium">Objeto</label>
          <input
            value={objeto}
            onChange={(e) => setObjeto(e.target.value)}
            placeholder="Ex.: aquisição de ambulâncias"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

          <label className="mt-3 mb-1 block text-sm font-medium">Secretaria</label>
          <input
            value={secretaria}
            onChange={(e) => setSecretaria(e.target.value)}
            placeholder="Ex.: Semusa"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

          {tipo === "ETP" && (
            <>
              <label className="mt-3 mb-1 block text-sm font-medium">Necessidade</label>
              <textarea
                value={necessidade}
                onChange={(e) => setNecessidade(e.target.value)}
                rows={3}
                placeholder="Descreva a necessidade administrativa"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <label className="mt-3 mb-1 block text-sm font-medium">Dotação (opcional)</label>
              <input
                value={dotacao}
                onChange={(e) => setDotacao(e.target.value)}
                placeholder="Programa / natureza / fonte"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </>
          )}

          <button
            onClick={gerar}
            disabled={loading || !objeto}
            className="mt-4 w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Gerando…" : `Gerar ${tipo}`}
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pesquisa de preços (PNCP)</span>
            <button
              onClick={buscarPrecos}
              disabled={buscandoPrecos || !objeto}
              className="rounded bg-gray-100 px-3 py-1 text-xs disabled:opacity-50"
            >
              {buscandoPrecos ? "Buscando…" : "Buscar"}
            </button>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            Contratações recentes (pregão eletrônico) cujo objeto contém o termo. Valor total estimado da
            contratação — não é preço unitário. Alimenta a estimativa de valor do ETP.
          </p>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {precos.length === 0 && <li className="text-gray-400">Sem resultados ainda.</li>}
            {precos.map((p, i) => (
              <li key={i} className="border-b border-gray-100 pb-2">
                <div className="font-medium text-gray-800">{p.descricao}</div>
                <div>{p.orgao}</div>
                <div>
                  {brl(p.valorEstimado)} ·{" "}
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                      {p.fonte}
                    </a>
                  ) : (
                    p.fonte
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Documento gerado</h2>
          {doc && (
            <div className="flex items-center gap-2">
              <SalvarArtefato
                modulo="contratacoes"
                tipo={tipo}
                titulo={`${tipo} — ${objeto || "sem objeto"}`}
                conteudo={doc}
                degraded={degraded}
                metadados={{ secretaria }}
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
            {aviso || "Modo rascunho (sem IA). Configure ANTHROPIC_API_KEY para geração assistida."}
          </p>
        )}
        {!doc && !erro && (
          <p className="text-sm text-gray-400">
            Preencha os campos e clique em “Gerar”. O documento aparece aqui em Markdown.
          </p>
        )}
        {doc && (
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{doc}</pre>
        )}
      </div>
    </div>
  );
}
