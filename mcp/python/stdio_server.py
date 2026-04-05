"""
Servidor MCP mínimo com o SDK Python official (FastMCP).

Repositório de referência: https://github.com/modelcontextprotocol/python-sdk

Servidor stdio (fica à espera do cliente; use com Cursor ou outro host MCP):

    npm run server:py

    # ou, com venv ativo:
    .venv\\Scripts\\mcp run python/stdio_server.py -t stdio

Teste rápido (Inspector em CLI, na pasta mcp/ — arranca o servidor, lista tools e chama echo/ping):

    npm run test:py

UI do Inspector: npm run inspector:python
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    "aiox-python-mcp",
    instructions="Servidor MCP de exemplo em Python (FastMCP) no monorepo aiox-squads.",
)


@mcp.tool()
def echo_py(message: str) -> str:
    """Devolve o texto (teste do SDK Python)."""
    return message


@mcp.tool()
def ping_py() -> str:
    """Confirma que o servidor Python está ativo."""
    return "MCP Python (mcp package) OK."


if __name__ == "__main__":
    mcp.run(transport="stdio")
