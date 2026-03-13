import React, { useEffect, useRef } from 'react'
import type { AgentCommand } from '../../types'

interface CommandSuggestionsProps {
  commands: AgentCommand[]
  filter: string
  onSelect: (command: string) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLTextAreaElement | null>
}

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  commands,
  filter,
  onSelect,
  onClose,
  anchorRef: _anchorRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = filter
    ? commands.filter(
        (c) =>
          c.trigger.toLowerCase().includes(filter.toLowerCase()) ||
          c.description.toLowerCase().includes(filter.toLowerCase())
      )
    : commands

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  if (filtered.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full left-0 right-0 mb-2 rounded-lg overflow-hidden z-50 animate-slide-up"
      style={{
        background: '#1A1D24',
        border: '1px solid #353B47',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
        maxHeight: '280px',
        overflowY: 'auto',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: '#2A2F3A' }}
      >
        <span
          className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
          style={{ background: '#2A2F3A', color: '#D4A853' }}
        >
          *
        </span>
        <span className="text-xs" style={{ color: '#5C6370' }}>
          Comandos disponíveis — clique para inserir
        </span>
      </div>

      <div className="py-1">
        {filtered.map((cmd) => (
          <button
            key={cmd.trigger}
            className="w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors"
            style={{ outline: 'none' }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = '#22262F'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
            onClick={() => onSelect(cmd.trigger + ' ')}
          >
            <span
              className="text-sm font-mono font-semibold flex-shrink-0 mt-0.5"
              style={{ color: '#D4A853', minWidth: '100px' }}
            >
              {cmd.trigger}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm" style={{ color: '#E8EAF0' }}>
                {cmd.description}
              </span>
              {cmd.example && (
                <span
                  className="text-xs font-mono truncate"
                  style={{ color: '#5C6370' }}
                >
                  {cmd.example}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
