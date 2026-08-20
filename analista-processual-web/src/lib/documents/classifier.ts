/**
 * Document Type Classifier
 * Identifies the type of legal document based on content analysis
 */

export type DocumentType =
  | 'peticao_inicial'
  | 'contestacao'
  | 'replica'
  | 'recurso_apelacao'
  | 'agravo_instrumento'
  | 'embargos_declaracao'
  | 'sentenca'
  | 'acordao'
  | 'despacho'
  | 'decisao_interlocutoria'
  | 'mandado'
  | 'certidao'
  | 'procuracao'
  | 'contrato'
  | 'notificacao'
  | 'parecer'
  | 'cumprimento_sentenca'
  | 'embargos_execucao'
  | 'desconhecido';

export interface ClassificationResult {
  type: DocumentType;
  confidence: number;
  label: string;
  legalArea: string;
  indicators: string[];
}

const DOCUMENT_PATTERNS: Record<DocumentType, { label: string; keywords: string[]; legalArea: string }> = {
  peticao_inicial: {
    label: 'Petição Inicial',
    keywords: ['excelentíssimo', 'meritissimo', 'valor da causa', 'requer a citação', 'pede deferimento', 'dos fatos', 'do direito', 'dos pedidos', 'termos em que'],
    legalArea: 'processual civil',
  },
  contestacao: {
    label: 'Contestação',
    keywords: ['contestar', 'preliminarmente', 'no mérito', 'improcedência', 'impugna', 'negação geral', 'em contestação'],
    legalArea: 'processual civil',
  },
  replica: {
    label: 'Réplica',
    keywords: ['réplica', 'manifestação à contestação', 'rebater', 'refutar os argumentos'],
    legalArea: 'processual civil',
  },
  recurso_apelacao: {
    label: 'Recurso de Apelação',
    keywords: ['apelação', 'razões de apelação', 'tribunal de justiça', 'reforma da sentença', 'data venia'],
    legalArea: 'processual civil',
  },
  agravo_instrumento: {
    label: 'Agravo de Instrumento',
    keywords: ['agravo de instrumento', 'decisão agravada', 'efeito suspensivo', 'tutela recursal'],
    legalArea: 'processual civil',
  },
  embargos_declaracao: {
    label: 'Embargos de Declaração',
    keywords: ['embargos de declaração', 'omissão', 'contradição', 'obscuridade', 'art. 1.022'],
    legalArea: 'processual civil',
  },
  sentenca: {
    label: 'Sentença',
    keywords: ['julgo procedente', 'julgo improcedente', 'dispositivo', 'extingo o processo', 'condeno', 'custas pelo'],
    legalArea: 'processual civil',
  },
  acordao: {
    label: 'Acórdão',
    keywords: ['acordam', 'câmara', 'turma', 'relator', 'voto', 'ementa', 'desprovimento', 'provimento'],
    legalArea: 'processual civil',
  },
  despacho: {
    label: 'Despacho',
    keywords: ['cite-se', 'intime-se', 'manifeste-se', 'cumpra-se', 'despacho'],
    legalArea: 'processual civil',
  },
  decisao_interlocutoria: {
    label: 'Decisão Interlocutória',
    keywords: ['defiro', 'indefiro', 'tutela de urgência', 'liminar', 'decido'],
    legalArea: 'processual civil',
  },
  mandado: {
    label: 'Mandado',
    keywords: ['mandado de', 'citação', 'intimação', 'oficial de justiça', 'certidou'],
    legalArea: 'processual civil',
  },
  certidao: {
    label: 'Certidão',
    keywords: ['certifico', 'certidão', 'dou fé', 'para constar'],
    legalArea: 'cartorial',
  },
  procuracao: {
    label: 'Procuração',
    keywords: ['procuração', 'outorgante', 'outorgado', 'poderes', 'substabelecer', 'ad judicia'],
    legalArea: 'civil',
  },
  contrato: {
    label: 'Contrato',
    keywords: ['contratante', 'contratado', 'cláusula', 'partes contratantes', 'objeto do contrato', 'vigência'],
    legalArea: 'civil',
  },
  notificacao: {
    label: 'Notificação',
    keywords: ['notificação extrajudicial', 'notificamos', 'providenciar', 'prazo de'],
    legalArea: 'civil',
  },
  parecer: {
    label: 'Parecer Jurídico',
    keywords: ['parecer', 'consulente', 'conclusão', 'opina', 'entendimento'],
    legalArea: 'consultivo',
  },
  cumprimento_sentenca: {
    label: 'Cumprimento de Sentença',
    keywords: ['cumprimento de sentença', 'art. 523', 'multa de 10%', 'pagamento voluntário', 'honorários de 10%'],
    legalArea: 'processual civil',
  },
  embargos_execucao: {
    label: 'Embargos à Execução',
    keywords: ['embargos à execução', 'excesso de execução', 'nulidade da execução', 'art. 917'],
    legalArea: 'processual civil',
  },
  desconhecido: {
    label: 'Documento Não Identificado',
    keywords: [],
    legalArea: 'indeterminada',
  },
};

export function classifyDocument(text: string): ClassificationResult {
  const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let bestMatch: DocumentType = 'desconhecido';
  let bestScore = 0;
  let bestIndicators: string[] = [];

  for (const [docType, pattern] of Object.entries(DOCUMENT_PATTERNS)) {
    if (docType === 'desconhecido') continue;

    let matchCount = 0;
    const indicators: string[] = [];

    for (const keyword of pattern.keywords) {
      const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedText.includes(normalizedKeyword)) {
        matchCount++;
        indicators.push(keyword);
      }
    }

    const score = matchCount / pattern.keywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = docType as DocumentType;
      bestIndicators = indicators;
    }
  }

  const pattern = DOCUMENT_PATTERNS[bestMatch];
  return {
    type: bestMatch,
    confidence: Math.min(bestScore * 1.2, 1.0), // boost slightly, cap at 1.0
    label: pattern.label,
    legalArea: pattern.legalArea,
    indicators: bestIndicators,
  };
}
