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

// ATENÇÃO: esta lista é validada na API (/api/artefatos) E reproduzida no
// CHECK da coluna `modulo` em supabase/migrations/0001_artefatos.sql. Ao
// adicionar/remover um módulo aqui, atualize a migração (e crie uma nova para
// alterar o CHECK em bancos já provisionados), senão o INSERT falhará no Postgres.
export const MODULOS_VALIDOS: ModuloArtefato[] = [
  "contratacoes",
  "diario-oficial",
  "orcamento",
  "rh",
  "transparencia",
];
