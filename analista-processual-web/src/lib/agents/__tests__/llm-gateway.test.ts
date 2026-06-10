/**
 * @jest-environment node
 */
const PROVIDER_KEYS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "DEEPSEEK_API_KEY",
  "QWEN_API_KEY",
  "KIMI_API_KEY",
  "MINIMAX_API_KEY",
  "GEMINI_API_KEY",
];

// Re-imports the gateway singleton with a controlled set of provider keys,
// since clients are initialized once from process.env at construction time.
function loadGateway(env: Record<string, string>) {
  jest.resetModules();
  for (const key of PROVIDER_KEYS) delete process.env[key];
  Object.assign(process.env, env);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/agents/llm-gateway") as typeof import("@/lib/agents/llm-gateway");
}

describe("LLM gateway — provider-aware routing", () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    // Restore env in place so module-held references stay valid.
    for (const key of Object.keys(process.env)) {
      if (!(key in ORIGINAL_ENV)) delete process.env[key];
    }
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("routes a budget task to an available provider instead of failing", () => {
    // budget tier has no OpenAI model; with only OpenAI configured it must
    // fall back to an available model rather than pick an unconfigured one.
    const { llmGateway, MODELS } = loadGateway({ OPENAI_API_KEY: "test" });
    const id = llmGateway.selectModel("simple");
    expect(MODELS[id].provider).toBe("openai");
  });

  it("routes moderate to gpt-4o-mini when only OpenAI is configured", () => {
    const { llmGateway } = loadGateway({ OPENAI_API_KEY: "test" });
    expect(llmGateway.selectModel("moderate")).toBe("gpt-4o-mini");
  });

  it("routes complex to gpt-4o when only OpenAI is configured", () => {
    const { llmGateway } = loadGateway({ OPENAI_API_KEY: "test" });
    expect(llmGateway.selectModel("complex")).toBe("gpt-4o");
  });

  it("uses a non-OpenAI provider when it is the only one configured", () => {
    const { llmGateway } = loadGateway({ DEEPSEEK_API_KEY: "test" });
    expect(llmGateway.selectModel("simple")).toBe("deepseek-v3");
  });

  it("never selects a model whose provider has no client", () => {
    const { llmGateway, MODELS } = loadGateway({ OPENAI_API_KEY: "test" });
    for (const complexity of ["simple", "moderate", "complex", "expert"] as const) {
      const id = llmGateway.selectModel(complexity);
      expect(MODELS[id].provider).toBe("openai");
    }
  });

  it("throws a clear error when no provider is configured", () => {
    const { llmGateway } = loadGateway({});
    expect(() => llmGateway.selectModel("simple")).toThrow(/Nenhum provedor/);
  });

  it("estimateCost applies the model's input+output rates", () => {
    const { llmGateway } = loadGateway({ OPENAI_API_KEY: "test" });
    // gpt-4o-mini: (0.00015 + 0.0006) per 1k tokens
    expect(llmGateway.estimateCost("gpt-4o-mini", 1000)).toBeCloseTo(0.00075, 6);
    expect(llmGateway.estimateCost("unknown-model", 1000)).toBe(0);
  });
});

describe("MODELS config integrity", () => {
  it("every model declares an apiModel and a valid tier", () => {
    const { MODELS } = loadGateway({ OPENAI_API_KEY: "test" });
    const validTiers = ["budget", "standard", "premium"];
    for (const config of Object.values(MODELS)) {
      expect(typeof config.apiModel).toBe("string");
      expect(config.apiModel.length).toBeGreaterThan(0);
      expect(validTiers).toContain(config.tier);
    }
  });
});
