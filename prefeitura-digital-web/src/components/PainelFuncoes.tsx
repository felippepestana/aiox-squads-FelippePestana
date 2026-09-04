"use client";

import { useState } from "react";
import { brl, pct } from "@/lib/format";

interface FuncaoDespesa {
  funcao: string;
  empenhado?: number;
  liquidado?: number;
  dotacao?: number;
  partEmpenhado?: number;
}
interface DespesaFuncao {
  saude?: FuncaoDespesa;
  educacao?: FuncaoDespesa;
  total?: FuncaoDespesa;
  indisponivel?: boolean;
}

// Valores por função em reais inteiros (sem centavos) para densidade visual.
const brl0 = (v?: number) => brl(v, { semCentavos: true });

interface Props {
  ente: string;
  exercicio: string;
}

function LinhaFuncao({ f }: { f?: FuncaoDespesa }) {
  if (!f) return null;
  const exec = f.empenhado && f.dotacao ? (f.empenhado / f.dotacao) * 100 : undefined;
  return (
    <div className="rounded border border-gray-100 p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-gray-800">{f.funcao}</span>
        <span className="text-xs text-gray-500">{pct(f.partEmpenhado)} da despesa total</span>
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-gray-500">Dotação</dt>
          <dd className="tabular-nums">{brl0(f.dotacao)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Empenhado</dt>
          <dd className="tabular-nums">{brl0(f.empenhado)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Liquidado</dt>
          <dd className="tabular-nums">{brl0(f.liquidado)}</dd>
        </div>
      </dl>
      {typeof exec === "number" && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-100">
          <div className="h-full bg-brand" style={{ width: `${Math.min(100, exec)}%` }} />
        </div>
      )}
    </div>
  );
}

// Painel de despesa por função (Saúde/Educação) — RREO Anexo 02 / SICONFI.
export default function PainelFuncoes({ ente, exercicio }: Props) {
  const [periodo, setPeriodo] = useState("6");
  const [dados, setDados] = useState<DespesaFuncao | null>(null);
  const [loading, setLoading] = useState(false);
  const [consultado, setConsultado] = useState(false);

  async function consultar() {
    setLoading(true);
    setConsultado(false);
    try {
      const res = await fetch(
        `/api/fiscal/funcoes?ente=${encodeURIComponent(ente)}&exercicio=${exercicio}&periodo=${periodo}`
      );
      setDados(await res.json());
    } catch {
      setDados({ indisponivel: true });
    } finally {
      setLoading(false);
      setConsultado(true);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold text-brand-fg">Despesa por função — Saúde e Educação</h2>
          <p className="text-sm text-gray-600">
            Execução por função (RREO Anexo 02), acumulada até o bimestre.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium">Bimestre</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
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

      {consultado && dados?.indisponivel && (
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Anexo 02 do RREO indisponível para os parâmetros informados. Tente outro bimestre/exercício.
        </div>
      )}

      {dados && !dados.indisponivel && (dados.saude || dados.educacao) && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <LinhaFuncao f={dados.saude} />
            <LinhaFuncao f={dados.educacao} />
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Não é o mínimo constitucional.</strong> Estes valores são a execução da despesa por
            função (saúde/educação) e a participação é sobre a despesa total. O mínimo constitucional
            (saúde 15%, educação 25% + FUNDEB) tem base de cálculo própria (receita de impostos e
            transferências) e é publicado nos anexos específicos do RREO (08/12), não disponíveis no feed
            aberto deste ente. Fonte: SICONFI / Tesouro Nacional.
          </div>
        </div>
      )}
    </div>
  );
}
