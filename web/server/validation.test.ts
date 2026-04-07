import { describe, it, expect } from "vitest";
import {
  createSessionSchema,
  switchAgentSchema,
  chatMessageSchema,
} from "./validation.js";

describe("createSessionSchema", () => {
  it("accepts valid input", () => {
    const result = createSessionSchema.safeParse({
      squadId: "devops",
      agentId: "devops-chief",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.squadId).toBe("devops");
      expect(result.data.agentId).toBe("devops-chief");
    }
  });

  it("rejects missing squadId", () => {
    const result = createSessionSchema.safeParse({ agentId: "devops-chief" });
    expect(result.success).toBe(false);
  });

  it("rejects missing agentId", () => {
    const result = createSessionSchema.safeParse({ squadId: "devops" });
    expect(result.success).toBe(false);
  });

  it("rejects empty strings", () => {
    const result = createSessionSchema.safeParse({ squadId: "", agentId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects null body", () => {
    const result = createSessionSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe("switchAgentSchema", () => {
  it("accepts valid input", () => {
    const result = switchAgentSchema.safeParse({
      squadId: "apex",
      agentId: "apex-lead",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty squadId", () => {
    const result = switchAgentSchema.safeParse({
      squadId: "",
      agentId: "apex-lead",
    });
    expect(result.success).toBe(false);
  });
});

describe("chatMessageSchema", () => {
  it("accepts text with files", () => {
    const result = chatMessageSchema.safeParse({
      text: "Hello",
      files: [
        {
          fileId: "file-123",
          filename: "test.pdf",
          mimeType: "application/pdf",
          sizeBytes: 1024,
        },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe("Hello");
      expect(result.data.files).toHaveLength(1);
    }
  });

  it("defaults text to empty string", () => {
    const result = chatMessageSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe("");
      expect(result.data.files).toEqual([]);
    }
  });

  it("defaults files to empty array", () => {
    const result = chatMessageSchema.safeParse({ text: "Hello" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.files).toEqual([]);
    }
  });

  it("rejects files with missing fields", () => {
    const result = chatMessageSchema.safeParse({
      text: "Hello",
      files: [{ fileId: "file-123" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects files as non-array", () => {
    const result = chatMessageSchema.safeParse({
      text: "Hello",
      files: "not-an-array",
    });
    expect(result.success).toBe(false);
  });
});
