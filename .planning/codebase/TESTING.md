# Testing Patterns

**Analysis Date:** 2026-04-09

## Test Framework

**Runner:**
- No test runner configured (no Jest, Vitest, Mocha config files)
- No test dependencies in `package.json` for chatbot or web projects

**Assertion Library:**
- Not detected

**Run Commands:**
- No test scripts in chatbot or main web `package.json`
- Web project includes smoke test script: `npm run test:smoke` → `node scripts/smoke-api.mjs`
- Validation is via GitHub Actions workflows, not unit tests

**Note:** This codebase appears to rely on manual testing and CI/CD validation rather than automated unit tests.

## Test File Organization

**Location:**
- No test files found in codebase
- No `.test.ts`, `.spec.ts`, or `__tests__/` directories detected

**Naming:**
- Not applicable (no tests present)

**Structure:**
- Not applicable (no tests present)

## Test Structure

**Suite Organization:**
- Not applicable (no tests present)

**Patterns:**
- Not applicable (no tests present)

## Mocking

**Framework:**
- Not detected

**Patterns:**
- Type-level `any` casts used to mock unsupported SDK methods (workaround for beta APIs)
- Example in `web/server/chatSession.ts`:
```typescript
const stream = (this.client.beta.messages as any).stream(
  { ... },
  { headers: { "anthropic-beta": "files-api-2025-04-14" } }
);
```

**What to Mock:**
- External APIs (Anthropic SDK) would need mocking in unit tests (currently not done)
- File system operations would require mocking for isolated tests

**What NOT to Mock:**
- Local data structures and business logic should be tested directly

## Fixtures and Factories

**Test Data:**
- Not detected

**Location:**
- Not applicable (no tests present)

## Coverage

**Requirements:**
- Not enforced

**View Coverage:**
- No coverage tooling configured

## Test Types

**Unit Tests:**
- Not present in codebase
- Would be appropriate for: parsing functions (YAML extraction in `agents.ts`), utility functions (latency formatting in `recentSessions.ts`), type validations

**Integration Tests:**
- Not present in codebase
- Smoke test script exists: `scripts/smoke-api.mjs` (validation only, not assertions)
- Would be appropriate for: server endpoints, chat session lifecycle, file upload/download

**E2E Tests:**
- Not present in codebase
- Would be appropriate for: full chatbot flow (select agent → send message → receive streaming response)

## Testing Strategy

**Validation via CI/CD:**
The codebase relies on GitHub Actions for quality gates:

**Squad Validation** (`.github/workflows/validate-squads.yml`):
- Ensures all squads have required structure: `README.md`, optional `config.yml` and `agents/` directory
- Counts agents and tasks per squad
- Runs on pull requests and pushes to main
- Bash script with `set -euo pipefail` for error handling

**Smoke Tests:**
- Web project includes `scripts/smoke-api.mjs` (runnable via `npm run test:smoke`)
- Purpose: basic API health check (details not visible in main code)
- Would test if server starts and responds to basic requests

**Manual Testing:**
- CLI and web UIs support manual interaction
- No automated test suite; developers rely on manual testing and code review

## Current Testing Gaps

**Not Tested:**
- `chatbot/src/chat.ts` - ChatSession streaming logic, history management
- `chatbot/src/agents.ts` - Agent loading and YAML meta extraction
- `chatbot/src/files.ts` - File upload, MIME type mapping, file deletion
- `chatbot/src/index.ts` - CLI command parsing, user interaction flow
- `web/server/chatSession.ts` - Message history, streaming with Files API
- `web/server/files.ts` - File upload to Anthropic Files API, MIME type handling
- `web/client/src/api.ts` - All API calls and error handling
- `web/client/src/recentSessions.ts` - localStorage persistence, session serialization
- `web/client/src/App.tsx` - All React state management, component interactions

**Priority Areas for Testing (if implementing tests):**
1. File handling (upload, deletion, MIME validation) — risk of data loss
2. Chat streaming and error recovery — core user experience
3. Session persistence (localStorage, server-side memory) — data integrity
4. API error handling (401, 404, 500 responses) — user-facing errors

## Development Practices

**No Test-Driven Development:**
- Code is written without test infrastructure
- Relies on code review and manual testing

**Type Safety:**
- TypeScript strict mode provides compile-time safety
- `tsconfig.json` enforces: strict null checks, no implicit any, no unused variables
- Type-only imports catch import errors

**Code Review:**
- GitHub PR workflow (`@claude` mention triggers Claude Agent execution)
- Manual review before merge

---

*Testing analysis: 2026-04-09*
