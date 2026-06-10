// Classificação compartilhada da Despesa com Pessoal frente aos limites da LRF.
// Fonte única para as rotas de API (ex.: /api/rh) e os componentes de UI
// (PainelPessoalLRF), evitando classificadores divergentes.

import type { PessoalLRF } from "@/lib/gov/siconfi";

// Limite máximo do Executivo municipal (art. 20 da LRF) e fatores derivados.
export const LRF_LIMITE_MAXIMO_PADRAO = 54;
export const LRF_FATOR_PRUDENCIAL = 0.95; // art. 22, parágrafo único
export const LRF_FATOR_ALERTA = 0.9; // art. 59, §1º, II

export type NivelLRF = "ok" | "alerta" | "vedado-prudencial" | "vedado-maximo" | "indisponivel";

export interface ChecagemLRF {
  nivel: NivelLRF;
  mensagem: string;
  dtpPct?: number;
  limitePrudencialPct?: number;
  limiteMaximoPct?: number;
  exercicio?: number;
  periodo?: number;
}

export interface LimitesLRF {
  max: number;
  prudencial: number;
  alerta: number;
}

/** Deriva os três limites, usando os valores informados pelo ente ou os padrões. */
export function limitesLRF(d?: Partial<PessoalLRF>): LimitesLRF {
  const max = d?.limiteMaximoPct ?? LRF_LIMITE_MAXIMO_PADRAO;
  const prudencial = d?.limitePrudencialPct ?? +(max * LRF_FATOR_PRUDENCIAL).toFixed(2);
  const alerta = d?.limiteAlertaPct ?? +(max * LRF_FATOR_ALERTA).toFixed(2);
  return { max, prudencial, alerta };
}

/** Classifica o percentual da DTP frente aos limites (sem o estado "indisponivel"). */
export function classificarNivel(
  dtpPct: number,
  limites: LimitesLRF
): Exclude<NivelLRF, "indisponivel"> {
  if (dtpPct >= limites.max) return "vedado-maximo";
  if (dtpPct >= limites.prudencial) return "vedado-prudencial";
  if (dtpPct >= limites.alerta) return "alerta";
  return "ok";
}

/** Avalia a situação fiscal da folha e monta a mensagem de alerta (usado no RH). */
export function avaliarLRF(d: PessoalLRF | null): ChecagemLRF {
  if (!d || typeof d.dtpPct !== "number") {
    return {
      nivel: "indisponivel",
      mensagem:
        "Não foi possível obter o RGF mais recente para checagem automática da LRF. Verifique manualmente a disponibilidade orçamentária e os limites de pessoal antes de emitir o ato.",
    };
  }
  const lim = limitesLRF(d);
  const nivel = classificarNivel(d.dtpPct, lim);
  const ctx = {
    dtpPct: d.dtpPct,
    limitePrudencialPct: lim.prudencial,
    limiteMaximoPct: lim.max,
    exercicio: d.exercicio,
    periodo: d.periodo,
  };

  const mensagens: Record<Exclude<NivelLRF, "indisponivel">, string> = {
    "vedado-maximo": `Despesa com pessoal em ${d.dtpPct}% da RCL — acima do limite máximo (${lim.max}%). A LRF (art. 22 e art. 23) impõe medidas de recondução; em regra, é vedado o provimento de cargo público e a concessão de vantagens. Avalie a juridicidade do ato.`,
    "vedado-prudencial": `Despesa com pessoal em ${d.dtpPct}% da RCL — acima do limite prudencial (${lim.prudencial}%). O art. 22, parágrafo único, da LRF VEDA atos que aumentem a despesa com pessoal (provimento, criação/majoração de vantagens, horas extras). Este ato pode ser vedado.`,
    alerta: `Despesa com pessoal em ${d.dtpPct}% da RCL — em faixa de alerta (≥ ${lim.alerta}%). Documente a adequação orçamentária e a estimativa de impacto antes de aumentar a folha.`,
    ok: `Despesa com pessoal em ${d.dtpPct}% da RCL — dentro do limite (abaixo de ${lim.alerta}%). Mantenha a dotação e a estimativa de impacto no processo.`,
  };

  return { ...ctx, nivel, mensagem: mensagens[nivel] };
}
