const RECENT_KEY = "aiox-recent-sessions-v1";
const LINES_PREFIX = "aiox-chat-lines-v1:";
const MAX_RECENT = 12;
const MAX_LINES_JSON = 450_000;

export type ChatLine =
  | { role: "user"; text: string; files?: string[] }
  | {
      role: "assistant";
      text: string;
      latency?: { msToFirst: number; msTotal: number };
    };

export type RecentSessionMeta = {
  sessionId: string;
  squadId: string;
  agentId: string;
  agentName: string;
  squadName: string;
  preview: string;
  updatedAt: number;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadRecentSessions(): RecentSessionMeta[] {
  if (typeof localStorage === "undefined") return [];
  const data = safeParse<RecentSessionMeta[]>(localStorage.getItem(RECENT_KEY));
  return Array.isArray(data) ? data : [];
}

export function upsertRecentSession(
  meta: Omit<RecentSessionMeta, "updatedAt"> & { updatedAt?: number }
): void {
  if (typeof localStorage === "undefined") return;
  const others = loadRecentSessions().filter(
    (x) => x.sessionId !== meta.sessionId
  );
  const row: RecentSessionMeta = {
    sessionId: meta.sessionId,
    squadId: meta.squadId,
    agentId: meta.agentId,
    agentName: meta.agentName,
    squadName: meta.squadName,
    preview: meta.preview,
    updatedAt: meta.updatedAt ?? Date.now(),
  };
  others.unshift(row);
  others.sort((a, b) => b.updatedAt - a.updatedAt);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(others.slice(0, MAX_RECENT)));
  } catch {
    /* quota */
  }
}

export function removeRecentSession(sessionId: string): void {
  if (typeof localStorage === "undefined") return;
  const next = loadRecentSessions().filter((x) => x.sessionId !== sessionId);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function saveChatLines(sessionId: string, lines: ChatLine[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    const s = JSON.stringify(lines);
    if (s.length > MAX_LINES_JSON) return;
    localStorage.setItem(LINES_PREFIX + sessionId, s);
  } catch {
    /* quota */
  }
}

export function loadChatLines(sessionId: string): ChatLine[] | null {
  if (typeof localStorage === "undefined") return null;
  const data = safeParse<ChatLine[]>(localStorage.getItem(LINES_PREFIX + sessionId));
  return Array.isArray(data) ? data : null;
}

export function removeChatLines(sessionId: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LINES_PREFIX + sessionId);
}

export function formatLatencyMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}
