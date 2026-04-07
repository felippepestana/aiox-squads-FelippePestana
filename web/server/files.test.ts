import { describe, it, expect } from "vitest";
import {
  mimeForExtension,
  supportedExtensions,
  buildFileContentBlock,
} from "./files.js";

describe("mimeForExtension", () => {
  it("returns correct MIME for PDF", () => {
    expect(mimeForExtension(".pdf")).toBe("application/pdf");
  });

  it("returns correct MIME for images", () => {
    expect(mimeForExtension(".png")).toBe("image/png");
    expect(mimeForExtension(".jpg")).toBe("image/jpeg");
    expect(mimeForExtension(".jpeg")).toBe("image/jpeg");
    expect(mimeForExtension(".webp")).toBe("image/webp");
    expect(mimeForExtension(".gif")).toBe("image/gif");
  });

  it("returns correct MIME for text files", () => {
    expect(mimeForExtension(".txt")).toBe("text/plain");
    expect(mimeForExtension(".md")).toBe("text/plain");
    expect(mimeForExtension(".csv")).toBe("text/csv");
  });

  it("returns correct MIME for JSON", () => {
    expect(mimeForExtension(".json")).toBe("application/json");
  });

  it("returns octet-stream for unknown extensions", () => {
    expect(mimeForExtension(".xyz")).toBe("application/octet-stream");
    expect(mimeForExtension(".exe")).toBe("application/octet-stream");
  });

  it("handles uppercase extensions", () => {
    expect(mimeForExtension(".PDF")).toBe("application/pdf");
    expect(mimeForExtension(".PNG")).toBe("image/png");
  });
});

describe("supportedExtensions", () => {
  it("returns an array of extensions", () => {
    const exts = supportedExtensions();
    expect(Array.isArray(exts)).toBe(true);
    expect(exts.length).toBeGreaterThan(0);
  });

  it("all extensions start with a dot", () => {
    const exts = supportedExtensions();
    for (const ext of exts) {
      expect(ext.startsWith(".")).toBe(true);
    }
  });

  it("includes common extensions", () => {
    const exts = supportedExtensions();
    expect(exts).toContain(".pdf");
    expect(exts).toContain(".txt");
    expect(exts).toContain(".png");
    expect(exts).toContain(".json");
  });
});

describe("buildFileContentBlock", () => {
  it("returns image block for image MIME types", () => {
    const block = buildFileContentBlock({
      fileId: "file-123",
      filename: "photo.png",
      mimeType: "image/png",
      sizeBytes: 1024,
    });
    expect((block as any).type).toBe("image");
    expect((block as any).source.type).toBe("file");
    expect((block as any).source.file_id).toBe("file-123");
  });

  it("returns document block for non-image MIME types", () => {
    const block = buildFileContentBlock({
      fileId: "file-456",
      filename: "report.pdf",
      mimeType: "application/pdf",
      sizeBytes: 2048,
    });
    expect((block as any).type).toBe("document");
    expect((block as any).source.type).toBe("file");
    expect((block as any).source.file_id).toBe("file-456");
    expect((block as any).title).toBe("report.pdf");
  });

  it("handles all image subtypes as image blocks", () => {
    for (const mime of ["image/jpeg", "image/webp", "image/gif"]) {
      const block = buildFileContentBlock({
        fileId: "file-img",
        filename: "test",
        mimeType: mime,
        sizeBytes: 100,
      });
      expect((block as any).type).toBe("image");
    }
  });

  it("handles text MIME types as document blocks", () => {
    for (const mime of ["text/plain", "text/csv", "application/json"]) {
      const block = buildFileContentBlock({
        fileId: "file-doc",
        filename: "test",
        mimeType: mime,
        sizeBytes: 100,
      });
      expect((block as any).type).toBe("document");
    }
  });
});
