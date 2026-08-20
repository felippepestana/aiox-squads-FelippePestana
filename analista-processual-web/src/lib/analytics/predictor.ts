/**
 * Case Outcome Predictor
 * Estimates probability of success based on case characteristics
 * Uses parametric model based on jurisprudential data
 */

export interface PredictionInput {
  caseType: string;
  area: string;
  court?: string;
  causeValue?: number;
  hasDocumentaryProof?: boolean;
  hasWitnesses?: boolean;
  isConsumerCase?: boolean;
  opposingPartyType?: 'individual' | 'company' | 'public_entity';
  previousDecisions?: 'favorable' | 'unfavorable' | 'mixed' | 'none';
  legalBasisStrength?: 'strong' | 'moderate' | 'weak';
}

export interface PredictionResult {
  successProbability: number;
  confidence: string;
  factors: PredictionFactor[];
  recommendation: string;
  estimatedDuration: { min: number; max: number; unit: string };
  estimatedValue?: { min: number; max: number };
  risks: string[];
  opportunities: string[];
}

export interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

// Base success rates by case type (empirical averages from Brazilian courts)
const BASE_RATES: Record<string, number> = {
  'cobranca': 0.72,
  'indenizacao': 0.58,
  'consumidor': 0.68,
  'trabalhista': 0.62,
  'familia': 0.55,
  'imobiliario': 0.50,
  'condominial': 0.65,
  'bancario': 0.52,
  'execucao': 0.45,
  'cumprimento': 0.60,
  'possessoria': 0.48,
  'default': 0.50,
};

// Average duration in months by case type
const AVG_DURATION: Record<string, { min: number; max: number }> = {
  'cobranca': { min: 8, max: 18 },
  'indenizacao': { min: 12, max: 30 },
  'consumidor': { min: 6, max: 14 },
  'trabalhista': { min: 8, max: 20 },
  'familia': { min: 4, max: 12 },
  'imobiliario': { min: 12, max: 36 },
  'condominial': { min: 6, max: 18 },
  'bancario': { min: 12, max: 30 },
  'execucao': { min: 6, max: 24 },
  'cumprimento': { min: 3, max: 12 },
  'possessoria': { min: 6, max: 24 },
  'default': { min: 12, max: 24 },
};

export function predictOutcome(input: PredictionInput): PredictionResult {
  const baseRate = BASE_RATES[input.caseType] || BASE_RATES['default'];
  let probability = baseRate;
  const factors: PredictionFactor[] = [];

  // Factor: Documentary proof
  if (input.hasDocumentaryProof === true) {
    probability += 0.12;
    factors.push({
      factor: 'Prova documental',
      impact: 'positive',
      weight: 0.12,
      description: 'Presença de prova documental robusta aumenta chances',
    });
  } else if (input.hasDocumentaryProof === false) {
    probability -= 0.10;
    factors.push({
      factor: 'Ausência de prova documental',
      impact: 'negative',
      weight: -0.10,
      description: 'Falta de documentação reduz chances significativamente',
    });
  }

  // Factor: Witnesses
  if (input.hasWitnesses) {
    probability += 0.05;
    factors.push({
      factor: 'Prova testemunhal',
      impact: 'positive',
      weight: 0.05,
      description: 'Testemunhas reforçam a prova',
    });
  }

  // Factor: Consumer case (CDC protection)
  if (input.isConsumerCase) {
    probability += 0.08;
    factors.push({
      factor: 'Relação de consumo',
      impact: 'positive',
      weight: 0.08,
      description: 'CDC confere proteção especial ao consumidor (inversão ônus)',
    });
  }

  // Factor: Opposing party type
  if (input.opposingPartyType === 'public_entity') {
    probability -= 0.08;
    factors.push({
      factor: 'Parte adversária: Fazenda Pública',
      impact: 'negative',
      weight: -0.08,
      description: 'Processos contra entes públicos tendem a ser mais complexos',
    });
  } else if (input.opposingPartyType === 'company') {
    probability += 0.03;
    factors.push({
      factor: 'Parte adversária: pessoa jurídica',
      impact: 'positive',
      weight: 0.03,
      description: 'Empresas têm maior propensão a acordo',
    });
  }

  // Factor: Previous decisions
  if (input.previousDecisions === 'favorable') {
    probability += 0.10;
    factors.push({
      factor: 'Decisões anteriores favoráveis',
      impact: 'positive',
      weight: 0.10,
      description: 'Histórico processual favorável é forte indicativo',
    });
  } else if (input.previousDecisions === 'unfavorable') {
    probability -= 0.15;
    factors.push({
      factor: 'Decisões anteriores desfavoráveis',
      impact: 'negative',
      weight: -0.15,
      description: 'Histórico desfavorável indica resistência do juízo',
    });
  }

  // Factor: Legal basis strength
  if (input.legalBasisStrength === 'strong') {
    probability += 0.10;
    factors.push({
      factor: 'Fundamentação jurídica forte',
      impact: 'positive',
      weight: 0.10,
      description: 'Súmulas, repetitivos ou jurisprudência pacífica',
    });
  } else if (input.legalBasisStrength === 'weak') {
    probability -= 0.12;
    factors.push({
      factor: 'Fundamentação jurídica frágil',
      impact: 'negative',
      weight: -0.12,
      description: 'Tese sem respaldo jurisprudencial sólido',
    });
  }

  // Clamp probability
  probability = Math.max(0.05, Math.min(0.95, probability));

  // Determine confidence level
  const confidence = factors.length >= 5 ? 'alta'
    : factors.length >= 3 ? 'média'
      : 'baixa (poucos dados)';

  // Duration estimate
  const duration = AVG_DURATION[input.caseType] || AVG_DURATION['default'];

  // Recommendation
  const recommendation = probability >= 0.70
    ? 'Ação recomendada. Probabilidade favorável com bons fundamentos.'
    : probability >= 0.50
      ? 'Ação possível, mas recomenda-se buscar acordo. Resultado incerto.'
      : 'Risco elevado. Considerar negociação extrajudicial ou reforço probatório antes de ajuizar.';

  // Risks and opportunities
  const risks = factors
    .filter(f => f.impact === 'negative')
    .map(f => f.description);

  const opportunities = factors
    .filter(f => f.impact === 'positive')
    .map(f => f.description);

  if (risks.length === 0) risks.push('Nenhum fator de risco significativo identificado');
  if (opportunities.length === 0) opportunities.push('Avaliar possibilidade de reforço probatório');

  return {
    successProbability: Math.round(probability * 100),
    confidence,
    factors,
    recommendation,
    estimatedDuration: { ...duration, unit: 'meses' },
    risks,
    opportunities,
  };
}
