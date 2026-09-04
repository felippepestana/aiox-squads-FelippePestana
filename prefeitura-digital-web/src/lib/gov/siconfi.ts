// Integração com o SICONFI (Tesouro Nacional) — API pública de dados abertos.
// Docs: https://apidatalake.tesouro.gov.br/docs/siconfi/

const SICONFI_BASE = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt";

export interface RreoLinha {
  conta?: string;
  coluna?: string;
  valor?: number;
  cod_conta?: string;
}

export interface RreoResultado {
  ente: string;
  exercicio: number;
  periodo: number;
  linhas: RreoLinha[];
  indisponivel?: boolean;
}

/**
 * Consulta o RREO (Relatório Resumido de Execução Orçamentária) de um ente.
 * ente = código IBGE (ex.: Porto Velho = 1100205).
 */
export async function consultarRREO(opts: {
  ente: string;
  exercicio: number;
  periodo: number; // bimestre 1-6
  anexo?: string; // ex.: "RREO-Anexo 01"
}): Promise<RreoResultado> {
  const base: RreoResultado = {
    ente: opts.ente,
    exercicio: opts.exercicio,
    periodo: opts.periodo,
    linhas: [],
  };
  try {
    const url = new URL(`${SICONFI_BASE}/rreo`);
    url.searchParams.set("an_exercicio", String(opts.exercicio));
    url.searchParams.set("nr_periodo", String(opts.periodo));
    url.searchParams.set("co_tipo_demonstrativo", "RREO");
    url.searchParams.set("id_ente", opts.ente);
    if (opts.anexo) url.searchParams.set("no_anexo", opts.anexo);

    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { ...base, indisponivel: true };

    const data = (await res.json()) as { items?: any[] };
    const items = Array.isArray(data?.items) ? data.items : [];
    base.linhas = items.slice(0, 50).map((i: any) => ({
      conta: i.conta,
      coluna: i.coluna,
      valor: i.valor,
      cod_conta: i.cod_conta,
    }));
    return base;
  } catch {
    return { ...base, indisponivel: true };
  }
}

// ── RGF / LRF — Despesa Total com Pessoal ──────────────────────────────────
// O RGF (Relatório de Gestão Fiscal) publica, no Anexo 01, a Despesa Total com
// Pessoal (DTP) e seu % sobre a RCL Ajustada, além dos limites da LRF: máximo
// (54%), prudencial (51,3% = 0,95×máx) e de alerta (48,6% = 0,90×máx). Esses
// valores são informados pelo próprio ente — não recalculamos, apenas exibimos.

export interface PessoalLRF {
  ente: string;
  exercicio: number;
  periodo: number; // quadrimestre 1-3
  rcl?: number; // Receita Corrente Líquida Ajustada
  dtpValor?: number; // Despesa Total com Pessoal (R$)
  dtpPct?: number; // % da DTP sobre a RCL Ajustada
  limiteMaximoPct?: number; // 54
  limitePrudencialPct?: number; // 51,3
  limiteAlertaPct?: number; // 48,6
  indisponivel?: boolean;
}

// Códigos de conta estáveis do RGF Anexo 01 (mapeados da API SICONFI).
const RGF_CONTAS = {
  rcl: "ReceitaCorrenteLiquidaAjustada",
  dtp: "DespesaComPessoalTotal",
  limiteMaximo: "LimiteMaximoDespesaComPessoalTotal",
  limitePrudencial: "LimitePrudencialDespesaComPessoalTotal",
  limiteAlerta: "LimiteDeAlertaDespesaComPessoalTotal",
} as const;

function ehColunaPercentual(coluna?: string) {
  return /%\s*sobre a rcl/i.test(coluna || "");
}
function ehColunaValor(coluna?: string) {
  return /^valor$/i.test((coluna || "").trim());
}

/**
 * Consulta a Despesa com Pessoal (LRF) no RGF Anexo 01 do Poder Executivo.
 * periodo = quadrimestre (1-3). Degrada para indisponivel se o ente não enviou.
 */
export async function consultarPessoalLRF(opts: {
  ente: string;
  exercicio: number;
  periodo: number;
}): Promise<PessoalLRF> {
  const base: PessoalLRF = {
    ente: opts.ente,
    exercicio: opts.exercicio,
    periodo: opts.periodo,
  };
  try {
    const url = new URL(`${SICONFI_BASE}/rgf`);
    url.searchParams.set("an_exercicio", String(opts.exercicio));
    url.searchParams.set("in_periodicidade", "Q"); // quadrimestral (municípios)
    url.searchParams.set("nr_periodo", String(opts.periodo));
    url.searchParams.set("co_tipo_demonstrativo", "RGF");
    url.searchParams.set("co_poder", "E"); // Executivo
    url.searchParams.set("id_ente", opts.ente);
    url.searchParams.set("no_anexo", "RGF-Anexo 01");

    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { ...base, indisponivel: true };

    const data = (await res.json()) as { items?: any[] };
    const items = Array.isArray(data?.items) ? data.items : [];
    if (items.length === 0) return { ...base, indisponivel: true };

    for (const i of items) {
      const cod = i.cod_conta as string;
      const valor = typeof i.valor === "number" ? i.valor : undefined;
      if (cod === RGF_CONTAS.rcl && ehColunaValor(i.coluna)) base.rcl = valor;
      else if (cod === RGF_CONTAS.dtp) {
        if (ehColunaValor(i.coluna)) base.dtpValor = valor;
        else if (ehColunaPercentual(i.coluna)) base.dtpPct = valor;
      } else if (cod === RGF_CONTAS.limiteMaximo && ehColunaPercentual(i.coluna))
        base.limiteMaximoPct = valor;
      else if (cod === RGF_CONTAS.limitePrudencial && ehColunaPercentual(i.coluna))
        base.limitePrudencialPct = valor;
      else if (cod === RGF_CONTAS.limiteAlerta && ehColunaPercentual(i.coluna))
        base.limiteAlertaPct = valor;
    }

    if (base.dtpPct === undefined) return { ...base, indisponivel: true };
    return base;
  } catch {
    return { ...base, indisponivel: true };
  }
}

