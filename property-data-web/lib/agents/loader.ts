import fs from "fs";
import path from "path";

export interface Agent {
  id: string;
  name: string;
  filePath: string;
  systemPrompt: string;
}

/**
 * Resolves the root path for the squads directory.
 */
function getSquadsRoot(): string {
  if (process.env.SQUADS_ROOT) {
    return path.resolve(process.env.SQUADS_ROOT);
  }
  return path.resolve(process.cwd(), "../squads");
}

/**
 * Extracts agent name and id from YAML front-matter in the .md file.
 */
function extractAgentMeta(
  content: string,
  filePath: string
): { name: string; id: string } {
  const nameMatch = content.match(/^\s*name:\s+(.+)$/m);
  const idMatch = content.match(/^\s*id:\s+(.+)$/m);
  const filename = path.basename(filePath, ".md");
  return {
    name: nameMatch ? nameMatch[1].trim() : filename,
    id: idMatch ? idMatch[1].trim() : filename,
  };
}

/**
 * Wraps raw agent markdown content with system prompt instructions.
 */
export function buildSystemPrompt(content: string, agentName: string): string {
  return [
    `Voce e o agente **${agentName}** do squad **property-data** do framework AIOX.`,
    "",
    "A seguir estao suas definicoes operacionais completas. Siga-as estritamente:",
    "",
    content,
    "",
    "---",
    "",
    "## Regras de interacao",
    "",
    "- Responda sempre em portugues (pt-BR) a menos que o usuario escreva em outro idioma.",
    "- Se um arquivo foi enviado pelo usuario (PDF, texto, imagem), analise-o como parte do contexto.",
    "- Seja preciso, direto e siga suas heuristicas de decisao.",
    "- Estruture a saida em Markdown quando apropriado.",
  ].join("\n");
}

/**
 * Loads all agents from the property-data squad directory.
 * Reads squads/property-data/agents/*.md files and returns structured agent data.
 */
export function loadPropertyDataAgents(): Agent[] {
  const squadsRoot = getSquadsRoot();
  const agentsDir = path.join(squadsRoot, "property-data", "agents");

  if (!fs.existsSync(agentsDir)) {
    console.warn(
      `[loader] Agents directory not found: ${agentsDir}. Returning empty list.`
    );
    return [];
  }

  const mdFiles = fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return mdFiles.map((file) => {
    const filePath = path.join(agentsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const meta = extractAgentMeta(content, filePath);

    return {
      id: meta.id,
      name: meta.name,
      filePath,
      systemPrompt: buildSystemPrompt(content, meta.name),
    };
  });
}
