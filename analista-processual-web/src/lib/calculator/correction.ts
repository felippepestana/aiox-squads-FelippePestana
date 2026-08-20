/**
 * Monetary Correction Calculator
 * Supports INPC, IPCA-E, and SELIC indices
 */

export type CorrectionIndex = 'INPC' | 'IPCA-E' | 'SELIC' | 'TR' | 'IGPM';

export interface CorrectionInput {
  originalValue: number;
  startDate: string;
  endDate: string;
  index: CorrectionIndex;
  includeInterest?: boolean;
  interestRate?: number; // monthly rate (default 1% for legal interest)
}

export interface CorrectionResult {
  originalValue: number;
  correctedValue: number;
  correctionFactor: number;
  interestValue: number;
  totalValue: number;
  index: CorrectionIndex;
  startDate: string;
  endDate: string;
  months: number;
  legalBasis: string;
}

// Approximate annual indices (real implementation would fetch from IBGE/BCB API)
// These serve as fallback when API is unavailable
const APPROXIMATE_ANNUAL_RATES: Record<CorrectionIndex, number> = {
  'INPC': 0.0450,
  'IPCA-E': 0.0420,
  'SELIC': 0.1075,
  'TR': 0.0180,
  'IGPM': 0.0380,
};

/**
 * Calculate monetary correction
 * Note: Uses approximate rates. For production, integrate with BCB/IBGE APIs.
 */
export function calculateCorrection(input: CorrectionInput): CorrectionResult {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  const months = monthsBetween(start, end);

  const annualRate = APPROXIMATE_ANNUAL_RATES[input.index];
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const correctionFactor = Math.pow(1 + monthlyRate, months);
  const correctedValue = input.originalValue * correctionFactor;

  // Legal interest (art. 406 CC: SELIC or 1% a.m.)
  let interestValue = 0;
  if (input.includeInterest !== false) {
    const interestMonthlyRate = input.interestRate ?? 0.01;
    interestValue = input.originalValue * interestMonthlyRate * months;
  }

  const totalValue = correctedValue + interestValue;

  const legalBasis = getLegalBasis(input.index, input.includeInterest);

  return {
    originalValue: input.originalValue,
    correctedValue: round2(correctedValue),
    correctionFactor: round4(correctionFactor),
    interestValue: round2(interestValue),
    totalValue: round2(totalValue),
    index: input.index,
    startDate: input.startDate,
    endDate: input.endDate,
    months,
    legalBasis,
  };
}

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function getLegalBasis(index: CorrectionIndex, includeInterest?: boolean): string {
  const bases: Record<CorrectionIndex, string> = {
    'INPC': 'Art. 1º-F Lei 9.494/97 (Fazenda Pública)',
    'IPCA-E': 'RE 870.947/SE (STF, Tema 810)',
    'SELIC': 'Art. 406 CC c/c EC 113/2021 (débitos da Fazenda)',
    'TR': 'Art. 39 Lei 8.177/91 (FGTS)',
    'IGPM': 'Pacto contratual',
  };
  let basis = bases[index];
  if (includeInterest && index !== 'SELIC') {
    basis += ' + Juros de mora art. 406 CC';
  }
  return basis;
}
