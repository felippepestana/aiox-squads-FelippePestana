import Anthropic from "@anthropic-ai/sdk";
import type { Agent } from "./agents.js";
import type { UploadedFile } from "./files.js";
import { buildFileContentBlock } from "./files.js";

const MODEL = "claude-opus-4-6";

export interface ChatMessage {
  role: "user" | "assistant";
  content: Anthropic.MessageParam["content"];
}

export class ChatSession {
  private client: Anthropic;
  private agent: Agent;
  private history: ChatMessage[] = [];

  constructor(client: Anthropic, agent: Agent) {
    this.client = client;
    this.agent = agent;
  }

  getAgent(): Agent {
    return this.agent;
  }

  switchAgent(newAgent: Agent): void {
    this.agent = newAgent;
  }

  resetHistory(): void {
    this.history = [];
  }

  async send(
    text: string,
    files: UploadedFile[],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const userContent: Anthropic.MessageParam["content"] = [];

    for (const file of files) {
      userContent.push(buildFileContentBlock(file) as any);
    }

    if (text.trim()) {
      userContent.push({ type: "text", text: text.trim() });
    }

    this.history.push({ role: "user", content: userContent });

    const messages: Anthropic.MessageParam[] = this.history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const stream = (this.client.beta.messages as any).stream(
      {
        model: MODEL,
        max_tokens: 8192,
        thinking: { type: "adaptive" },
        system: this.agent.systemPrompt,
        messages,
      },
      { headers: { "anthropic-beta": "files-api-2025-04-14" } }
    );

    let fullText = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta"
      ) {
        const chunk: string = event.delta.text;
        fullText += chunk;
        onChunk(chunk);
      }
    }

    this.history.push({
      role: "assistant",
      content: fullText || "(sem resposta)",
    });

    return fullText;
  }

  historyLength(): number {
    return this.history.length;
  }
}
