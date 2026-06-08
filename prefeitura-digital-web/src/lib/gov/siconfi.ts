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
