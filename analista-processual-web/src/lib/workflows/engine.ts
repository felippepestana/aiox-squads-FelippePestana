/**
 * Workflow Execution Engine
 * Manages workflow state and step transitions
 */

import { WorkflowTemplate, WorkflowStep, getWorkflowTemplate } from './templates';

export interface WorkflowInstance {
  id: string;
  templateId: string;
  templateName: string;
  analysisId?: string;
  processNumber?: string;
  currentStep: string;
  steps: WorkflowStepState[];
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WorkflowStepState {
  stepId: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  generatedTasks?: string[];
  calculatedDeadline?: string;
}

export interface ExecuteWorkflowInput {
  templateId: string;
  analysisId?: string;
  processNumber?: string;
  startFromStep?: string;
}

export interface AdvanceStepInput {
  workflowId: string;
  stepId: string;
  action: 'complete' | 'skip';
  notes?: string;
}

/**
 * Create a new workflow instance from a template
 */
export function createWorkflowInstance(input: ExecuteWorkflowInput): WorkflowInstance {
  const template = getWorkflowTemplate(input.templateId);
  if (!template) {
    throw new Error(`Template não encontrado: ${input.templateId}`);
  }

  const now = new Date().toISOString();
  const startStep = input.startFromStep || template.steps[0].id;

  const steps: WorkflowStepState[] = template.steps.map(step => ({
    stepId: step.id,
    name: step.name,
    status: step.id === startStep ? 'active' : 'pending',
    startedAt: step.id === startStep ? now : undefined,
  }));

  return {
    id: generateId(),
    templateId: input.templateId,
    templateName: template.name,
    analysisId: input.analysisId,
    processNumber: input.processNumber,
    currentStep: startStep,
    steps,
    status: 'active',
    startedAt: now,
    updatedAt: now,
  };
}

/**
 * Advance workflow to next step
 */
export function advanceWorkflow(instance: WorkflowInstance, stepId: string, action: 'complete' | 'skip', notes?: string): WorkflowInstance {
  const now = new Date().toISOString();
  const template = getWorkflowTemplate(instance.templateId);
  if (!template) throw new Error('Template não encontrado');

  // Update current step
  const stepIndex = instance.steps.findIndex(s => s.stepId === stepId);
  if (stepIndex === -1) throw new Error(`Step não encontrado: ${stepId}`);

  instance.steps[stepIndex].status = action === 'complete' ? 'completed' : 'skipped';
  instance.steps[stepIndex].completedAt = now;
  if (notes) instance.steps[stepIndex].notes = notes;

  // Find next pending step
  const nextStep = instance.steps.find(s => s.status === 'pending');
  if (nextStep) {
    nextStep.status = 'active';
    nextStep.startedAt = now;
    instance.currentStep = nextStep.stepId;
  } else {
    instance.status = 'completed';
    instance.completedAt = now;
  }

  instance.updatedAt = now;
  return instance;
}

/**
 * Get workflow progress summary
 */
export function getWorkflowProgress(instance: WorkflowInstance): {
  totalSteps: number;
  completedSteps: number;
  currentStep: string;
  progressPercent: number;
  status: string;
} {
  const completed = instance.steps.filter(s => s.status === 'completed' || s.status === 'skipped').length;
  const total = instance.steps.length;
  const current = instance.steps.find(s => s.status === 'active');

  return {
    totalSteps: total,
    completedSteps: completed,
    currentStep: current?.name || 'Concluído',
    progressPercent: Math.round((completed / total) * 100),
    status: instance.status,
  };
}

function generateId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
