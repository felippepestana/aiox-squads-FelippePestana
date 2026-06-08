// Tipos compartilhados para os artefatos persistidos.

export type ModuloArtefato =
  | "contratacoes"
  | "diario-oficial"
  | "orcamento"
  | "rh"
  | "transparencia";

export interface Artefato {
  id: string;
  modulo: ModuloArtefato;
  tipo: string;
  titulo: string;
  conteudo: string;
  degraded: boolean;
  metadados: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NovoArtefato {
  modulo: ModuloArtefato;
  tipo: string;
  titulo: string;
  conteudo: string;
  degraded?: boolean;
  metadados?: Record<string, unknown>;
}

export const MODULOS_VALIDOS: ModuloArtefato[] = [
  "contratacoes",
  "diario-oficial",
  "orcamento",
  "rh",
  "transparencia",
];
