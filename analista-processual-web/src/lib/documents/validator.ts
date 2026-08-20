/**
 * CPC Art. 319 Petition Validator
 * Validates if a petition meets all formal requirements
 */

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  requirements: RequirementCheck[];
  suggestions: string[];
  legalBasis: string;
}

export interface RequirementCheck {
  id: string;
  requirement: string;
  article: string;
  status: 'present' | 'absent' | 'partial';
  details?: string;
}

/**
 * CPC Art. 319 Requirements:
 * I - juiz/tribunal
 * II - partes (qualificação)
 * III - fatos e fundamentos
 * IV - pedido com especificações
 * V - valor da causa
 * VI - provas
 * VII - opção por audiência de conciliação
 */
export function validatePetition(text: string): ValidationResult {
  const normalizedText = text.toLowerCase();
  const requirements: RequirementCheck[] = [];

  // I - Endereçamento (juízo/tribunal)
  const hasAddressing = /(?:excelent[ií]ssim[oa]|mm\.|meritissimo|juiz[oa]?|vara|tribunal|comarca)/i.test(text);
  requirements.push({
    id: 'addressing',
    requirement: 'Endereçamento ao juízo competente',
    article: 'Art. 319, I, CPC',
    status: hasAddressing ? 'present' : 'absent',
    details: hasAddressing ? 'Endereçamento identificado' : 'Não foi identificado endereçamento ao juízo',
  });

  // II - Qualificação das partes
  const hasPartyQualification = /(?:cpf|cnpj|nacionalidade|estado civil|profissão|residente|domiciliado)/i.test(text);
  const hasPartyNames = /(?:autor|requerente|r[eé]u|requerido)/i.test(text);
  const partyStatus = hasPartyQualification && hasPartyNames ? 'present' : hasPartyNames ? 'partial' : 'absent';
  requirements.push({
    id: 'parties',
    requirement: 'Qualificação completa das partes',
    article: 'Art. 319, II, CPC',
    status: partyStatus,
    details: partyStatus === 'present'
      ? 'Partes qualificadas'
      : partyStatus === 'partial'
        ? 'Partes mencionadas mas qualificação incompleta'
        : 'Partes não identificadas',
  });

  // III - Fatos e fundamentos jurídicos
  const hasFacts = /(?:dos? fatos?|da narrativa|hist[oó]rico)/i.test(text);
  const hasLegalBasis = /(?:do direito|dos? fundamentos?|art\.|lei|c[oó]digo)/i.test(text);
  const factsStatus = hasFacts && hasLegalBasis ? 'present' : hasFacts || hasLegalBasis ? 'partial' : 'absent';
  requirements.push({
    id: 'facts_and_law',
    requirement: 'Fatos e fundamentos jurídicos do pedido',
    article: 'Art. 319, III, CPC',
    status: factsStatus,
    details: factsStatus === 'present'
      ? 'Fatos e fundamentos identificados'
      : 'Seção de fatos e/ou fundamentos ausente ou incompleta',
  });

  // IV - Pedido com especificações
  const hasRequest = /(?:dos? pedidos?|requer|pede|pleiteia)/i.test(text);
  const hasSpecification = /(?:condena[rç]|declara[rç]|constitui[rç]|determina[rç]|antecipação|tutela)/i.test(text);
  const requestStatus = hasRequest && hasSpecification ? 'present' : hasRequest ? 'partial' : 'absent';
  requirements.push({
    id: 'request',
    requirement: 'Pedido com suas especificações',
    article: 'Art. 319, IV, CPC',
    status: requestStatus,
    details: requestStatus === 'present'
      ? 'Pedido(s) identificado(s) com especificação'
      : requestStatus === 'partial'
        ? 'Pedido genérico sem especificação adequada'
        : 'Seção de pedidos não encontrada',
  });

  // V - Valor da causa
  const hasCauseValue = /(?:valor da causa|atribui[^\s]*\s*(?:a esta|\u00e0 causa)|r\$)/i.test(text);
  requirements.push({
    id: 'cause_value',
    requirement: 'Valor da causa',
    article: 'Art. 319, V, CPC',
    status: hasCauseValue ? 'present' : 'absent',
    details: hasCauseValue ? 'Valor da causa informado' : 'Valor da causa não encontrado',
  });

  // VI - Provas
  const hasProofs = /(?:provas?|prova[rç]|demonstra[rç]|documento|testemunha|per[ií]cia)/i.test(text);
  requirements.push({
    id: 'proofs',
    requirement: 'Provas com que pretende demonstrar a verdade dos fatos',
    article: 'Art. 319, VI, CPC',
    status: hasProofs ? 'present' : 'absent',
    details: hasProofs ? 'Menção a provas identificada' : 'Não há menção a meios de prova',
  });

  // VII - Opção por audiência de conciliação
  const hasConciliation = /(?:conciliação|mediação|autocomposição|art\.?\s*334)/i.test(text);
  requirements.push({
    id: 'conciliation',
    requirement: 'Opção pela audiência de conciliação/mediação',
    article: 'Art. 319, VII, CPC',
    status: hasConciliation ? 'present' : 'absent',
    details: hasConciliation
      ? 'Opção por conciliação/mediação identificada'
      : 'Não há manifestação sobre audiência de conciliação (art. 334)',
  });

  // Calculate score
  const presentCount = requirements.filter(r => r.status === 'present').length;
  const partialCount = requirements.filter(r => r.status === 'partial').length;
  const score = Math.round(((presentCount + partialCount * 0.5) / requirements.length) * 100);

  // Generate suggestions
  const suggestions: string[] = [];
  for (const req of requirements) {
    if (req.status === 'absent') {
      suggestions.push(`Adicionar: ${req.requirement} (${req.article})`);
    } else if (req.status === 'partial') {
      suggestions.push(`Completar: ${req.requirement} (${req.article})`);
    }
  }

  return {
    isValid: score >= 70,
    score,
    requirements,
    suggestions,
    legalBasis: 'CPC art. 319 (Requisitos da petição inicial)',
  };
}
