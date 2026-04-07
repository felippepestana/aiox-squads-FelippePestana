/**
 * Build-time script: bundles all squad agent data into a JSON file
 * so the Cloudflare Worker can load agents without filesystem access.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQUADS_DIR = path.resolve(__dirname, "../../squads");
const OUT = path.resolve(__dirname, "../dist/squads-bundle.json");

function extractMeta(content, filePath) {
  const nameMatch = content.match(/^\s*name:\s+(.+)$/m);
  const idMatch = content.match(/^\s*id:\s+(.+)$/m);
  const filename = path.basename(filePath, ".md");
  return {
    name: nameMatch ? nameMatch[1].trim() : filename,
    id: idMatch ? idMatch[1].trim() : filename,
  };
}

function loadSquadMeta(squadDir, squadId) {
  const configPath = path.join(squadDir, "config.yaml");
  const fallback = { icon: "📦", title: squadId, description: "" };
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

const bundle = [];

if (fs.existsSync(SQUADS_DIR)) {
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

    const agents = agentFiles.map((file) => {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const meta = extractMeta(content, filePath);
      return { id: meta.id, name: meta.name, content };
    });

    bundle.push({
      id: squadId,
      meta: loadSquadMeta(squadPath, squadId),
      agents,
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(bundle));
console.log(`Bundled ${bundle.length} squads → ${OUT}`);
