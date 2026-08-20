/**
 * Document Generator
 * Fills templates with provided variables and validates completeness
 */

import { getDocumentTemplate, DocumentTemplate, TemplateVariable } from './templates';

export interface GenerateInput {
  templateId: string;
  variables: Record<string, string>;
  includeHeader?: boolean;
  dateFormat?: 'full' | 'short';
}

export interface GenerateResult {
  document: string;
  templateName: string;
  completeness: number;
  missingVariables: string[];
  warnings: string[];
  metadata: {
    generatedAt: string;
    templateId: string;
    wordCount: number;
    charCount: number;
  };
}

/**
 * Generate a document from a template with variables
 */
export function generateDocument(input: GenerateInput): GenerateResult {
  const template = getDocumentTemplate(input.templateId);
  if (!template) {
    throw new Error(`Template não encontrado: ${input.templateId}`);
  }

  // Check missing required variables
  const missingVariables: string[] = [];
  const warnings: string[] = [];

  for (const variable of template.variables) {
    if (variable.required && !input.variables[variable.id]) {
      missingVariables.push(variable.label);
    }
  }

  // Validate variable formats
  for (const variable of template.variables) {
    const value = input.variables[variable.id];
    if (value) {
      const validationResult = validateVariable(variable, value);
      if (validationResult) {
        warnings.push(validationResult);
      }
    }
  }

  // Build document from sections
  const sections = [...template.structure].sort((a, b) => a.order - b.order);
  let document = '';

  for (const section of sections) {
    // Skip optional sections without content
    if (section.optional) {
      const sectionVars = extractVariableNames(section.content);
      const hasContent = sectionVars.some(v => input.variables[v] && input.variables[v].trim());
      if (!hasContent) continue;
    }

    let sectionContent = section.content;

    // Replace variables
    for (const [key, value] of Object.entries(input.variables)) {
      const placeholder = `{{${key}}}`;
      sectionContent = sectionContent.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || `[${key}]`);
    }

    // Mark unfilled variables
    sectionContent = sectionContent.replace(/\{\{(\w+)\}\}/g, '[PREENCHER: $1]');

    document += sectionContent + '\n\n';
  }

  // Add date and location if header requested
  if (input.includeHeader !== false) {
    const now = new Date();
    const dateStr = input.dateFormat === 'short'
      ? now.toLocaleDateString('pt-BR')
      : formatFullDate(now);
    document += `\n${dateStr}\n\n___________________________\nAdvogado(a)\nOAB/__ nº _____`;
  }

  // Calculate completeness
  const totalVars = template.variables.filter(v => v.required).length;
  const filledVars = totalVars - missingVariables.length;
  const completeness = totalVars > 0 ? Math.round((filledVars / totalVars) * 100) : 100;

  return {
    document: document.trim(),
    templateName: template.name,
    completeness,
    missingVariables,
    warnings,
    metadata: {
      generatedAt: new Date().toISOString(),
      templateId: input.templateId,
      wordCount: document.split(/\s+/).length,
      charCount: document.length,
    },
  };
}

function extractVariableNames(content: string): string[] {
  const matches = content.match(/\{\{(\w+)\}\}/g);
  return matches ? matches.map(m => m.replace(/\{\{|\}\}/g, '')) : [];
}

function validateVariable(variable: TemplateVariable, value: string): string | null {
  switch (variable.type) {
    case 'cpf': {
      const cpfClean = value.replace(/\D/g, '');
      if (cpfClean.length !== 11) return `${variable.label}: CPF deve ter 11 dígitos`;
      break;
    }
    case 'cnpj': {
      const cnpjClean = value.replace(/\D/g, '');
      if (cnpjClean.length !== 14) return `${variable.label}: CNPJ deve ter 14 dígitos`;
      break;
    }
    case 'currency': {
      const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (isNaN(numValue) || numValue <= 0) return `${variable.label}: valor monetário inválido`;
      break;
    }
    case 'date': {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) return `${variable.label}: formato de data inválido (use DD/MM/AAAA)`;
      break;
    }
  }
  return null;
}

function formatFullDate(date: Date): string {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}
