import { buildFileContentBlock } from "./files.js";
const MODEL = "claude-opus-4-6";
export class ChatSession {
    client;
    agent;
    history = [];
    constructor(client, agent) {
        this.client = client;
        this.agent = agent;
    }
    getAgent() {
        return this.agent;
    }
    switchAgent(newAgent) {
        this.agent = newAgent;
    }
    resetHistory() {
        this.history = [];
    }
    async send(text, files, onChunk) {
        const userContent = [];
        for (const file of files) {
            userContent.push(buildFileContentBlock(file));
        }
        if (text.trim()) {
            userContent.push({ type: "text", text: text.trim() });
        }
        this.history.push({ role: "user", content: userContent });
        const messages = this.history.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const stream = this.client.beta.messages.stream({
            model: MODEL,
            max_tokens: 8192,
            thinking: { type: "adaptive" },
            system: this.agent.systemPrompt,
            messages,
        }, { headers: { "anthropic-beta": "files-api-2025-04-14" } });
        let fullText = "";
        for await (const event of stream) {
            if (event.type === "content_block_delta" &&
                event.delta?.type === "text_delta") {
                const chunk = event.delta.text;
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
    historyLength() {
        return this.history.length;
    }
}
