// ── Agent & Squad types ────────────────────────────────────────────────────────

export interface AgentCommand {
  trigger: string
  description: string
  example?: string
}

export interface AgentDefinition {
  id: string
  name: string
  squad: string
  icon: string
  title: string
  description: string
  commands: AgentCommand[]
  color: string
}

export interface ApiSquad {
  id: string
  agents: ApiAgent[]
}

export interface ApiAgent {
  id: string
  name: string
  squad: string
}

// ── Message types ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'agent' | 'system'

export interface UploadedFile {
  fileId: string
  filename: string
  sizeKb?: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  agentId?: string
  agentName?: string
  timestamp: Date
  isStreaming?: boolean
  files?: UploadedFile[]
}

// ── Session types ──────────────────────────────────────────────────────────────

export interface Session {
  id: string
  title: string
  agentId: string
  agentName: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  previewText?: string
}

// ── Chat state ─────────────────────────────────────────────────────────────────

export interface ChatState {
  sessions: Session[]
  activeSessionId: string | null
  messages: Record<string, Message[]>
  activeAgentId: string | null
  isStreaming: boolean
  pendingFiles: UploadedFile[]
}

// ── API response types ─────────────────────────────────────────────────────────

export interface UploadResponse {
  ok: boolean
  fileId: string
  filename: string
  sizeKb: string
}

export interface SseStartEvent {
  agent: string
}

export interface SseChunkEvent {
  text: string
}

export interface SseDoneEvent {
  ok: boolean
}

export interface SseErrorEvent {
  message: string
}
