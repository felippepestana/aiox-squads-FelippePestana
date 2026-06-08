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
