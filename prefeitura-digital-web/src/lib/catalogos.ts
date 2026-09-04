// Catálogos compartilhados (client-safe): tipos de ato e itens de checklist.
// Centralizados aqui para que páginas (cliente), rotas de API e prompts usem a
// MESMA fonte de verdade, evitando divergência entre o dropdown e a validação.
// Este módulo não contém texto de prompt nem dependências server-only.

// ── Atos do Diário Oficial ─────────────────────────────────────────────────
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

// ── Atos de pessoal (RH) ───────────────────────────────────────────────────
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

// ── Itens do diagnóstico de transparência ──────────────────────────────────
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
