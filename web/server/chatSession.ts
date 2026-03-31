import Anthropic from "@anthropic-ai/sdk";
import type { Agent } from "./agents.js";
import type { UploadedFile } from "./files.js";
import { buildFileContentBlock } from "./files.js";
import { executeTool, toolsForAgent, type toolSchemas } from "./tools.js";

const MODEL = "claude-opus-4-6";
const MAX_TOOL_ROUNDS = 10;

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

    // Determine which tools this agent needs
    const agentTools = this.agent.tools ?? [];
    const tools =
      agentTools.length > 0
        ? toolsForAgent(agentTools)
        : ([] as Anthropic.Tool[]);

    let fullText = "";
    let rounds = 0;

    // Agentic loop: keep calling until model stops requesting tools
    while (rounds < MAX_TOOL_ROUNDS) {
      rounds++;

      const messages: Anthropic.MessageParam[] = this.history.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const apiParams: any = {
        model: MODEL,
        max_tokens: 8192,
        thinking: { type: "enabled", budget_tokens: 4096 },
        system: this.agent.systemPrompt,
        messages,
      };

      if (tools.length > 0) {
        apiParams.tools = tools;
      }

      const stream = (this.client.beta.messages as any).stream(apiParams, {
        headers: { "anthropic-beta": "files-api-2025-04-14" },
      });

      let roundText = "";
      const toolUseBlocks: Array<{
        id: string;
        name: string;
        input: Record<string, unknown>;
      }> = [];
      let currentToolUse: {
        id: string;
        name: string;
        inputJson: string;
      } | null = null;
      let stopReason: string | null = null;

      for await (const event of stream) {
        if (event.type === "message_stop") {
          // nothing
        } else if (event.type === "message_delta") {
          stopReason = (event as any).delta?.stop_reason ?? stopReason;
        } else if (
          event.type === "content_block_start" &&
          (event as any).content_block?.type === "tool_use"
        ) {
          currentToolUse = {
            id: (event as any).content_block.id,
            name: (event as any).content_block.name,
            inputJson: "",
          };
        } else if (
          event.type === "content_block_delta" &&
          (event as any).delta?.type === "input_json_delta"
        ) {
          if (currentToolUse) {
            currentToolUse.inputJson +=
              (event as any).delta.partial_json ?? "";
          }
        } else if (
          event.type === "content_block_stop" &&
          currentToolUse
        ) {
          let parsedInput: Record<string, unknown> = {};
          try {
            parsedInput = JSON.parse(currentToolUse.inputJson || "{}");
          } catch {
            parsedInput = {};
          }
          toolUseBlocks.push({
            id: currentToolUse.id,
            name: currentToolUse.name,
            input: parsedInput,
          });
          currentToolUse = null;
        } else if (
          event.type === "content_block_delta" &&
          (event as any).delta?.type === "text_delta"
        ) {
          const chunk: string = (event as any).delta.text;
          roundText += chunk;
          fullText += chunk;
          onChunk(chunk);
        }
      }

      // If model used tools, execute them and continue the loop
      if (toolUseBlocks.length > 0) {
        // Build the assistant message content with text + tool_use blocks
        const assistantContent: any[] = [];
        if (roundText) {
          assistantContent.push({ type: "text", text: roundText });
        }
        for (const tu of toolUseBlocks) {
          assistantContent.push({
            type: "tool_use",
            id: tu.id,
            name: tu.name,
            input: tu.input,
          });
        }
        this.history.push({ role: "assistant", content: assistantContent });

        // Execute tools and build tool_result messages
        const toolResults: any[] = toolUseBlocks.map((tu) => {
          const result = executeTool(tu.name, tu.input);
          return {
            type: "tool_result",
            tool_use_id: tu.id,
            content: result,
          };
        });
        this.history.push({ role: "user", content: toolResults });

        // Continue loop — model will process tool results
        continue;
      }

      // No tool use — model is done
      break;
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
