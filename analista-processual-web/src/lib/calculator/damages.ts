/**
 * Moral Damages Estimation Calculator
 * Based on jurisprudential parameters from Brazilian courts
 */

export interface DamagesInput {
  category: DamageCategory;
  severity: 'light' | 'moderate' | 'severe' | 'very_severe';
  victimIncome?: number; // Monthly income for proportionality
  offenderType?: 'individual' | 'small_company' | 'large_company' | 'public_entity';
  recurrence?: boolean; // Repeat offense
  court?: string; // For regional benchmarks
}

export type DamageCategory =
  | 'negative_registry' // Negativação indevida
  | 'service_failure' // Falha na prestação de serviço
  | 'abusive_collection' // Cobrança abusiva
  | 'contract_breach' // Descumprimento contratual
  | 'honor_injury' // Lesão à honra
  | 'privacy_violation' // Violação de privacidade
  | 'consumer_fraud' // Fraude ao consumidor
  | 'labor_moral' // Dano moral trabalhista
  | 'medical_error' // Erro médico
  | 'traffic_accident' // Acidente de trânsito
  | 'death' // Morte
  | 'aesthetic'; // Dano estético

export interface DamagesResult {
  category: string;
  severity: string;
  estimatedRange: { min: number; max: number };
  suggestedValue: number;
  parameters: string[];
  jurisprudence: string[];
  legalBasis: string;
}

// Parametric ranges based on common jurisprudence (in BRL)
const DAMAGE_RANGES: Record<DamageCategory, Record<string, { min: number; max: number }>> = {
  negative_registry: {
    light: { min: 3000, max: 8000 },
    moderate: { min: 8000, max: 15000 },
    severe: { min: 15000, max: 30000 },
    very_severe: { min: 30000, max: 50000 },
  },
  service_failure: {
    light: { min: 2000, max: 5000 },
    moderate: { min: 5000, max: 10000 },
    severe: { min: 10000, max: 20000 },
    very_severe: { min: 20000, max: 40000 },
  },
  abusive_collection: {
    light: { min: 3000, max: 7000 },
    moderate: { min: 7000, max: 15000 },
    severe: { min: 15000, max: 25000 },
    very_severe: { min: 25000, max: 50000 },
  },
  contract_breach: {
    light: { min: 2000, max: 5000 },
    moderate: { min: 5000, max: 15000 },
    severe: { min: 15000, max: 30000 },
    very_severe: { min: 30000, max: 60000 },
  },
  honor_injury: {
    light: { min: 5000, max: 10000 },
    moderate: { min: 10000, max: 25000 },
    severe: { min: 25000, max: 50000 },
    very_severe: { min: 50000, max: 100000 },
  },
  privacy_violation: {
    light: { min: 5000, max: 10000 },
    moderate: { min: 10000, max: 30000 },
    severe: { min: 30000, max: 60000 },
    very_severe: { min: 60000, max: 150000 },
  },
  consumer_fraud: {
    light: { min: 5000, max: 10000 },
    moderate: { min: 10000, max: 25000 },
    severe: { min: 25000, max: 50000 },
    very_severe: { min: 50000, max: 100000 },
  },
  labor_moral: {
    light: { min: 5000, max: 15000 },
    moderate: { min: 15000, max: 30000 },
    severe: { min: 30000, max: 60000 },
    very_severe: { min: 60000, max: 150000 },
  },
  medical_error: {
    light: { min: 10000, max: 30000 },
    moderate: { min: 30000, max: 80000 },
    severe: { min: 80000, max: 200000 },
    very_severe: { min: 200000, max: 500000 },
  },
  traffic_accident: {
    light: { min: 5000, max: 15000 },
    moderate: { min: 15000, max: 40000 },
    severe: { min: 40000, max: 100000 },
    very_severe: { min: 100000, max: 300000 },
  },
  death: {
    light: { min: 50000, max: 100000 },
    moderate: { min: 100000, max: 200000 },
    severe: { min: 200000, max: 500000 },
    very_severe: { min: 500000, max: 1000000 },
  },
  aesthetic: {
    light: { min: 5000, max: 15000 },
    moderate: { min: 15000, max: 40000 },
    severe: { min: 40000, max: 100000 },
    very_severe: { min: 100000, max: 300000 },
  },
};

