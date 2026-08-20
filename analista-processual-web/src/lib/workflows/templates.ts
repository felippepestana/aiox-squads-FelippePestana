/**
 * Procedural Workflow Templates
 * Pre-configured flows for common case types mapped to CPC
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  caseType: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  description: string;
  deadlineDays?: number;
  legalBasis?: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  dependsOn?: string[];
  actions: StepAction[];
}

export interface StepAction {
  type: 'create_task' | 'send_notification' | 'calculate_deadline' | 'generate_document' | 'update_status';
  config: Record<string, unknown>;
}

export interface WorkflowTrigger {
  type: 'status_change' | 'deadline_approaching' | 'publication' | 'manual' | 'schedule';
  condition: Record<string, unknown>;
  targetStep: string;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'acao_conhecimento',
    name: 'Ação de Conhecimento (Procedimento Comum)',
    description: 'Fluxo completo de uma ação de conhecimento pelo procedimento comum CPC',
    caseType: 'conhecimento',
    steps: [
      {
        id: 'distribuicao',
        order: 1,
        name: 'Distribuição',
        description: 'Protocolo e distribuição da petição inicial',
        status: 'pending',
        actions: [
          { type: 'create_task', config: { title: 'Protocolar petição inicial', priority: 'HIGH' } },
          { type: 'calculate_deadline', config: { type: 'manifestacao_generica', label: 'Emenda da inicial (se determinada)' } },
        ],
      },
      {
        id: 'citacao',
        order: 2,
        name: 'Citação do Réu',
        description: 'Aguardar citação válida do réu',
        legalBasis: 'CPC art. 238-259',
        status: 'pending',
        dependsOn: ['distribuicao'],
        actions: [
          { type: 'send_notification', config: { message: 'Acompanhar citação do réu' } },
        ],
      },
      {
        id: 'audiencia_conciliacao',
        order: 3,
        name: 'Audiência de Conciliação/Mediação',
        description: 'Audiência prévia de conciliação (art. 334 CPC)',
        legalBasis: 'CPC art. 334',
        status: 'pending',
        dependsOn: ['citacao'],
        actions: [
          { type: 'create_task', config: { title: 'Preparar para audiência de conciliação' } },
          { type: 'calculate_deadline', config: { type: 'audiencia_conciliacao', label: 'Prazo para cancelamento' } },
        ],
      },
      {
        id: 'contestacao',
        order: 4,
        name: 'Contestação',
        description: 'Prazo para contestação do réu',
        deadlineDays: 15,
        legalBasis: 'CPC art. 335',
        status: 'pending',
        dependsOn: ['audiencia_conciliacao'],
        actions: [
          { type: 'calculate_deadline', config: { type: 'contestacao' } },
          { type: 'send_notification', config: { message: 'Prazo de contestação iniciado' } },
        ],
      },
      {
        id: 'replica',
        order: 5,
        name: 'Réplica',
        description: 'Manifestação do autor sobre a contestação',
        deadlineDays: 15,
        legalBasis: 'CPC art. 351',
        status: 'pending',
        dependsOn: ['contestacao'],
        actions: [
          { type: 'create_task', config: { title: 'Elaborar réplica', priority: 'HIGH' } },
          { type: 'calculate_deadline', config: { type: 'replica' } },
        ],
      },
      {
        id: 'saneamento',
        order: 6,
        name: 'Saneamento e Organização',
        description: 'Decisão de saneamento (art. 357 CPC)',
        legalBasis: 'CPC art. 357',
        status: 'pending',
        dependsOn: ['replica'],
        actions: [
          { type: 'send_notification', config: { message: 'Aguardando decisão de saneamento' } },
        ],
      },
      {
        id: 'instrucao',
        order: 7,
        name: 'Instrução Probatória',
        description: 'Fase de produção de provas',
        legalBasis: 'CPC art. 358-484',
        status: 'pending',
        dependsOn: ['saneamento'],
        actions: [
          { type: 'create_task', config: { title: 'Organizar provas e requerer diligências' } },
        ],
      },
      {
        id: 'alegacoes_finais',
        order: 8,
        name: 'Alegações Finais',
        description: 'Memoriais / razões finais',
        deadlineDays: 15,
        legalBasis: 'CPC art. 364, §2º',
        status: 'pending',
        dependsOn: ['instrucao'],
        actions: [
          { type: 'create_task', config: { title: 'Elaborar alegações finais', priority: 'HIGH' } },
        ],
      },
      {
        id: 'sentenca',
        order: 9,
        name: 'Sentença',
        description: 'Aguardar prolatação da sentença',
        legalBasis: 'CPC art. 485-488',
        status: 'pending',
        dependsOn: ['alegacoes_finais'],
        actions: [
          { type: 'send_notification', config: { message: 'Processo concluso para sentença' } },
        ],
      },
      {
        id: 'recurso',
        order: 10,
        name: 'Recurso (Apelação)',
        description: 'Avaliar e interpor recurso de apelação',
        deadlineDays: 15,
        legalBasis: 'CPC art. 1.003, §5º',
        status: 'pending',
        dependsOn: ['sentenca'],
        actions: [
          { type: 'calculate_deadline', config: { type: 'apelacao' } },
          { type: 'create_task', config: { title: 'Avaliar cabimento de apelação', priority: 'CRITICAL' } },
        ],
      },
    ],
    triggers: [
      { type: 'publication', condition: { contains: 'cite-se' }, targetStep: 'citacao' },
      { type: 'publication', condition: { contains: 'designo audiência' }, targetStep: 'audiencia_conciliacao' },
      { type: 'publication', condition: { contains: 'contestação' }, targetStep: 'contestacao' },
      { type: 'publication', condition: { contains: 'sentença' }, targetStep: 'sentenca' },
      { type: 'deadline_approaching', condition: { daysBeforeDue: 3 }, targetStep: '' },
    ],
  },
  {
    id: 'cumprimento_sentenca',
    name: 'Cumprimento de Sentença',
    description: 'Fluxo de cumprimento de sentença (obrigação de pagar)',
    caseType: 'cumprimento',
    steps: [
      {
        id: 'requerimento',
        order: 1,
        name: 'Requerimento de Cumprimento',
        description: 'Iniciar cumprimento de sentença com memória de cálculo',
        legalBasis: 'CPC art. 523',
        status: 'pending',
        actions: [
          { type: 'create_task', config: { title: 'Elaborar memória de cálculo e requerer cumprimento' } },
          { type: 'generate_document', config: { template: 'cumprimento_sentenca' } },
        ],
      },
      {
        id: 'intimacao_pagamento',
        order: 2,
        name: 'Intimação para Pagamento (15 dias)',
        description: 'Devedor intimado para pagamento voluntário',
        deadlineDays: 15,
        legalBasis: 'CPC art. 523, caput',
        status: 'pending',
        dependsOn: ['requerimento'],
        actions: [
          { type: 'calculate_deadline', config: { type: 'cumprimento_sentenca' } },
        ],
      },
      {
        id: 'impugnacao',
        order: 3,
        name: 'Impugnação (15 dias)',
        description: 'Prazo para impugnação do executado',
        deadlineDays: 15,
        legalBasis: 'CPC art. 525',
        status: 'pending',
        dependsOn: ['intimacao_pagamento'],
        actions: [
          { type: 'calculate_deadline', config: { type: 'impugnacao_cumprimento' } },
        ],
      },
      {
        id: 'penhora',
        order: 4,
        name: 'Penhora e Avaliação',
        description: 'Penhora de bens do devedor',
        legalBasis: 'CPC art. 831',
        status: 'pending',
        dependsOn: ['impugnacao'],
        actions: [
          { type: 'create_task', config: { title: 'Indicar bens à penhora / requerer SISBAJUD' } },
        ],
      },
      {
        id: 'satisfacao',
        order: 5,
        name: 'Satisfação do Crédito',
        description: 'Levantamento de valores ou adjudicação',
        legalBasis: 'CPC art. 904',
        status: 'pending',
        dependsOn: ['penhora'],
        actions: [
          { type: 'create_task', config: { title: 'Requerer levantamento / adjudicação' } },
        ],
      },
    ],
    triggers: [
      { type: 'publication', condition: { contains: 'intime-se para pagamento' }, targetStep: 'intimacao_pagamento' },
      { type: 'publication', condition: { contains: 'penhora' }, targetStep: 'penhora' },
    ],
  },
  {
    id: 'execucao_titulo',
    name: 'Execução de Título Extrajudicial',
    description: 'Fluxo de execução de título extrajudicial',
    caseType: 'execucao',
    steps: [
      {
        id: 'peticao_exec',
        order: 1,
        name: 'Petição Inicial de Execução',
        description: 'Ajuizamento da execução',
        legalBasis: 'CPC art. 798',
        status: 'pending',
        actions: [
          { type: 'generate_document', config: { template: 'peticao_execucao' } },
        ],
      },
      {
        id: 'citacao_exec',
        order: 2,
        name: 'Citação para Pagar (3 dias)',
        description: 'Citação do executado para pagamento em 3 dias',
        deadlineDays: 3,
        legalBasis: 'CPC art. 829',
        status: 'pending',
        dependsOn: ['peticao_exec'],
        actions: [
          { type: 'send_notification', config: { message: 'Executado citado para pagamento' } },
        ],
      },
      {
        id: 'embargos',
        order: 3,
        name: 'Embargos à Execução (15 dias)',
        description: 'Prazo para oposição de embargos',
        deadlineDays: 15,
        legalBasis: 'CPC art. 915',
        status: 'pending',
        dependsOn: ['citacao_exec'],
        actions: [
          { type: 'calculate_deadline', config: { type: 'embargos_execucao' } },
        ],
      },
      {
        id: 'penhora_exec',
        order: 4,
        name: 'Penhora',
        description: 'Constrição de bens',
        legalBasis: 'CPC art. 831',
        status: 'pending',
        dependsOn: ['embargos'],
        actions: [
          { type: 'create_task', config: { title: 'Requerer penhora / SISBAJUD / RENAJUD' } },
        ],
      },
      {
        id: 'expropriacao',
        order: 5,
        name: 'Expropriação',
        description: 'Leilão, adjudicação ou apropriação de frutos',
        legalBasis: 'CPC art. 825',
        status: 'pending',
        dependsOn: ['penhora_exec'],
        actions: [
          { type: 'create_task', config: { title: 'Definir forma de expropriação' } },
        ],
      },
    ],
    triggers: [
      { type: 'publication', condition: { contains: 'cite-se para pagar' }, targetStep: 'citacao_exec' },
      { type: 'publication', condition: { contains: 'embargos' }, targetStep: 'embargos' },
    ],
  },
];

export function getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(t => t.id === id);
}

export function getWorkflowTemplates(): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES;
}
