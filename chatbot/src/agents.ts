import fs from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";

export interface Agent {
  id: string;
  name: string;
  squad: string;
  filePath: string;
  systemPrompt: string;
}

/** Metadados públicos do squad (manifest YAML), alinhados com web/server/agents. */
export interface SquadMeta {
  id: string;
  name: string;
  title?: string;
  description?: string;
  version?: string;
  status?: string;
}

export interface Squad {
  id: string;
  meta: SquadMeta;
  agents: Agent[];
}

function getSquadsDir(): string {
  const fromEnv = process.env.SQUADS_ROOT?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.resolve(__dirname, "../../squads");
}

/** Rótulo amigável para UI (title → name → id). */
export function squadDisplayLabel(s: Squad): string {
  const t = s.meta.title?.trim();
  if (t) return t;
  const n = s.meta.name?.trim();
  if (n) return n;
  return s.id;
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

function defaultMeta(squadId: string): SquadMeta {
  return { id: squadId, name: squadId };
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function resolveSquadManifestPath(squadDir: string): string | null {
  const candidates = [
    path.join(squadDir, "squad.yaml"),
    path.join(squadDir, "squad.yml"),
    path.join(squadDir, "config", "squad-config.yaml"),
    path.join(squadDir, "config", "squad-config.yml"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function extractMetaFromYamlRoot(
  root: Record<string, unknown>,
  squadId: string
): SquadMeta {
  let src = root;
  const nested = root["squad_config"];
  const nestedRec = asRecord(nested);
  if (nestedRec) src = nestedRec;

  const name =
    typeof src["name"] === "string" && src["name"].trim()
      ? (src["name"] as string).trim()
      : squadId;
  const title =
    typeof src["title"] === "string" && src["title"].trim()
      ? (src["title"] as string).trim()
      : undefined;
  const status =
    typeof src["status"] === "string" && src["status"].trim()
      ? (src["status"] as string).trim()
      : undefined;
  let description: string | undefined;
  if (typeof src["description"] === "string") {
    const d = (src["description"] as string).trim();
    if (d) description = d;
  }
  let version: string | undefined;
  if (src["version"] !== undefined && src["version"] !== null) {
    const v = String(src["version"]).trim();
    if (v) version = v;
  }

  return {
    id: squadId,
    name,
    title,
    description,
    version,
    status,
  };
}

function loadSquadMeta(squadDir: string, squadId: string): SquadMeta {
  const manifest = resolveSquadManifestPath(squadDir);
  if (!manifest) return defaultMeta(squadId);
  try {
    const raw = fs.readFileSync(manifest, "utf-8");
    const doc = parseYaml(raw);
    const root = asRecord(doc);
    if (!root) return defaultMeta(squadId);
    return extractMetaFromYamlRoot(root, squadId);
  } catch {
    return defaultMeta(squadId);
  }
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

    const meta = loadSquadMeta(path.join(SQUADS_DIR, squadId), squadId);
    squads.push({ id: squadId, meta, agents });
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
