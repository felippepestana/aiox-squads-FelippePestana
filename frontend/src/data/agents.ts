import type { AgentDefinition } from '../types'

// Static agent metadata — enriches API response with UI data.
// The canonical list comes from GET /api/agents; this provides icons, descriptions,
// commands, and colors for agents we know about. Unknown agents get defaults.

export const KNOWN_AGENTS: Record<string, Omit<AgentDefinition, 'id' | 'name' | 'squad'>> = {
  'processual-writer': {
    icon: '⚖️',
    title: 'Especialista em Redação Processual',
    description: 'Redige, formata e revisa peças processuais com linguagem técnica jurídica sóbria.',
    color: '#D4A853',
    commands: [
      { trigger: '*redigir', description: 'Redige peça processual completa', example: '*redigir petição inicial {fatos}' },
      { trigger: '*formatar', description: 'Aplica formatação padrão ao texto', example: '*formatar {texto}' },
      { trigger: '*revisar', description: 'Revisa linguagem e argumentação', example: '*revisar {texto}' },
      { trigger: '*qualificar', description: 'Gera bloco de qualificação da parte', example: '*qualificar autor {dados}' },
      { trigger: '*citar', description: 'Formata citação de jurisprudência', example: '*citar {dados_decisao}' },
    ],
  },

  // Legal squad — possible future agents
  'legal-chief': {
    icon: '🏛️',
    title: 'Chefe do Squad Jurídico',
    description: 'Orquestra análises jurídicas complexas e coordena agentes especializados.',
    color: '#4F8EF7',
    commands: [
      { trigger: '*analisar', description: 'Analisa caso jurídico', example: '*analisar {caso}' },
      { trigger: '*estrategia', description: 'Define estratégia processual', example: '*estrategia {contexto}' },
      { trigger: '*resumir', description: 'Resume peça ou processo', example: '*resumir {documento}' },
    ],
  },
  'case-analyst': {
    icon: '🔍',
    title: 'Analista de Casos',
    description: 'Analisa casos e documentos jurídicos, identifica pontos-chave e riscos.',
    color: '#4CAF7A',
    commands: [
      { trigger: '*analisar', description: 'Análise completa do caso', example: '*analisar {caso}' },
      { trigger: '*risco', description: 'Avalia riscos processuais', example: '*risco {situacao}' },
      { trigger: '*extrair', description: 'Extrai dados de documento', example: '*extrair {documento}' },
    ],
  },
  'jurisp-research': {
    icon: '📚',
    title: 'Pesquisador de Jurisprudência',
    description: 'Pesquisa e sintetiza jurisprudência relevante para o caso.',
    color: '#D4A853',
    commands: [
      { trigger: '*pesquisar', description: 'Pesquisa jurisprudência', example: '*pesquisar {tema}' },
      { trigger: '*sintetizar', description: 'Sintetiza precedentes', example: '*sintetizar {tema}' },
      { trigger: '*sumular', description: 'Identifica súmulas aplicáveis', example: '*sumular {materia}' },
    ],
  },
  'appellate-spec': {
    icon: '📋',
    title: 'Especialista em Recursos',
    description: 'Especializado em recursos e instâncias superiores.',
    color: '#E8A93A',
    commands: [
      { trigger: '*recurso', description: 'Elabora estratégia recursal', example: '*recurso {decisao}' },
      { trigger: '*agravo', description: 'Redige agravo', example: '*agravo {decisao}' },
      { trigger: '*especial', description: 'Recurso especial STJ', example: '*especial {materia}' },
    ],
  },
  'execution-spec': {
    icon: '⚡',
    title: 'Especialista em Execução',
    description: 'Especializado em cumprimento de sentença e execução forçada.',
    color: '#E85454',
    commands: [
      { trigger: '*calculo', description: 'Calcula débito atualizado', example: '*calculo {valor} {data}' },
      { trigger: '*impugnar', description: 'Elabora impugnação', example: '*impugnar {execucao}' },
      { trigger: '*penhora', description: 'Estratégia de penhora', example: '*penhora {bens}' },
    ],
  },
  'ralph': {
    icon: '🤝',
    title: 'Negociador Jurídico',
    description: 'Especializado em acordos, mediação e resolução extrajudicial.',
    color: '#9BA3B2',
    commands: [
      { trigger: '*acordo', description: 'Elabora proposta de acordo', example: '*acordo {contexto}' },
      { trigger: '*mediacao', description: 'Estratégia de mediação', example: '*mediacao {conflito}' },
      { trigger: '*minuta', description: 'Redige minuta de acordo', example: '*minuta {termos}' },
    ],
  },
  'legal-strategy': {
    icon: '♟️',
    title: 'Estrategista Jurídico',
    description: 'Define estratégias processuais e táticas de litígio.',
    color: '#6BA3FF',
    commands: [
      { trigger: '*estrategia', description: 'Define estratégia do caso', example: '*estrategia {caso}' },
      { trigger: '*tese', description: 'Desenvolve tese jurídica', example: '*tese {materia}' },
      { trigger: '*linha', description: 'Linha de argumentação', example: '*linha {objetivo}' },
    ],
  },
  'metric-validator': {
    icon: '📊',
    title: 'Validador de Métricas',
    description: 'Valida argumentos jurídicos e métricas de qualidade das peças.',
    color: '#4CAF7A',
    commands: [
      { trigger: '*validar', description: 'Valida argumentação', example: '*validar {argumento}' },
      { trigger: '*qualidade', description: 'Avalia qualidade da peça', example: '*qualidade {peca}' },
      { trigger: '*checklist', description: 'Executa checklist de revisão', example: '*checklist {peca}' },
    ],
  },

  // Dispatch squad
  'dispatch-chief': {
    icon: '🎯',
    title: 'Chefe de Distribuição',
    description: 'Orquestra tarefas e distribui trabalho entre agentes especializados.',
    color: '#4F8EF7',
    commands: [
      { trigger: '*alocar', description: 'Aloca tarefa ao agente ideal', example: '*alocar {tarefa}' },
      { trigger: '*planejar', description: 'Planeja execução de projeto', example: '*planejar {projeto}' },
    ],
  },
  'task-router': {
    icon: '🔀',
    title: 'Roteador de Tarefas',
    description: 'Classifica e roteia tarefas para os agentes mais adequados.',
    color: '#9BA3B2',
    commands: [
      { trigger: '*rotear', description: 'Roteia tarefa', example: '*rotear {tarefa}' },
      { trigger: '*classificar', description: 'Classifica tipo de tarefa', example: '*classificar {descricao}' },
    ],
  },

  // Deep research squad
  'dr-orchestrator': {
    icon: '🔬',
    title: 'Orquestrador de Pesquisa',
    description: 'Conduz pesquisas aprofundadas com metodologia científica rigorosa.',
    color: '#D4A853',
    commands: [
      { trigger: '*pesquisar', description: 'Inicia pesquisa profunda', example: '*pesquisar {tema}' },
      { trigger: '*sintetizar', description: 'Sintetiza evidências', example: '*sintetizar {fontes}' },
      { trigger: '*revisar', description: 'Revisão sistemática', example: '*revisar {literatura}' },
    ],
  },

  // Education squad
  'education-chief': {
    icon: '🎓',
    title: 'Chefe de Educação',
    description: 'Coordena criação de conteúdo educacional com rigor pedagógico.',
    color: '#4CAF7A',
    commands: [
      { trigger: '*criar', description: 'Cria material didático', example: '*criar {topico}' },
      { trigger: '*avaliar', description: 'Avalia aprendizado', example: '*avaliar {conteudo}' },
    ],
  },

  // SEO squad
  'seo-chief': {
    icon: '🌐',
    title: 'Chefe de SEO',
    description: 'Orquestra estratégias de otimização para motores de busca.',
    color: '#4F8EF7',
    commands: [
      { trigger: '*auditar', description: 'Auditoria SEO', example: '*auditar {url}' },
      { trigger: '*otimizar', description: 'Otimiza conteúdo', example: '*otimizar {pagina}' },
      { trigger: '*keywords', description: 'Pesquisa de palavras-chave', example: '*keywords {tema}' },
    ],
  },

  // Kaizen squad
  'kaizen-chief': {
    icon: '⚙️',
    title: 'Chefe de Melhoria Contínua',
    description: 'Identifica oportunidades de melhoria e otimização de processos.',
    color: '#E8A93A',
    commands: [
      { trigger: '*mapear', description: 'Mapeia processo atual', example: '*mapear {processo}' },
      { trigger: '*otimizar', description: 'Propõe melhorias', example: '*otimizar {fluxo}' },
      { trigger: '*medir', description: 'Define métricas', example: '*medir {objetivo}' },
    ],
  },

  // Apex squad
  'apex-lead': {
    icon: '⬡',
    title: 'Líder Apex',
    description: 'Lidera desenvolvimento frontend com foco em qualidade e performance.',
    color: '#4F8EF7',
    commands: [
      { trigger: '*review', description: 'Code review', example: '*review {codigo}' },
      { trigger: '*arquitetura', description: 'Define arquitetura', example: '*arquitetura {componente}' },
    ],
  },

  // Curator squad
  'curator-chief': {
    icon: '🎬',
    title: 'Curador de Conteúdo',
    description: 'Curadoria e otimização de conteúdo multimídia.',
    color: '#9BA3B2',
    commands: [
      { trigger: '*curar', description: 'Curadoria de conteúdo', example: '*curar {material}' },
      { trigger: '*catalogar', description: 'Cataloga conteúdo', example: '*catalogar {video}' },
    ],
  },
}

