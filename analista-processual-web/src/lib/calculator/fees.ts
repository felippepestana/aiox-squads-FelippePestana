/**
 * Court Fees and Attorney Fees Calculator
 */

export interface CourtFeeInput {
  causeValue: number;
  court: string; // e.g. 'TJRO', 'TJSP', 'TRF1'
  type: 'initial' | 'appeal' | 'execution';
}

export interface CourtFeeResult {
  causeValue: number;
  court: string;
  type: string;
  feeValue: number;
  calculationBasis: string;
  legalBasis: string;
}

export interface AttorneyFeeInput {
  causeValue: number;
  state: string; // UF code
  type: 'sucumbencia' | 'contratual' | 'dativos';
  complexity?: 'low' | 'medium' | 'high';
}

export interface AttorneyFeeResult {
  causeValue: number;
  minFee: number;
  maxFee: number;
  suggestedFee: number;
  percentage: { min: number; max: number };
  legalBasis: string;
  state: string;
}

// Simplified court fee tables (real values vary by state and year)
const COURT_FEE_RATES: Record<string, { rate: number; min: number; max: number; basis: string }> = {
  'TJRO': { rate: 0.02, min: 50.36, max: 30000, basis: 'Lei Complementar 784/2014-RO, art. 2º' },
  'TJSP': { rate: 0.01, min: 106.30, max: 100000, basis: 'Lei 11.608/2003-SP, art. 4º' },
  'TJRJ': { rate: 0.02, min: 100, max: 50000, basis: 'Lei 3.350/1999-RJ' },
  'TJMG': { rate: 0.01, min: 80, max: 25000, basis: 'Lei 14.939/2003-MG' },
  'TRF1': { rate: 0.01, min: 10.64, max: 1818.37, basis: 'Lei 9.289/96, art. 14' },
  'TRF2': { rate: 0.01, min: 10.64, max: 1818.37, basis: 'Lei 9.289/96, art. 14' },
  'TRF3': { rate: 0.01, min: 10.64, max: 1818.37, basis: 'Lei 9.289/96, art. 14' },
  'TRF4': { rate: 0.01, min: 10.64, max: 1818.37, basis: 'Lei 9.289/96, art. 14' },
  'TRF5': { rate: 0.01, min: 10.64, max: 1818.37, basis: 'Lei 9.289/96, art. 14' },
};

export function calculateCourtFees(input: CourtFeeInput): CourtFeeResult {
  const feeTable = COURT_FEE_RATES[input.court] ?? COURT_FEE_RATES['TJRO'];
  let rawFee = input.causeValue * feeTable.rate;

  // Appeal typically costs double
  if (input.type === 'appeal') {
    rawFee *= 2;
  }

  // Execution has reduced rate
  if (input.type === 'execution') {
    rawFee *= 0.5;
  }

  const feeValue = Math.max(feeTable.min, Math.min(rawFee, feeTable.max));

  return {
    causeValue: input.causeValue,
    court: input.court,
    type: input.type,
    feeValue: Math.round(feeValue * 100) / 100,
    calculationBasis: `${(feeTable.rate * 100).toFixed(1)}% sobre valor da causa (min R$ ${feeTable.min}, max R$ ${feeTable.max})`,
    legalBasis: feeTable.basis,
  };
}

export function calculateAttorneyFees(input: AttorneyFeeInput): AttorneyFeeResult {
  // CPC art. 85, §2º: 10% to 20% for sucumbência
  let minPct = 0.10;
  let maxPct = 0.20;

  if (input.type === 'sucumbencia') {
    // Art. 85, §2º CPC
    minPct = 0.10;
    maxPct = 0.20;
  } else if (input.type === 'contratual') {
    // OAB table reference (varies by state)
    minPct = 0.20;
    maxPct = 0.30;
  } else if (input.type === 'dativos') {
    // Art. 85, §8º CPC (equidade)
    minPct = 0.10;
    maxPct = 0.20;
  }

  // Adjust by complexity
  if (input.complexity === 'high') {
    minPct += 0.05;
    maxPct += 0.05;
  } else if (input.complexity === 'low') {
    maxPct -= 0.05;
  }

  const minFee = input.causeValue * minPct;
  const maxFee = input.causeValue * maxPct;
  const suggestedFee = input.causeValue * ((minPct + maxPct) / 2);

  const legalBasis = input.type === 'sucumbencia'
    ? 'CPC art. 85, §2º'
    : input.type === 'contratual'
      ? 'Tabela OAB/' + input.state + ' + Código de Ética OAB art. 48'
      : 'CPC art. 85, §8º (equidade)';

  return {
    causeValue: input.causeValue,
    minFee: Math.round(minFee * 100) / 100,
    maxFee: Math.round(maxFee * 100) / 100,
    suggestedFee: Math.round(suggestedFee * 100) / 100,
    percentage: { min: minPct * 100, max: maxPct * 100 },
    legalBasis,
    state: input.state,
  };
}
