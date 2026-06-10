import OpenAI from "openai";

export type ModelTier = "budget" | "standard" | "premium";
export type TaskComplexity = "simple" | "moderate" | "complex" | "expert";

type Provider =
  | "openai"
  | "anthropic"
  | "deepseek"
  | "qwen"
  | "kimi"
  | "minimax"
  | "gemini";

interface ModelConfig {
  name: string;
  provider: Provider;
  tier: ModelTier;
  contextWindow: number;
  costPer1kTokens: { input: number; output: number };
  // Identifier expected by the provider's API (differs from the internal key).
  apiModel: string;
}

export const MODELS: Record<string, ModelConfig> = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "openai",
    tier: "premium",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
    apiModel: "gpt-4o",
  },
  "gpt-4o-mini": {
    name: "GPT-4o-mini",
    provider: "openai",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
    apiModel: "gpt-4o-mini",
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    tier: "premium",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    apiModel: "claude-3-5-sonnet-20241022",
  },
  "claude-3-5-haiku": {
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    tier: "standard",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.0008, output: 0.004 },
    apiModel: "claude-3-5-haiku-20241022",
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "deepseek",
    tier: "budget",
    contextWindow: 64000,
    costPer1kTokens: { input: 0.00007, output: 0.00027 },
    apiModel: "deepseek-chat",
  },
  "qwen-2.5": {
    name: "Qwen 2.5",
    provider: "qwen",
    tier: "budget",
    contextWindow: 32000,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    apiModel: "qwen2.5-72b-instruct",
  },
  "kimi-k2": {
    name: "Kimi K2",
    provider: "kimi",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.001, output: 0.004 },
    apiModel: "moonshot-v1-128k",
  },
  "minimax-01": {
    name: "MiniMax 01",
    provider: "minimax",
    tier: "budget",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.0001, output: 0.0005 },
    apiModel: "MiniMax-Text-01",
  },
  "gemini-2.0-pro": {
    name: "Gemini 2.0 Pro",
    provider: "gemini",
    tier: "premium",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.00125, output: 0.005 },
    apiModel: "gemini-2.0-flash",
  },
};

// Env var that holds each provider's API key.
const PROVIDER_ENV: Record<Provider, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  qwen: "QWEN_API_KEY",
  kimi: "KIMI_API_KEY",
  minimax: "MINIMAX_API_KEY",
  gemini: "GEMINI_API_KEY",
};

// OpenAI-compatible base URL per provider (openai uses the SDK default).
// These reflect each provider's documented OpenAI-compatible endpoint as of
// the time of writing — verify against the provider before relying on it.
const PROVIDER_BASE_URLS: Partial<Record<Provider, string>> = {
  deepseek: "https://api.deepseek.com",
  qwen: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  kimi: "https://api.moonshot.ai/v1",
  minimax: "https://api.minimaxi.chat/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/",
  anthropic: "https://api.anthropic.com/v1/",
};

const COMPLEXITY_RULES: Record<TaskComplexity, ModelTier> = {
  simple: "budget",
  moderate: "standard",
  complex: "premium",
  expert: "premium",
};

const TIERS_CHEAPEST_FIRST: ModelTier[] = ["budget", "standard", "premium"];

interface LLMRequest {
  model: string;
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface LLMResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  cost: number;
}

interface CostTracker {
  totalCost: number;
  byModel: Record<string, number>;
  byTier: Record<ModelTier, number>;
}

