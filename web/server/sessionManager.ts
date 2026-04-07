import type { ChatSession } from "./chatSession.js";

export interface SessionState {
  chat: ChatSession;
  createdAt: number;
  lastActivity: number;
}

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // check every 60 seconds

export class SessionManager {
  private sessions = new Map<string, SessionState>();
  private ttlMs: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(ttlMs?: number) {
    this.ttlMs = ttlMs ?? DEFAULT_TTL_MS;
  }

  start(): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
    this.cleanupTimer.unref();
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  set(id: string, chat: ChatSession): SessionState {
    const now = Date.now();
    const state: SessionState = { chat, createdAt: now, lastActivity: now };
    this.sessions.set(id, state);
    return state;
  }

  get(id: string): SessionState | undefined {
    const state = this.sessions.get(id);
    if (!state) return undefined;

    if (Date.now() - state.lastActivity > this.ttlMs) {
      this.sessions.delete(id);
      return undefined;
    }

    state.lastActivity = Date.now();
    return state;
  }

  has(id: string): boolean {
    return this.get(id) !== undefined;
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  size(): number {
    return this.sessions.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, state] of this.sessions) {
      if (now - state.lastActivity > this.ttlMs) {
        this.sessions.delete(id);
      }
    }
  }
}
