import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowTemplates, createWorkflowInstance, advanceWorkflow, getWorkflowProgress } from '@/lib/workflows';

/**
 * GET /api/workflows
 * List available workflow templates
 */
export async function GET() {
  const templates = getWorkflowTemplates();
  return NextResponse.json({
    data: templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      caseType: t.caseType,
      stepsCount: t.steps.length,
      steps: t.steps.map(s => ({ id: s.id, name: s.name, order: s.order, deadlineDays: s.deadlineDays, legalBasis: s.legalBasis })),
    })),
  });
}

/**
 * POST /api/workflows
 * Execute a workflow (create instance) or advance a step
 *
 * Body for creation:
 * - action: 'create'
 * - templateId: string
 * - processNumber?: string
 * - startFromStep?: string
 *
 * Body for advancing:
 * - action: 'advance'
 * - workflowInstance: WorkflowInstance object
 * - stepId: string
 * - stepAction: 'complete' | 'skip'
 * - notes?: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { templateId, processNumber, startFromStep } = body;
      if (!templateId) {
        return NextResponse.json({ error: 'templateId obrigatório' }, { status: 400 });
      }

      const instance = createWorkflowInstance({ templateId, processNumber, startFromStep });
      const progress = getWorkflowProgress(instance);

      return NextResponse.json({
        data: { instance, progress },
      }, { status: 201 });
    }

    if (action === 'advance') {
      const { workflowInstance, stepId, stepAction, notes } = body;
      if (!workflowInstance || !stepId || !stepAction) {
        return NextResponse.json(
          { error: 'Campos obrigatórios: workflowInstance, stepId, stepAction (complete|skip)' },
          { status: 400 }
        );
      }

      const updated = advanceWorkflow(workflowInstance, stepId, stepAction, notes);
      const progress = getWorkflowProgress(updated);

      return NextResponse.json({ data: { instance: updated, progress } });
    }

    return NextResponse.json(
      { error: 'action deve ser "create" ou "advance"' },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro no workflow';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
