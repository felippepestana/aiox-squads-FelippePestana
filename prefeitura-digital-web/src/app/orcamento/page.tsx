"use client";

import { useState } from "react";
import PainelPessoalLRF from "@/components/PainelPessoalLRF";

interface RreoLinha {
  conta?: string;
  coluna?: string;
  valor?: number;
  cod_conta?: string;
}

const ENTE_PADRAO = process.env.NEXT_PUBLIC_MUNICIPIO_IBGE || "1100205";
const ANO_ATUAL = new Date().getFullYear();

function brl(v?: number) {
  if (typeof v !== "number") return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function OrcamentoPage() {
  const [ente, setEnte] = useState(ENTE_PADRAO);
  const [exercicio, setExercicio] = useState(String(ANO_ATUAL));
  const [periodo, setPeriodo] = useState("1");

  const [linhas, setLinhas] = useState<RreoLinha[]>([]);
  const [indisponivel, setIndisponivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consultado, setConsultado] = useState(false);

  async function consultar() {
    setLoading(true);
    setConsultado(false);
    try {
      const res = await fetch(
        `/api/orcamento?ente=${encodeURIComponent(ente)}&exercicio=${exercicio}&periodo=${periodo}`
      );
      const data = await res.json();
      setLinhas(data.linhas || []);
      setIndisponivel(Boolean(data.indisponivel));
    } catch {
      setIndisponivel(true);
      setLinhas([]);
    } finally {
      setLoading(false);
      setConsultado(true);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Orçamento — execução (SICONFI)</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Consulta ao RREO (Relatório Resumido de Execução Orçamentária) publicado no SICONFI/Tesouro
          Nacional. Base do eixo orçamentário transversal: toda contratação e ato de pessoal observa a
          disponibilidade orçamentária, os mínimos constitucionais (saúde 15%, educação 25% + FUNDEB) e os
          limites de pessoal da LRF.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium">Ente (cód. IBGE)</label>
            <input
              value={ente}
              onChange={(e) => setEnte(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Exercício</label>
            <input
              value={exercicio}
              onChange={(e) => setExercicio(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bimestre</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <option key={b} value={b}>
                  {b}º bimestre
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={consultar}
            disabled={loading || !ente}
            className="rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Consultando…" : "Consultar"}
          </button>
        </div>
      </div>

      {consultado && indisponivel && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Dados indisponíveis no SICONFI para os parâmetros informados (o RREO pode ainda não ter sido
          enviado para o bimestre/exercício). Tente outro bimestre ou exercício.
        </div>
      )}

      {consultado && !indisponivel && linhas.length === 0 && (
        <p className="text-sm text-gray-500">Nenhuma linha retornada.</p>
      )}

      {linhas.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Conta</th>
                <th className="px-4 py-2">Coluna</th>
                <th className="px-4 py-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2">{l.conta || l.cod_conta || "—"}</td>
                  <td className="px-4 py-2 text-gray-600">{l.coluna || "—"}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{brl(l.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
            Fonte: SICONFI / Tesouro Nacional (dados abertos). Exibindo até 50 linhas do RREO.
          </p>
        </div>
      )}

      <PainelPessoalLRF ente={ente} exercicio={exercicio} />

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Roadmap: apuração dos mínimos de saúde (15%) e educação (25% + FUNDEB) a partir dos anexos
        específicos do RREO, quando publicados pelo ente, e cruzamento com SIOPS/SIOPE.
      </div>
    </div>
  );
}
