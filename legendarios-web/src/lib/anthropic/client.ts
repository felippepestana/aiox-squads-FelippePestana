import Anthropic from "@anthropic-ai/sdk";

export type AgentTier = "opus" | "sonnet" | "haiku";

export const AGENT_MODELS: Record<AgentTier, string> = {
  opus: "claude-opus-4-7",
  sonnet: "claude-sonnet-4-6",
  haiku: "claude-haiku-4-5-20251001",
};

export const AGENT_TIER_MAP: Record<string, AgentTier> = {
  "legendarios-chief": "opus",
  "marketing-master": "opus",
  "event-master": "sonnet",
  "community-master": "sonnet",
  "conteudo-instagram": "sonnet",
  "ads-meta": "sonnet",
  "whatsapp-automator": "sonnet",
  "email-marketer": "sonnet",
  "influencer-scout": "sonnet",
  "check-in-coordinator": "sonnet",
  "crm-manager": "sonnet",
  "analytics-reporter": "sonnet",
};

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return _client;
}

export function modelForAgent(agentId: string): string {
  const tier = AGENT_TIER_MAP[agentId] ?? "sonnet";
  return AGENT_MODELS[tier];
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentRequest {
  agentId: string;
  systemPrompt: string;
  messages: AgentMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AgentResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostBRL: number;
}

const USD_TO_BRL = 5.10;

const MODEL_COSTS_USD: Record<string, { input: number; output: number }> = {
  "claude-opus-4-7":            { input: 0.015, output: 0.075 },
  "claude-sonnet-4-6":          { input: 0.003, output: 0.015 },
  "claude-haiku-4-5-20251001":  { input: 0.0008, output: 0.004 },
};

export async function callAgent(req: AgentRequest): Promise<AgentResponse> {
  const client = getAnthropicClient();
  const model = modelForAgent(req.agentId);

  const response = await client.messages.create({
    model,
    max_tokens: req.maxTokens ?? 8192,
    temperature: req.temperature ?? 0.7,
    system: req.systemPrompt,
    messages: req.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const content =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  const costs = MODEL_COSTS_USD[model] ?? { input: 0.003, output: 0.015 };
  const costUSD =
    (response.usage.input_tokens / 1_000_000) * costs.input * 1000 +
    (response.usage.output_tokens / 1_000_000) * costs.output * 1000;
  const costBRL = costUSD * USD_TO_BRL;

  return {
    content,
    model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    estimatedCostBRL: Math.round(costBRL * 100) / 100,
  };
}

export async function* streamAgent(req: AgentRequest): AsyncGenerator<string> {
  const client = getAnthropicClient();
  const model = modelForAgent(req.agentId);

  const stream = client.messages.stream({
    model,
    max_tokens: req.maxTokens ?? 8192,
    temperature: req.temperature ?? 0.7,
    system: req.systemPrompt,
    messages: req.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}
