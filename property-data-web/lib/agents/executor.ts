import { USE_CASE_AGENTS, type PipelineEvent, type UseCase } from "@/types/analysis";
import type { LLMGatewayConfig } from "@/types/llm";
import type { PropertyFormData } from "@/types/property";

import { loadPropertyDataAgents, type Agent } from "@/lib/agents/loader";
import { selectModel, callLLM } from "@/lib/llm/gateway";

export interface PropertyData extends PropertyFormData {
  id?: string;
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  content?: string;
  url?: string;
}

/**
 * Builds context text from property data and documents for injection into prompts.
 */
function buildPropertyContext(
  propertyData: PropertyData,
  documents: DocumentData[]
): string {
  const lines: string[] = [
    "## Dados do Imovel",
    "",
    `- **Endereco:** ${propertyData.address}, ${propertyData.number}`,
    `- **Bairro:** ${propertyData.neighborhood}`,
    `- **Cidade/UF:** ${propertyData.city} - ${propertyData.state}`,
    `- **CEP:** ${propertyData.cep}`,
    `- **Tipo:** ${propertyData.type}`,
  ];

  if (propertyData.area) {
    lines.push(`- **Area:** ${propertyData.area} m2`);
  }
  if (propertyData.matricula) {
    lines.push(`- **Matricula:** ${propertyData.matricula}`);
  }
  if (propertyData.inscricao) {
    lines.push(`- **Inscricao Municipal:** ${propertyData.inscricao}`);
  }

  if (documents.length > 0) {
    lines.push("", "## Documentos Enviados", "");
    for (const doc of documents) {
      lines.push(`### ${doc.name} (${doc.type})`);
      if (doc.content) {
        lines.push("", doc.content, "");
      }
    }
  }

  return lines.join("\n");
}

/**
 * Executes the analysis pipeline as an async generator, streaming events
 * for each agent's execution.
 *
 * Steps:
 * 1. Select agents based on the use case
 * 2. Always append "relator-imobiliario" at the end
 * 3. For each agent: stream LLM output, yielding events
 * 4. Yield pipeline:done at the end
 */
export async function* executePipeline(
  propertyData: PropertyData,
  documents: DocumentData[],
  useCase: string,
  llmConfig: LLMGatewayConfig
): AsyncGenerator<PipelineEvent> {
  const allAgents = loadPropertyDataAgents();
  const agentMap = new Map<string, Agent>(allAgents.map((a) => [a.id, a]));

  // Determine which agent IDs to run
  const ucKey = useCase as UseCase;
  const agentIds = [...(USE_CASE_AGENTS[ucKey] ?? [])];

  // Always add relator-imobiliario at the end if not already included
  if (!agentIds.includes("relator-imobiliario")) {
    agentIds.push("relator-imobiliario");
  }

  const propertyContext = buildPropertyContext(propertyData, documents);
  const previousOutputs: Map<string, string> = new Map();

  for (const agentId of agentIds) {
    const agent = agentMap.get(agentId);
    if (!agent) {
      yield {
        type: "agent:error",
        agentId,
        message: `Agent "${agentId}" not found in loaded agents`,
      };
      continue;
    }

    yield {
      type: "agent:start",
      agentId: agent.id,
      agentName: agent.name,
    };

    try {
      const selected = selectModel(agentId, llmConfig);

      // Build user message with property context and any previous agent outputs
      const contextParts = [propertyContext];
      if (previousOutputs.size > 0) {
        contextParts.push("", "## Analises Anteriores", "");
        for (const [prevId, prevOutput] of previousOutputs) {
          contextParts.push(`### ${prevId}`, "", prevOutput, "");
        }
      }

      const userMessage = contextParts.join("\n");
      let fullOutput = "";

      const stream = callLLM({
        provider: selected.provider,
        model: selected.model,
        apiKey: selected.apiKey,
        systemPrompt: agent.systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        maxTokens: selected.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        fullOutput += chunk;
        yield {
          type: "agent:chunk",
          agentId: agent.id,
          agentName: agent.name,
          text: chunk,
        };
      }

      previousOutputs.set(agentId, fullOutput);

      yield {
        type: "agent:done",
        agentId: agent.id,
        agentName: agent.name,
        model: selected.model,
        status: "done",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      yield {
        type: "agent:error",
        agentId: agent.id,
        agentName: agent.name,
        message,
        status: "error",
      };
    }
  }

  yield { type: "pipeline:done" };
}
