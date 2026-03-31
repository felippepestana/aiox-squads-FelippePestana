/**
 * Tool definitions and execution for AIOX squad agents.
 *
 * Agents declare tools in their config.yaml (WebSearch, Read, Write, Glob, Grep).
 * This module provides:
 * 1. Anthropic tool schemas to pass in API calls
 * 2. Server-side execution handlers for each tool
 */

import type Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const WORKSPACE =
  process.env.AIOX_WORKSPACE ?? path.resolve(process.cwd(), "workspace");

// Ensure workspace exists
if (!fs.existsSync(WORKSPACE)) {
  fs.mkdirSync(WORKSPACE, { recursive: true });
}

// --- Tool Schemas (sent to Anthropic API) ---

export const toolSchemas: Anthropic.Tool[] = [
  {
    name: "Read",
    description:
      "Read the contents of a file. Returns the text content. Use for reading uploaded documents, reports, or any text file in the workspace.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_path: {
          type: "string",
          description:
            "Path to the file to read, relative to the workspace directory.",
        },
      },
      required: ["file_path"],
    },
  },
  {
    name: "Write",
    description:
      "Write content to a file in the workspace. Creates the file if it does not exist, overwrites if it does. Use for saving reports, analysis results, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_path: {
          type: "string",
          description: "Path to the file to write, relative to the workspace.",
        },
        content: {
          type: "string",
          description: "The text content to write to the file.",
        },
      },
      required: ["file_path", "content"],
    },
  },
  {
    name: "Glob",
    description:
      "List files in the workspace matching a glob pattern. Returns a list of file paths.",
    input_schema: {
      type: "object" as const,
      properties: {
        pattern: {
          type: "string",
          description:
            'Glob pattern to match files (e.g. "*.md", "reports/**/*.pdf").',
        },
      },
      required: ["pattern"],
    },
  },
  {
    name: "Grep",
    description:
      "Search for a text pattern in files within the workspace. Returns matching lines with file paths and line numbers.",
    input_schema: {
      type: "object" as const,
      properties: {
        pattern: {
          type: "string",
          description: "Text or regex pattern to search for.",
        },
        glob: {
          type: "string",
          description:
            'Optional glob to filter files (e.g. "*.md"). Default: all files.',
        },
      },
      required: ["pattern"],
    },
  },
  {
    name: "WebSearch",
    description:
      "Search the web for information. Returns a summary of search results. Useful for finding jurisprudence, legislation, legal doctrine, and current information.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The search query string.",
        },
      },
      required: ["query"],
    },
  },
];

// --- Tool Execution ---

function safePath(filePath: string): string {
  const resolved = path.resolve(WORKSPACE, filePath);
  if (!resolved.startsWith(WORKSPACE)) {
    throw new Error("Path traversal not allowed");
  }
  return resolved;
}

function executeRead(input: { file_path: string }): string {
  const fullPath = safePath(input.file_path);
  if (!fs.existsSync(fullPath)) {
    return `Error: File not found: ${input.file_path}`;
  }
  const stat = fs.statSync(fullPath);
  if (stat.size > 1024 * 1024) {
    return `Error: File too large (${(stat.size / 1024 / 1024).toFixed(1)}MB). Max 1MB.`;
  }
  return fs.readFileSync(fullPath, "utf-8");
}

function executeWrite(input: { file_path: string; content: string }): string {
  const fullPath = safePath(input.file_path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, input.content, "utf-8");
  return `File written successfully: ${input.file_path} (${input.content.length} chars)`;
}

function executeGlob(input: { pattern: string }): string {
  // Simple glob implementation using fs
  const results: string[] = [];

  function walk(dir: string, base: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(base, entry.name);
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else {
        if (matchGlob(rel, input.pattern)) {
          results.push(rel);
        }
      }
    }
  }

  walk(WORKSPACE, "");
  if (results.length === 0) return "No files found matching pattern.";
  return results.slice(0, 100).join("\n");
}

function matchGlob(filePath: string, pattern: string): boolean {
  const regex = pattern
    .replace(/\./g, "\\.")
    .replace(/\*\*/g, "<<GLOBSTAR>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<GLOBSTAR>>/g, ".*");
  return new RegExp(`^${regex}$`).test(filePath);
}

function executeGrep(input: { pattern: string; glob?: string }): string {
  const results: string[] = [];
  const regex = new RegExp(input.pattern, "gi");

  function search(dir: string, base: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(base, entry.name);
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        search(full, rel);
        continue;
      }
      if (input.glob && !matchGlob(rel, input.glob)) continue;
      try {
        const content = fs.readFileSync(full, "utf-8");
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (regex.test(lines[i])) {
            results.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
            if (results.length >= 50) return;
          }
          regex.lastIndex = 0;
        }
      } catch {
        // skip binary/unreadable files
      }
    }
  }

  search(WORKSPACE, "");
  if (results.length === 0) return "No matches found.";
  return results.join("\n");
}

function executeWebSearch(input: { query: string }): string {
  // WebSearch is a placeholder — in production, integrate with a search API
  // For now, return a message indicating the search was requested
  return (
    `[WebSearch requested: "${input.query}"]\n\n` +
    `Note: WebSearch tool execution requires an external search API integration. ` +
    `The agent should provide analysis based on its training knowledge. ` +
    `For production use, integrate with Google Custom Search, Bing API, or similar.`
  );
}

// --- Main executor ---

export function executeTool(
  name: string,
  input: Record<string, unknown>
): string {
  switch (name) {
    case "Read":
      return executeRead(input as { file_path: string });
    case "Write":
      return executeWrite(input as { file_path: string; content: string });
    case "Glob":
      return executeGlob(input as { pattern: string });
    case "Grep":
      return executeGrep(input as { pattern: string; glob?: string });
    case "WebSearch":
      return executeWebSearch(input as { query: string });
    default:
      return `Error: Unknown tool "${name}"`;
  }
}

/** Filter tool schemas to only those needed by a specific agent */
export function toolsForAgent(agentToolNames: string[]): Anthropic.Tool[] {
  if (!agentToolNames.length) return [];
  return toolSchemas.filter((t) => agentToolNames.includes(t.name));
}
