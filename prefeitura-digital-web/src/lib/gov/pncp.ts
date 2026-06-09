// Integração com o PNCP (Portal Nacional de Contratações Públicas) — API pública de consulta.
// Docs: https://pncp.gov.br/api/consulta/swagger-ui/index.html
//
// IMPORTANTE: o endpoint /contratacoes/publicacao NÃO aceita busca textual livre.
// Ele exige dataInicial, dataFinal e codigoModalidadeContratacao, e pagina com
// tamanhoPagina >= 10. Por isso, buscamos contratações recentes de uma modalidade
// e filtramos por palavra-chave no objeto da compra do lado da aplicação.

const PNCP_BASE = "https://pncp.gov.br/api/consulta/v1";

// Modalidades de contratação (Lei 14.133/2021). Pregão eletrônico é o mais
// representativo para pesquisa de preços de bens/serviços comuns.
export const MODALIDADE_PREGAO_ELETRONICO = 6;

export interface PrecoItem {
  descricao: string;
  orgao?: string;
  valorEstimado?: number; // valor TOTAL estimado da contratação (não é preço unitário)
  data?: string;
  fonte: string;
  link?: string;
}

function yyyymmdd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

// Normaliza para comparação tolerante a acentos/caixa.
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function montarLink(c: any): string {
  // numeroControlePNCP no formato CNPJ-1-SEQ/ANO permite montar a URL pública.
  const ncp: string | undefined = c.numeroControlePNCP;
  if (ncp) {
    const m = ncp.match(/^(\d{14})-\d+-(\d+)\/(\d+)$/);
    if (m) return `https://pncp.gov.br/app/editais/${m[1]}/${m[3]}/${Number(m[2])}`;
  }
  return c.linkSistemaOrigem || "https://pncp.gov.br";
}

/**
 * Busca contratações recentes no PNCP e filtra por palavra-chave para subsidiar
 * a pesquisa de preços. Em caso de indisponibilidade, retorna lista vazia.
 *
 * @param termo  palavras-chave do objeto (ex.: "ambulância")
 * @param opts.dias  janela de busca em dias (padrão 180)
 * @param opts.modalidade  código da modalidade (padrão pregão eletrônico)
 * @param opts.maxPaginas  máximo de páginas varridas (padrão 5 × 50 = 250 registros)
 */
export async function buscarContratacoes(
  termo: string,
  opts: { dias?: number; modalidade?: number; maxPaginas?: number } = {}
): Promise<PrecoItem[]> {
  const dias = opts.dias ?? 180;
  const modalidade = opts.modalidade ?? MODALIDADE_PREGAO_ELETRONICO;
  const maxPaginas = opts.maxPaginas ?? 5;
  const tamanhoPagina = 50;

  const dataFinal = new Date();
  const dataInicial = new Date(dataFinal.getTime() - dias * 24 * 60 * 60 * 1000);

  const tokens = normalizar(termo).split(/\s+/).filter(Boolean);
  const casa = (objeto: string) => {
    if (tokens.length === 0) return true;
    const alvo = normalizar(objeto);
    return tokens.every((t) => alvo.includes(t));
  };

  const resultados: PrecoItem[] = [];
  try {
    for (let pagina = 1; pagina <= maxPaginas; pagina++) {
      const url = new URL(`${PNCP_BASE}/contratacoes/publicacao`);
      url.searchParams.set("dataInicial", yyyymmdd(dataInicial));
      url.searchParams.set("dataFinal", yyyymmdd(dataFinal));
      url.searchParams.set("codigoModalidadeContratacao", String(modalidade));
      url.searchParams.set("pagina", String(pagina));
      url.searchParams.set("tamanhoPagina", String(tamanhoPagina));

      const res = await fetch(url.toString(), {
        headers: { accept: "application/json" },
        next: { revalidate: 3600 }, // cache de 1h para não martelar a API
      });
      if (!res.ok) break;

      const data = (await res.json()) as { data?: any[]; paginasRestantes?: number };
      const itens = Array.isArray(data?.data) ? data.data : [];

      for (const c of itens) {
        const objeto = c.objetoCompra || c.objeto || "Contratação";
        if (!casa(objeto)) continue;
        resultados.push({
          descricao: objeto,
          orgao: c.orgaoEntidade?.razaoSocial || c.unidadeOrgao?.nomeUnidade,
          valorEstimado: typeof c.valorTotalEstimado === "number" ? c.valorTotalEstimado : undefined,
          data: c.dataPublicacaoPncp || c.dataInclusao,
          fonte: "PNCP",
          link: montarLink(c),
        });
        if (resultados.length >= 10) return resultados;
      }

      if (!data.paginasRestantes || data.paginasRestantes <= 0) break;
    }
    return resultados;
  } catch {
    return resultados;
  }
}
