/**
 * Centralized document text extraction. Supports:
 *   - plain text formats (.txt, .md, .csv, .json, .html, .xml, .rtf)
 *   - PDF with a text layer (via unpdf)
 *   - scanned PDFs (no text layer): pages are rasterized (unpdf + @napi-rs/canvas)
 *     and OCR'd (tesseract.js)
 *   - DOCX (via mammoth)
 *   - images via OCR (via tesseract.js): png, jpg, jpeg, webp, tiff, bmp, gif
 *
 * Designed to run on the Node runtime. Heavy parsers are imported lazily so a
 * plain-text upload never pulls in the PDF/DOCX/OCR dependencies.
 */

const TEXT_EXTENSIONS = [
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".html",
  ".xml",
  ".rtf",
];

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".tif",
  ".tiff",
  ".bmp",
  ".gif",
];

export type ExtractionMethod =
  | "text"
  | "pdf"
  | "ocr-pdf"
  | "docx"
  | "ocr-image"
  | "none";

export interface ExtractionResult {
  /** Extracted text, or null when nothing usable could be extracted. */
  text: string | null;
  /** How the text was obtained (or why it wasn't). */
  method: ExtractionMethod;
  /** True when the file type is supported but yielded no text (e.g. scanned PDF). */
  needsOcr: boolean;
}

function lower(filename: string): string {
  return filename.toLowerCase();
}

export function isTextLike(filename: string, fileType: string): boolean {
  return (
    fileType.startsWith("text/") ||
    fileType === "application/json" ||
    TEXT_EXTENSIONS.some((ext) => lower(filename).endsWith(ext))
  );
}

export function isPdf(filename: string, fileType: string): boolean {
  return fileType === "application/pdf" || lower(filename).endsWith(".pdf");
}

export function isDocx(filename: string, fileType: string): boolean {
  return (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower(filename).endsWith(".docx")
  );
}

export function isImage(filename: string, fileType: string): boolean {
  return (
    fileType.startsWith("image/") ||
    IMAGE_EXTENSIONS.some((ext) => lower(filename).endsWith(ext))
  );
}

/** OCR languages, e.g. "por+eng". Configurable via OCR_LANGS. */
function ocrLangs(): string {
  return process.env.OCR_LANGS || "por+eng";
}

/** Max PDF pages to OCR (guards the request budget). Configurable via OCR_PDF_MAX_PAGES. */
function ocrPdfMaxPages(): number {
  const n = Number(process.env.OCR_PDF_MAX_PAGES);
  return Number.isFinite(n) && n > 0 ? n : 20;
}

/** Rasterization scale for scanned-PDF OCR. Configurable via OCR_PDF_SCALE. */
function ocrPdfScale(): number {
  const n = Number(process.env.OCR_PDF_SCALE);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

function workerOptions(): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  if (process.env.OCR_CACHE_PATH) {
    options.cachePath = process.env.OCR_CACHE_PATH;
  }
  return options;
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n\n") : text;
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

function toUint8(img: unknown): Uint8Array {
  if (img instanceof Uint8Array) return img;
  return new Uint8Array(img as ArrayBuffer);
}

/**
 * OCRs a scanned PDF by rasterizing each page (unpdf + @napi-rs/canvas) and
 * running tesseract.js. Reuses a single worker across pages and caps the page
 * count to respect the request budget.
 */
export async function extractPdfOcr(buffer: Buffer): Promise<string> {
  const { getDocumentProxy, renderPageAsImage } = await import("unpdf");
  const { createWorker } = await import("tesseract.js");

  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const pageCount = Math.min(pdf.numPages, ocrPdfMaxPages());
  const scale = ocrPdfScale();
  const data = new Uint8Array(buffer);

  const worker = await createWorker(ocrLangs(), undefined, workerOptions());
  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      const image = await renderPageAsImage(data, pageNumber, {
        scale,
        canvasImport: () => import("@napi-rs/canvas"),
      });
      const {
        data: { text },
      } = await worker.recognize(Buffer.from(toUint8(image)));
      if (text.trim()) pages.push(text.trim());
    }
    return pages.join("\n\n").trim();
  } finally {
    await worker.terminate();
  }
}

/**
 * Runs OCR over an image buffer using tesseract.js. The worker downloads the
 * language data on first use (cached under OCR_CACHE_PATH or the OS temp dir).
 */
export async function extractImageOcr(buffer: Buffer): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(ocrLangs(), undefined, workerOptions());
  try {
    const {
      data: { text },
    } = await worker.recognize(buffer);
    return text;
  } finally {
    await worker.terminate();
  }
}

/**
 * Extracts text from an uploaded document. Never throws — on failure returns a
 * null result with `method: "none"` so the caller can persist the document and
 * surface which files lacked extractable text.
 */
export async function extractDocumentText(
  filename: string,
  fileType: string,
  buffer: Buffer
): Promise<ExtractionResult> {
  try {
    if (isTextLike(filename, fileType)) {
      const text = buffer.toString("utf-8").trim();
      return { text: text || null, method: text ? "text" : "none", needsOcr: false };
    }

    if (isPdf(filename, fileType)) {
      const text = (await extractPdf(buffer)).trim();
      if (text) return { text, method: "pdf", needsOcr: false };
      // No text layer: scanned PDF. Rasterize pages and OCR them.
      const ocr = (await extractPdfOcr(buffer)).trim();
      return {
        text: ocr || null,
        method: ocr ? "ocr-pdf" : "none",
        needsOcr: !ocr,
      };
    }

    if (isDocx(filename, fileType)) {
      const text = (await extractDocx(buffer)).trim();
      return { text: text || null, method: text ? "docx" : "none", needsOcr: false };
    }

    if (isImage(filename, fileType)) {
      const text = (await extractImageOcr(buffer)).trim();
      return {
        text: text || null,
        method: text ? "ocr-image" : "none",
        needsOcr: !text,
      };
    }

    // Unsupported (e.g. legacy .doc): not extractable here.
    return { text: null, method: "none", needsOcr: false };
  } catch (error) {
    console.error(`Failed to extract text from ${filename}:`, error);
    return { text: null, method: "none", needsOcr: false };
  }
}
