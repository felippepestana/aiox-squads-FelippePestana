// Core domain model of the RÉGUA platform (see docs/regua/02-arquitetura.md).
// Instituicao → Carteira → Contrato → Devedor/Aluno → Parcela and its satellites.

export type UUID = string;

export interface Instituicao {
  id: UUID;
  razaoSocial: string;
  cnpj: string;
}

export interface Carteira {
  id: UUID;
  instituicaoId: UUID;
  nome: string;
  successFeePercent: number;
  criadaEm: Date;
}

/** Documentation flags drive the judicial-route decision engine (V1). */
export interface Contrato {
  id: UUID;
  carteiraId: UUID;
  temAssinaturaDevedor: boolean | null; // null = not yet confirmed
  tem2Testemunhas: boolean | null;
  temConfissaoDivida: boolean;
}

/** Financial guardian — collection targets ONLY this person (rule C2/C4). */
export interface Devedor {
  id: UUID;
  contratoId: UUID;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  /** Rule S1: flagged debtors leave the automated dunning flow immediately. */
  flagSuperendividamento: boolean;
  /** Rule S2: hit on the firm's consumer-client base blocks contact. */
  flagConflictCheck: boolean;
}

/** Minor student — data minimized by design (rule L1): no contact fields. */
export interface Aluno {
  id: UUID;
  contratoId: UUID;
  nome: string;
  serieOuCurso: string | null;
}

export type ParcelaStatus =
  | "em_aberto"
  | "em_negociacao"
  | "acordada"
  | "paga"
  | "negativada"
  | "protestada"
  | "judicializada"
  | "prescrita";

export interface Parcela {
  id: UUID;
  contratoId: UUID;
  /** Competência no formato YYYY-MM (mensalidade do mês). */
  competencia: string;
  /**
   * Identificador da anuidade/semestralidade a que a parcela pertence
   * (ex.: "2023" ou "2023-2"). Agrupa parcelas para a regra de prescrição
   * do REsp 2.086.705/SP. Null quando o agrupamento é desconhecido.
   */
  anuidadeId: string | null;
  vencimento: Date;
  valorOriginal: number;
  status: ParcelaStatus;
}

export interface Acordo {
  id: UUID;
  parcelaIds: UUID[];
  desconto: number;
  /** Vencimento da última parcela do acordo — novo termo prescricional (P2). */
  vencimentoUltimaParcela: Date;
  confissaoDividaAceitaEm: Date | null;
}

export type AgingBucket = "0-30" | "31-60" | "61-90" | "91-180" | "180+" | "prescrito";
