import OpenAI from "openai";

export type ModelTier = "budget" | "standard" | "premium";
export type TaskComplexity = "simple" | "moderate" | "complex" | "expert";

export type Provider =
  | "openai"
  | "anthropic"
  | "deepseek"
  | "qwen"
  | "kimi"
  | "minimax"
  | "gemini"
  | "groq"
  | "openrouter"
  | "mistral"
  | "xai"
  | "custom";

interface ModelConfig {
  name: string;
  provider: Provider;
  /**
   * The model id sent to the provider API. Differs from the internal key for
   * non-OpenAI providers (e.g. "deepseek-chat", not "deepseek-v3"). Can be
   * overridden at runtime via `<PROVIDER>_MODEL` (e.g. DEEPSEEK_MODEL).
   */
  apiModel: string;
  tier: ModelTier;
  contextWindow: number;
  costPer1kTokens: { input: number; output: number };
}

export const MODELS: Record<string, ModelConfig> = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "openai",
    apiModel: "gpt-4o",
    tier: "premium",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
  },
  "gpt-4o-mini": {
    name: "GPT-4o-mini",
    provider: "openai",
    apiModel: "gpt-4o-mini",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    apiModel: "claude-3-5-sonnet-latest",
    tier: "premium",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
  },
  "claude-3-5-haiku": {
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    apiModel: "claude-3-5-haiku-latest",
    tier: "standard",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.0008, output: 0.004 },
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "deepseek",
    apiModel: "deepseek-chat",
    tier: "budget",
    contextWindow: 64000,
    costPer1kTokens: { input: 0.00007, output: 0.00027 },
  },
  "deepseek-r1": {
    name: "DeepSeek R1 (reasoner)",
    provider: "deepseek",
    apiModel: "deepseek-reasoner",
    tier: "premium",
    contextWindow: 64000,
    costPer1kTokens: { input: 0.00055, output: 0.00219 },
  },
  "mistral-large": {
    name: "Mistral Large",
    provider: "mistral",
    apiModel: "mistral-large-latest",
    tier: "premium",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.002, output: 0.006 },
  },
  "mistral-small": {
    name: "Mistral Small",
    provider: "mistral",
    apiModel: "mistral-small-latest",
    tier: "budget",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.0002, output: 0.0006 },
  },
  "grok-3": {
    name: "Grok 3 (xAI)",
    provider: "xai",
    apiModel: "grok-3",
    tier: "premium",
    contextWindow: 131072,
    costPer1kTokens: { input: 0.003, output: 0.015 },
  },
  "grok-3-mini": {
    name: "Grok 3 Mini (xAI)",
    provider: "xai",
    apiModel: "grok-3-mini",
    tier: "standard",
    contextWindow: 131072,
    costPer1kTokens: { input: 0.0003, output: 0.0005 },
  },
  "qwen-2.5": {
    name: "Qwen 2.5",
    provider: "qwen",
    apiModel: "qwen-plus",
    tier: "budget",
    contextWindow: 32000,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
  },
  "kimi-k2": {
    name: "Kimi K2",
    provider: "kimi",
    apiModel: "moonshot-v1-128k",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.001, output: 0.004 },
  },
  "minimax-01": {
    name: "MiniMax 01",
    provider: "minimax",
    apiModel: "MiniMax-Text-01",
    tier: "budget",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.0001, output: 0.0005 },
  },
  "gemini-2.0-flash": {
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    apiModel: "gemini-2.0-flash",
    tier: "standard",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.0001, output: 0.0004 },
  },
  "gemini-2.0-pro": {
    name: "Gemini 2.0 Pro",
    provider: "gemini",
    apiModel: "gemini-2.0-pro-exp",
    tier: "premium",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.00125, output: 0.005 },
  },
  "groq-llama-3.3-70b": {
    name: "Llama 3.3 70B (Groq)",
    provider: "groq",
    apiModel: "llama-3.3-70b-versatile",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00059, output: 0.00079 },
  },
  "groq-llama-3.1-8b": {
    name: "Llama 3.1 8B (Groq)",
    provider: "groq",
    apiModel: "llama-3.1-8b-instant",
    tier: "budget",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00005, output: 0.00008 },
  },
  "groq-gemma2-9b": {
    name: "Gemma 2 9B (Groq)",
    provider: "groq",
    apiModel: "gemma2-9b-it",
    tier: "budget",
    contextWindow: 8192,
    costPer1kTokens: { input: 0.0002, output: 0.0002 },
  },
  "openrouter-auto": {
    name: "OpenRouter (configurável)",
    provider: "openrouter",
    apiModel: "meta-llama/llama-3.3-70b-instruct",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.0001, output: 0.0003 },
  },
  // Generic OpenAI-compatible provider. Point CUSTOM_BASE_URL + CUSTOM_API_KEY
  // at ANY compatible endpoint (Together, Fireworks, Cerebras, Ollama, vLLM,
  // LM Studio, ...) and set the model via CUSTOM_MODEL. Tier via CUSTOM_TIER.
  custom: {
    name: "Custom (OpenAI-compatible)",
    provider: "custom",
    apiModel: "",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0, output: 0 },
  },
};