/**
 * Busca o RGF mais recente disponível, tentando o exercício atual (quadrimestres
 * 3→1) e, em seguida, o anterior. Usado para checar a situação fiscal da folha
 * antes de emitir atos de pessoal. Retorna null se nada estiver publicado.
 */
export async function consultarPessoalLRFRecente(
  ente: string
): Promise<PessoalLRF | null> {
  const anoAtual = new Date().getFullYear();
  const candidatos: Array<{ exercicio: number; periodo: number }> = [];
  for (const exercicio of [anoAtual, anoAtual - 1]) {
    for (const periodo of [3, 2, 1]) candidatos.push({ exercicio, periodo });
  }
  for (const c of candidatos) {
    const r = await consultarPessoalLRF({ ente, ...c });
    if (!r.indisponivel) return r;
  }
  return null;
}

// ── Despesa por função — Saúde e Educação (RREO Anexo 02) ──────────────────
// ATENÇÃO: estes são valores de EXECUÇÃO POR FUNÇÃO. NÃO são o mínimo
// constitucional (saúde 15% / educação 25%), cujo cálculo usa a receita de
// impostos e transferências e é publicado nos anexos específicos (08/12),
// frequentemente ausentes no feed aberto. A participação aqui é sobre a
// despesa total empenhada/liquidada, apenas para acompanhamento.

export interface FuncaoDespesa {
  funcao: string;
  empenhado?: number;
  liquidado?: number;
  dotacao?: number;
  partEmpenhado?: number; // % sobre o total empenhado
}

export interface DespesaFuncaoResultado {
  ente: string;
  exercicio: number;
  periodo: number;
  saude?: FuncaoDespesa;
  educacao?: FuncaoDespesa;
  total?: FuncaoDespesa;
  indisponivel?: boolean;
}

function colEmpenhadoAteBimestre(c?: string) {
  return /EMPENHADAS ATÉ O BIMESTRE/i.test(c || "");
}
function colLiquidadoAteBimestre(c?: string) {
  return /LIQUIDADAS ATÉ O BIMESTRE/i.test(c || "");
}
function colDotacaoAtualizada(c?: string) {
  return /DOTAÇÃO ATUALIZADA/i.test(c || "");
}

/**
 * Consulta a despesa empenhada/liquidada das funções Saúde e Educação no RREO
 * Anexo 02 (despesa por função/subfunção), ignorando a parcela intraorçamentária.
 */
export async function consultarDespesaFuncao(opts: {
  ente: string;
  exercicio: number;
  periodo: number; // bimestre 1-6
}): Promise<DespesaFuncaoResultado> {
  const base: DespesaFuncaoResultado = {
    ente: opts.ente,
    exercicio: opts.exercicio,
    periodo: opts.periodo,
  };
  try {
    const url = new URL(`${SICONFI_BASE}/rreo`);
    url.searchParams.set("an_exercicio", String(opts.exercicio));
    url.searchParams.set("nr_periodo", String(opts.periodo));
    url.searchParams.set("co_tipo_demonstrativo", "RREO");
    url.searchParams.set("id_ente", opts.ente);
    url.searchParams.set("no_anexo", "RREO-Anexo 02");

    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { ...base, indisponivel: true };

    const data = (await res.json()) as { items?: any[] };
    const items = Array.isArray(data?.items) ? data.items : [];
    if (items.length === 0) return { ...base, indisponivel: true };

    // Apenas a despesa orçamentária total por função (exclui a intra).
    const orc = items.filter((i) => i.cod_conta === "RREO2TotalDespesas");

    const monta = (nomeFuncao: (c: string) => boolean): FuncaoDespesa | undefined => {
      const linhas = orc.filter((i) => nomeFuncao((i.conta || "").trim()));
      if (linhas.length === 0) return undefined;
      const f: FuncaoDespesa = { funcao: (linhas[0].conta || "").trim() };
      for (const l of linhas) {
        const v = typeof l.valor === "number" ? l.valor : undefined;
        if (colEmpenhadoAteBimestre(l.coluna)) f.empenhado = v;
        else if (colLiquidadoAteBimestre(l.coluna)) f.liquidado = v;
        else if (colDotacaoAtualizada(l.coluna)) f.dotacao = v;
      }
      return f;
    };

    base.saude = monta((c) => c === "Saúde");
    base.educacao = monta((c) => c === "Educação");
    base.total = monta((c) => /^TOTAL \(III\)/i.test(c));

    if (!base.saude && !base.educacao) return { ...base, indisponivel: true };

    // Participação sobre o total empenhado (apenas acompanhamento de execução).
    const tot = base.total?.empenhado;
    if (tot) {
      for (const f of [base.saude, base.educacao]) {
        if (f?.empenhado) f.partEmpenhado = +((f.empenhado / tot) * 100).toFixed(2);
      }
    }
    return base;
  } catch {
    return { ...base, indisponivel: true };
  }
}
