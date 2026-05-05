# ClickUp MCP Integration Setup Guide

## Overview

This guide helps you set up ClickUp integration with Claude Code using the Model Context Protocol (MCP).

## Available ClickUp MCP Packages

Several ClickUp MCP server implementations are available on npm. Here's a comparison:

| Package | Version | Features | Recommended For |
|---------|---------|----------|-----------------|
| `@taazkareem/clickup-mcp-server` | v0.14.4 | Full ClickUp API coverage, task/document/chat management | General use (recommended) |
| `@chykalophia/clickup-mcp-server` | v5.0.0 | 177+ tools, AI-powered optimization, context-aware workflows | Advanced/AI-focused usage |
| `@sjotie/clickup-mcp` | v1.8.6 | High-performance, optimized for AI integration | Performance-critical tasks |
| `@pipeworx/mcp-clickup` | v0.1.0 | Lightweight wrapper around ClickUp REST API v2 | Minimal dependency setup |
| `@antidrift/mcp-clickup` | v0.22.0 | Workspaces, spaces, tasks, comments | Comprehensive team collaboration |

## Recommended Setup: @taazkareem/clickup-mcp-server

We recommend `@taazkareem/clickup-mcp-server` as it offers:
- Recent updates (May 2026)
- Full ClickUp API coverage
- Support for tasks, documents, and chat management
- Good community support
- Clear integration with AI assistants

## Setup Steps

### Step 1: Obtain ClickUp API Token

1. Go to https://app.clickup.com/settings/apps
2. Look for "API Token" or "Developer" section
3. Generate a new API token if you don't have one
4. Copy the token (keep it secret!)

### Step 2: Install the MCP Server

```bash
npm install -g @taazkareem/clickup-mcp-server
```

### Step 3: Add ClickUp MCP to Claude Code

```bash
export CLICKUP_API_TOKEN="your_token_here"
claude mcp add ClickUp \
  -e CLICKUP_API_TOKEN=$CLICKUP_API_TOKEN \
  -- npx @taazkareem/clickup-mcp-server
```

### Step 4: Verify Installation

```bash
claude mcp list
```

You should see `ClickUp` in the list of available MCPs.

### Step 5: Test the Integration

Try using ClickUp tasks from Claude Code. The MCP should enable:
- List tasks and workspaces
- Create and update tasks
- Manage task comments
- View task attachments
- Access document management

## Alternative: Using Another Package

If you prefer a different package, simply replace the package name and command:

### @chykalophia/clickup-mcp-server (Advanced)
```bash
npm install -g @chykalophia/clickup-mcp-server
export CLICKUP_API_TOKEN="your_token_here"
claude mcp add ClickUp \
  -e CLICKUP_API_TOKEN=$CLICKUP_API_TOKEN \
  -- npx @chykalophia/clickup-mcp-server
```

### @pipeworx/mcp-clickup (Lightweight)
```bash
npm install -g @pipeworx/mcp-clickup
export CLICKUP_API_TOKEN="your_token_here"
claude mcp add ClickUp \
  -e CLICKUP_API_TOKEN=$CLICKUP_API_TOKEN \
  -- npx @pipeworx/mcp-clickup
```

## Troubleshooting

### Token Not Recognized
- Verify the token at https://app.clickup.com/settings/apps
- Ensure the token is set in the environment: `echo $CLICKUP_API_TOKEN`
- Check that the token is passed correctly to the MCP server

### MCP Connection Failed
```bash
# Run the diagnostic script
./fix-mcp.sh

# Check the token explicitly
env | grep CLICKUP

# Try to list ClickUp resources
claude mcp list
```

### Permissions Issues
- In Claude Code, you may be prompted to approve MCP access
- Click "Allow" or "Approve" when prompted
- If denied, re-run the `claude mcp add` command

## Security Best Practices

⚠️ **Never commit your API token to git:**

1. Add to `.gitignore`:
   ```
   .env
   .env.local
   ```

2. Store the token in environment variables:
   ```bash
   # Add to ~/.bashrc, ~/.zshrc, or ~/.env
   export CLICKUP_API_TOKEN="your_token_here"
   ```

3. Or use a credentials manager:
   ```bash
   # macOS Keychain
   security add-generic-password -s "ClickUp API Token" -a "$USER" -w "your_token_here"
   
   # Then retrieve it
   export CLICKUP_API_TOKEN=$(security find-generic-password -s "ClickUp API Token" -w)
   ```

## Updating the Package

To update to a newer version:

```bash
npm install -g @taazkareem/clickup-mcp-server@latest
```

Then verify with:
```bash
claude mcp list
```

## Removing ClickUp MCP

If you need to remove the integration:

```bash
claude mcp remove ClickUp
```

## Additional Resources

- ClickUp API Documentation: https://clickup.com/api
- MCP Documentation: https://modelcontextprotocol.io
- ClickUp Settings: https://app.clickup.com/settings

---

For more MCP setup information, see `CLAUDE.md` or `MCP_SETUP_PLAN.md`.
