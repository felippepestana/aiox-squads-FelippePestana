# Codebase Concerns

**Analysis Date:** 2026-04-09

## Tech Debt

**Session Memory Leaks:**
- Issue: Sessions stored in `Map<string, SessionState>` in `/web/server/index.ts:79` are never cleaned up. Sessions accumulate indefinitely in memory, causing memory exhaustion over time.
- Files: `web/server/index.ts` (lines 79, 195, 242, 276), `chatbot/src/server.ts` (lines 32-35)
- Impact: Long-running deployments will experience memory bloat, eventual OOM crashes, and degraded performance. In production (Cloudflare Workers), this would cause repeated crashes.
- Fix approach: Implement automatic session expiration with TTL (e.g., 30-min timeout). Add cleanup on POST `/api/sessions/:id/reset` and schedule periodic purge of stale sessions.

**Type Casting to `any`:**
- Issue: Multiple locations bypass TypeScript type safety with `as any` casts, particularly around the beta Files API:
  - `web/server/files.ts:32` - `(client.beta.files as any).upload`
  - `web/server/files.ts:61` - Same pattern
  - `web/server/files.ts:80-81, 85-86` - File content block casting
  - `web/server/chatSession.ts:43` - File content block in send()
  - `web/server/chatSession.ts:57` - Messages stream casting
- Files: `web/server/files.ts` (8 instances), `web/server/chatSession.ts` (2 instances)
- Impact: Loss of type safety on critical API communication. Beta API changes will not be caught at compile time, causing runtime failures.
- Fix approach: Create proper TypeScript interfaces for beta API responses. When stable types become available, replace `any` casts with correct types.

**Missing Error Recovery for SSE Streams:**
- Issue: SSE chat endpoint (`POST /api/sessions/:id/chat` in `web/server/index.ts:275-306`) catches errors but sends them via SSE. If stream fails mid-transmission, client may not receive error properly. No exponential backoff or retry logic.
- Files: `web/server/index.ts:297-305`, `web/server/chatSession.ts:70-79`
- Impact: Network glitches during streaming cause partial responses. Users don't reliably know if chat succeeded or failed.
- Fix approach: Add explicit error event type in SSE protocol. Implement client-side retry with exponential backoff. Add server-side stream timeout handling.

**Hardcoded Model Name:**
- Issue: Model `"claude-opus-4-6"` is hardcoded as constant in:
  - `web/server/chatSession.ts:6`
  - `chatbot/src/chat.ts:5`
- Impact: Model upgrades require code changes and redeployment. No A/B testing capability. Cannot easily switch models per-squad or per-agent.
- Fix approach: Move model selection to agent configuration or environment variable. Allow override at session creation time.

**No Input Validation on Chat Messages:**
- Issue: `POST /api/sessions/:id/chat` accepts `text` and `files` without size/length validation beyond multer file limits:
  - `web/server/index.ts:282` - `String(req.body?.text ?? "")` accepts unlimited length text
  - No check on total payload size for text + files combined
- Files: `web/server/index.ts:282-286`
- Impact: Malicious users can send extremely large text payloads, consuming server resources and API quota.
- Fix approach: Add `maxLength` validation on text field (recommend 50KB). Implement combined payload size check (text + files).

## Known Bugs

**File Upload Extension Check Inconsistency:**
- Symptoms: File type validation performed twice with different mechanisms - once in multer fileFilter (line 98-105 in `web/server/index.ts`), again in filename extension check (line 254). Potential mismatch if originalname doesn't match actual file type.
- Files: `web/server/index.ts:98-106, 254-258`
- Trigger: Upload file with mismatched MIME type and extension (e.g., PNG with .txt extension)
- Workaround: Multer allows it through, but buildFileContentBlock may create wrong content type. Send files matching their actual MIME type.

**Agent Loading Silent Failure:**
- Symptoms: When squad agent files are malformed or missing YAML frontmatter, extractAgentMeta falls back to filename silently. No logging or error tracking.
- Files: `web/server/agents.ts:79-86` (extractAgentMeta returns filename if YAML parsing fails)
- Trigger: Corrupted agent .md file without `name:` or `id:` fields
- Workaround: Agents will load with filename as ID, which may break agent switching logic if filenames don't match config.