class LLMGateway {
  private clients: Map<Provider, OpenAI> = new Map();
  private costTracker: CostTracker = {
    totalCost: 0,
    byModel: {},
    byTier: { budget: 0, standard: 0, premium: 0 },
  };

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    (Object.keys(PROVIDER_ENV) as Provider[]).forEach((provider) => {
      const apiKey = process.env[PROVIDER_ENV[provider]];
      if (!apiKey) return;
      const baseURL = PROVIDER_BASE_URLS[provider];
      this.clients.set(
        provider,
        new OpenAI(baseURL ? { apiKey, baseURL } : { apiKey })
      );
    });
  }

  /** A model is usable only if its provider has an initialized client. */
  private isAvailable(modelId: string): boolean {
    const config = MODELS[modelId];
    return !!config && this.clients.has(config.provider);
  }

  private modelsInTier(tier: ModelTier, onlyAvailable: boolean): string[] {
    return Object.keys(MODELS).filter(
      (id) => MODELS[id].tier === tier && (!onlyAvailable || this.isAvailable(id))
    );
  }

  selectModel(taskComplexity: TaskComplexity, preferredTier?: ModelTier): string {
    const tier = preferredTier || COMPLEXITY_RULES[taskComplexity];

    // Prefer a configured model in the requested tier.
    const inTier = this.modelsInTier(tier, true);
    if (inTier.length > 0) {
      return inTier[Math.floor(Math.random() * inTier.length)];
    }

    // Otherwise fall back to any configured model (cheapest tier first).
    for (const t of TIERS_CHEAPEST_FIRST) {
      const available = this.modelsInTier(t, true);
      if (available.length > 0) return available[0];
    }

    throw new Error(
      "Nenhum provedor de LLM configurado. Defina ao menos uma chave de API (ex.: OPENAI_API_KEY)."
    );
  }

  estimateCost(model: string, tokens: number): number {
    const config = MODELS[model];
    if (!config) return 0;
    return (tokens / 1000) * (config.costPer1kTokens.input + config.costPer1kTokens.output);
  }

  async complete(
    request: LLMRequest,
    options?: {
      fallbackEnabled?: boolean;
      maxRetries?: number;
      onStream?: (chunk: string) => void;
    }
  ): Promise<LLMResponse> {
    const { fallbackEnabled = true, maxRetries = 3 } = options || {};
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.executeRequest(request, options?.onStream);

        this.trackCost(request.model, response.usage);

        return response;
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries && fallbackEnabled) {
          const fallbackModel = this.getFallbackModel(request.model);
          if (fallbackModel) {
            request = { ...request, model: fallbackModel };
            continue;
          }
        }
      }
    }

    throw lastError || new Error("LLM request failed after all retries");
  }

  private async executeRequest(
    request: LLMRequest,
    onStream?: (chunk: string) => void
  ): Promise<LLMResponse> {
    const config = MODELS[request.model];
    const client = this.clients.get(config?.provider ?? "openai");

    if (!client) {
      throw new Error(`No client available for model: ${request.model}`);
    }

    const response = await client.chat.completions.create({
      model: config?.apiModel ?? request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 4096,
      stream: request.stream ?? false,
    });

    if (request.stream && onStream) {
      for await (const chunk of response as AsyncIterable<any>) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          onStream(content);
        }
      }
      return {
        content: "",
        model: request.model,
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        cost: 0,
      };
    }

    const completion = response as OpenAI.Chat.ChatCompletion;
    const message = completion.choices[0]?.message;

    return {
      content: message?.content || "",
      model: request.model,
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
      cost: this.estimateCost(
        request.model,
        completion.usage?.total_tokens || 0
      ),
    };
  }

  /** Picks a different configured model in the same or a cheaper tier. */
  private getFallbackModel(model: string): string | null {
    const config = MODELS[model];
    if (!config) return null;

    const startIdx = TIERS_CHEAPEST_FIRST.indexOf(config.tier);
    for (let i = startIdx; i >= 0; i--) {
      const candidate = this.modelsInTier(TIERS_CHEAPEST_FIRST[i], true).find(
        (id) => id !== model
      );
      if (candidate) return candidate;
    }
    return null;
  }

  private trackCost(model: string, usage: LLMResponse["usage"]) {
    const config = MODELS[model];
    if (!config) return;

    const cost = this.estimateCost(model, usage.total_tokens);

    this.costTracker.totalCost += cost;
    this.costTracker.byModel[model] = (this.costTracker.byModel[model] || 0) + cost;
    this.costTracker.byTier[config.tier] += cost;
  }

  getCostSummary(): CostTracker {
    return { ...this.costTracker };
  }

  resetCostTracker() {
    this.costTracker = {
      totalCost: 0,
      byModel: {},
      byTier: { budget: 0, standard: 0, premium: 0 },
    };
  }
}

export const llmGateway = new LLMGateway();
export default llmGateway;
