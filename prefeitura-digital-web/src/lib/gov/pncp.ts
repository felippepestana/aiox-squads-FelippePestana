// Integração com o PNCP (Portal Nacional de Contratações Públicas) — API pública de consulta.
// Docs: https://pncp.gov.br/api/consulta/swagger-ui/index.html

const PNCP_BASE = "https://pncp.gov.br/api/consulta/v1";

export interface PrecoItem {
  descricao: string;
  orgao?: string;
  valorUnitario?: number;
  data?: string;
  fonte: string;
  link?: string;
}

/**
 * Busca contratações publicadas no PNCP por palavra-chave para subsidiar a
 * pesquisa de preços. A API do PNCP é paginada; aqui consultamos a primeira página.
 * Em caso de indisponibilidade, retorna lista vazia (o app não quebra).
 */
export async function buscarContratacoes(termo: string): Promise<PrecoItem[]> {
  try {
    const url = new URL(`${PNCP_BASE}/contratacoes/publicacao`);
    url.searchParams.set("pagina", "1");
    url.searchParams.set("tamanhoPagina", "10");
    if (termo) url.searchParams.set("q", termo);

    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      // Revalida a cada 1h para não martelar a API
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { data?: any[] };
    const itens = Array.isArray(data?.data) ? data.data : [];
    return itens.slice(0, 10).map((c: any) => ({
      descricao: c.objetoCompra || c.objeto || "Contratação",
      orgao: c.orgaoEntidade?.razaoSocial || c.unidadeOrgao?.nomeUnidade,
      valorUnitario: c.valorTotalEstimado,
      data: c.dataPublicacaoPncp || c.dataInclusao,
      fonte: "PNCP",
      link: "https://pncp.gov.br",
    }));
  } catch {
    return [];
  }
}
