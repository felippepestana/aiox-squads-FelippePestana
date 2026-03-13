import React, { useState } from 'react'
import { Trash2, MessageSquare } from 'lucide-react'
import type { Session } from '../../types'

interface SessionItemProps {
  session: Session
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isActive,
  onClick,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative flex items-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className="flex-1 flex items-start gap-2 px-3 py-2 text-left transition-all rounded-md mx-1 min-w-0"
        style={{
          width: 'calc(100% - 8px)',
          background: isActive ? '#1A1D24' : 'transparent',
          border: isActive ? '1px solid #2A2F3A' : '1px solid transparent',
        }}
        onMouseOver={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLElement).style.background = '#1A1D24'
        }}
        onMouseOut={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        <MessageSquare
          size={13}
          className="flex-shrink-0 mt-0.5"
          style={{ color: isActive ? '#4F8EF7' : '#5C6370' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-xs truncate"
              style={{
                color: isActive ? '#E8EAF0' : '#9BA3B2',
                fontWeight: isActive ? 500 : 400,
                maxWidth: '130px',
              }}
            >
              {session.title}
            </span>
            <span
              className="text-xs flex-shrink-0"
              style={{ color: '#5C6370', fontSize: '10px' }}
            >
              {formatDate(session.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-xs truncate"
              style={{ color: '#5C6370', fontSize: '10px' }}
            >
              {session.agentName}
            </span>
            {session.messageCount > 0 && (
              <span
                className="text-xs flex-shrink-0"
                style={{ color: '#353B47', fontSize: '10px' }}
              >
                · {session.messageCount} msgs
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Delete button */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute right-3 flex items-center justify-center w-5 h-5 rounded transition-all"
          style={{
            background: '#1A1D24',
            color: '#5C6370',
          }}
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#E85454')
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#5C6370')
          }
          title="Excluir sessão"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  )
}
