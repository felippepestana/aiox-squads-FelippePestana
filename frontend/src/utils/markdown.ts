import { marked } from 'marked'

// Configure marked for legal rendering
marked.setOptions({
  gfm: true,
  breaks: true,
})

// Highlight legal case references in gold
// Patterns: STJ, STF, TJ, TRT, TST, TJSP etc. + case numbers
const LEGAL_CITATION_PATTERN =
  /\b(STJ|STF|TST|TSE|STM|TRF[\d]?|TJ[A-Z]{2}|TRT[\d]{1,2})(,\s*[\w\s]+,\s*(?:AgInt|AREsp|REsp|RE|AI|HC|MS|RHC|ADI|ADC|ADPF|ARE|Rcl|Ag|Pet|Inq|ED|EMB|RMS|RO|RR|AIRR|ROAR|SBDI|OJ)\s+(?:n[oº]?\s*[\d.,/-]+))/g

// STJ Turma patterns
const TRIBUNAL_REF_PATTERN =
  /\b(STJ|STF|TST|TSE|STM|TRF\d?|TJ[A-Z]{2}|TRT\d{1,2})\b/g

// Article reference pattern
const ARTICLE_PATTERN =
  /\b(art(?:igo)?s?\.?\s*\d+[º°]?(?:,\s*[§]\s*\d+[º°]?)?(?:\s*,\s*inc(?:iso)?\.?\s*[IVXivx]+)?(?:\s*do?\s+(?:CPC|CC|CF|CLT|CDC|CP|CPP|Lei\s+n[oº]?\s*[\d.,/]+))?)/gi

export function renderMarkdown(content: string): string {
  if (!content) return ''

  // Pre-process: enhance blockquotes that look like citations
  let processed = content

  // Convert markdown to HTML
  const html = marked.parse(processed) as string

  return html
}

// Detect if a message contains specific legal structures that need special rendering
export function detectLegalStructures(content: string): {
  hasCaseBrief: boolean
  hasCitations: boolean
  hasRiskAssessment: boolean
  hasPetition: boolean
} {
  return {
    hasCaseBrief:
      /CASO:|FATOS:|FUNDAMENTOS:|PEDIDOS:/i.test(content) ||
      /briefing|sumário do caso/i.test(content),
    hasCitations:
      /\(STJ|STF|TJ[A-Z]{2}|TRF|TST/.test(content) ||
      /Rel\.\s+Min\.|j\.\s+\d{2}\.\d{2}/.test(content),
    hasRiskAssessment:
      /risco\s+(alto|médio|baixo|alta|média|baixa)/i.test(content) ||
      /probabilidade\s+de\s+(sucesso|êxito)/i.test(content),
    hasPetition:
      /AO JUÍZO|PETIÇÃO INICIAL|IMPUGNAÇÃO|RECURSO DE|AGRAVO/i.test(content),
  }
}

// Extract risk level from text
export function extractRiskLevel(
  text: string
): 'alta' | 'média' | 'baixa' | null {
  const match = text.match(/risco\s+(alto|alta|médio|média|baixo|baixa)/i)
  if (!match) return null
  const level = match[1].toLowerCase()
  if (level === 'alto' || level === 'alta') return 'alta'
  if (level === 'médio' || level === 'média') return 'média'
  if (level === 'baixo' || level === 'baixa') return 'baixa'
  return null
}

// Sanitize HTML output (basic)
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
}
