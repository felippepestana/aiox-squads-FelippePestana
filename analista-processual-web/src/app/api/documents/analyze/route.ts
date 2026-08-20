import { NextRequest, NextResponse } from 'next/server';
import { classifyDocument, extractEntities, validatePetition } from '@/lib/documents';

/**
 * POST /api/documents/analyze
 * Analyze a legal document: classify type, extract entities, validate CPC requirements
 *
 * Body:
 * - text: string (document content)
 * - actions?: string[] (default: all) - 'classify' | 'extract' | 'validate'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, actions } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Campo "text" obrigatório (conteúdo do documento)' },
        { status: 400 }
      );
    }

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Texto muito curto para análise (mínimo 50 caracteres)' },
        { status: 400 }
      );
    }

    const performActions = actions || ['classify', 'extract', 'validate'];
    const result: Record<string, unknown> = {};

    if (performActions.includes('classify')) {
      result.classification = classifyDocument(text);
    }

    if (performActions.includes('extract')) {
      result.entities = extractEntities(text);
    }

    if (performActions.includes('validate')) {
      result.validation = validatePetition(text);
    }

    return NextResponse.json({
      data: {
        ...result,
        metadata: {
          textLength: text.length,
          wordCount: text.split(/\s+/).length,
          analyzedAt: new Date().toISOString(),
          actionsPerformed: performActions,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro na análise';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/documents/analyze
 * Returns available document types and analysis capabilities
 */
export async function GET() {
  return NextResponse.json({
    data: {
      actions: ['classify', 'extract', 'validate'],
      documentTypes: [
        'peticao_inicial', 'contestacao', 'replica', 'recurso_apelacao',
        'agravo_instrumento', 'embargos_declaracao', 'sentenca', 'acordao',
        'despacho', 'decisao_interlocutoria', 'mandado', 'certidao',
        'procuracao', 'contrato', 'notificacao', 'parecer',
        'cumprimento_sentenca', 'embargos_execucao',
      ],
      extractableEntities: ['processNumber', 'parties', 'values', 'dates', 'attorneys', 'legalReferences'],
      validationBasis: 'CPC art. 319 (7 requisitos da petição inicial)',
    },
  });
}
