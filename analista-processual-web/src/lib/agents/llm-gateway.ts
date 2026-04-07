import OpenAI from "openai";

export type ModelTier = "budget" | "standard" | "premium";
export type TaskComplexity = "simple" | "moderate" | "complex" | "expert";

interface ModelConfig {
  name: string;
  provider: "openai" | "anthropic" | "deepseek" | "qwen" | "kimi" | "minimax" | "gemini";
  tier: ModelTier;
  contextWindow: number;
  costPer1kTokens: { input: number; output: number };
}

export const MODELS: Record<string, ModelConfig> = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "openai",
    tier: "premium",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
  },
  "gpt-4o-mini": {
    name: "GPT-4o-mini",
    provider: "openai",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    tier: "premium",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
  },
  "claude-3-5-haiku": {
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    tier: "standard",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.0008, output: 0.004 },
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "deepseek",
    tier: "budget",
    contextWindow: 64000,
    costPer1kTokens: { input: 0.00007, output: 0.00027 },
  },
  "qwen-2.5": {
    name: "Qwen 2.5",
    provider: "qwen",
    tier: "budget",
    contextWindow: 32000,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
  },
  "kimi-k2": {
    name: "Kimi K2",
    provider: "kimi",
    tier: "standard",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.001, output: 0.004 },
  },
  "minimax-01": {
    name: "MiniMax 01",
    provider: "minimax",
    tier: "budget",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.0001, output: 0.0005 },
  },
  "gemini-2.0-pro": {
    name: "Gemini 2.0 Pro",
    provider: "gemini",
    tier: "premium",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.00125, output: 0.005 },
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
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY,
      qwen: process.env.QWEN_API_KEY,
      kimi: process.env.KIMI_API_KEY,
      minimax: process.env.MINIMAX_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
    };

    if (apiKeys.openai) {
      this.clients.set("openai", new OpenAI({ apiKey: apiKeys.openai }));
    }
  }

  selectModel(taskComplexity: TaskComplexity, preferredTier?: ModelTier): string {
    const tier = preferredTier || COMPLEXITY_RULES[taskComplexity];
    
    const modelsInTier = Object.entries(MODELS)
      .filter(([_, config]) => config.tier === tier)
      .map(([id, _]) => id);

    if (modelsInTier.length === 0) {
      return "gpt-4o-mini";
    }

    return modelsInTier[Math.floor(Math.random() * modelsInTier.length)];
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
      model: request.model,
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
    const config = MODELS[model];
    if (!config) return null;

    if (config.tier === "premium") {
      return "gpt-4o-mini";
    }
    if (config.tier === "standard") {
      return "deepseek-v3";
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