const CATEGORY_NAMES: Record<DamageCategory, string> = {
  negative_registry: 'Negativação indevida',
  service_failure: 'Falha na prestação de serviço',
  abusive_collection: 'Cobrança abusiva/vexatória',
  contract_breach: 'Descumprimento contratual',
  honor_injury: 'Lesão à honra/imagem',
  privacy_violation: 'Violação de privacidade',
  consumer_fraud: 'Fraude ao consumidor',
  labor_moral: 'Dano moral trabalhista',
  medical_error: 'Erro médico',
  traffic_accident: 'Acidente de trânsito',
  death: 'Morte (indenização por óbito)',
  aesthetic: 'Dano estético',
};

export function calculateDamages(input: DamagesInput): DamagesResult {
  const range = DAMAGE_RANGES[input.category][input.severity];
  let { min, max } = range;

  // Adjust for offender type (punitive character)
  if (input.offenderType === 'large_company') {
    min *= 1.5;
    max *= 2.0;
  } else if (input.offenderType === 'public_entity') {
    min *= 1.3;
    max *= 1.5;
  }

  // Recurrence increases value
  if (input.recurrence) {
    min *= 1.3;
    max *= 1.5;
  }

  const suggestedValue = Math.round((min + max) / 2);

  const parameters = [
    `Categoria: ${CATEGORY_NAMES[input.category]}`,
    `Gravidade: ${input.severity}`,
    input.offenderType ? `Ofensor: ${input.offenderType}` : null,
    input.recurrence ? 'Reincidência: sim (majorante)' : null,
    input.victimIncome ? `Renda vítima: R$ ${input.victimIncome.toLocaleString('pt-BR')}` : null,
  ].filter(Boolean) as string[];

  const jurisprudence = getJurisprudenceReferences(input.category);

  return {
    category: CATEGORY_NAMES[input.category],
    severity: input.severity,
    estimatedRange: { min: Math.round(min), max: Math.round(max) },
    suggestedValue,
    parameters,
    jurisprudence,
    legalBasis: 'CF art. 5º, V e X + CC arts. 186, 187, 927',
  };
}

function getJurisprudenceReferences(category: DamageCategory): string[] {
  const refs: Record<DamageCategory, string[]> = {
    negative_registry: [
      'Súmula 385/STJ (cadastro preexistente)',
      'Súmula 388/STJ (notificação prévia)',
      'REsp 1.061.134/RS (repetitivo)',
    ],
    service_failure: [
      'CDC art. 14 (responsabilidade objetiva)',
      'Súmula 479/STJ (instituições financeiras)',
    ],
    abusive_collection: [
      'CDC art. 42 (cobrança abusiva)',
      'CDC art. 42, par. único (repetição em dobro)',
    ],
    contract_breach: [
      'CC art. 389 (perdas e danos)',
      'CC art. 475 (resolução)',
    ],
    honor_injury: [
      'CF art. 5º, X (inviolabilidade da honra)',
      'CC art. 953 (injúria, calúnia, difamação)',
    ],
    privacy_violation: [
      'LGPD art. 42 (reparação de danos)',
      'CF art. 5º, X (intimidade e vida privada)',
    ],
    consumer_fraud: [
      'CDC art. 6º, VI (reparação de danos)',
      'CDC art. 37 (publicidade enganosa)',
    ],
    labor_moral: [
      'CLT art. 223-G (parâmetros de fixação)',
      'CF art. 7º, XXVIII (acidente de trabalho)',
    ],
    medical_error: [
      'CC art. 951 (responsabilidade profissional)',
      'CDC art. 14, §4º (profissionais liberais: culpa)',
    ],
    traffic_accident: [
      'CC art. 927, par. único (risco da atividade)',
      'CC art. 948/949 (homicidio/lesão corporal)',
    ],
    death: [
      'CC art. 948 (indenização por homicídio)',
      'Súmula 491/STF (indenização por morte)',
    ],
    aesthetic: [
      'Súmula 387/STJ (cumulação com dano moral)',
      'CC art. 949 (lesão corporal e deformidade)',
    ],
  };
  return refs[category] || [];
}
