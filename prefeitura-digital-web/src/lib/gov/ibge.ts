// Integração com a API de Localidades do IBGE — pública.

const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export interface Municipio {
  id: number;
  nome: string;
  uf?: string;
}

export async function obterMunicipio(codigoIbge: string): Promise<Municipio | null> {
  try {
    const res = await fetch(`${IBGE_BASE}/municipios/${codigoIbge}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 604800 },
    });
    if (!res.ok) return null;
    const m = (await res.json()) as any;
    return {
      id: m.id,
      nome: m.nome,
      uf: m.microrregiao?.mesorregiao?.UF?.sigla,
    };
  } catch {
    return null;
  }
}
