export type TreatmentCategory = 'emagrecimento' | 'estetica-corporal' | 'estetica-facial' | 'saude'

export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  tagline: string
  description: string
  benefits: string[]
  duration: string
  sessions: string
  icon: string
  highlight?: boolean
  beforeAfterLabel?: { before: string; after: string }
}

export const categoryLabels: Record<TreatmentCategory, string> = {
  emagrecimento: 'Emagrecimento',
  'estetica-corporal': 'Estética Corporal',
  'estetica-facial': 'Estética Facial',
  saude: 'Saúde & Prevenção',
}

export const treatments: Treatment[] = [
  {
    id: 'semaglutida',
    name: 'Protocolo GLP-1',
    category: 'emagrecimento',
    tagline: 'Emagrecimento com ciência de ponta',
    description: 'Protocolos personalizados com análogos GLP-1 (semaglutida/liraglutida) para emagrecimento sustentável, controlando fome, saciedade e metabolismo sob supervisão médica especializada.',
    benefits: [
      'Perda de peso sustentável e saudável',
      'Controle glicêmico e metabólico',
      'Redução de gordura visceral',
      'Acompanhamento médico contínuo',
    ],
    duration: 'Programa de 3 a 12 meses',
    sessions: 'Consultas mensais + suporte',
    icon: '⚗️',
    highlight: true,
    beforeAfterLabel: { before: 'Antes do protocolo', after: 'Após 3 meses' },
  },
  {
    id: 'criolipolise',
    name: 'Criolipólise',
    category: 'estetica-corporal',
    tagline: 'Elimine gordura localizada sem cirurgia',
    description: 'Tecnologia que congela e elimina células de gordura definitivamente, esculpindo silhuetas com precisão. Resultado natural e progressivo sem cirurgia.',
    benefits: [
      'Eliminação definitiva de gordura localizada',
      'Sem cirurgia, sem anestesia',
      'Resultado visível a partir de 30 dias',
      'Zonas: abdômen, flancos, coxas, papada',
    ],
    duration: '45 a 90 min por sessão',
    sessions: '1 a 3 sessões',
    icon: '❄️',
    beforeAfterLabel: { before: 'Antes', after: '60 dias depois' },
  },
  {
    id: 'sculptra',
    name: 'Sculptra Corporal',
    category: 'estetica-corporal',
    tagline: 'Bioestimulação que esculpe com naturalidade',
    description: 'Ácido poli-L-lático que estimula a produção natural de colágeno, promovendo volumização, firmeza e rejuvenescimento progressivo de pele e contorno corporal.',
    benefits: [
      'Estímulo natural de colágeno',
      'Resultado progressivo e duradouro',
      'Melhora de celulite e flacidez',
      'Natural, sem aspecto de "preenchido"',
    ],
    duration: '45 min por sessão',
    sessions: '2 a 3 sessões (a cada 4 semanas)',
    icon: '✨',
    highlight: true,
  },
  {
    id: 'hifem',
    name: 'Escultura Muscular HIFEM',
    category: 'estetica-corporal',
    tagline: 'Tonificação intensa sem malhação',
    description: 'Tecnologia HIFEM (High-Intensity Focused Electromagnetic) que provoca 20.000 contrações musculares em 30 minutos, construindo músculo e queimando gordura simultaneamente.',
    benefits: [
      'Equivale a 20.000 abdominais em 30min',
      'Ganho de massa muscular (+16% médio)',
      'Redução de gordura (-19% médio)',
      'Glúteos, abdômen, braços, coxas',
    ],
    duration: '30 min por sessão',
    sessions: '4 sessões (2x/semana)',
    icon: '⚡',
    beforeAfterLabel: { before: 'Antes', after: 'Após 4 sessões' },
  },
  {
    id: 'harmonizacao',
    name: 'Harmonização Facial',
    category: 'estetica-facial',
    tagline: 'Beleza que equilibra, não que exagera',
    description: 'Protocolo completo de harmonização orofacial com toxina botulínica e preenchimentos de ácido hialurônico, respeitando a anatomia única de cada paciente para resultados naturais.',
    benefits: [
      'Resultado natural e harmonioso',
      'Toxina botulínica certificada',
      'Preenchimento com ácido hialurônico',
      'Protocolo personalizado por biomapping',
    ],
    duration: '60 a 90 min',
    sessions: '1 sessão + manutenção semestral',
    icon: '💫',
    highlight: true,
    beforeAfterLabel: { before: 'Antes', after: 'Após harmonização' },
  },
  {
    id: 'bioestimuladores',
    name: 'Bioestimuladores de Colágeno',
    category: 'estetica-facial',
    tagline: 'Rejuvenescimento de dentro para fora',
    description: 'Radiesse, Sculptra e outros bioestimuladores que ativam a produção natural de colágeno, restaurando volumes perdidos com o envelhecimento de forma gradual e duradoura.',
    benefits: [
      'Produção natural de colágeno',
      'Rejuvenescimento progressivo',
      'Duração de 18 a 24 meses',
      'Natural — sem resultado "artificial"',
    ],
    duration: '60 min por sessão',
    sessions: '2 a 3 sessões',
    icon: '🌿',
  },
  {
    id: 'fios-pdo',
    name: 'Fios de Sustentação PDO',
    category: 'estetica-facial',
    tagline: 'Lifting sem bisturi',
    description: 'Fios de polidioxanona (PDO) implantados sob a pele para reposicionamento imediato de tecidos e estímulo de colágeno, promovendo efeito lifting natural e progressivo.',
    benefits: [
      'Efeito lifting imediato',
      'Sem cortes ou cicatrizes',
      'Estimula produção de colágeno',
      'Resultado por 12 a 18 meses',
    ],
    duration: '60 min',
    sessions: '1 sessão',
    icon: '🧵',
  },
  {
    id: 'avaliacao-cardiovascular',
    name: 'Avaliação Cardiovascular',
    category: 'saude',
    tagline: 'Transformação segura começa pelo coração',
    description: 'Avaliação cardiológica completa com Dr. Angelo Pagotto antes de iniciar qualquer protocolo de emagrecimento ou estético. Segurança cardiovascular é pré-requisito para resultados seguros.',
    benefits: [
      'Avaliação de risco cardiovascular',
      'Eletrocardiograma e exames complementares',
      'Liberação para procedimentos estéticos',
      'Acompanhamento durante protocolos de emagrecimento',
    ],
    duration: '45 a 60 min',
    sessions: '1 consulta inicial + acompanhamento',
    icon: '❤️',
  },
]
