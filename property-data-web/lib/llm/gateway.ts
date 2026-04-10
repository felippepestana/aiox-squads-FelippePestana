import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import {
  AGENT_COMPLEXITY,
  TIER_MODELS,
  type LLMGatewayConfig,
  type LLMProvider,
  type LLMProviderConfig,
  type ComplexityTier,
} from "@/types/llm";

interface SelectedModel {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  maxTokens: number;
}

interface CallLLMParams {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
  stream?: boolean;
}

const PROVIDER_BASE_URLS: Partial<Record<LLMProvider, string>> = {
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/",
  deepseek: "https://api.deepseek.com",
};

/**
 * Selects the best model for a given agent based on its complexity tier
 * and the user's available API keys.
 */
export function selectModel(
  agentId: string,
  config: LLMGatewayConfig
): SelectedModel {
  const tier: ComplexityTier = AGENT_COMPLEXITY[agentId] ?? "standard";
  const candidates = TIER_MODELS[tier];

  // If the user specified a preferred provider and has a key, try that first
  if (config.preferredProvider) {
    const preferred = candidates.find(
      (c) => c.provider === config.preferredProvider
    );
    const key =
      config.userKeys[config.preferredProvider] ??
      config.systemKeys[config.preferredProvider];
    if (preferred && key) {
      return {
        provider: preferred.provider,
        model: preferred.model,
        apiKey: key,
        maxTokens: preferred.maxTokens,
      };
    }
  }

  // Iterate through tier candidates and pick the first one with an available key.
  // Prefer user keys over system keys.
  for (const candidate of candidates) {
    const key =
      config.userKeys[candidate.provider] ??
      config.systemKeys[candidate.provider];
    if (key) {
      return {
        provider: candidate.provider,
        model: candidate.model,
        apiKey: key,
        maxTokens: candidate.maxTokens,
      };
    }
  }

  throw new Error(
    `No API key available for agent "${agentId}" (tier: ${tier}). ` +
      `Configure at least one provider key for: ${candidates.map((c) => c.provider).join(", ")}`
  );
}

/**
 * Calls the appropriate LLM provider and returns an async iterable of text chunks.
 */
export async function* callLLM(
  params: CallLLMParams
): AsyncIterable<string> {
  const { provider, model, apiKey, systemPrompt, messages, maxTokens } = params;

  if (provider === "anthropic") {
    yield* callAnthropic({ model, apiKey, systemPrompt, messages, maxTokens });
  } else {
    // openai, gemini, deepseek all use the OpenAI-compatible SDK
    const baseURL = PROVIDER_BASE_URLS[provider];
    yield* callOpenAICompatible({
      model,
      apiKey,
      systemPrompt,
      messages,
      maxTokens,
      baseURL,
    });
  }
}

async function* callAnthropic(params: {
  model: string;
  apiKey: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
}): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey: params.apiKey });

  const stream = client.messages.stream({
    model: params.model,
    max_tokens: params.maxTokens,
    system: params.systemPrompt,
    messages: params.messages,
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

async function* callOpenAICompatible(params: {
  model: string;
  apiKey: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
  baseURL?: string;
}): AsyncGenerator<string> {
  const client = new OpenAI({
    apiKey: params.apiKey,
    ...(params.baseURL && { baseURL: params.baseURL }),
  });

  const stream = await client.chat.completions.create({
    model: params.model,
    max_tokens: params.maxTokens,
    stream: true,
    messages: [
      { role: "system", content: params.systemPrompt },
      ...params.messages,
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
