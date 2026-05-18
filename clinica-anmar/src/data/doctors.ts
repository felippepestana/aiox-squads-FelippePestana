export interface Doctor {
  id: string
  name: string
  title: string
  crm: string
  specialty: string
  subSpecialties: string[]
  bio: string
  focus: string
  credentials: string[]
  image: string
}

export const doctors: Doctor[] = [
  {
    id: 'angelo',
    name: 'Dr. Angelo Bruno Pagotto',
    title: 'Cardiologista',
    crm: 'CRM-AM 10486 | RQE 5136',
    specialty: 'Cardiologia',
    subSpecialties: [
      'Avaliação Cardiovascular',
      'Hipertensão Arterial',
      'Doenças Coronarianas',
      'Dislipidemia',
      'Insuficiência Cardíaca',
      'Arritmias',
      'Medicina Preventiva',
    ],
    bio: 'Dr. Angelo Bruno Pagotto é cardiologista com CRM-AM 10486, responsável pela segurança cardiovascular de todos os protocolos da Clínica AnMar. Sua presença garante que cada transformação corporal seja realizada com o máximo de segurança clínica, avaliando riscos cardíacos antes de procedimentos estéticos e de emagrecimento.',
    focus: 'Segurança cardiovascular nos protocolos de emagrecimento e estética — porque transformação saudável começa com um coração avaliado.',
    credentials: [
      'Cardiologista',
      'CRM-AM 10486',
      'RQE 5136',
      'Telemedicina habilitada',
      'Hospital Adventista de Manaus',
    ],
    image: '/assets/dr-angelo.jpg',
  },
  {
    id: 'marina',
    name: 'Dra. Marina Mayara T. B. Pagotto',
    title: 'Ginecologista & Especialista em Emagrecimento',
    crm: 'CRM-AM (nº a confirmar)',
    specialty: 'Ginecologia, Obstetrícia & Medicina do Emagrecimento',
    subSpecialties: [
      'Emagrecimento e Sarcopenia',
      'Medicina Metabólica',
      'Harmonização Facial',
      'Bioestimuladores de Colágeno',
      'Toxina Botulínica',
      'Preenchimento Dérmico',
      'Ultrassonografia',
    ],
    bio: 'Dra. Marina Pagotto é ginecologista-obstetra com especialização em ultrassonografia e pós-graduação em Emagrecimento e Sarcopenia (GA Master Group). É a mente clínica por trás dos protocolos de transformação corporal e estética da AnMar, combinando ciência metabólica com resultados estéticos duradouros.',
    focus: 'Protocolos personalizados de emagrecimento e estética que vão além da superfície — transformando saúde, autoestima e qualidade de vida.',
    credentials: [
      'Ginecologista-Obstetra',
      'Especialista em Ultrassonografia',
      'Pós-grad. Emagrecimento & Sarcopenia – GA Master Group',
      'Medicina Metabólica',
      'Harmonização Facial',
    ],
    image: '/assets/dra-marina.jpg',
  },
]
