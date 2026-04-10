export interface ReportDesign {
  designId?: string;
  pdfUrl?: string;
  thumbUrl?: string;
}

/**
 * Generates a visual cover for the property report.
 * TODO: integrate MCP generate-design
 */
export async function generateReportCover(
  propertyAddress: string,
  photoUrl?: string
): Promise<ReportDesign> {
  // Placeholder — will integrate with Canva MCP generate-design tool
  return {};
}

/**
 * Exports the full analysis as a designed PDF.
 * TODO: integrate MCP export-design
 */
export async function exportReportPdf(
  analysisResult: unknown,
  mode: string
): Promise<ReportDesign> {
  // Placeholder — will integrate with Canva MCP export-design tool
  return {};
}
