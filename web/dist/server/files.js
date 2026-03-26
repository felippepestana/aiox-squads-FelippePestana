import { toFile } from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
const SUPPORTED_MIME = {
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
export async function uploadFileFromBuffer(client, buffer, filename, mimeType) {
    const uploadedFile = await toFile(buffer, filename, { type: mimeType });
    const result = await client.beta.files.upload({ file: uploadedFile }, { headers: { "anthropic-beta": "files-api-2025-04-14" } });
    return {
        fileId: result.id,
        filename,
        mimeType,
        sizeBytes: buffer.length,
    };
}
export async function uploadFile(client, filePath) {
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
    const result = await client.beta.files.upload({ file: uploadedFile }, { headers: { "anthropic-beta": "files-api-2025-04-14" } });
    return {
        fileId: result.id,
        filename,
        mimeType,
        sizeBytes: stats.size,
    };
}
export function buildFileContentBlock(uploaded) {
    if (uploaded.mimeType.startsWith("image/")) {
        return {
            type: "image",
            source: { type: "file", file_id: uploaded.fileId },
        };
    }
    return {
        type: "document",
        source: { type: "file", file_id: uploaded.fileId },
        title: uploaded.filename,
    };
}
export function mimeForExtension(ext) {
    return SUPPORTED_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}
export function supportedExtensions() {
    return Object.keys(SUPPORTED_MIME);
}
