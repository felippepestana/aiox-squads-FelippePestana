import React from 'react'
import { Settings, Zap, Hash } from 'lucide-react'
import type { AgentDefinition, Session } from '../../types'

interface AgentHeaderProps {
  activeAgent: AgentDefinition | null
  activeSession: Session | null
  onResetHistory: () => void
  onCommandClick: (command: string) => void
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  activeAgent,
  activeSession,
  onResetHistory,
  onCommandClick,
}) => {
  if (!activeAgent) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
        style={{
          borderBottom: '1px solid #2A2F3A',
          background: '#111318',
          minHeight: '56px',
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
          style={{ background: '#1A1D24', border: '1px solid #2A2F3A' }}
        >
          ⚖️
        </div>
        <div>
          <h1 className="text-sm font-semibold" style={{ color: '#E8EAF0' }}>
            AIOX Legal
          </h1>
          <p className="text-xs" style={{ color: '#5C6370' }}>
            Sistema Jurídico Inteligente
          </p>
        </div>
      </div>
    )
  }

  const quickCommands = activeAgent.commands.slice(0, 4)
  const messageCount = activeSession?.messageCount || 0

  return (
    <div
      className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
      style={{
        borderBottom: '1px solid #2A2F3A',
        background: '#111318',
        minHeight: '56px',
      }}
    >
      {/* Agent icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{
          background: '#1A1D24',
          border: `1px solid ${activeAgent.color}40`,
        }}
      >
        {activeAgent.icon}
      </div>

      {/* Agent info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold truncate" style={{ color: '#E8EAF0' }}>
            {activeAgent.name}
          </h2>
          {/* Online indicator */}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#4CAF7A' }}
            title="Online"
          />
          <span
            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: `${activeAgent.color}18`,
              border: `1px solid ${activeAgent.color}35`,
              color: activeAgent.color,
            }}
          >
            {activeAgent.squad}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: '#5C6370' }}>
          {activeAgent.title}
        </p>
      </div>

      {/* Quick command chips */}
      <div className="hidden lg:flex items-center gap-1.5">
        {quickCommands.map((cmd) => (
          <button
            key={cmd.trigger}
            onClick={() => onCommandClick(cmd.trigger + ' ')}
            className="text-xs px-2.5 py-1 rounded-full transition-all font-mono"
            style={{
              background: '#1A1D24',
              border: '1px solid #2A2F3A',
              color: '#D4A853',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#22262F'
              el.style.borderColor = '#D4A85350'
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#1A1D24'
              el.style.borderColor = '#2A2F3A'
            }}
            title={cmd.description}
          >
            {cmd.trigger}
          </button>
        ))}
      </div>

      {/* Token/message counter */}
      {messageCount > 0 && (
        <div
          className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded"
          style={{
            color: '#5C6370',
            background: '#1A1D24',
            border: '1px solid #2A2F3A',
          }}
        >
          <Hash size={11} />
          {messageCount} msgs
        </div>
      )}

      {/* Streaming indicator */}
      <div className="flex items-center gap-1 text-xs" style={{ color: '#5C6370' }}>
        <Zap size={12} style={{ color: '#4CAF7A' }} />
        <span className="hidden sm:inline">ao vivo</span>
      </div>

      {/* Settings / reset button */}
      <button
        onClick={onResetHistory}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0"
        style={{
          background: 'transparent',
          border: '1px solid #2A2F3A',
          color: '#5C6370',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#1A1D24'
          el.style.color = '#E8EAF0'
        }}
        onMouseOut={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'transparent'
          el.style.color = '#5C6370'
        }}
        title="Configurações / Limpar histórico"
      >
        <Settings size={15} />
      </button>
    </div>
  )
}
