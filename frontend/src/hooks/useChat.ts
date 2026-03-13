import { useState, useCallback, useRef, useEffect } from 'react'
import type { Message, Session, UploadedFile } from '../types'

const SESSION_STORAGE_KEY = 'aiox_sessions'
const MESSAGES_STORAGE_KEY = 'aiox_messages'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function generateSessionId(): string {
  return 'sess-' + Math.random().toString(36).slice(2, 10)
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors
  }
}

interface UseChatReturn {
  sessions: Session[]
  activeSessionId: string | null
  messages: Message[]
  isStreaming: boolean
  pendingFiles: UploadedFile[]
  createSession: (agentId: string, agentName: string) => string
  selectSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  sendMessage: (
    text: string,
    agentId: string,
    agentName: string,
    files?: UploadedFile[]
  ) => Promise<void>
  addPendingFile: (file: UploadedFile) => void
  removePendingFile: (fileId: string) => void
  clearPendingFiles: () => void
  uploadFile: (file: File, agentId: string) => Promise<UploadedFile | null>
  resetHistory: (sessionId: string) => Promise<void>
  stopStreaming: () => void
}

export function useChat(): UseChatReturn {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = loadFromStorage<Session[]>(SESSION_STORAGE_KEY, [])
    return stored.map((s) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }))
  })

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
    const stored = loadFromStorage<Record<string, Message[]>>(
      MESSAGES_STORAGE_KEY,
      {}
    )
    // Restore dates
    const restored: Record<string, Message[]> = {}
    for (const [sid, msgs] of Object.entries(stored)) {
      restored[sid] = msgs.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }))
    }
    return restored
  })

  const [isStreaming, setIsStreaming] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([])
  const abortRef = useRef<(() => void) | null>(null)

  // Persist sessions to storage
  useEffect(() => {
    saveToStorage(SESSION_STORAGE_KEY, sessions)
  }, [sessions])

  useEffect(() => {
    saveToStorage(MESSAGES_STORAGE_KEY, allMessages)
  }, [allMessages])

  const messages = activeSessionId ? allMessages[activeSessionId] || [] : []

  const createSession = useCallback(
    (agentId: string, agentName: string): string => {
      const id = generateSessionId()
      const newSession: Session = {
        id,
        title: 'Nova sessão',
        agentId,
        agentName,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
      }
      setSessions((prev) => [newSession, ...prev])
      setAllMessages((prev) => ({ ...prev, [id]: [] }))
      setActiveSessionId(id)
      return id
    },
    []
  )

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
  }, [])

  const deleteSession = useCallback(
    async (sessionId: string) => {
      // Fire-and-forget session cleanup on server
      fetch(`/api/session/${sessionId}`, { method: 'DELETE' }).catch(() => {})

      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setAllMessages((prev) => {
        const next = { ...prev }
        delete next[sessionId]
        return next
      })

      if (activeSessionId === sessionId) {
        setActiveSessionId(null)
      }
    },
    [activeSessionId]
  )

  const addMessage = useCallback(
    (sessionId: string, message: Message) => {
      setAllMessages((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), message],
      }))
    },
    []
  )

  const updateLastMessage = useCallback(
    (sessionId: string, updater: (msg: Message) => Message) => {
      setAllMessages((prev) => {
        const msgs = prev[sessionId] || []
        if (msgs.length === 0) return prev
        const updated = [...msgs]
        updated[updated.length - 1] = updater(updated[updated.length - 1])
        return { ...prev, [sessionId]: updated }
      })
    },
    []
  )

  const updateSessionMeta = useCallback(
    (sessionId: string, firstUserText?: string) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s
          return {
            ...s,
            title:
              firstUserText && s.messageCount === 0
                ? firstUserText.slice(0, 50) + (firstUserText.length > 50 ? '…' : '')
                : s.title,
            messageCount: s.messageCount + 1,
            updatedAt: new Date(),
          }
        })
      )
    },
    []
  )

  const sendMessage = useCallback(
    async (
      text: string,
      agentId: string,
      agentName: string,
      files: UploadedFile[] = []
    ) => {
      if (isStreaming) return
      if (!text.trim()) return

      // Ensure we have an active session
      let sessionId = activeSessionId
      if (!sessionId) {
        sessionId = createSession(agentId, agentName)
      }

      const currentSession = sessions.find((s) => s.id === sessionId)
      const isFirstMessage = !currentSession || currentSession.messageCount === 0

      // Add user message
      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
        files,
      }
      addMessage(sessionId, userMsg)
      updateSessionMeta(sessionId, isFirstMessage ? text : undefined)

      // Add placeholder agent message
      const agentMsg: Message = {
        id: generateId(),
        role: 'agent',
        content: '',
        agentId,
        agentName,
        timestamp: new Date(),
        isStreaming: true,
      }
      addMessage(sessionId, agentMsg)

      setIsStreaming(true)

      // Build URL for SSE
      const fileIds = files.map((f) => f.fileId).join(',')
      const params = new URLSearchParams({
        sessionId,
        agentId,
        message: text,
        fileIds,
      })
      const url = `/api/chat?${params}`

      let fullContent = ''
      const es = new EventSource(url)
      let closed = false

      const close = () => {
        if (!closed) {
          closed = true
          es.close()
        }
      }
      abortRef.current = close

      es.addEventListener('chunk', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as { text: string }
          fullContent += data.text
          updateLastMessage(sessionId!, (msg) => ({
            ...msg,
            content: fullContent,
            isStreaming: true,
          }))
        } catch {
          // ignore parse errors
        }
      })

      es.addEventListener('done', () => {
        close()
        updateLastMessage(sessionId!, (msg) => ({
          ...msg,
          isStreaming: false,
        }))
        updateSessionMeta(sessionId!, undefined)
        setIsStreaming(false)
        abortRef.current = null
      })

      es.addEventListener('error', (e: MessageEvent) => {
        close()
        const errorMsg = e.data
          ? (JSON.parse(e.data) as { message: string }).message
          : 'Erro na comunicação com o servidor'
        updateLastMessage(sessionId!, (msg) => ({
          ...msg,
          content: fullContent || `⚠ ${errorMsg}`,
          isStreaming: false,
        }))
        setIsStreaming(false)
        abortRef.current = null
      })

      es.onerror = () => {
        if (es.readyState === EventSource.CLOSED) {
          return
        }
        close()
        updateLastMessage(sessionId!, (msg) => ({
          ...msg,
          content: fullContent || '⚠ Conexão interrompida.',
          isStreaming: false,
        }))
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [
      isStreaming,
      activeSessionId,
      sessions,
      createSession,
      addMessage,
      updateLastMessage,
      updateSessionMeta,
    ]
  )

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current()
      abortRef.current = null
    }
    setIsStreaming(false)

    if (activeSessionId) {
      updateLastMessage(activeSessionId, (msg) => ({
        ...msg,
        isStreaming: false,
        content: msg.content || '(interrompido)',
      }))
    }
  }, [activeSessionId, updateLastMessage])

  const addPendingFile = useCallback((file: UploadedFile) => {
    setPendingFiles((prev) => [...prev, file])
  }, [])

  const removePendingFile = useCallback((fileId: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.fileId !== fileId))
  }, [])

  const clearPendingFiles = useCallback(() => {
    setPendingFiles([])
  }, [])

  const uploadFile = useCallback(
    async (file: File, agentId: string): Promise<UploadedFile | null> => {
      const sessionId = activeSessionId || generateSessionId()
      const fd = new FormData()
      fd.append('file', file)
      fd.append('sessionId', sessionId)
      fd.append('agentId', agentId)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        return {
          fileId: data.fileId,
          filename: data.filename,
          sizeKb: data.sizeKb,
        }
      } catch (err) {
        console.error('Upload error:', err)
        return null
      }
    },
    [activeSessionId]
  )

  const resetHistory = useCallback(async (sessionId: string) => {
    try {
      await fetch('/api/session/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      // Add system message
      const sysMsg: Message = {
        id: generateId(),
        role: 'system',
        content: 'Histórico da sessão limpo.',
        timestamp: new Date(),
      }
      setAllMessages((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), sysMsg],
      }))
    } catch (err) {
      console.error('Reset error:', err)
    }
  }, [])

  // Notify server on page close
  useEffect(() => {
    const cleanup = () => {
      if (activeSessionId) {
        navigator.sendBeacon(`/api/session/${activeSessionId}`)
      }
    }
    window.addEventListener('beforeunload', cleanup)
    return () => window.removeEventListener('beforeunload', cleanup)
  }, [activeSessionId])

  return {
    sessions,
    activeSessionId,
    messages,
    isStreaming,
    pendingFiles,
    createSession,
    selectSession,
    deleteSession,
    sendMessage,
    addPendingFile,
    removePendingFile,
    clearPendingFiles,
    uploadFile,
    resetHistory,
    stopStreaming,
  }
}
