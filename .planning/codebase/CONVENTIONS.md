# Coding Conventions

**Analysis Date:** 2026-04-09

## Naming Patterns

**Files:**
- TypeScript modules: kebab-case (e.g., `chat-session.ts`, `recent-sessions.ts`)
- React components: PascalCase (e.g., `App.tsx`, `MarkdownMessage.tsx`)
- Directories: kebab-case (e.g., `recent-sessions`, `deep-research`)
- Configuration files: camelCase (e.g., `vite.config.ts`, `tsconfig.json`)

**Functions:**
- camelCase for all function declarations and exports
- Prefix private/internal helpers with underscore (e.g., `stripAgent()`, `routeSessionId()`)
- Async functions use async/await syntax, never callbacks
- Single-purpose naming: `uploadFile()`, `deleteFile()`, `chatStream()`

**Variables:**
- camelCase for all local and module-level variables
- Constants (module-level, immutable): UPPER_SNAKE_CASE (e.g., `RECENT_KEY`, `MAX_RECENT`, `LINES_PREFIX`)
- Boolean flags: prefix with `is`, `has`, or `should` (e.g., `hasError`, `isOpen`, `shouldStream`)
- Collections: plural names (e.g., `squads`, `agents`, `lines`, `pendingFiles`)

**Types & Interfaces:**
- PascalCase for all interface and type names (e.g., `ChatMessage`, `UploadedFile`, `AgentRef`)
- Type names are descriptive, not prefixed with `I` (e.g., `ChatLine` not `IChatLine`)
- Union types use literal string discriminators (e.g., `role: "user" | "assistant"`)

## Code Style

**Formatting:**
- No dedicated formatter configured; follows TypeScript strict mode defaults
- Indentation: 2 spaces (implicit, no config file enforced)
- Line length: no hard limit (files up to 861 lines observed)
- Semicolons: required (TypeScript strict mode)
- Trailing commas: used in multi-line structures

**Linting:**
- No ESLint, Biome, or Prettier config files present
- TypeScript strict mode enforced in `tsconfig.json`
- Compilation target: ES2022
- Module system: CommonJS for Node.js, ESNext for browser/React code
- Strict null checks, no implicit any, no unused locals

## Import Organization

**Order:**
1. External npm packages (stdlib: fs, path, os, crypto)
2. Third-party dependencies (@anthropic-ai/sdk, express, react, multer, cors, helmet)
3. Local modules (using relative or absolute imports based on context)
4. Type-only imports at end of group (using `type` keyword)

**Path Aliases:**
- No path aliases configured in tsconfig
- Relative paths with `./` or `../` used consistently
- File extensions included in ES modules (e.g., `import { ChatSession } from "./chatSession.js"`)

**Examples from codebase:**
```typescript
// chatbot/src/index.ts
import readline from "readline";
import Anthropic from "@anthropic-ai/sdk";
import { loadAllSquads, flatAgentList, Agent, Squad } from "./agents";
import { uploadFile, deleteFile, supportedExtensions, UploadedFile } from "./files";
import { ChatSession } from "./chat";

// web/client/src/App.tsx
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatStream, clearPortalKey, createSession, ... } from "./api";
import { type ChatLine, formatLatencyMs, ... } from "./recentSessions";
const MarkdownMessage = lazy(() => import("./MarkdownMessage"));
```

## Error Handling

**Patterns:**
- Try/catch blocks wrap async operations; error messages propagated as strings
- Custom error classes when needed: `PortalAuthError extends Error` in `api.ts`
- Callbacks accept `err: any` and extract message or text for display
- Silent failures in cleanup: `.catch(() => {})` for non-critical operations
- User-facing errors through state variables (e.g., `setError(String(e))`)

**Examples:**
```typescript
// web/client/src/api.ts
export class PortalAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortalAuthError";
  }
}

// chatbot/src/index.ts (error handling in CLI)
try {
  await session.send(trimmed, filesToSend, (chunk) => {
    process.stdout.write(chunk);
  });
} catch (err: any) {
  console.log(`\n${c.red}✗ Erro: ${err.message}${c.reset}`);
}
```

## Logging

**Framework:** `console` (console.log, console.error) for both CLI and server

**Patterns:**
- CLI (`chatbot/src/index.ts`): Styled output with ANSI color codes via object `c`
- Server logs: structured JSON output to console, processed by deployment platform
- No logging library (winston, pino); relying on platform logs
- Streaming responses logged via event handlers, not per-chunk
- Errors logged to console.error immediately or deferred to state

**CLI Color Functions:**
```typescript
function header(text: string): string { ... }
function success(text: string): string { ... }
function warn(text: string): string { ... }
function info(text: string): string { ... }
function prompt(text: string): string { ... }
function agentTag(squad: string, name: string): string { ... }
```

## Comments

**When to Comment:**
- Not heavily commented; code relies on self-documenting names
- JSDoc used sparingly for public APIs and complex functions
- Inline comments used to explain non-obvious logic (e.g., File API beta headers, quirky platform requirements)

**JSDoc/TSDoc:**
- Used in `files.ts`, `chat.ts` for file upload/download and streaming functions
- Format: single-line comments for parameters and return types
- Example from `chatbot/src/chat.ts`:
```typescript
/**
 * Envia uma mensagem (texto + arquivos opcionais) e retorna
 * a resposta do agente via streaming.
 *
 * @param text - Texto do usuário
 * @param files - Arquivos enviados (já upados na Files API)
 * @param onChunk - Callback chamado a cada token de texto recebido
 */
async send(
  text: string,
  files: UploadedFile[],
  onChunk: (chunk: string) => void
): Promise<string> { ... }
```

## Function Design

**Size:** 
- Small, focused functions preferred
- Most functions 20-50 lines
- Larger functions (100+ lines) are intentional: `App.tsx` (861 lines) is a monolithic React component with all state management

**Parameters:**
- Explicit parameters preferred over configuration objects
- When multiple related params, use object destructuring (e.g., `{ signal?: AbortSignal }` in `chatStream()`)
- Callback parameters typed explicitly

**Return Values:**
- Explicit return types on all function declarations
- Promise-based async functions return `Promise<T>`, not callbacks
- Void functions used for state mutations or side effects

**Examples:**
```typescript
// Simple, typed function
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Function with options object
export async function chatStream(
  sessionId: string,
  text: string,
  files: UploadedFileMeta[],
  onChunk: (t: string) => void,
  opts?: { signal?: AbortSignal }
): Promise<void> { ... }
```

## Module Design

**Exports:**
- Explicit named exports, no default exports (except React lazy-loaded components)
- Interfaces exported from modules that define them
- Type-only exports using `export type` syntax

**Barrel Files:**
- Not used; imports specify full module paths
- Each module exports only its public surface

**Patterns observed in codebase:**

`chatbot/src/agents.ts` exports interfaces and functions:
```typescript
export interface Agent { ... }
export interface Squad { ... }
export function loadAllSquads(): Squad[] { ... }
export function flatAgentList(squads: Squad[]): Agent[] { ... }
```

`web/client/src/api.ts` mixes functions and custom errors:
```typescript
export async function fetchSquads(): Promise<SquadSummary[]> { ... }
export class PortalAuthError extends Error { ... }
export const PORTAL_KEY_STORAGE = "aiox-portal-key";
```

---

*Convention analysis: 2026-04-09*