**Cloudflare Workers Bundle Path Logic:**
- Symptoms: Bundle path detection in `web/server/agents.ts:69` uses regex to detect dist directory: `/[/\\]dist[/\\]server$/i`. This assumes specific directory structure that may not hold after build optimizations.
- Files: `web/server/agents.ts:69`, `web/server/index.ts:308`
- Trigger: Deploy with non-standard build output structure
- Workaround: Test bundle loading in staging before production deploy. Verify squads-bundle.json exists.

## Security Considerations

**Portal Authentication Bypass Potential:**
- Risk: Portal auth middleware checks headers for exact key match (`web/server/authPortal.ts:53`). If WEB_PORTAL_API_KEY is weak or exposed in logs, any request with that key gains full API access. No rate limiting on failed auth attempts.
- Files: `web/server/authPortal.ts:18-62`
- Current mitigation: Requires env var configuration (not in code). Key stored in process.env, not committed.
- Recommendations: (1) Implement per-IP rate limiting on auth failures, (2) Add audit logging for all auth attempts, (3) Rotate API key mechanism (consider JWT or short-lived tokens), (4) Document that ANTHROPIC_API_KEY + WEB_PORTAL_API_KEY should use strong secrets.

**API Key Exposure in Error Messages:**
- Risk: If `requireApiKey` fails, error message exposes presence of `.env` file: `"ANTHROPIC_API_KEY não configurada. Defina no ambiente ou em web/.env"` (web/server/index.ts:113). Information leakage.
- Files: `web/server/index.ts:108-118`
- Current mitigation: Only shown when key missing (not when wrong key provided)
- Recommendations: Use generic error message. Log actual location to server-side logs only.

**File Upload MIME Type Spoofing:**
- Risk: File upload uses file.mimetype from multer (which comes from request headers, user-controlled) as fallback if it's not "application/octet-stream" (`web/server/index.ts:255-258`). User can send incorrect MIME type, causing buildFileContentBlock to create wrong content type.
- Files: `web/server/index.ts:255-258`, `web/server/files.ts:74-88`
- Current mitigation: Extension-based fallback exists
- Recommendations: (1) Validate file content magic bytes (file signature), not just extension/MIME, (2) Force MIME type based on extension only, (3) Add file size check before upload (32 MB limit in multer is reasonable but should be documented).

**No CORS Protection with Wildcard:**
- Risk: CORS enabled with `origin: true` by default (web/server/index.ts:134-136). Any website can make requests to this API if deployed without CORS_ORIGIN set.
- Files: `web/server/index.ts:132-139`
- Current mitigation: Requires CORS_ORIGIN env var to restrict. Portal auth optional.
- Recommendations: In production, always set CORS_ORIGIN whitelist. Consider removing default wildcard—require explicit config.

**Unvalidated JSON Parsing:**
- Risk: Multer allows JSON up to 2MB (`web/server/index.ts:140`). No validation that JSON conforms to expected schema. Malformed JSON throws 400, but large payloads could cause parsing overhead.
- Files: `web/server/index.ts:140`
- Current mitigation: 2MB limit prevents extremely large payloads
- Recommendations: Add strict schema validation using zod or joi for request bodies (sessionId, agentId, text, files).

## Performance Bottlenecks

**Squad Loading Happens on Every Request:**
- Problem: `loadAllSquads()` called on every `/api/squads` and `/api/sessions` request (`web/server/index.ts:161, 186, 207`). Reads all agent files from disk synchronously.
- Files: `web/server/index.ts:161, 186, 207`, `web/server/agents.ts:109-154`
- Cause: No caching. Squad list regenerated on every request.
- Improvement path: Cache squads in memory after first load. Invalidate cache only when squad files change (use fs.watch on /squads directory). For Cloudflare Workers, bundle squads once at build time.

**Synchronous File I/O in Request Path:**
- Problem: `loadSquadMeta` and `loadAllSquads` use synchronous fs calls (`fs.readFileSync`, `fs.readdirSync`) in hot path. Blocks event loop.
- Files: `web/server/agents.ts:94, 120, 130, 139, 150`
- Cause: Simpler to implement than async, but blocks single-threaded Node event loop.
- Improvement path: Convert to async file loading. Use `fs.promises` for readdir and readFile. Cache at startup instead of per-request.

**Session History Unbounded Growth:**
- Problem: `ChatSession` accumulates all messages in memory array (`web/server/chatSession.ts:16`). No limit on conversation length. Large conversations (100+ turns) cause increased memory per session and slower context construction.
- Files: `web/server/chatSession.ts:15-16, 50, 62, 81-84`
- Cause: Simplified history tracking. No sliding window or pruning.
- Improvement path: Implement max message cap (e.g., keep last 100 messages). Archive older messages to disk/DB if needed. Add historyLength() method (exists but not enforced).