const COMPLEXITY_RULES: Record<TaskComplexity, ModelTier> = {
  simple: "budget",
  moderate: "standard",
  complex: "premium",
  expert: "premium",
};

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
  private clients: Map<string, OpenAI> = new Map();
  private costTracker: CostTracker = {
    totalCost: 0,
    byModel: {},
    byTier: { budget: 0, standard: 0, premium: 0 },
  };

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    // OpenAI is the default provider. The remaining providers expose
    // OpenAI-compatible APIs and are only initialized when an API key (and a
    // base URL, when not built-in) is configured, so we never select a model we
    // cannot call. To switch providers, just set the corresponding API key.
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.clients.set("openai", new OpenAI({ apiKey: openaiKey }));
    }

    // Providers with a well-known default base URL (overridable via *_BASE_URL).
    const knownBaseURLs: Partial<Record<Provider, string>> = {
      deepseek: "https://api.deepseek.com",
      groq: "https://api.groq.com/openai/v1",
      openrouter: "https://openrouter.ai/api/v1",
      gemini: "https://generativelanguage.googleapis.com/v1beta/openai/",
      kimi: "https://api.moonshot.cn/v1",
      qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      mistral: "https://api.mistral.ai/v1",
      minimax: "https://api.minimax.chat/v1",
      xai: "https://api.x.ai/v1",
    };

    // "custom" has no default base URL — it must be provided. It lets users
    // plug ANY OpenAI-compatible endpoint (Together, Fireworks, Cerebras,
    // Ollama, vLLM, ...) without code changes.
    const compatibleProviders: Provider[] = [
      "deepseek",
      "qwen",
      "kimi",
      "minimax",
      "gemini",
      "groq",
      "openrouter",
      "mistral",
      "xai",
      "custom",
    ];

    for (const provider of compatibleProviders) {
      const upper = provider.toUpperCase();
      const key = process.env[`${upper}_API_KEY`];
      const baseURL = process.env[`${upper}_BASE_URL`] || knownBaseURLs[provider];
      if (key && baseURL) {
        this.clients.set(provider, new OpenAI({ apiKey: key, baseURL }));
      }
    }
  }

  /**
   * Resolves the model id to send to the provider API. Honors a per-provider
   * env override (`<PROVIDER>_MODEL`), then the config's `apiModel`, then the
   * internal id as a last resort.
   */
  private resolveApiModel(modelId: string): string {
    const provider = MODELS[modelId]?.provider;
    if (provider) {
      const override = process.env[`${provider.toUpperCase()}_MODEL`];
      if (override) return override;
    }
    return MODELS[modelId]?.apiModel ?? modelId;
  }

  /** True when at least one LLM provider client is available. */
  isConfigured(): boolean {
    return this.clients.size > 0;
  }

  private isModelAvailable(modelId: string): boolean {
    const provider = MODELS[modelId]?.provider;
    return provider ? this.clients.has(provider) : false;
  }

  /** Effective tier for a model (the custom provider honors CUSTOM_TIER). */
  private modelTier(modelId: string): ModelTier {
    if (MODELS[modelId]?.provider === "custom") {
      const t = process.env.CUSTOM_TIER;
      if (t === "budget" || t === "standard" || t === "premium") return t;
    }
    return MODELS[modelId]?.tier ?? "standard";
  }

  selectModel(taskComplexity: TaskComplexity, preferredTier?: ModelTier): string {
    const tier = preferredTier || COMPLEXITY_RULES[taskComplexity];

    // Prefer an available model in the requested tier, then any available
    // model, falling back to gpt-4o-mini (callers guard with isConfigured()).
    const inTier = Object.keys(MODELS).filter(
      (id) => this.modelTier(id) === tier && this.isModelAvailable(id)
    );
    if (inTier.length > 0) {
      return inTier[Math.floor(Math.random() * inTier.length)];
    }

    const anyAvailable = Object.keys(MODELS).filter((id) =>
      this.isModelAvailable(id)
    );
    if (anyAvailable.length > 0) {
      return anyAvailable[Math.floor(Math.random() * anyAvailable.length)];
    }

    return "gpt-4o-mini";
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
    const client = this.clients.get(MODELS[request.model]?.provider || "openai");
    
    if (!client) {
      throw new Error(`No client available for model: ${request.model}`);
    }

    const response = await client.chat.completions.create({
      model: this.resolveApiModel(request.model),
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

  private getFallbackModel(model: string): string | null {
    // Fall back to a different available model, if any.
    const candidate = Object.keys(MODELS).find(
      (id) => id !== model && this.isModelAvailable(id)
    );
    return candidate ?? null;
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
