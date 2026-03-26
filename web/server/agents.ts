import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface Agent {
  id: string;
  name: string;
  squad: string;
  filePath: string;
  systemPrompt: string;
}

export interface Squad {
  id: string;
  agents: Agent[];
}

function getSquadsDir(): string {
  const fromEnv = process.env.SQUADS_ROOT?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  // tsx: server/ → ../../squads (raiz do repo). Build: dist/server/ → ../../../squads
  const fromDistBundle = /[/\\]dist[/\\]server$/i.test(__dirname);
  const rel = fromDistBundle ? "../../../squads" : "../../squads";
  return path.resolve(__dirname, rel);
}

/** Extrai nome/id do agente a partir do bloco YAML no arquivo .md */
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

/** Carrega todos os agentes de todos os squads disponíveis */
export function loadAllSquads(): Squad[] {
  const squads: Squad[] = [];
  const SQUADS_DIR = getSquadsDir();

  if (!fs.existsSync(SQUADS_DIR)) return squads;

  const squadDirs = fs
    .readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const squadId of squadDirs) {
    const agentsDir = path.join(SQUADS_DIR, squadId, "agents");
    if (!fs.existsSync(agentsDir)) continue;

    const agentFiles = fs
      .readdirSync(agentsDir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    if (agentFiles.length === 0) continue;

    const agents: Agent[] = agentFiles.map((file) => {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const meta = extractAgentMeta(content, filePath);
      return {
        id: meta.id,
        name: meta.name,
        squad: squadId,
        filePath,
        systemPrompt: buildSystemPrompt(content, meta.name, squadId),
      };
    });

    squads.push({ id: squadId, agents });
  }

  return squads;
}

function buildSystemPrompt(
  agentContent: string,
  agentName: string,
  squadId: string
): string {
  return [
    `Você é o agente **${agentName}** do squad **${squadId}** do framework AIOX.`,
    "",
    "A seguir estão suas definições operacionais completas. Siga-as estritamente:",
    "",
    agentContent,
    "",
    "---",
    "",
    "## Regras de interação no chatbot",
    "",
    "- Responda sempre em português (pt-BR) a menos que o usuário escreva em outro idioma.",
    "- Se um arquivo foi enviado pelo usuário (PDF, texto, imagem), analise-o como parte do contexto.",
    "- Quando o usuário digitar `/help`, liste seus comandos disponíveis.",
    "- Quando o usuário digitar `/exit`, diga adeus e encerre a sessão.",
    "- Seja preciso, direto e siga suas heurísticas de decisão.",
  ].join("\n");
}

export function flatAgentList(squads: Squad[]): Agent[] {
  return squads.flatMap((s) => s.agents);
}

export function findAgent(
  squads: Squad[],
  squadId: string,
  agentId: string
): Agent | undefined {
  const squad = squads.find((s) => s.id === squadId);
  return squad?.agents.find((a) => a.id === agentId);
}
