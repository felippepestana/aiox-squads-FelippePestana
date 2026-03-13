import React, { useState, useCallback } from 'react'
import { Plus, Scale, ChevronDown, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import type { AgentDefinition, Session } from '../../types'
import type { SquadGroup } from '../../hooks/useAgents'
import { AgentItem } from './AgentItem'
import { SessionItem } from './SessionItem'
import { SQUAD_LABELS } from '../../data/agents'

interface SidebarProps {
  squads: SquadGroup[]
  allAgents: AgentDefinition[]
  activeAgent: AgentDefinition | null
  sessions: Session[]
  activeSessionId: string | null
  isLoading: boolean
  error: string | null
  onSelectAgent: (agent: AgentDefinition) => void
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onNewSession: () => void
  onRefresh: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  squads,
  activeAgent,
  sessions,
  activeSessionId,
  isLoading,
  error,
  onSelectAgent,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onRefresh,
}) => {
  const [collapsedSquads, setCollapsedSquads] = useState<Set<string>>(new Set())
  const [showAllSessions, setShowAllSessions] = useState(false)

  const toggleSquad = useCallback((squadId: string) => {
    setCollapsedSquads((prev) => {
      const next = new Set(prev)
      if (next.has(squadId)) {
        next.delete(squadId)
      } else {
        next.add(squadId)
      }
      return next
    })
  }, [])

  const visibleSessions = showAllSessions ? sessions : sessions.slice(0, 8)

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0"
      style={{
        width: '260px',
        background: '#111318',
        borderRight: '1px solid #2A2F3A',
      }}
    >
      {/* Brand header */}
      <div
        className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid #2A2F3A' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1A1D24 0%, #22262F 100%)',
            border: '1px solid #353B47',
          }}
        >
          <Scale size={16} style={{ color: '#D4A853' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold tracking-tight" style={{ color: '#E8EAF0' }}>
            AIOX Legal
          </h1>
          <p className="text-xs" style={{ color: '#5C6370' }}>
            Sistema Jurídico IA
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center w-7 h-7 rounded transition-all"
          style={{ color: '#5C6370', background: 'transparent' }}
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#E8EAF0')
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#5C6370')
          }
          title="Recarregar agentes"
        >
          <RefreshCw
            size={13}
            className={isLoading ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Agents section */}
        <div className="py-2">
          <div
            className="flex items-center gap-2 px-4 mb-2"
            style={{ marginTop: '4px' }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#5C6370', letterSpacing: '0.8px' }}
            >
              Agentes
            </span>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-3">
              <Loader2 size={14} className="animate-spin" style={{ color: '#4F8EF7' }} />
              <span className="text-xs" style={{ color: '#5C6370' }}>
                Carregando agentes…
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className="px-4 py-2">
              <p className="text-xs" style={{ color: '#E85454' }}>
                {error}
              </p>
              <button
                onClick={onRefresh}
                className="text-xs mt-1 underline"
                style={{ color: '#4F8EF7' }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Squad groups */}
          {squads.map((squad) => {
            const isCollapsed = collapsedSquads.has(squad.id)
            const label = SQUAD_LABELS[squad.id] || squad.label || squad.id

            return (
              <div key={squad.id} className="mb-1">
                {/* Squad header */}
                <button
                  onClick={() => toggleSquad(squad.id)}
                  className="flex items-center gap-1.5 w-full px-4 py-1.5 text-left transition-colors"
                  style={{ background: 'transparent' }}
                  onMouseOver={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      'rgba(255,255,255,0.02)')
                  }
                  onMouseOut={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'transparent')
                  }
                >
                  {isCollapsed ? (
                    <ChevronRight size={11} style={{ color: '#5C6370' }} />
                  ) : (
                    <ChevronDown size={11} style={{ color: '#5C6370' }} />
                  )}
                  <span
                    className="text-xs font-semibold uppercase tracking-wider truncate"
                    style={{
                      color: '#E8A93A',
                      letterSpacing: '0.5px',
                      fontSize: '10px',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="ml-auto text-xs"
                    style={{ color: '#5C6370', fontSize: '10px' }}
                  >
                    {squad.agents.length}
                  </span>
                </button>

                {/* Agent list */}
                {!isCollapsed && (
                  <div className="py-0.5">
                    {squad.agents.map((agent) => (
                      <AgentItem
                        key={agent.id}
                        agent={agent}
                        isActive={activeAgent?.id === agent.id}
                        onClick={() => onSelectAgent(agent)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sessions section */}
        {sessions.length > 0 && (
          <div
            className="py-2"
            style={{ borderTop: '1px solid #2A2F3A' }}
          >
            <div className="flex items-center justify-between px-4 mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#5C6370', letterSpacing: '0.8px' }}
              >
                Sessões Recentes
              </span>
              <span
                className="text-xs"
                style={{ color: '#5C6370', fontSize: '10px' }}
              >
                {sessions.length}
              </span>
            </div>

            {visibleSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={activeSessionId === session.id}
                onClick={() => onSelectSession(session.id)}
                onDelete={() => onDeleteSession(session.id)}
              />
            ))}

            {sessions.length > 8 && (
              <button
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="w-full text-xs py-1.5 text-center transition-colors"
                style={{ color: '#5C6370' }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#9BA3B2')
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#5C6370')
                }
              >
                {showAllSessions
                  ? 'Mostrar menos'
                  : `Ver mais ${sessions.length - 8} sessões`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer: New session button */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: '1px solid #2A2F3A' }}
      >
        <button
          onClick={onNewSession}
          disabled={!activeAgent}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeAgent ? 'rgba(79, 142, 247, 0.12)' : '#1A1D24',
            border: activeAgent
              ? '1px solid rgba(79, 142, 247, 0.25)'
              : '1px solid #2A2F3A',
            color: activeAgent ? '#4F8EF7' : '#5C6370',
            cursor: activeAgent ? 'pointer' : 'not-allowed',
          }}
          onMouseOver={(e) => {
            if (activeAgent) {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(79, 142, 247, 0.2)'
            }
          }}
          onMouseOut={(e) => {
            if (activeAgent) {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(79, 142, 247, 0.12)'
            }
          }}
        >
          <Plus size={15} />
          Nova Sessão
        </button>
      </div>
    </aside>
  )
}
