import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  "README.md",
  ".env.example",
  "docker-compose.yml",
  "web/package.json",
  "chatbot/package.json",
  "analista-processual-web/package.json",
  "analista-processual-web/prisma/schema.prisma",
];

const errors = [];
for (const file of required) {
  try {
    await access(path.join(root, file));
  } catch {
    errors.push(`Arquivo obrigatório ausente: ${file}`);
  }
}

const squadsRoot = path.join(root, "squads");
const entries = await readdir(squadsRoot, { withFileTypes: true });
const squads = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => entry.name);
let configs = 0;
for (const squad of squads) {
  const configPath = path.join(squadsRoot, squad, "config.yaml");
  try {
    const config = await readFile(configPath, "utf8");
    if (!config.trim()) errors.push(`Configuração vazia: squads/${squad}/config.yaml`);
    configs += 1;
  } catch {
    // Alguns pacotes são aplicações ou ferramentas auxiliares e não squads declarativos.
  }
}

if (configs === 0) errors.push("Nenhum squad declarativo com config.yaml foi encontrado.");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Repositório válido: ${squads.length} diretórios em squads/, ${configs} configurações declarativas.`);
