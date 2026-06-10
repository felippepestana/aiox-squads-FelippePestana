// Identificação do município (caso de referência: Porto Velho/RO). As variáveis
// NEXT_PUBLIC_* são inlinadas no build, disponíveis no cliente e no servidor.

export const MUNICIPIO_NOME = process.env.NEXT_PUBLIC_MUNICIPIO_NOME || "Porto Velho";
export const MUNICIPIO_UF = process.env.NEXT_PUBLIC_MUNICIPIO_UF || "RO";

// Código IBGE usado nas consultas fiscais (SICONFI). Quando não configurado,
// caímos no ente de referência — mas sinalizamos para não consultar Porto Velho
// por engano em outra prefeitura.
export const MUNICIPIO_IBGE = process.env.NEXT_PUBLIC_MUNICIPIO_IBGE || "1100205";
export const MUNICIPIO_IBGE_CONFIGURADO = Boolean(process.env.NEXT_PUBLIC_MUNICIPIO_IBGE);
