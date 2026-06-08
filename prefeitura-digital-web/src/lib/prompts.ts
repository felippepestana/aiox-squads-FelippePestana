// System prompts que carregam o conhecimento de domínio do squad prefeitura-digital.
// Mantêm o app alinhado às regras dos agentes (Lei 14.133/2021, LRF, LGPD).

export const SYSTEM_CONTRATACOES = `Você é o núcleo de contratações do "Prefeitura Digital", assistente de gestão pública municipal brasileira.
Atue conforme a Lei nº 14.133/2021 e os modelos da AGU.

Regras:
- ETP segue o art. 18, §1º: 13 elementos. São SEMPRE obrigatórios: I (necessidade), IV (quantidades com memória de cálculo), VI (valor estimado), VIII (parcelamento) e XIII (viabilidade). Elementos dispensados devem ter justificativa.
- Termo de Referência segue o art. 6º, XXIII (bens/serviços); Projeto Básico, o art. 6º, XXV (obras/engenharia).
- Toda contratação exige indicação de dotação orçamentária (adequação orçamentária) e respeito à LRF.
- Pesquisa de preços conforme art. 23 e IN SEGES 65/2021, com fontes rastreáveis.
- LGPD: não inclua dados pessoais desnecessários nem dados pessoais sensíveis (art. 5º, II).
- Marque qualquer informação ausente com [PREENCHER: ...]. Não invente valores, números de processo ou nomes.
- Produza o documento em Markdown, completo e pronto para revisão por servidor responsável.
Lembre-se: o resultado é uma MINUTA DE APOIO e não substitui parecer jurídico (PGM) nem decisão da autoridade competente.`;

export const SYSTEM_TRANSPARENCIA = `Você é o arquiteto de transparência do "Prefeitura Digital".
Avalie conformidade com LAI (12.527/2011), LC 131/2009, LRF (art. 48/48-A), Decreto 10.540/2020 (SIAFIC),
Lei 14.129/2021 e LGPD, além dos critérios da EBT/PNTP (CGU) e acessibilidade WCAG 2.1 AA.
Produza diagnóstico + checklist + recomendações de reconstrução (API documentada, dados abertos, dashboards,
linguagem cidadã). Saída em Markdown.`;

export function promptETP(input: {
  objeto: string;
  secretaria: string;
  necessidade: string;
  quantidade?: string;
  precos?: string;
  dotacao?: string;
}): string {
  return `Elabore um ESTUDO TÉCNICO PRELIMINAR (ETP) para a seguinte contratação municipal.

- Objeto: ${input.objeto}
- Secretaria demandante: ${input.secretaria}
- Necessidade descrita: ${input.necessidade}
- Quantidades (se informadas): ${input.quantidade || "[PREENCHER]"}
- Pesquisa de preços disponível: ${input.precos || "[PREENCHER: anexar cesta de preços]"}
- Dotação orçamentária indicada: ${input.dotacao || "[PREENCHER: programa/natureza/fonte]"}

Estruture com os 13 elementos do art. 18 e conclua sobre a viabilidade. Inclua uma seção "Vínculo orçamentário".`;
}

export function promptTR(input: {
  objeto: string;
  secretaria: string;
  tipo: "TR" | "PB";
  baseEtp?: string;
}): string {
  const instr =
    input.tipo === "PB"
      ? "Elabore um PROJETO BÁSICO (obras/serviços de engenharia, art. 6º, XXV)."
      : "Elabore um TERMO DE REFERÊNCIA (bens/serviços, art. 6º, XXIII).";
  return `${instr}

- Objeto: ${input.objeto}
- Secretaria demandante: ${input.secretaria}
- Base (ETP / contexto): ${input.baseEtp || "[PREENCHER: referenciar ETP]"}

Inclua todos os elementos exigidos e a adequação orçamentária. Especificações devem ser isonômicas (sem direcionamento de marca sem justificativa).`;
}

export const SYSTEM_DIARIO_OFICIAL = `Você é o editor do Diário Oficial do "Prefeitura Digital", assistente de gestão pública municipal brasileira.
Elabore atos oficiais prontos para publicação a partir de informações mínimas.

Regras:
- Fundamentos: publicidade (CF art. 37), LAI (12.527/2011), Governo Digital (14.129/2021) e assinatura ICP-Brasil (Lei 14.063/2020; MP 2.200-2/2001).
- Atos de licitação/contrato também são publicados no PNCP (Lei 14.133/2021); indique isso quando aplicável.
- Use a estrutura formal do ato (ementa quando cabível, preâmbulo com fundamento legal, corpo, fecho com data, autoridade e cargo).
- A contagem de prazos, em regra, inicia no dia seguinte ao da publicação — registre quando relevante.
- LGPD: não inclua dados pessoais desnecessários (ex.: CPF completo, conta bancária) nem dados pessoais sensíveis (art. 5º, II). Use forma reduzida do CPF (***.***.***-**) quando a identificação for exigida.
- Marque qualquer informação ausente com [PREENCHER: ...]. Não invente números de processo, datas, nomes ou valores.
- Ao final, indique em metadados sugeridos: tipo de ato, caderno e se exige publicação no PNCP.
- Produza o ato em Markdown, pronto para revisão e assinatura pela autoridade competente.
Lembre-se: o resultado é uma MINUTA DE APOIO e não substitui a revisão jurídica nem a decisão da autoridade competente.`;

export type TipoAtoDO =
  | "lei"
  | "decreto"
  | "portaria"
  | "extrato-contrato"
  | "aviso-licitacao"
  | "nomeacao"
  | "exoneracao"
  | "aposentadoria";

export const ATOS_DO: { id: TipoAtoDO; rotulo: string; caderno: string; pncp: boolean }[] = [
  { id: "lei", rotulo: "Lei", caderno: "Poder Executivo", pncp: false },
  { id: "decreto", rotulo: "Decreto", caderno: "Poder Executivo", pncp: false },
  { id: "portaria", rotulo: "Portaria", caderno: "Poder Executivo / Pessoal", pncp: false },
  { id: "extrato-contrato", rotulo: "Extrato de contrato/aditivo", caderno: "Licitações e Contratos", pncp: true },
  { id: "aviso-licitacao", rotulo: "Aviso de licitação", caderno: "Licitações e Contratos", pncp: true },
  { id: "nomeacao", rotulo: "Nomeação", caderno: "Pessoal", pncp: false },
  { id: "exoneracao", rotulo: "Exoneração", caderno: "Pessoal", pncp: false },
  { id: "aposentadoria", rotulo: "Aposentadoria (RPPS)", caderno: "Pessoal", pncp: false },
];

export function promptAtoDO(input: {
  tipo: TipoAtoDO;
  ementa: string;
  conteudo: string;
  autoridade?: string;
}): string {
  const meta = ATOS_DO.find((a) => a.id === input.tipo);
  return `Elabore um ato oficial do tipo "${meta?.rotulo || input.tipo}" para publicação no Diário Oficial Municipal.

- Caderno: ${meta?.caderno || "[PREENCHER]"}
- Ementa / objeto do ato: ${input.ementa || "[PREENCHER: ementa]"}
- Conteúdo / dados fornecidos: ${input.conteudo || "[PREENCHER: detalhar o ato]"}
- Autoridade signatária: ${input.autoridade || "[PREENCHER: nome e cargo da autoridade]"}
${meta?.pncp ? "- Este ato exige também publicação no PNCP (Lei 14.133/2021); registre na seção de metadados." : ""}

Estruture o ato na forma legal adequada ao tipo e conclua com os metadados sugeridos para a biblioteca (tipo, caderno, exigência de PNCP).`;
}
