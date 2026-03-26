import Anthropic, { toFile } from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SUPPORTED_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".md": "text/plain",
  ".json": "application/json",
  ".csv": "text/csv",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export interface UploadedFile {
  fileId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadFileFromBuffer(
  client: Anthropic,
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadedFile> {
  const uploadedFile = await toFile(buffer, filename, { type: mimeType });
  const result = await (client.beta.files as any).upload(
    { file: uploadedFile },
    { headers: { "anthropic-beta": "files-api-2025-04-14" } }
  );
  return {
    fileId: result.id,
    filename,
    mimeType,
    sizeBytes: buffer.length,
  };
}

export async function uploadFile(
  client: Anthropic,
  filePath: string
): Promise<UploadedFile> {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Arquivo não encontrado: ${absolutePath}`);
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const mimeType = SUPPORTED_MIME[ext] ?? "application/octet-stream";
  const filename = path.basename(absolutePath);
  const stats = fs.statSync(absolutePath);

  const fileStream = fs.createReadStream(absolutePath);
  const uploadedFile = await toFile(fileStream, filename, { type: mimeType });

  const result = await (client.beta.files as any).upload(
    { file: uploadedFile },
    { headers: { "anthropic-beta": "files-api-2025-04-14" } }
  );

  return {
    fileId: result.id,
    filename,
    mimeType,
    sizeBytes: stats.size,
  };
}

export function buildFileContentBlock(
  uploaded: UploadedFile
): Anthropic.Beta.BetaContentBlockParam {
  if (uploaded.mimeType.startsWith("image/")) {
    return {
      type: "image",
      source: { type: "file", file_id: uploaded.fileId } as any,
    } as any;
  }
  return {
    type: "document",
    source: { type: "file", file_id: uploaded.fileId } as any,
    title: uploaded.filename,
  } as any;
}

export function mimeForExtension(ext: string): string {
  return SUPPORTED_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

export function supportedExtensions(): string[] {
  return Object.keys(SUPPORTED_MIME);
}
