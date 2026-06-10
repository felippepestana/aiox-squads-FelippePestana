"use client";

import { useState } from "react";
import { brl, pct } from "@/lib/format";
import { classificarNivel, limitesLRF, NivelLRF } from "@/lib/lrf";

interface PessoalLRF {
  rcl?: number;
  dtpValor?: number;
  dtpPct?: number;
  limiteMaximoPct?: number;
  limitePrudencialPct?: number;
  limiteAlertaPct?: number;
  indisponivel?: boolean;
}

// Mapeia o nível compartilhado da LRF para rótulo e estilos do painel.
const ESTILO: Record<Exclude<NivelLRF, "indisponivel">, { nivel: string; cor: string; barra: string }> = {
  "vedado-maximo": { nivel: "Limite máximo excedido", cor: "bg-red-100 text-red-800 border-red-200", barra: "bg-red-500" },
  "vedado-prudencial": { nivel: "Acima do limite prudencial", cor: "bg-orange-100 text-orange-800 border-orange-200", barra: "bg-orange-500" },
  alerta: { nivel: "Em alerta", cor: "bg-amber-100 text-amber-800 border-amber-200", barra: "bg-amber-500" },
  ok: { nivel: "Dentro do limite", cor: "bg-green-100 text-green-800 border-green-200", barra: "bg-green-500" },
};

function avaliar(d: PessoalLRF) {
  if (typeof d.dtpPct !== "number") return null;
  return ESTILO[classificarNivel(d.dtpPct, limitesLRF(d))];
}

interface Props {
  ente: string;
  exercicio: string;
}

// Painel da Despesa com Pessoal (LRF) — fonte RGF/SICONFI. Quadrimestral.
export default function PainelPessoalLRF({ ente, exercicio }: Props) {
  const [periodo, setPeriodo] = useState("2");
  const [dados, setDados] = useState<PessoalLRF | null>(null);
  const [loading, setLoading] = useState(false);
  const [consultado, setConsultado] = useState(false);

  async function consultar() {
    setLoading(true);
    setConsultado(false);
    try {
      const res = await fetch(
        `/api/fiscal/pessoal?ente=${encodeURIComponent(ente)}&exercicio=${exercicio}&periodo=${periodo}`
      );
      setDados(await res.json());
    } catch {
      setDados({ indisponivel: true });
    } finally {
      setLoading(false);
      setConsultado(true);
    }
  }

  const av = dados && !dados.indisponivel ? avaliar(dados) : null;
  // Posição da DTP na barra, normalizada pelo limite máximo (com folga visual).
  // Usa o MESMO limite máximo do classificador para barra e marcadores ficarem coerentes.
  const escala = limitesLRF(dados ?? undefined).max * 1.15;
  const largura =
    typeof dados?.dtpPct === "number" ? Math.min(100, (dados.dtpPct / escala) * 100) : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold text-brand-fg">Despesa com Pessoal — limite da LRF</h2>
          <p className="text-sm text-gray-600">
            Indicador do RGF (art. 19/20 da LRF). Limite máximo do Executivo municipal: 54% da RCL.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium">Quadrimestre</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {[1, 2, 3].map((q) => (
                <option key={q} value={q}>
                  {q}º quadrimestre
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={consultar}
            disabled={loading || !ente}
            className="rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Apurando…" : "Apurar"}
          </button>
        </div>
      </div>

      {consultado && dados?.indisponivel && (
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          RGF indisponível para os parâmetros informados (o ente pode não ter enviado o quadrimestre).
          Tente outro quadrimestre ou exercício.
        </div>
      )}

      {av && dados && (
        <div className="mt-4 space-y-4">
          <div className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${av.cor}`}>
            {av.nivel} — {pct(dados.dtpPct)} da RCL
          </div>

          {/* Barra com marcadores dos limites de alerta, prudencial e máximo
              (derivados, coerentes com a escala e o classificador). */}
          <div className="relative h-6 w-full overflow-hidden rounded bg-gray-100">
            <div className={`h-full ${av.barra}`} style={{ width: `${largura}%` }} />
            {(() => {
              const lim = limitesLRF(dados);
              return [
                { v: lim.alerta, t: "alerta" },
                { v: lim.prudencial, t: "prudencial" },
                { v: lim.max, t: "máximo" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-gray-500/60"
                  style={{ left: `${Math.min(100, (m.v / escala) * 100)}%` }}
                  title={`${m.t}: ${pct(m.v)}`}
                />
              ));
            })()}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-gray-100 p-3">
              <dt className="text-xs text-gray-500">Despesa com Pessoal (DTP)</dt>
              <dd className="mt-1 font-semibold tabular-nums">{brl(dados.dtpValor)}</dd>
              <dd className="text-xs text-gray-500">{pct(dados.dtpPct)} da RCL</dd>
            </div>
            <div className="rounded border border-gray-100 p-3">
              <dt className="text-xs text-gray-500">RCL Ajustada</dt>
              <dd className="mt-1 font-semibold tabular-nums">{brl(dados.rcl)}</dd>
            </div>
            <div className="rounded border border-gray-100 p-3">
              <dt className="text-xs text-gray-500">Limite prudencial</dt>
              <dd className="mt-1 font-semibold tabular-nums">{pct(dados.limitePrudencialPct)}</dd>
              <dd className="text-xs text-gray-500">veda atos que aumentem a despesa</dd>
            </div>
            <div className="rounded border border-gray-100 p-3">
              <dt className="text-xs text-gray-500">Limite máximo</dt>
              <dd className="mt-1 font-semibold tabular-nums">{pct(dados.limiteMaximoPct)}</dd>
              <dd className="text-xs text-gray-500">art. 20 da LRF</dd>
            </div>
          </dl>

          <p className="text-xs text-gray-500">
            Fonte: RGF / SICONFI (dados abertos), Poder Executivo. Valores informados pelo ente; este
            painel não substitui a apuração oficial do Tribunal de Contas.
          </p>
        </div>
      )}
    </div>
  );
}
