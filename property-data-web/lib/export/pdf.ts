import fs from "fs";
import path from "path";

const SQUADS_ROOT = process.env.SQUADS_ROOT || path.resolve(process.cwd(), "../squads");

function loadTemplate(templateName: string): string {
  const templatePath = path.join(SQUADS_ROOT, "property-data", "templates", templateName);
  if (!fs.existsSync(templatePath)) return "";
  return fs.readFileSync(templatePath, "utf-8");
}

function populateTemplate(template: string, data: Record<string, unknown>): string {
  // Replace {{placeholder}} with values from data, recursively flatten nested objects
  let result = template;
  const flat = flattenObject(data);
  for (const [key, value] of Object.entries(flat)) {
    result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, "g"), String(value ?? "[NAO ENCONTRADO]"));
  }
  // Replace any remaining unfilled placeholders
  result = result.replace(/\{\{[^}]+\}\}/g, "[NAO DISPONIVEL]");
  return result;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value ?? "");
    }
  }
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a structured report from agent outputs even without template matching
function buildReportFromAgentOutputs(agentOutputs: Record<string, string>, mode: string): string {
  const sections: string[] = [];
  const date = new Date().toLocaleDateString("pt-BR");

  sections.push(`# Relatorio de Levantamento Imobiliario`);
  sections.push(`\n> **Gerado em:** ${date} | **Squad:** Property Data v1.0 | **Modo:** ${mode}\n`);
  sections.push("---\n");

  const agentSections: Record<string, { title: string; icon: string }> = {
    "leitor-documental": { title: "Dados Extraidos dos Documentos", icon: "\u{1F4D1}" },
    "pesquisador-registral": { title: "Pesquisa Registral", icon: "\u{1F4CB}" },
    "analista-legislativo": { title: "Legislacao Aplicavel", icon: "\u2696\uFE0F" },
    "analista-urbanistico": { title: "Analise Urbanistica", icon: "\u{1F3D7}\uFE0F" },
    "analista-visual": { title: "Analise Visual e Geoespacial", icon: "\u{1F6F0}\uFE0F" },
    "avaliador-imovel": { title: "Avaliacao do Imovel", icon: "\u{1F4B0}" },
    "analista-ambiental": { title: "Situacao Ambiental", icon: "\u{1F33F}" },
    "analista-condominial": { title: "Documentacao Condominial", icon: "\u{1F3D8}\uFE0F" },
    "relator-imobiliario": { title: "Sintese Final", icon: "\u{1F4DD}" },
  };

  for (const [agentId, output] of Object.entries(agentOutputs)) {
    const section = agentSections[agentId];
    if (section && output) {
      sections.push(`## ${section.icon} ${section.title}\n`);
      sections.push(output);
      sections.push("\n---\n");
    }
  }

  sections.push("\n*Property Data Squad v1.0 | Gerado por relator-imobiliario*");
  return sections.join("\n");
}

export async function generateMarkdownReport(
  analysisResult: unknown,
  mode: string
): Promise<string> {
  const result = (analysisResult ?? {}) as Record<string, unknown>;

  // Try template-based approach first
  if (mode === "LAUDO_ABNT") {
    const template = loadTemplate("laudo-avaliacao-tmpl.md");
    if (template) return populateTemplate(template, result);
  } else {
    const template = loadTemplate("relatorio-imobiliario-tmpl.md");
    if (template && Object.keys(result).length > 5) return populateTemplate(template, result);
  }

  // Fallback: build from agent outputs directly
  if (typeof result === "object") {
    // Check if result is agent outputs (key = agentId, value = string output)
    const isAgentOutputs = Object.values(result).every(v => typeof v === "string");
    if (isAgentOutputs) {
      return buildReportFromAgentOutputs(result as Record<string, string>, mode);
    }
  }

  return "# Relatorio\n\nDados insuficientes para gerar relatorio.";
}
