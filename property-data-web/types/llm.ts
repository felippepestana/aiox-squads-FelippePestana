export type LLMProvider = "anthropic" | "openai" | "gemini" | "deepseek";
export type ComplexityTier = "simple" | "standard" | "premium";

export interface LLMProviderConfig {
  provider: LLMProvider;
  model: string;
  maxTokens: number;
  supportsMultimodal: boolean;
}

export interface LLMGatewayConfig {
  userKeys: Partial<Record<LLMProvider, string>>;
  systemKeys: Partial<Record<LLMProvider, string>>;
  preferredProvider?: LLMProvider;
}

export const AGENT_COMPLEXITY: Record<string, ComplexityTier> = {
  "property-data-chief": "simple",
  "leitor-documental": "premium",
  "pesquisador-registral": "standard",
  "analista-legislativo": "standard",
  "analista-urbanistico": "standard",
  "analista-visual": "premium",
  "avaliador-imovel": "premium",
  "analista-ambiental": "standard",
  "analista-condominial": "simple",
  "relator-imobiliario": "premium",
};

export const TIER_MODELS: Record<ComplexityTier, LLMProviderConfig[]> = {
  simple: [
    { provider: "anthropic", model: "claude-haiku-4-5-20251001", maxTokens: 4096, supportsMultimodal: false },
    { provider: "openai", model: "gpt-4o-mini", maxTokens: 4096, supportsMultimodal: false },
    { provider: "deepseek", model: "deepseek-chat", maxTokens: 4096, supportsMultimodal: false },
  ],
  standard: [
    { provider: "anthropic", model: "claude-sonnet-4-6", maxTokens: 8192, supportsMultimodal: true },
    { provider: "openai", model: "gpt-4o", maxTokens: 8192, supportsMultimodal: true },
    { provider: "gemini", model: "gemini-2.0-flash", maxTokens: 8192, supportsMultimodal: true },
  ],
  premium: [
    { provider: "anthropic", model: "claude-opus-4-6", maxTokens: 8192, supportsMultimodal: true },
    { provider: "openai", model: "gpt-4o", maxTokens: 8192, supportsMultimodal: true },
    { provider: "gemini", model: "gemini-2.0-pro", maxTokens: 8192, supportsMultimodal: true },
  ],
};
