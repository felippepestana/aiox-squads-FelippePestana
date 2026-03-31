/**
 * Session persistence store using SQLite (better-sqlite3).
 * Falls back to in-memory Map when SQLite is unavailable (e.g. Cloudflare Workers).
 */

import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.AIOX_DB_PATH ?? path.resolve(serverDir, "../../data/aiox.db");

export interface SessionRow {
  id: string;
  squad_id: string;
  agent_id: string;
  agent_name: string;
  use_case: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: number;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  files: string | null;
  created_at: string;
}

export interface ReportRow {
  id: number;
  session_id: string;
  use_case: string;
  mode: string;
  content: string;
  created_at: string;
}

export interface Store {
  createSession(row: Omit<SessionRow, "created_at" | "updated_at">): void;
  getSession(id: string): SessionRow | undefined;
  touchSession(id: string, agentId?: string, agentName?: string): void;
  deleteSession(id: string): void;
  listSessions(limit?: number): SessionRow[];
  setUseCase(sessionId: string, useCase: string): void;

  addMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    files?: string[]
  ): void;
  getMessages(sessionId: string): MessageRow[];

  saveReport(
    sessionId: string,
    useCase: string,
    mode: string,
    content: string
  ): number;
  getReport(id: number): ReportRow | undefined;
  getReportsBySession(sessionId: string): ReportRow[];
}

// ---------- SQLite implementation ----------

let db: any = null;

function ensureDb(): any {
  if (db) return db;

  let Database: any;
  try {
    Database = require("better-sqlite3");
  } catch {
    return null;
  }

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      squad_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL DEFAULT '',
      use_case TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('user','assistant')),
      content TEXT NOT NULL DEFAULT '',
      files TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      use_case TEXT NOT NULL DEFAULT '',
      mode TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_reports_session ON reports(session_id);
  `);

  return db;
}

function sqliteStore(): Store | null {
  const d = ensureDb();
  if (!d) return null;

  const stmts = {
    insertSession: d.prepare(
      `INSERT INTO sessions (id, squad_id, agent_id, agent_name, use_case) VALUES (?, ?, ?, ?, ?)`
    ),
    getSession: d.prepare(`SELECT * FROM sessions WHERE id = ?`),
    touchSession: d.prepare(
      `UPDATE sessions SET updated_at = datetime('now'), agent_id = COALESCE(?, agent_id), agent_name = COALESCE(?, agent_name) WHERE id = ?`
    ),
    deleteSession: d.prepare(`DELETE FROM sessions WHERE id = ?`),
    listSessions: d.prepare(
      `SELECT * FROM sessions ORDER BY updated_at DESC LIMIT ?`
    ),
    setUseCase: d.prepare(
      `UPDATE sessions SET use_case = ?, updated_at = datetime('now') WHERE id = ?`
    ),
    addMessage: d.prepare(
      `INSERT INTO messages (session_id, role, content, files) VALUES (?, ?, ?, ?)`
    ),
    getMessages: d.prepare(
      `SELECT * FROM messages WHERE session_id = ? ORDER BY id`
    ),
    saveReport: d.prepare(
      `INSERT INTO reports (session_id, use_case, mode, content) VALUES (?, ?, ?, ?)`
    ),
    getReport: d.prepare(`SELECT * FROM reports WHERE id = ?`),
    getReportsBySession: d.prepare(
      `SELECT * FROM reports WHERE session_id = ? ORDER BY id DESC`
    ),
  };

  return {
    createSession(row) {
      stmts.insertSession.run(
        row.id,
        row.squad_id,
        row.agent_id,
        row.agent_name,
        row.use_case ?? null
      );
    },
    getSession(id) {
      return stmts.getSession.get(id) as SessionRow | undefined;
    },
    touchSession(id, agentId, agentName) {
      stmts.touchSession.run(agentId ?? null, agentName ?? null, id);
    },
    deleteSession(id) {
      stmts.deleteSession.run(id);
    },
    listSessions(limit = 50) {
      return stmts.listSessions.all(limit) as SessionRow[];
    },
    setUseCase(sessionId, useCase) {
      stmts.setUseCase.run(useCase, sessionId);
    },
    addMessage(sessionId, role, content, files) {
      stmts.addMessage.run(
        sessionId,
        role,
        content,
        files?.length ? JSON.stringify(files) : null
      );
    },
    getMessages(sessionId) {
      return stmts.getMessages.all(sessionId) as MessageRow[];
    },
    saveReport(sessionId, useCase, mode, content) {
      const info = stmts.saveReport.run(sessionId, useCase, mode, content);
      return Number(info.lastInsertRowid);
    },
    getReport(id) {
      return stmts.getReport.get(id) as ReportRow | undefined;
    },
    getReportsBySession(sessionId) {
      return stmts.getReportsBySession.all(sessionId) as ReportRow[];
    },
  };
}

// ---------- In-memory fallback ----------

function memoryStore(): Store {
  const sessions = new Map<string, SessionRow>();
  const messages = new Map<string, MessageRow[]>();
  const reports: ReportRow[] = [];
  let msgId = 0;
  let rptId = 0;

  return {
    createSession(row) {
      const now = new Date().toISOString();
      sessions.set(row.id, { ...row, created_at: now, updated_at: now });
    },
    getSession(id) {
      return sessions.get(id);
    },
    touchSession(id, agentId, agentName) {
      const s = sessions.get(id);
      if (!s) return;
      s.updated_at = new Date().toISOString();
      if (agentId) s.agent_id = agentId;
      if (agentName) s.agent_name = agentName;
    },
    deleteSession(id) {
      sessions.delete(id);
      messages.delete(id);
    },
    listSessions(limit = 50) {
      return [...sessions.values()]
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, limit);
    },
    setUseCase(sessionId, useCase) {
      const s = sessions.get(sessionId);
      if (s) {
        s.use_case = useCase;
        s.updated_at = new Date().toISOString();
      }
    },
    addMessage(sessionId, role, content, files) {
      const arr = messages.get(sessionId) ?? [];
      arr.push({
        id: ++msgId,
        session_id: sessionId,
        role,
        content,
        files: files?.length ? JSON.stringify(files) : null,
        created_at: new Date().toISOString(),
      });
      messages.set(sessionId, arr);
    },
    getMessages(sessionId) {
      return messages.get(sessionId) ?? [];
    },
    saveReport(sessionId, useCase, mode, content) {
      const r: ReportRow = {
        id: ++rptId,
        session_id: sessionId,
        use_case: useCase,
        mode,
        content,
        created_at: new Date().toISOString(),
      };
      reports.push(r);
      return r.id;
    },
    getReport(id) {
      return reports.find((r) => r.id === id);
    },
    getReportsBySession(sessionId) {
      return reports
        .filter((r) => r.session_id === sessionId)
        .sort((a, b) => b.id - a.id);
    },
  };
}

// ---------- Export singleton ----------

export const store: Store = sqliteStore() ?? memoryStore();
