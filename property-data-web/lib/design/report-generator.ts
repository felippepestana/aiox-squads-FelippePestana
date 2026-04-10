/**
 * Report design generator for Property Data Web.
 *
 * Provides two modes:
 * 1. Standalone: generates HTML cover + Markdown report
 * 2. MCP-integrated: uses design tools (generate-design, export-design) when available
 *
 * MCP tools referenced (activate when server connected):
 * - generate-design-structured: AI cover generation
 * - upload-asset-from-url: property photos in design
 * - export-design: PDF export
 * - list-brand-kits: brand consistency
 * - get-assets: themed icons and illustrations
 */

export interface ReportDesign {
  designId?: string;
  pdfUrl?: string;
  thumbUrl?: string;
  markdownContent?: string;
  coverHtml?: string;
}

export interface ReportOptions {
  propertyAddress: string;
  city: string;
  state: string;
  type: string;
  mode: string; // RELATORIO | LAUDO_ABNT | CARD | SUMMARY
  photoUrl?: string;
  analysisDate?: string;
  evaluationValue?: string;
}

const MODE_TITLES: Record<string, string> = {
  RELATORIO: "Relatorio de Levantamento Imobiliario",
  LAUDO_ABNT: "Laudo de Avaliacao Imobiliaria — ABNT NBR 14653",
  CARD: "Resumo do Imovel",
  SUMMARY: "Sintese da Analise",
};

const MODE_SUBTITLES: Record<string, string> = {
  RELATORIO: "Pesquisa registral, legislativa, urbanistica, visual e ambiental",
  LAUDO_ABNT: "Conforme normas ABNT NBR 14653-1 e NBR 14653-2",
  CARD: "Dados essenciais consolidados",
  SUMMARY: "Resultados sintetizados do pipeline multiagente",
};

/**
 * Generates a professional cover page as styled HTML.
 * Can be rendered as an image or included at the top of a PDF.
 */
export async function generateReportCover(options: ReportOptions): Promise<ReportDesign> {
  const date = options.analysisDate || new Date().toLocaleDateString("pt-BR");
  const title = MODE_TITLES[options.mode] || "Relatorio Imobiliario";
  const subtitle = MODE_SUBTITLES[options.mode] || "";

  const coverHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #1a3a1a 0%, #2d5016 50%, #4a7c24 100%);
    color: #fff;
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px;
  }
  .badge {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 24px;
    padding: 8px 24px;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 48px;
  }
  .title {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    line-height: 1.3;
    margin-bottom: 16px;
  }
  .subtitle {
    font-size: 16px;
    opacity: 0.8;
    text-align: center;
    margin-bottom: 64px;
    max-width: 500px;
  }
  .divider {
    width: 80px;
    height: 3px;
    background: #C8860A;
    margin-bottom: 48px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%;
    max-width: 500px;
  }
  .info-item {
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 16px 20px;
  }
  .info-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.7;
    margin-bottom: 4px;
  }
  .info-value {
    font-size: 16px;
    font-weight: 600;
  }
  ${options.photoUrl ? `.photo { width: 100%; max-width: 500px; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 48px; }` : ""}
  .footer {
    position: absolute;
    bottom: 48px;
    font-size: 12px;
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div class="badge">Property Data Squad</div>
  ${options.photoUrl ? `<img src="${options.photoUrl}" class="photo" alt="Foto do imovel" />` : ""}
  <h1 class="title">${title}</h1>
  <p class="subtitle">${subtitle}</p>
  <div class="divider"></div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Endereco</div>
      <div class="info-value">${options.propertyAddress}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Cidade/UF</div>
      <div class="info-value">${options.city} - ${options.state}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Tipo</div>
      <div class="info-value">${options.type}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Data</div>
      <div class="info-value">${date}</div>
    </div>
    ${options.evaluationValue ? `
    <div class="info-item" style="grid-column: span 2;">
      <div class="info-label">Valor Estimado</div>
      <div class="info-value" style="font-size: 24px; color: #C8860A;">${options.evaluationValue}</div>
    </div>` : ""}
  </div>
  <div class="footer">Property Data Squad v1.0 — Levantamento e Avaliacao Imobiliaria</div>
</body>
</html>`.trim();

  // Markdown cover fallback
  const markdownCover = [
    `# ${title}`,
    "",
    `> ${subtitle}`,
    "",
    `| Campo | Valor |`,
    `|-------|-------|`,
    `| **Endereco** | ${options.propertyAddress} |`,
    `| **Cidade/UF** | ${options.city} - ${options.state} |`,
    `| **Tipo** | ${options.type} |`,
    `| **Data** | ${date} |`,
    options.evaluationValue ? `| **Valor Estimado** | ${options.evaluationValue} |` : "",
    "",
    "---",
    "",
  ].filter(Boolean).join("\n");

  return {
    coverHtml,
    markdownContent: markdownCover,
  };
}

/**
 * Generates a complete report package combining cover + analysis content.
 * Returns Markdown content that can be saved or converted to PDF.
 *
 * When MCP design tools are available, this will also:
 * - Generate a visual cover via generate-design-structured
 * - Upload property photos via upload-asset-from-url
 * - Export as designed PDF via export-design
 */
export async function exportReportPdf(
  analysisResult: unknown,
  mode: string,
  options?: Partial<ReportOptions>
): Promise<ReportDesign> {
  const { generateMarkdownReport } = await import("@/lib/export/pdf");

  const reportContent = await generateMarkdownReport(analysisResult, mode);

  const coverOptions: ReportOptions = {
    propertyAddress: options?.propertyAddress ?? "Endereco nao informado",
    city: options?.city ?? "",
    state: options?.state ?? "",
    type: options?.type ?? "Nao especificado",
    mode,
    photoUrl: options?.photoUrl,
    analysisDate: options?.analysisDate,
    evaluationValue: options?.evaluationValue,
  };

  const cover = await generateReportCover(coverOptions);
  const fullMarkdown = (cover.markdownContent ?? "") + reportContent;

  return {
    coverHtml: cover.coverHtml,
    markdownContent: fullMarkdown,
    // When MCP tools are available:
    // designId: await mcpGenerateDesign(coverOptions, reportContent),
    // pdfUrl: await mcpExportDesign(designId, "pdf"),
    // thumbUrl: await mcpGetThumbnail(designId),
  };
}

/**
 * Generates a compact property summary card (Markdown).
 */
export async function generatePropertyCard(
  options: ReportOptions,
  keyMetrics: Record<string, string>
): Promise<string> {
  const lines = [
    `## 🏠 ${options.propertyAddress}`,
    `**${options.city} - ${options.state}** | ${options.type}`,
    "",
    "| Metrica | Valor |",
    "|---------|-------|",
  ];

  for (const [key, value] of Object.entries(keyMetrics)) {
    lines.push(`| ${key} | ${value} |`);
  }

  return lines.join("\n");
}
