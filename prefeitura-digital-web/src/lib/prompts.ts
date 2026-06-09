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

export const ITENS_TRANSPARENCIA: { id: string; rotulo: string }[] = [
  { id: "receitas-despesas", rotulo: "Receitas e despesas detalhadas, em tempo real (LC 131/2009)" },
  { id: "licitacoes-contratos", rotulo: "Licitações, contratos e convênios" },
  { id: "folha", rotulo: "Folha/remuneração nominal (sem dados pessoais excedentes — LGPD)" },
  { id: "rreo-rgf", rotulo: "RREO e RGF publicados (LRF art. 48/48-A)" },
  { id: "esic", rotulo: "e-SIC funcional (transparência passiva)" },
  { id: "dados-abertos", rotulo: "Dados abertos em formato aberto + API documentada (OpenAPI)" },
  { id: "siafic", rotulo: "Padrão mínimo SIAFIC (Decreto 10.540/2020)" },
  { id: "acessibilidade", rotulo: "Acessibilidade WCAG 2.1 AA / ABNT NBR 17225:2025" },
  { id: "linguagem-cidada", rotulo: "Linguagem cidadã nos sumários (RREO/RGF)" },
];

export function promptTransparencia(input: {
  portalUrl?: string;
  situacao?: string;
  itensAtendidos: string[]; // ids de ITENS_TRANSPARENCIA já cumpridos
}): string {
  const atendidos = ITENS_TRANSPARENCIA.filter((i) => input.itensAtendidos.includes(i.id));
  const pendentes = ITENS_TRANSPARENCIA.filter((i) => !input.itensAtendidos.includes(i.id));
  const lista = (arr: { rotulo: string }[]) =>
    arr.length ? arr.map((i) => `  - ${i.rotulo}`).join("\n") : "  - (nenhum informado)";

  return `Elabore um DIAGNÓSTICO DE TRANSPARÊNCIA do Portal da Transparência do município.

- Portal (URL): ${input.portalUrl || "[PREENCHER: informar URL do portal]"}
- Situação atual descrita: ${input.situacao || "[PREENCHER: descrever o estado atual]"}

Itens declarados como ATENDIDOS:
${lista(atendidos)}

Itens PENDENTES / não declarados:
${lista(pendentes)}

Produza:
1. Diagnóstico de conformidade (LAI, LC 131/2009, LRF art. 48/48-A, SIAFIC, Lei 14.129/2021, LGPD, EBT/PNTP, WCAG), classificando cada item pendente por criticidade.
2. Checklist priorizado (quick wins x estruturantes).
3. Plano de reconstrução: dados abertos (CKAN), API documentada (OpenAPI), dashboards por tema (execução orçamentária, licitações, pessoal), linguagem cidadã e auditoria de acessibilidade.
Não invente dados do município; marque lacunas com [PREENCHER: ...].`;
}

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

// ── Recursos Humanos — atos de pessoal ─────────────────────────────────────

export const SYSTEM_RH = `Você é o núcleo de Recursos Humanos (Semad) do "Prefeitura Digital", assistente de gestão pública municipal brasileira.
Elabore atos de pessoal prontos para publicação a partir de informações mínimas.

Regras:
- Fundamentos constitucionais: CF art. 37 (legalidade, impessoalidade, publicidade, concurso público), art. 38/39/40/41 e o Estatuto dos Servidores do Município (referencie como "Estatuto do Servidor Municipal" quando a lei local não for informada).
- Limite de despesa com pessoal (LRF, arts. 19-23): atos que AUMENTAM a despesa com pessoal exigem prévia dotação, estimativa de impacto (LRF art. 16/17 quando aplicável) e observância dos limites; se o ente estiver acima do limite prudencial (art. 22, parágrafo único), há VEDAÇÃO a provimento de cargo, criação/majoração de vantagens e contratação de horas extras — registre isso quando o ato aumentar a folha.
- Assinatura eletrônica: Lei 14.063/2020; publicidade no Diário Oficial Municipal.
- LGPD (art. 5º, II): não inclua dados pessoais desnecessários nem sensíveis. Use CPF na forma reduzida (***.***.***-**) e nunca inclua conta bancária, dados de saúde ou biométricos.
- Marque qualquer informação ausente com [PREENCHER: ...]. Não invente nomes, matrículas, números de processo, datas ou valores.
- Estruture o ato na forma legal (epígrafe, preâmbulo com fundamento, corpo articulado, fecho com data/autoridade/cargo).
- Produza o ato em Markdown, pronto para revisão e assinatura pela autoridade competente.
Lembre-se: o resultado é uma MINUTA DE APOIO e não substitui parecer jurídico nem decisão da autoridade competente.`;

