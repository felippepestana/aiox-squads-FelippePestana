export interface AgentRef {
  id: string;
  name: string;
  squad: string;
}

export interface SquadSummary {
  id: string;
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