## Fragile Areas

**SSE Stream Connection Management:**
- Files: `web/server/index.ts:289-305`
- Why fragile: SSE is stateless protocol over HTTP. If client disconnects mid-stream (network glitch, browser close), server has no way to detect until next write attempt. No heartbeat/keepalive. Error handling via SSE format means client must parse JSON to detect failure.
- Safe modification: (1) Add ping events every 10s to detect disconnects, (2) Move to WebSocket for bidirectional communication, (3) Add explicit "stream ended" marker before res.end(), (4) Implement client-side reconnect with session resumption.
- Test coverage: No tests visible for SSE streaming behavior, connection drops, or partial failures.

**Agent Switching Without History Context:**
- Files: `web/server/chatSession.ts:27-29`, `web/server/index.ts:199-214`
- Why fragile: When user switches agents (`POST /api/sessions/:id/switch-agent`), chat history is preserved but agent changes. This creates context mismatch—history from Agent A may not be appropriate for Agent B. Agent B will see chat history from Agent A in context window.
- Safe modification: (1) Document that history is preserved on agent switch (is this intended?), (2) Consider offering "clear history on switch" option, (3) Add clear visual indicator in UI when history mismatches agent, (4) Log agent switches with timestamps.
- Test coverage: No visible tests for agent switching behavior.

**Bundle vs File System Loading Logic:**
- Files: `web/server/agents.ts:22-43, 109-154`, `web/server/index.ts:308-325`
- Why fragile: Two separate loading paths (bundle.json for Cloudflare, filesystem for Node). Bugs in one path won't be caught by the other. Inconsistent directory path calculation (`/dist/server` detection at lines 69, 308).
- Safe modification: (1) Unify loading paths with consistent abstraction, (2) Add tests for both bundle and file loading, (3) Document expected structure for each environment, (4) Add logging to indicate which loader was used.
- Test coverage: No tests for squad loading in either mode.

## Scaling Limits

**In-Memory Session Storage:**
- Current capacity: Single Node process holds all sessions in Map. No limit enforced. 1000 active sessions ≈ 50-100 MB depending on history length.
- Limit: Crashes when total heap exceeds available RAM. Cloudflare Workers has memory limit per isolate (estimated 10 MB available). In-process Map storage won't scale beyond single instance.
- Scaling path: (1) Replace Map with Redis or similar external session store, (2) Implement session eviction policy (LRU, TTL), (3) For Cloudflare, leverage KV Namespace or Durable Objects instead of in-memory storage. (4) Add metrics: active session count, memory usage per session.

**File Upload Temporary Storage:**
- Current capacity: Multer stores files in memory (web/server/index.ts:96). Max file size 32 MB. Multiple concurrent uploads could saturate RAM.
- Limit: With 100 concurrent 32 MB uploads, would require 3.2 GB RAM. Shared temp directory fills up if cleanup fails.
- Scaling path: (1) Use disk-based multer storage with cleanup after upload, (2) Stream directly to Files API instead of buffering, (3) Add concurrent upload quota per session, (4) Implement file cleanup worker for orphaned temp files.

**Squad Filesystem Reads:**
- Current capacity: Works well up to ~100 squads with ~50 agents each. Each squad load scans entire /squads directory.
- Limit: 1000+ squads would cause noticeable latency on `loadAllSquads()` call. No caching means every request rescans.
- Scaling path: (1) Implement squad registry/index file instead of directory scan, (2) Cache squad metadata in memory, (3) For large deployments, consider squad discovery service or plugin system, (4) Move to DB for squad metadata (SQLite, PostgreSQL).

## Dependencies at Risk

**`@anthropic-ai/sdk` Beta API Usage:**
- Risk: Code uses undocumented beta APIs (Files API, beta.messages.stream) with `-beta` headers hardcoded. When API stabilizes or changes, code breaks.
- Impact: Files API may change syntax, streaming behavior, or authentication. Beta headers will stop working if API version changes. `as any` casts hide breaking changes.
- Migration plan: (1) Watch Anthropic SDK changelog for stable releases, (2) Create abstraction layer for API calls (currently inline), (3) Set up test suite that runs against both beta and stable SDKs, (4) Plan migration timeline before beta becomes breaking change.

