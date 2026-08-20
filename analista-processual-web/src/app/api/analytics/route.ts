import { NextRequest, NextResponse } from 'next/server';
import { calculateOfficeKPIs, calculateAttorneyMetrics, predictOutcome } from '@/lib/analytics';

/**
 * POST /api/analytics
 * Legal Analytics Engine
 *
 * Body.type determines which analysis to run:
 * - "kpis": Calculate office KPIs from case data
 * - "attorney": Calculate per-attorney metrics
 * - "predict": Predict case outcome
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Campo "type" obrigatório: kpis | attorney | predict' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'kpis':
        if (!params.cases || !Array.isArray(params.cases)) {
          return NextResponse.json(
            { error: 'Campo "cases" obrigatório (array de objetos CaseData)' },
            { status: 400 }
          );
        }
        result = calculateOfficeKPIs(params.cases);
        break;

      case 'attorney':
        if (!params.cases || !Array.isArray(params.cases)) {
          return NextResponse.json(
            { error: 'Campo "cases" obrigatório (array de objetos CaseData)' },
            { status: 400 }
          );
        }
        result = calculateAttorneyMetrics(params.cases);
        break;

      case 'predict':
        if (!params.caseType || !params.area) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: caseType, area. Opcionais: court, hasDocumentaryProof, hasWitnesses, isConsumerCase, opposingPartyType, previousDecisions, legalBasisStrength' },
            { status: 400 }
          );
        }
        result = predictOutcome(params);
        break;

      default:
        return NextResponse.json(
          { error: `Tipo desconhecido: ${type}. Use: kpis, attorney, predict` },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro na análise';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * GET /api/analytics
 * Returns available analytics capabilities and required parameters
 */
export async function GET() {
  return NextResponse.json({
    data: {
      types: [
        {
          type: 'kpis',
          name: 'KPIs do Escritório',
          description: 'Calcula indicadores de desempenho do escritório',
          requiredFields: ['cases (array)'],
          caseFields: ['id', 'type', 'area', 'status', 'startDate', 'endDate?', 'causeValue?', 'recoveredValue?', 'costs?', 'attorney?', 'court?'],
          statusOptions: ['active', 'won', 'lost', 'settled', 'archived'],
        },
        {
          type: 'attorney',
          name: 'Métricas por Advogado',
          description: 'Calcula produtividade e desempenho por advogado',
          requiredFields: ['cases (array with attorney field)'],
        },
        {
          type: 'predict',
          name: 'Predição de Resultado',
          description: 'Estima probabilidade de êxito processual',
          requiredFields: ['caseType', 'area'],
          optionalFields: ['court', 'hasDocumentaryProof', 'hasWitnesses', 'isConsumerCase', 'opposingPartyType', 'previousDecisions', 'legalBasisStrength'],
          caseTypes: ['cobranca', 'indenizacao', 'consumidor', 'trabalhista', 'familia', 'imobiliario', 'condominial', 'bancario', 'execucao', 'cumprimento', 'possessoria'],
          legalBasisOptions: ['strong', 'moderate', 'weak'],
        },
      ],
    },
  });
}
