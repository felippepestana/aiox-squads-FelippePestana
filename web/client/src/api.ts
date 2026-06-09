export interface AgentRef {
  id: string;
  name: string;
  squad: string;
}

export interface SquadMeta {
  icon: string;
  title: string;
  description: string;
  /** metadata.platform from config.yaml (ex: "apex-talent") */
  platform?: string;
  /** metadata.status from config.yaml (ex: "ACTIVE", "DEVELOPING") */
  status?: string;
  /** top-level domain from config.yaml */
  domain?: string;
}

export interface SquadSummary {
  id: string;
  meta: SquadMeta;
  agents: AgentRef[];
}

export interface UploadedFileMeta {
  fileId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export const PORTAL_KEY_STORAGE = "aiox-portal-key";

export function getPortalKey(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(PORTAL_KEY_STORAGE);
}

export function setPortalKey(key: string): void {
  sessionStorage.setItem(PORTAL_KEY_STORAGE, key.trim());
}

export function clearPortalKey(): void {
  sessionStorage.removeItem(PORTAL_KEY_STORAGE);
}

/** Headers para chamadas à API (chave do portal, se houver no sessionStorage). */
export function portalHeaders(jsonBody: boolean): HeadersInit {
  const h: Record<string, string> = {};
  if (jsonBody) h["Content-Type"] = "application/json";
  const k = getPortalKey();
  if (k) h["X-Portal-Key"] = k;
  return h;
}

export async function fetchAuthStatus(): Promise<{
  portalAuthRequired: boolean;
}> {
  const r = await fetch("/api/auth/status");
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchSquads(): Promise<SquadSummary[]> {
  const r = await fetch("/api/squads", { headers: portalHeaders(false) });
  if (r.status === 401) {
    throw new PortalAuthError("Chave do portal necessária ou inválida");
  }
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export class PortalAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortalAuthError";
  }
}

export async function createSession(
  squadId: string,
  agentId: string
): Promise<{ sessionId: string; agent: AgentRef }> {
  const r = await fetch("/api/sessions", {
    method: "POST",
    headers: portalHeaders(true),
    body: JSON.stringify({ squadId, agentId }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? (await r.text()));
  }
  return r.json();
}

export async function switchAgent(
  sessionId: string,
  squadId: string,
  agentId: string
): Promise<{ agent: AgentRef }> {
  const r = await fetch(`/api/sessions/${sessionId}/switch-agent`, {
    method: "POST",
    headers: portalHeaders(true),
    body: JSON.stringify({ squadId, agentId }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? (await r.text()));
  }
  return r.json();
}

/** True se a sessão ainda existe no servidor (memória). */
export async function fetchSessionExists(sessionId: string): Promise<boolean> {
  const r = await fetch(`/api/sessions/${sessionId}`, {
    headers: portalHeaders(false),
  });
  if (r.status === 404) return false;
  if (!r.ok) throw new Error(await r.text());
  return true;
}

export async function resetSession(sessionId: string): Promise<void> {
  const r = await fetch(`/api/sessions/${sessionId}/reset`, {
    method: "POST",
    headers: portalHeaders(false),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? (await r.text()));
  }
}

export async function uploadFile(
  sessionId: string,
  file: File
): Promise<UploadedFileMeta> {
  const fd = new FormData();
  fd.append("file", file);
  const k = getPortalKey();
  const headers: HeadersInit = k ? { "X-Portal-Key": k } : {};
  const r = await fetch(`/api/sessions/${sessionId}/upload`, {
    method: "POST",
    headers,
    body: fd,
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? (await r.text()));
  }
  return r.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// talent-compass — interview feature
// ─────────────────────────────────────────────────────────────────────────────

export interface RoleProfile {
  role_title: string;
  performance_objectives: { id: string; outcome: string; metric: string }[];
  competencies: {
    technical: { name: string; bars: Record<string, string> }[];
    behavioral: { name: string; bars: Record<string, string> }[];
    motivation: string[];
  };
  scorecard_weights: {
    technical: number;
    behavioral: number;
    motivation: number;
    behavioral_style: number;
  };
}

export interface GuideQuestion {
  id: string;
  competency: string;
  type: "behavioral" | "situational";
  text: string;
  probes: string[];
  bars: Record<string, string>;
}
export interface InterviewGuide {
  role_title: string;
  questions: GuideQuestion[];
}

export interface Scorecard {
  candidate: string;
  role_title: string;
  categories: {
    technical: { score: number; max: number; evidence: string };
    behavioral: { score: number; max: number; evidence: string };
    motivation: { score: number; max: number; evidence: string };
  };
  behavioral_style_context: string;
  total: number;
  grade: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  fairness_status: "pass" | "review";
  fairness_notes: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: portalHeaders(true),
    body: JSON.stringify(body),
  });

  // Read the body once as text, then parse — avoids double-consuming the body
  // and preserves the original payload when the response is not valid JSON.
  const text = await r.text();
  let parsed: unknown;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
  }

  if (!r.ok) {
    const maybeError =
      parsed && typeof parsed === "object" && "error" in parsed
        ? (parsed as { error?: string }).error
        : undefined;
    throw new Error(maybeError || text || r.statusText);
  }

  if (parsed === undefined && text) {
    throw new Error("Resposta JSON inválida do servidor.");
  }
  return parsed as T;
}

export async function interviewStatus(): Promise<{ dbEnabled: boolean }> {
  const r = await fetch("/api/interview/status", { headers: portalHeaders(false) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function defineRole(role: string): Promise<RoleProfile> {
  const { profile } = await postJson<{ profile: RoleProfile }>(
    "/api/interview/define-role",
    { role }
  );
  return profile;
}

export async function buildGuide(role: RoleProfile): Promise<InterviewGuide> {
  const { guide } = await postJson<{ guide: InterviewGuide }>(
    "/api/interview/build-guide",
    { role }
  );
  return guide;
}

export async function scoreCandidate(args: {
  role: RoleProfile;
  guide: InterviewGuide;
  candidateName: string;
  answers: { questionId: string; competency: string; answer: string }[];
  behavioralStyle?: string;
}): Promise<{
  scorecard: Scorecard;
  persisted: boolean;
  applicationId: string | null;
  scorecardId: string | null;
}> {
  return postJson("/api/interview/score", args);
}

export async function persistDocument(args: {
  templateKey: string;
  renderedHtml: string;
  data: unknown;
  entityType?: string;
  entityId?: string | null;
}): Promise<{ id: string | null; persisted: boolean }> {
  return postJson("/api/interview/document", args);
}

type StreamEvent =
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export async function chatStream(
  sessionId: string,
  text: string,
  files: UploadedFileMeta[],
  onChunk: (t: string) => void,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const r = await fetch(`/api/sessions/${sessionId}/chat`, {
    method: "POST",
    headers: portalHeaders(true),
    body: JSON.stringify({ text, files }),
    signal: opts?.signal,
  });
  if (!r.ok || !r.body) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }

  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      for (const line of block.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;
        const ev = JSON.parse(raw) as StreamEvent;
        if (ev.type === "chunk") onChunk(ev.text);
        if (ev.type === "error") throw new Error(ev.message);
      }
    }
  }
}
