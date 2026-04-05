import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer(
  { name: "aiox-local-mcp", version: "0.1.0" },
  {
    instructions:
      "Servidor MCP de exemplo neste repositório. Oferece ferramenta echo, recurso de metadados e um prompt simples para testar integrações (Cursor, Inspector, clientes MCP).",
  }
);

server.registerTool(
  "echo",
  {
    description: "Devolve o texto recebido. Útil para validar stdio e permissões do cliente.",
    inputSchema: { message: z.string().describe("Texto a devolver") },
  },
  async ({ message }) => ({
    content: [{ type: "text", text: message }],
  })
);

server.registerTool(
  "repo_ping",
  {
    description: "Confirma que o servidor MCP local está ativo e informa o repositório.",
    inputSchema: {},
  },
  async () => ({
    content: [
      {
        type: "text",
        text: "MCP local aiox-squads: servidor stdio OK (TypeScript SDK @modelcontextprotocol/sdk).",
      },
    ],
  })
);

server.registerResource(
  "about_mcp_local",
  "workspace://mcp/about",
  {
    title: "Sobre este MCP",
    description: "Metadados do servidor MCP empacotado em mcp/",
    mimeType: "text/markdown",
  },
  async () => ({
    contents: [
      {
        uri: "workspace://mcp/about",
        mimeType: "text/markdown",
        text: [
          "# MCP local (aiox-squads)",
          "",
          "- Pasta: `mcp/`",
          "- SDK: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)",
          "- Inspector: `npm run inspector` (UI) ou `npm run inspector:config`",
          "- Docs: https://modelcontextprotocol.io",
        ].join("\n"),
      },
    ],
  })
);

server.registerPrompt(
  "summarize_intent",
  {
    title: "Resumir intenção",
    description: "Template mínimo para testar listagem de prompts no cliente.",
    argsSchema: { topic: z.string().describe("Assunto a resumir") },
  },
  ({ topic }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Em uma frase, qual é a intenção principal em relação a: ${topic}?`,
        },
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
