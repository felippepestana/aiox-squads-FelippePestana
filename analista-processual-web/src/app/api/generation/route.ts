import { NextRequest, NextResponse } from 'next/server';
import { generateDocument, getDocumentTemplates, getDocumentTemplate } from '@/lib/generation';

/**
 * GET /api/generation
 * List available document templates
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');

  if (templateId) {
    const template = getDocumentTemplate(templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ data: template });
  }

  const templates = getDocumentTemplates();
  return NextResponse.json({
    data: templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      variablesCount: t.variables.length,
      variables: t.variables.map(v => ({ id: v.id, label: v.label, type: v.type, required: v.required })),
    })),
  });
}

/**
 * POST /api/generation
 * Generate a document from template
 *
 * Body:
 * - templateId: string
 * - variables: Record<string, string>
 * - includeHeader?: boolean
 * - dateFormat?: 'full' | 'short'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, variables, includeHeader, dateFormat } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId obrigatório. Use GET /api/generation para ver templates disponíveis.' },
        { status: 400 }
      );
    }

    if (!variables || typeof variables !== 'object') {
      return NextResponse.json(
        { error: 'variables obrigatório (objeto com pares chave-valor)' },
        { status: 400 }
      );
    }

    const result = generateDocument({ templateId, variables, includeHeader, dateFormat });

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro na geração';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
