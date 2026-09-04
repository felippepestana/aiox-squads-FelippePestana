"use client";

import { useState } from "react";
import SalvarArtefato from "@/components/SalvarArtefato";
import { ATOS_RH as ATOS, TipoAtoRH } from "@/lib/catalogos";
import { ChecagemLRF, NivelLRF } from "@/lib/lrf";
import { MUNICIPIO_IBGE_CONFIGURADO, MUNICIPIO_NOME } from "@/lib/municipio";

const LRF_ESTILO: Record<NivelLRF, string> = {
  ok: "border-green-200 bg-green-50 text-green-800",
  alerta: "border-amber-200 bg-amber-50 text-amber-800",
  "vedado-prudencial": "border-orange-200 bg-orange-50 text-orange-800",
  "vedado-maximo": "border-red-200 bg-red-50 text-red-800",
  indisponivel: "border-gray-200 bg-gray-50 text-gray-700",
};
const LRF_TITULO: Record<NivelLRF, string> = {
  ok: "✓ LRF — dentro do limite",
  alerta: "⚠ LRF — faixa de alerta",
  "vedado-prudencial": "⛔ LRF — acima do prudencial",
  "vedado-maximo": "⛔ LRF — acima do limite máximo",
  indisponivel: "ℹ LRF — checagem indisponível",
};

export default function RhPage() {
  const [tipo, setTipo] = useState<TipoAtoRH>("nomeacao");
  const [servidor, setServidor] = useState("");
  const [cargo, setCargo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [autoridade, setAutoridade] = useState("");

  const [doc, setDoc] = useState("");
  const [degraded, setDegraded] = useState(false);
  const [aviso, setAviso] = useState("");
  const [lrf, setLrf] = useState<ChecagemLRF | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const meta = ATOS.find((a) => a.id === tipo)!;

  async function gerar() {
    setLoading(true);
    setErro("");
    setDoc("");
    setLrf(null);
    setDegraded(false);
    setAviso("");
    try {
      const res = await fetch("/api/rh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tipo, servidor, cargo, detalhes, autoridade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na geração.");
      setDoc(data.text);
      setDegraded(Boolean(data.degraded));
      setAviso(data.aviso || "");
      setLrf(data.lrf || null);
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Recursos Humanos (Semad) — atos de pessoal</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Geração de atos de pessoal a partir de informações mínimas, com fundamento legal, observância da
          LGPD e checagem do limite de despesa com pessoal da LRF (RGF/SICONFI) para atos que aumentam a
          folha.
        </p>
        {!MUNICIPIO_IBGE_CONFIGURADO && (
          <p className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            Município não configurado: a checagem da LRF usa {MUNICIPIO_NOME} (1100205) como referência.
            Defina <code>NEXT_PUBLIC_MUNICIPIO_IBGE</code> para consultar o RGF do seu ente.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <label className="mb-1 block text-sm font-medium">Tipo de ato</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoAtoRH)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {ATOS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.rotulo}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Fundamento: <span className="font-medium">{meta.fundamento}</span>
              {meta.impactaFolha && (
                <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">checa LRF</span>
              )}
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Servidor(a)</label>
              <input
                value={servidor}
                onChange={(e) => setServidor(e.target.value)}
                placeholder="Nome do servidor"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cargo / função</label>
              <input
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex.: Analista Administrativo / FG-2"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Detalhes do ato</label>
              <textarea
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                rows={4}
                placeholder="Matrícula, lotação, datas/vigência, valor da vantagem, nº do processo…"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Autoridade signatária</label>
              <input
                value={autoridade}
                onChange={(e) => setAutoridade(e.target.value)}
                placeholder="Nome e cargo (ex.: Prefeito Municipal)"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={gerar}
              disabled={loading || (!servidor && !detalhes)}
              className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Gerando…" : "Gerar ato"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {lrf && (
            <div className={`rounded-lg border p-4 text-sm ${LRF_ESTILO[lrf.nivel]}`}>
              <div className="font-semibold">{LRF_TITULO[lrf.nivel]}</div>
              <p className="mt-1">{lrf.mensagem}</p>
              {lrf.exercicio && (
                <p className="mt-1 text-xs opacity-80">
                  Base: RGF {lrf.exercicio}, {lrf.periodo}º quadrimestre (SICONFI).
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Ato gerado</h2>
            {doc && (
              <div className="flex items-center gap-2">
                <SalvarArtefato
                  modulo="rh"
                  tipo={meta.rotulo}
                  titulo={`${meta.rotulo} — ${servidor || "sem servidor"}`}
                  conteudo={doc}
                  degraded={degraded}
                  metadados={{ cargo, impactaFolha: meta.impactaFolha, lrf: lrf?.nivel }}
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
            <p className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
              {aviso || "Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para geração assistida."}
            </p>
          )}

          <div className="min-h-[300px] rounded-lg border border-gray-200 bg-white p-4">
            {doc ? (
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{doc}</pre>
            ) : (
              <p className="text-sm text-gray-400">
                Preencha os campos e clique em “Gerar ato”. Atos que aumentam a folha disparam a checagem
                automática da LRF.
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Minuta de apoio — não substitui parecer jurídico nem a decisão da autoridade competente. Dados
            pessoais conforme a LGPD (CPF reduzido; sem dados sensíveis).
          </p>
        </div>
      </div>
    </div>
  );
}
