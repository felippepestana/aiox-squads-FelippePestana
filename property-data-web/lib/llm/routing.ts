import {
  AGENT_COMPLEXITY,
  TIER_MODELS,
  type ComplexityTier,
  type LLMProvider,
  type LLMProviderConfig,
} from "@/types/llm";

/**
 * Returns the complexity tier for a given agent ID.
 * Defaults to "standard" if the agent is not mapped.
 */
export function getAgentComplexity(agentId: string): ComplexityTier {
  return AGENT_COMPLEXITY[agentId] ?? "standard";
}

/**
 * Returns the list of model configurations available for a given complexity tier,
 * filtered to only include providers the caller has keys for.
 */
export function getAvailableModels(
  tier: ComplexityTier,
  availableProviders: LLMProvider[]
): LLMProviderConfig[] {
  const providerSet = new Set(availableProviders);
  return TIER_MODELS[tier].filter((config) => providerSet.has(config.provider));
}
