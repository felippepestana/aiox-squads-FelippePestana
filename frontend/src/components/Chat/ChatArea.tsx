import React, { useEffect, useRef } from 'react'
import { Scale } from 'lucide-react'
import type { Message, AgentDefinition } from '../../types'
import { MessageBubble } from './MessageBubble'

interface ChatAreaProps {
  messages: Message[]
  activeAgent: AgentDefinition | null
  isStreaming: boolean
}

function WelcomeScreen({ agent }: { agent: AgentDefinition | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
        style={{ background: '#1A1D24', border: '1px solid #2A2F3A' }}
      >
        {agent ? agent.icon : <Scale size={32} style={{ color: '#D4A853' }} />}
      </div>

      {agent ? (
        <>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#E8EAF0' }}>
            {agent.name}
          </h2>
          <p className="text-sm mb-1" style={{ color: '#9BA3B2' }}>
            {agent.title}
          </p>
          <p
            className="text-sm max-w-sm leading-relaxed mb-6"
            style={{ color: '#5C6370' }}
          >
            {agent.description}
          </p>

          {/* Quick commands */}
          {agent.commands.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5C6370' }}>
                Comandos disponíveis
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {agent.commands.slice(0, 5).map((cmd) => (
                  <div
                    key={cmd.trigger}
                    className="flex flex-col items-start px-3 py-2 rounded-lg text-left"
                    style={{
                      background: '#1A1D24',
                      border: '1px solid #2A2F3A',
                      minWidth: '140px',
                    }}
                  >
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{ color: '#D4A853' }}
                    >
                      {cmd.trigger}
                    </span>
                    <span className="text-xs mt-0.5" style={{ color: '#5C6370' }}>
                      {cmd.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#E8EAF0' }}>
            AIOX Legal
          </h2>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#5C6370' }}>
            Selecione um agente na barra lateral para iniciar uma conversa jurídica.
          </p>
        </>
      )}

      <div
        className="mt-8 text-xs px-3 py-1.5 rounded-full"
        style={{
          color: '#5C6370',
          background: '#111318',
          border: '1px solid #2A2F3A',
        }}
      >
        Digite <span style={{ color: '#D4A853' }}>*</span> para ver comandos disponíveis
      </div>
    </div>
  )
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  activeAgent,
  isStreaming,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  const isEmpty = messages.length === 0

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      style={{ padding: isEmpty ? '0' : '16px 20px' }}
    >
      {isEmpty ? (
        <div className="h-full">
          <WelcomeScreen agent={activeAgent} />
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null
            const showAgent =
              msg.role === 'agent' &&
              (!prevMsg || prevMsg.role !== 'agent' || prevMsg.agentId !== msg.agentId)

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                showAgent={showAgent}
              />
            )
          })}
          <div ref={bottomRef} className="h-2" />
        </div>
      )}
    </div>
  )
}
