/**
 * Entity Extraction from Legal Documents
 * Extracts parties, values, dates, CNJ numbers, courts, attorneys
 */

export interface ExtractedEntities {
  processNumber?: string;
  parties: Party[];
  values: ExtractedValue[];
  dates: ExtractedDate[];
  court?: string;
  judge?: string;
  attorneys: Attorney[];
  legalReferences: string[];
}

export interface Party {
  name: string;
  role: 'autor' | 'reu' | 'terceiro' | 'assistente' | 'litisconsorte' | 'desconhecido';
  document?: string; // CPF or CNPJ
}

export interface ExtractedValue {
  amount: number;
  formatted: string;
  context: string;
  type: 'causa' | 'condenacao' | 'honorarios' | 'custas' | 'multa' | 'outro';
}

export interface ExtractedDate {
  date: string;
  context: string;
  type: 'fato' | 'prazo' | 'audiencia' | 'publicacao' | 'outro';
}

export interface Attorney {
  name: string;
  oab: string;
  party?: string;
}

// CNJ process number pattern: NNNNNNN-DD.AAAA.J.TR.OOOO
const CNJ_PATTERN = /\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}/g;

// CPF pattern
const CPF_PATTERN = /\d{3}\.\d{3}\.\d{3}-\d{2}/g;

// CNPJ pattern
const CNPJ_PATTERN = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g;

// OAB pattern
const OAB_PATTERN = /OAB[\/\s]*([A-Z]{2})[\/\s]*(\d+[A-Z]?)/gi;

// Brazilian currency
const CURRENCY_PATTERN = /R\$\s*([\d.,]+)/g;

// Date patterns (DD/MM/YYYY)
const DATE_PATTERN = /\d{2}\/\d{2}\/\d{4}/g;

export function extractEntities(text: string): ExtractedEntities {
  const entities: ExtractedEntities = {
    parties: [],
    values: [],
    dates: [],
    attorneys: [],
    legalReferences: [],
  };

  // Extract CNJ process number
  const cnjMatches = text.match(CNJ_PATTERN);
  if (cnjMatches && cnjMatches.length > 0) {
    entities.processNumber = cnjMatches[0];
  }

  // Extract monetary values
  let valueMatch;
  const currencyRegex = new RegExp(CURRENCY_PATTERN.source, 'g');
  while ((valueMatch = currencyRegex.exec(text)) !== null) {
    const rawValue = valueMatch[1].replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(rawValue);
    if (!isNaN(amount) && amount > 0) {
      // Get context (30 chars before and after)
      const start = Math.max(0, valueMatch.index - 30);
      const end = Math.min(text.length, valueMatch.index + valueMatch[0].length + 30);
      const context = text.slice(start, end).trim();

      const type = inferValueType(context);
      entities.values.push({
        amount,
        formatted: `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        context,
        type,
      });
    }
  }

  // Extract dates
  let dateMatch;
  const dateRegex = new RegExp(DATE_PATTERN.source, 'g');
  while ((dateMatch = dateRegex.exec(text)) !== null) {
    const start = Math.max(0, dateMatch.index - 30);
    const end = Math.min(text.length, dateMatch.index + dateMatch[0].length + 30);
    const context = text.slice(start, end).trim();
    const type = inferDateType(context);

    entities.dates.push({
      date: dateMatch[0],
      context,
      type,
    });
  }

  // Extract OAB registrations
  let oabMatch;
  const oabRegex = new RegExp(OAB_PATTERN.source, 'gi');
  while ((oabMatch = oabRegex.exec(text)) !== null) {
    entities.attorneys.push({
      name: '', // Would need NLP for name association
      oab: `OAB/${oabMatch[1]} ${oabMatch[2]}`,
    });
  }

  // Extract legal references (articles, laws)
  const legalRefPattern = /(?:art(?:igo)?\.|art)\s*\d+[\w\s,]*(?:(?:do|da|dos|das)\s+)?(?:CPC|CC|CDC|CF|CLT|Lei[\s\d./]+)/gi;
  const legalRefs = text.match(legalRefPattern);
  if (legalRefs) {
    entities.legalReferences = [...new Set(legalRefs.map(r => r.trim()))];
  }

  // Extract parties (simplified heuristic)
  entities.parties = extractParties(text);

  return entities;
}

function inferValueType(context: string): ExtractedValue['type'] {
  const lower = context.toLowerCase();
  if (lower.includes('valor da causa') || lower.includes('atribui')) return 'causa';
  if (lower.includes('condena') || lower.includes('indeniza')) return 'condenacao';
  if (lower.includes('honorário')) return 'honorarios';
  if (lower.includes('custa') || lower.includes('taxa')) return 'custas';
  if (lower.includes('multa')) return 'multa';
  return 'outro';
}

function inferDateType(context: string): ExtractedDate['type'] {
  const lower = context.toLowerCase();
  if (lower.includes('audiência') || lower.includes('designo')) return 'audiencia';
  if (lower.includes('prazo') || lower.includes('até')) return 'prazo';
  if (lower.includes('publica') || lower.includes('diario')) return 'publicacao';
  return 'fato';
}

function extractParties(text: string): Party[] {
  const parties: Party[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Look for common party identification patterns
    if (lower.includes('autor') || lower.includes('requerente') || lower.includes('exequente')) {
      const cpfMatch = line.match(CPF_PATTERN);
      const cnpjMatch = line.match(CNPJ_PATTERN);
      parties.push({
        name: cleanPartyName(line, 'autor'),
        role: 'autor',
        document: cpfMatch?.[0] || cnpjMatch?.[0],
      });
    }

    if (lower.includes('réu') || lower.includes('requerido') || lower.includes('executado')) {
      const cpfMatch = line.match(CPF_PATTERN);
      const cnpjMatch = line.match(CNPJ_PATTERN);
      parties.push({
        name: cleanPartyName(line, 'reu'),
        role: 'reu',
        document: cpfMatch?.[0] || cnpjMatch?.[0],
      });
    }
  }

  return parties;
}

function cleanPartyName(line: string, _role: string): string {
  // Remove common prefixes and suffixes
  return line
    .replace(/^\s*(?:autor|r[eé]u|requerente|requerido|exequente|executado)[:\s-]*/i, '')
    .replace(/\s*(?:CPF|CNPJ|inscri[a-z]+)[:\s].*/i, '')
    .trim()
    .slice(0, 100); // Cap at 100 chars
}
