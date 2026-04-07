import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Cached bundle for Cloudflare Workers (no fs access) */
let _bundleCache: Squad[] | null = null;

interface BundledAgent {
  id: string;
  name: string;
  content: string;
}
interface BundledSquad {
  id: string;
  meta: SquadMeta;
  agents: BundledAgent[];
}

/** Try to load from squads-bundle.json (used in Workers deploy) */
function tryLoadFromBundle(): Squad[] | null {
  if (_bundleCache) return _bundleCache;
  try {
    const bundlePath = path.resolve(__dirname, "../squads-bundle.json");
    if (!fs.existsSync(bundlePath)) return null;
    const raw = JSON.parse(fs.readFileSync(bundlePath, "utf-8")) as BundledSquad[];
    _bundleCache = raw.map((s) => ({
      id: s.id,
      meta: s.meta,
      agents: s.agents.map((a) => ({
        id: a.id,
        name: a.name,
        squad: s.id,
        filePath: `bundled:${s.id}/${a.id}`,
        systemPrompt: buildSystemPrompt(a.content, a.name, s.id),
      })),
    }));
    return _bundleCache;
  } catch {
    return null;
  }
}

export interface Agent {
  id: string;
  name: string;
  squad: string;
  filePath: string;
  systemPrompt: string;
}

export interface SquadMeta {
  icon: string;
  title: string;
  description: string;
}

export interface Squad {
  id: string;
  meta: SquadMeta;
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

/** Extrai metadados do squad a partir de config.yaml */
function loadSquadMeta(squadDir: string, squadId: string): SquadMeta {
  const configPath = path.join(squadDir, "config.yaml");
  const fallback: SquadMeta = { icon: "📦", title: squadId, description: "" };
  if (!fs.existsSync(configPath)) return fallback;
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const iconMatch = raw.match(/^\s*icon:\s*"?([^\n"]+)"?\s*$/m);
    const titleMatch = raw.match(/^\s*title:\s*"?([^\n"]+)"?\s*$/m);
    const descMatch = raw.match(/^\s*description:\s*"?([^\n"]+)"?\s*$/m);
    return {
      icon: iconMatch ? iconMatch[1].trim() : fallback.icon,
      title: titleMatch ? titleMatch[1].trim() : fallback.title,
      description: descMatch ? descMatch[1].trim() : fallback.description,
    };
  } catch {
    return fallback;
  }
}

/** Carrega todos os agentes de todos os squads disponíveis */
export function loadAllSquads(): Squad[] {
  // Try bundle first (Cloudflare Workers deploy)
  const fromBundle = tryLoadFromBundle();
  if (fromBundle) return fromBundle;

  const squads: Squad[] = [];
  const SQUADS_DIR = getSquadsDir();

  if (!fs.existsSync(SQUADS_DIR)) return squads;

  const squadDirs = fs
    .readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const squadId of squadDirs) {
    const squadPath = path.join(SQUADS_DIR, squadId);
    const agentsDir = path.join(squadPath, "agents");
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

    squads.push({ id: squadId, meta: loadSquadMeta(squadPath, squadId), agents });
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