export type TipoAtoRH =
  | "nomeacao"
  | "exoneracao"
  | "designacao-fg"
  | "gratificacao"
  | "concessao-licenca"
  | "ferias"
  | "aposentadoria-rpps"
  | "pad-instauracao";

// impactaFolha = o ato tende a AUMENTAR a despesa com pessoal (dispara checagem LRF).
export const ATOS_RH: {
  id: TipoAtoRH;
  rotulo: string;
  fundamento: string;
  impactaFolha: boolean;
}[] = [
  { id: "nomeacao", rotulo: "Nomeação / provimento", fundamento: "CF art. 37, II; Estatuto do Servidor", impactaFolha: true },
  { id: "exoneracao", rotulo: "Exoneração / vacância", fundamento: "Estatuto do Servidor", impactaFolha: false },
  { id: "designacao-fg", rotulo: "Designação de função gratificada", fundamento: "Estatuto do Servidor; lei de cargos", impactaFolha: true },
  { id: "gratificacao", rotulo: "Concessão de gratificação/vantagem", fundamento: "Lei municipal de cargos; LRF art. 21", impactaFolha: true },
  { id: "concessao-licenca", rotulo: "Concessão de licença/afastamento", fundamento: "Estatuto do Servidor", impactaFolha: false },
  { id: "ferias", rotulo: "Concessão de férias", fundamento: "Estatuto do Servidor", impactaFolha: false },
  { id: "aposentadoria-rpps", rotulo: "Aposentadoria (RPPS/IPAM)", fundamento: "CF art. 40; lei do RPPS", impactaFolha: false },
  { id: "pad-instauracao", rotulo: "Instauração de PAD", fundamento: "Estatuto do Servidor; CF art. 41, §1º", impactaFolha: false },
];

export function promptAtoRH(input: {
  tipo: TipoAtoRH;
  servidor: string;
  cargo: string;
  detalhes: string;
  autoridade?: string;
  alertaLRF?: string; // contexto fiscal injetado quando o ato impacta a folha
}): string {
  const meta = ATOS_RH.find((a) => a.id === input.tipo);
  return `Elabore um ato de pessoal do tipo "${meta?.rotulo || input.tipo}" para publicação no Diário Oficial Municipal.

- Fundamento de referência: ${meta?.fundamento || "[PREENCHER]"}
- Servidor(a): ${input.servidor || "[PREENCHER: nome]"}
- Cargo/função: ${input.cargo || "[PREENCHER: cargo]"}
- Detalhes do ato: ${input.detalhes || "[PREENCHER: detalhar (matrícula, lotação, datas, vigência, valor da vantagem)]"}
- Autoridade signatária: ${input.autoridade || "[PREENCHER: nome e cargo da autoridade]"}
${input.alertaLRF ? `\nContexto fiscal (LRF) a observar no ato: ${input.alertaLRF}` : ""}

${meta?.impactaFolha ? "Este ato aumenta a despesa com pessoal: inclua uma cláusula de adequação orçamentária e a observância dos limites da LRF (arts. 19-22)." : ""}
Conclua com os metadados sugeridos para a biblioteca (tipo de ato, caderno "Pessoal", impacto na folha).`;
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
