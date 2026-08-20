/**
 * Procedural Deadline Types
 * Based on CPC/2015 and common Brazilian procedural law
 */

export interface DeadlineType {
  id: string;
  name: string;
  description: string;
  businessDays: number;
  legalBasis: string;
  category: 'contestacao' | 'recurso' | 'manifestacao' | 'cumprimento' | 'outros';
}

export const DEADLINE_TYPES: DeadlineType[] = [
  // Contestação e defesa
  {
    id: 'contestacao',
    name: 'Contestação',
    description: 'Prazo para apresentar contestação',
    businessDays: 15,
    legalBasis: 'CPC art. 335',
    category: 'contestacao',
  },
  {
    id: 'reconvencao',
    name: 'Reconvenção',
    description: 'Prazo para apresentar reconvenção (junto com a contestação)',
    businessDays: 15,
    legalBasis: 'CPC art. 343',
    category: 'contestacao',
  },
  {
    id: 'replica',
    name: 'Réplica',
    description: 'Prazo para réplica à contestação',
    businessDays: 15,
    legalBasis: 'CPC art. 351',
    category: 'contestacao',
  },
  {
    id: 'impugnacao_cumprimento',
    name: 'Impugnação ao Cumprimento de Sentença',
    description: 'Prazo para impugnar cumprimento de sentença',
    businessDays: 15,
    legalBasis: 'CPC art. 525',
    category: 'cumprimento',
  },
  {
    id: 'embargos_execucao',
    name: 'Embargos à Execução',
    description: 'Prazo para oposição de embargos à execução',
    businessDays: 15,
    legalBasis: 'CPC art. 915',
    category: 'cumprimento',
  },
  // Recursos
  {
    id: 'apelacao',
    name: 'Apelação',
    description: 'Prazo para interpor recurso de apelação',
    businessDays: 15,
    legalBasis: 'CPC art. 1.003, §5º',
    category: 'recurso',
  },
  {
    id: 'agravo_instrumento',
    name: 'Agravo de Instrumento',
    description: 'Prazo para interpor agravo de instrumento',
    businessDays: 15,
    legalBasis: 'CPC art. 1.003, §5º',
    category: 'recurso',
  },
  {
    id: 'embargos_declaracao',
    name: 'Embargos de Declaração',
    description: 'Prazo para oposição de embargos de declaração',
    businessDays: 5,
    legalBasis: 'CPC art. 1.023',
    category: 'recurso',
  },
  {
    id: 'recurso_especial',
    name: 'Recurso Especial',
    description: 'Prazo para interpor recurso especial (STJ)',
    businessDays: 15,
    legalBasis: 'CPC art. 1.003, §5º',
    category: 'recurso',
  },
  {
    id: 'recurso_extraordinario',
    name: 'Recurso Extraordinário',
    description: 'Prazo para interpor recurso extraordinário (STF)',
    businessDays: 15,
    legalBasis: 'CPC art. 1.003, §5º',
    category: 'recurso',
  },
  {
    id: 'contrarrazoes',
    name: 'Contrarrazões',
    description: 'Prazo para apresentar contrarrazões ao recurso',
    businessDays: 15,
    legalBasis: 'CPC art. 1.003, §5º',
    category: 'recurso',
  },
  // Manifestações
  {
    id: 'manifestacao_generica',
    name: 'Manifestação Genérica',
    description: 'Prazo genérico para manifestação nos autos',
    businessDays: 15,
    legalBasis: 'CPC art. 218, §3º',
    category: 'manifestacao',
  },
  {
    id: 'manifestacao_5dias',
    name: 'Manifestação (5 dias)',
    description: 'Prazo para manifestação quando determinado em 5 dias',
    businessDays: 5,
    legalBasis: 'CPC art. 218, §3º',
    category: 'manifestacao',
  },
  {
    id: 'juntada_documentos',
    name: 'Juntada de Documentos',
    description: 'Prazo para juntada de documentos',
    businessDays: 5,
    legalBasis: 'CPC art. 107, IV',
    category: 'manifestacao',
  },
  {
    id: 'cumprimento_sentenca',
    name: 'Cumprimento Voluntário de Sentença',
    description: 'Prazo para pagamento voluntário em cumprimento de sentença',
    businessDays: 15,
    legalBasis: 'CPC art. 523',
    category: 'cumprimento',
  },
  // Outros
  {
    id: 'audiencia_conciliacao',
    name: 'Antecedência para Audiência de Conciliação',
    description: 'Prazo mínimo de antecedência para audiência de conciliação/mediação',
    businessDays: 10,
    legalBasis: 'CPC art. 334, §5º (pedido de cancelamento)',
    category: 'outros',
  },
];

export function getDeadlineType(id: string): DeadlineType | undefined {
  return DEADLINE_TYPES.find(t => t.id === id);
}

export function getDeadlinesByCategory(category: DeadlineType['category']): DeadlineType[] {
  return DEADLINE_TYPES.filter(t => t.category === category);
}