**Express.js 5.x:**
- Risk: Package.json uses `express: ^5.2.1`. v5 has breaking changes from v4 (which dominates ecosystem). Limited third-party middleware compatibility.
- Impact: Fewer middleware options. Harder to find examples/help.
- Migration plan: OK for now (v5 stable), but pin version if deploying to critical infrastructure. Monitor for security updates.

**Outdated TypeScript Strict Mode:**
- Risk: tsconfig has `strict: true` but code uses `as any` throughout. This defeats the purpose of strict mode.
- Impact: False sense of type safety. Real bugs won't be caught.
- Migration plan: (1) Eliminate `as any` casts (see Tech Debt section), (2) Add `noImplicitAny: true` and `noUncheckedIndexedAccess: true` for strictness, (3) Use TypeScript 5.9+ (already in package.json, good), (4) Enable `lib.dom` types if client runs in browser.

## Missing Critical Features

**No Session Persistence:**
- Problem: Sessions lost on server restart. No way to resume conversation. All uploads are lost.
- Blocks: Production deployments (any crash/redeploy loses user context), multi-instance deployments (sticky sessions required), graceful restarts.
- Recommendation: Implement session persistence to Redis, SQLite, or cloud storage. Consider adding session export/restore feature.

**No Audit Logging:**
- Problem: No logs of who accessed which agents, what files were uploaded, when sessions were created. Portal auth has no audit trail.
- Blocks: Compliance, debugging, security incident response.
- Recommendation: Add structured logging (JSON) for: agent access, file uploads, session lifecycle, auth failures. Send to external log aggregator (e.g., CloudWatch, Datadog).

**No Rate Limiting Per User/Session:**
- Problem: Rate limits apply globally (`web/server/index.ts:52-73`). No per-user quotas. Abuser can exhaust global limits and block all users.
- Blocks: Multi-tenant deployments, preventing DOS attacks from single user.
- Recommendation: Implement per-session/user rate limiting. Track across API keys if portal auth enabled. Use Redis for distributed rate limit state.

**No Health Checks for Dependencies:**
- Problem: Server assumes Anthropic API is always available. No health endpoint that checks API connectivity.
- Blocks: Kubernetes/container orchestration readiness probes. Monitoring can't detect when API service goes down.
- Recommendation: Add `/api/health/deep` endpoint that makes test API call. Cache result with TTL to avoid overloading.

## Test Coverage Gaps

**No Tests for SSE Streaming:**
- What's not tested: SSE event format, error handling in streams, partial disconnects, content chunking
- Files: `web/server/index.ts:275-306`
- Risk: Stream errors go undetected. Breaking changes to event format won't be caught. Streaming timeout behavior unknown.
- Priority: High (critical path—main chat feature)

**No Tests for Session Management:**
- What's not tested: Session creation, agent switching, history preservation, concurrent requests to same session
- Files: `web/server/chatSession.ts`, `web/server/index.ts:180-224`
- Risk: Session memory leaks undetected. Agent switching behavior undefined. Race conditions possible.
- Priority: High (sessions are core state)

**No Tests for Squad Loading:**
- What's not tested: File system loading, bundle loading, agent extraction from YAML, fallback behavior for malformed files
- Files: `web/server/agents.ts`
- Risk: Changes to squad loading break silently. Agent metadata extraction fragile. Bundle loading untested in CI.
- Priority: Medium (squad setup, not request path)

**No Tests for File Upload/Processing:**
- What's not tested: MIME type detection, file size limits, unsupported extensions, concurrent uploads, cleanup of temp files
- Files: `web/server/files.ts`, `web/server/index.ts:226-273`
- Risk: File handling bugs (type spoofing, cleanup failures) go undetected. Temp disk fill scenario untested.
- Priority: Medium (security concern around file validation)

**No Tests for Portal Authentication:**
- What's not tested: Header parsing (single vs array), Bearer token extraction, key comparison, auth failure responses
- Files: `web/server/authPortal.ts`
- Risk: Auth bypass vulnerabilities possible (e.g., array header handling bug). Edge cases untested.
- Priority: High (security)

**No Smoke/Integration Tests for Full Workflow:**
- What's not tested: End-to-end: session create → agent list → upload file → send chat message → receive response
- Files: All server modules
- Risk: Integration issues (incompatible API changes, broken response format) found in production
- Priority: Medium (exists but minimal: `web/scripts/smoke-api.mjs` appears basic)

---

*Concerns audit: 2026-04-09*
