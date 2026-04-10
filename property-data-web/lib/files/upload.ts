import Anthropic, { toFile } from "@anthropic-ai/sdk";

const SUPPORTED_MIME: Record<string, string> = {
  ".pdf": "application/pdf", ".txt": "text/plain", ".md": "text/plain",
  ".json": "application/json", ".csv": "text/csv", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
};

export interface UploadedFile {
  fileId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadFileFromBuffer(
  client: Anthropic, buffer: Buffer, filename: string, mimeType: string
): Promise<UploadedFile> {
  const uploadedFile = await toFile(buffer, filename, { type: mimeType });
  const result = await (client.beta.files as any).upload(
    { file: uploadedFile },
    { headers: { "anthropic-beta": "files-api-2025-04-14" } }
  );
  return { fileId: result.id, filename, mimeType, sizeBytes: buffer.length };
}

export function buildFileContentBlock(uploaded: UploadedFile): any {
  if (uploaded.mimeType.startsWith("image/")) {
    return { type: "image", source: { type: "file", file_id: uploaded.fileId } as any } as any;
  }
  return { type: "document", source: { type: "file", file_id: uploaded.fileId } as any, title: uploaded.filename } as any;
}

export function mimeForExtension(ext: string): string {
  return SUPPORTED_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}
