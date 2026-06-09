"use client";

import { useState } from "react";
import SalvarArtefato from "@/components/SalvarArtefato";

const ITENS: { id: string; rotulo: string }[] = [
  { id: "receitas-despesas", rotulo: "Receitas e despesas detalhadas, em tempo real (LC 131/2009)" },
  { id: "licitacoes-contratos", rotulo: "Licitações, contratos e convênios" },
  { id: "folha", rotulo: "Folha/remuneração nominal (sem dados pessoais excedentes — LGPD)" },
  { id: "rreo-rgf", rotulo: "RREO e RGF publicados (LRF art. 48/48-A)" },
  { id: "esic", rotulo: "e-SIC funcional (transparência passiva)" },
  { id: "dados-abertos", rotulo: "Dados abertos em formato aberto + API documentada (OpenAPI)" },
  { id: "siafic", rotulo: "Padrão mínimo SIAFIC (Decreto 10.540/2020)" },
  { id: "acessibilidade", rotulo: "Acessibilidade WCAG 2.1 AA / ABNT NBR 17225:2025" },
  { id: "linguagem-cidada", rotulo: "Linguagem cidadã nos sumários (RREO/RGF)" },
];

export default function TransparenciaPage() {
  const [portalUrl, setPortalUrl] = useState("");
  const [situacao, setSituacao] = useState("");
  const [atendidos, setAtendidos] = useState<string[]>([]);

  const [doc, setDoc] = useState("");
  const [degraded, setDegraded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function toggle(id: string) {
    setAtendidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function diagnosticar() {
    setLoading(true);
    setErro("");
    setDoc("");
    try {
      const res = await fetch("/api/transparencia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ portalUrl, situacao, itensAtendidos: atendidos }),
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

  const cobertura = Math.round((atendidos.length / ITENS.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Transparência — diagnóstico de conformidade</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Marque o que o portal já atende e gere um diagnóstico priorizado + plano de reconstrução,
          alinhado à LAI, LC 131/2009, LRF (art. 48/48-A), SIAFIC, EBT/PNTP (CGU) e acessibilidade WCAG.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">URL do portal (opcional)</label>
              <input
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                placeholder="https://transparencia.municipio.gov.br"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Situação atual (opcional)</label>
              <textarea
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
                rows={3}
                placeholder="Ex.: portal legado sem API; dados em PDF; e-SIC por e-mail…"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Checklist atendido</h2>
              <span className="text-xs text-gray-500">{cobertura}% ({atendidos.length}/{ITENS.length})</span>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded bg-gray-100">
              <div className="h-full bg-brand" style={{ width: `${cobertura}%` }} />
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {ITENS.map((c) => (
                <li key={c.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={atendidos.includes(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  <span>{c.rotulo}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={diagnosticar}
              disabled={loading}
              className="mt-4 w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Diagnosticando…" : "Gerar diagnóstico"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Diagnóstico</h2>
            {doc && (
              <div className="flex items-center gap-2">
                <SalvarArtefato
                  modulo="transparencia"
                  tipo="Diagnóstico de transparência"
                  titulo={`Transparência — ${cobertura}% do checklist`}
                  conteudo={doc}
                  degraded={degraded}
                  metadados={{ cobertura, atendidos }}
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
              Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para diagnóstico assistido.
            </p>
          )}

          <div className="min-h-[300px] rounded-lg border border-gray-200 bg-white p-4">
            {doc ? (
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{doc}</pre>
            ) : (
              <p className="text-sm text-gray-400">
                Marque os itens atendidos e clique em “Gerar diagnóstico” para receber a análise priorizada
                e o plano de reconstrução.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
