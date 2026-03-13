import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Sidebar } from './components/Sidebar/Sidebar'
import { AgentHeader } from './components/Header/AgentHeader'
import { ChatArea } from './components/Chat/ChatArea'
import { ChatInput } from './components/Input/ChatInput'
import type { AgentDefinition, UploadedFile } from './types'
import { useAgents } from './hooks/useAgents'
import { useChat } from './hooks/useChat'

// Simple toast notification hook
function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ message, type })
      timerRef.current = setTimeout(() => setToast(null), 3000)
    },
    []
  )

  return { toast, showToast }
}

export default function App() {
  const { squads, allAgents, activeAgent, setActiveAgent, isLoading, error, refresh } =
    useAgents()

  const {
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
  } = useChat()

  const { toast, showToast } = useToast()

  // Input ref for inserting quick commands from header
  const [injectedCommand, setInjectedCommand] = useState<string | null>(null)

  // Handle agent selection — also switch agent on server for active session
  const handleSelectAgent = useCallback(
    async (agent: AgentDefinition) => {
      setActiveAgent(agent)

      // If there's an active session, switch the agent on the server
      if (activeSessionId) {
        try {
          await fetch('/api/session/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: activeSessionId, agentId: agent.id }),
          })
        } catch {
          // Silent fail
        }
      }
    },
    [setActiveAgent, activeSessionId]
  )

  // Handle new session
  const handleNewSession = useCallback(() => {
    if (!activeAgent) return
    createSession(activeAgent.id, activeAgent.name)
    showToast(`Nova sessão com ${activeAgent.name}`, 'success')
  }, [activeAgent, createSession, showToast])

  // Handle send
  const handleSend = useCallback(
    async (text: string, files: UploadedFile[]) => {
      if (!activeAgent) {
        showToast('Selecione um agente primeiro', 'error')
        return
      }

      let sid = activeSessionId
      if (!sid) {
        sid = createSession(activeAgent.id, activeAgent.name)
      }

      clearPendingFiles()
      await sendMessage(text, activeAgent.id, activeAgent.name, files)
    },
    [
      activeAgent,
      activeSessionId,
      createSession,
      clearPendingFiles,
      sendMessage,
      showToast,
    ]
  )

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      if (!activeAgent) {
        showToast('Selecione um agente antes de enviar arquivos', 'error')
        return null
      }

      showToast(`Enviando ${file.name}…`, 'info')
      const uploaded = await uploadFile(file, activeAgent.id)

      if (uploaded) {
        addPendingFile(uploaded)
        showToast(`${file.name} pronto para envio`, 'success')
        return uploaded
      } else {
        showToast(`Erro ao enviar ${file.name}`, 'error')
        return null
      }
    },
    [activeAgent, uploadFile, addPendingFile, showToast]
  )

  // Handle reset history
  const handleResetHistory = useCallback(async () => {
    if (!activeSessionId) return
    await resetHistory(activeSessionId)
    showToast('Histórico limpo', 'info')
  }, [activeSessionId, resetHistory, showToast])

  // Handle quick command from header
  const handleCommandClick = useCallback((command: string) => {
    setInjectedCommand(command)
    // Clear after a tick so ChatInput can pick it up
    setTimeout(() => setInjectedCommand(null), 100)
  }, [])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null

  // Keyboard shortcut: Ctrl+K for agent focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Focus the first agent button in sidebar
        const firstAgent = document.querySelector<HTMLButtonElement>(
          '[data-agent-btn]'
        )
        firstAgent?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: '#0A0B0E' }}
    >
      {/* Sidebar */}
      <Sidebar
        squads={squads}
        allAgents={allAgents}
        activeAgent={activeAgent}
        sessions={sessions}
        activeSessionId={activeSessionId}
        isLoading={isLoading}
        error={error}
        onSelectAgent={handleSelectAgent}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onNewSession={handleNewSession}
        onRefresh={refresh}
      />

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Agent header bar */}
        <AgentHeader
          activeAgent={activeAgent}
          activeSession={activeSession}
          onResetHistory={handleResetHistory}
          onCommandClick={handleCommandClick}
        />

        {/* Chat messages */}
        <ChatArea
          messages={messages}
          activeAgent={activeAgent}
          isStreaming={isStreaming}
        />

        {/* Input area */}
        <ChatInputWrapper
          activeAgent={activeAgent}
          isStreaming={isStreaming}
          pendingFiles={pendingFiles}
          injectedCommand={injectedCommand}
          onSend={handleSend}
          onFileUpload={handleFileUpload}
          onRemoveFile={removePendingFile}
          onStop={stopStreaming}
        />
      </main>

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  )
}

// Wrapper to handle command injection into input
interface ChatInputWrapperProps {
  activeAgent: AgentDefinition | null
  isStreaming: boolean
  pendingFiles: UploadedFile[]
  injectedCommand: string | null
  onSend: (text: string, files: UploadedFile[]) => void
  onFileUpload: (file: File) => Promise<UploadedFile | null>
  onRemoveFile: (fileId: string) => void
  onStop: () => void
}

function ChatInputWrapper({
  injectedCommand,
  ...props
}: ChatInputWrapperProps) {
  const [externalText, setExternalText] = useState<string | null>(null)

  useEffect(() => {
    if (injectedCommand) {
      setExternalText(injectedCommand)
    }
  }, [injectedCommand])

  // We pass externalText down but ChatInput manages its own state internally.
  // When injectedCommand changes, we signal via a key that forces re-render
  // with a pre-filled value. This is a simple approach.
  return (
    <ChatInputControlled
      {...props}
      prefillText={externalText}
      onPrefillConsumed={() => setExternalText(null)}
    />
  )
}

// Controlled variant that accepts prefill
interface ChatInputControlledProps extends Omit<ChatInputWrapperProps, 'injectedCommand'> {
  prefillText: string | null
  onPrefillConsumed: () => void
}

function ChatInputControlled({
  activeAgent,
  isStreaming,
  pendingFiles,
  prefillText,
  onPrefillConsumed: _onPrefillConsumed,
  onSend,
  onFileUpload,
  onRemoveFile,
  onStop,
}: ChatInputControlledProps) {
  // Re-use key trick to inject command — simpler than prop drilling text state
  return (
    <ChatInput
      key={prefillText || 'default'}
      activeAgent={activeAgent}
      isStreaming={isStreaming}
      pendingFiles={pendingFiles}
      onSend={onSend}
      onFileUpload={onFileUpload}
      onRemoveFile={onRemoveFile}
      onStop={onStop}
    />
  )
}

// Toast component
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

function Toast({ message, type }: ToastProps) {
  const colors = {
    success: { color: '#4CAF7A', border: 'rgba(76, 175, 122, 0.3)', bg: 'rgba(76, 175, 122, 0.1)' },
    error: { color: '#E85454', border: 'rgba(232, 84, 84, 0.3)', bg: 'rgba(232, 84, 84, 0.1)' },
    info: { color: '#9BA3B2', border: '#353B47', bg: '#1A1D24' },
  }[type]

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.color,
        padding: '9px 18px',
        borderRadius: '8px',
        fontSize: '13px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
