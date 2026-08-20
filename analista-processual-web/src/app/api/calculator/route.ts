import { NextRequest, NextResponse } from 'next/server';
import { calculateCorrection, calculateCourtFees, calculateAttorneyFees, calculateDamages } from '@/lib/calculator';

/**
 * POST /api/calculator
 * Legal Calculator API
 *
 * Body.type determines which calculator to use:
 * - "correction": Monetary correction
 * - "court_fees": Court fees by tribunal
 * - "attorney_fees": Attorney fees (OAB)
 * - "damages": Moral damages estimation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Campo "type" obrigatório: correction | court_fees | attorney_fees | damages' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'correction':
        if (!params.originalValue || !params.startDate || !params.endDate || !params.index) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: originalValue, startDate, endDate, index (INPC|IPCA-E|SELIC|TR|IGPM)' },
            { status: 400 }
          );
        }
        result = calculateCorrection(params);
        break;

      case 'court_fees':
        if (!params.causeValue || !params.court) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: causeValue, court (ex: TJRO, TJSP, TRF1), type (initial|appeal|execution)' },
            { status: 400 }
          );
        }
        result = calculateCourtFees(params);
        break;

      case 'attorney_fees':
        if (!params.causeValue || !params.state) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: causeValue, state (UF), type (sucumbencia|contratual|dativos)' },
            { status: 400 }
          );
        }
        result = calculateAttorneyFees(params);
        break;

      case 'damages':
        if (!params.category || !params.severity) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: category, severity (light|moderate|severe|very_severe)' },
            { status: 400 }
          );
        }
        result = calculateDamages(params);
        break;

      default:
        return NextResponse.json(
          { error: `Tipo desconhecido: ${type}. Use: correction, court_fees, attorney_fees, damages` },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro no cálculo';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * GET /api/calculator
 * Returns available calculator types and their parameters
 */
export async function GET() {
  return NextResponse.json({
    data: {
      calculators: [
        {
          type: 'correction',
          name: 'Correção Monetária',
          params: ['originalValue', 'startDate', 'endDate', 'index', 'includeInterest?', 'interestRate?'],
          indices: ['INPC', 'IPCA-E', 'SELIC', 'TR', 'IGPM'],
        },
        {
          type: 'court_fees',
          name: 'Custas Processuais',
          params: ['causeValue', 'court', 'type'],
          courts: ['TJRO', 'TJSP', 'TJRJ', 'TJMG', 'TRF1', 'TRF2', 'TRF3', 'TRF4', 'TRF5'],
          feeTypes: ['initial', 'appeal', 'execution'],
        },
        {
          type: 'attorney_fees',
          name: 'Honorários Advocatícios',
          params: ['causeValue', 'state', 'type', 'complexity?'],
          feeTypes: ['sucumbencia', 'contratual', 'dativos'],
          complexity: ['low', 'medium', 'high'],
        },
        {
          type: 'damages',
          name: 'Danos Morais (Estimação)',
          params: ['category', 'severity', 'offenderType?', 'recurrence?', 'victimIncome?'],
          categories: [
            'negative_registry', 'service_failure', 'abusive_collection',
            'contract_breach', 'honor_injury', 'privacy_violation',
            'consumer_fraud', 'labor_moral', 'medical_error',
            'traffic_accident', 'death', 'aesthetic',
          ],
          severities: ['light', 'moderate', 'severe', 'very_severe'],
        },
      ],
    },
  });
}
