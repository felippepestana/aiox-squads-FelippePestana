import { z } from "zod";

export const createSessionSchema = z.object({
  squadId: z.string().min(1, "squadId is required"),
  agentId: z.string().min(1, "agentId is required"),
});

export const switchAgentSchema = z.object({
  squadId: z.string().min(1, "squadId is required"),
  agentId: z.string().min(1, "agentId is required"),
});

export const chatMessageSchema = z.object({
  text: z.string().default(""),
  files: z
    .array(
      z.object({
        fileId: z.string(),
        filename: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number(),
      })
    )
    .default([]),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SwitchAgentInput = z.infer<typeof switchAgentSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