// Default metadata for agents not explicitly listed
export function getAgentMeta(
  id: string,
  name: string,
  squad: string
): AgentDefinition {
  const known = KNOWN_AGENTS[id]
  if (known) {
    return { id, name, squad, ...known }
  }

  // Generate defaults for unknown agents
  return {
    id,
    name,
    squad,
    icon: getDefaultIcon(squad),
    title: name,
    description: `Agente especializado do squad ${squad}.`,
    color: getSquadColor(squad),
    commands: [
      { trigger: '*ajuda', description: 'Lista comandos disponíveis' },
    ],
  }
}

function getDefaultIcon(squad: string): string {
  const icons: Record<string, string> = {
    legal: '⚖️',
    dispatch: '🎯',
    'deep-research': '🔬',
    education: '🎓',
    seo: '🌐',
    kaizen: '⚙️',
    apex: '⬡',
    curator: '🎬',
    'squad-creator': '🏗️',
    'squad-creator-pro': '🏗️',
  }
  return icons[squad] || '🤖'
}

function getSquadColor(squad: string): string {
  const colors: Record<string, string> = {
    legal: '#D4A853',
    dispatch: '#4F8EF7',
    'deep-research': '#E8A93A',
    education: '#4CAF7A',
    seo: '#6BA3FF',
    kaizen: '#E8A93A',
    apex: '#4F8EF7',
    curator: '#9BA3B2',
    'squad-creator': '#4CAF7A',
  }
  return colors[squad] || '#9BA3B2'
}

export const SQUAD_LABELS: Record<string, string> = {
  legal: 'Jurídico',
  dispatch: 'Despacho',
  'deep-research': 'Pesquisa Profunda',
  education: 'Educação',
  seo: 'SEO',
  kaizen: 'Melhoria Contínua',
  apex: 'Frontend',
  curator: 'Curadoria',
  'squad-creator': 'Criação de Squads',
  'squad-creator-pro': 'Criação de Squads Pro',
}
