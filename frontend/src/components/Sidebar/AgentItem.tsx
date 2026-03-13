import React, { useState } from 'react'
import type { AgentDefinition } from '../../types'

interface AgentItemProps {
  agent: AgentDefinition
  isActive: boolean
  onClick: () => void
}

export const AgentItem: React.FC<AgentItemProps> = ({
  agent,
  isActive,
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all rounded-md mx-1"
        style={{
          width: 'calc(100% - 8px)',
          background: isActive ? `${agent.color}14` : 'transparent',
          borderLeft: isActive ? `2px solid ${agent.color}` : '2px solid transparent',
          paddingLeft: isActive ? '10px' : '12px',
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
        {/* Status dot */}
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: isActive ? agent.color : '#353B47',
            boxShadow: isActive ? `0 0 4px ${agent.color}80` : 'none',
          }}
        />

        {/* Icon */}
        <span
          className="text-base flex-shrink-0 leading-none"
          style={{ opacity: isActive ? 1 : 0.7 }}
        >
          {agent.icon}
        </span>

        {/* Name */}
        <span
          className="text-sm truncate flex-1"
          style={{
            color: isActive ? '#E8EAF0' : '#9BA3B2',
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {agent.name}
        </span>

        {/* Commands count badge */}
        {isActive && agent.commands.length > 0 && (
          <span
            className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
            style={{
              background: `${agent.color}20`,
              color: agent.color,
              fontSize: '10px',
            }}
          >
            {agent.commands.length}
          </span>
        )}
      </button>

      {/* Tooltip on hover */}
      {showTooltip && !isActive && (
        <div
          className="absolute left-full top-0 ml-2 z-50 pointer-events-none animate-fade-in"
          style={{ minWidth: '200px', maxWidth: '260px' }}
        >
          <div
            className="p-3 rounded-lg text-xs shadow-xl"
            style={{
              background: '#1A1D24',
              border: '1px solid #353B47',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{agent.icon}</span>
              <span className="font-semibold" style={{ color: '#E8EAF0' }}>
                {agent.name}
              </span>
            </div>
            <p style={{ color: '#9BA3B2', lineHeight: '1.5' }}>
              {agent.description}
            </p>
            {agent.commands.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.commands.slice(0, 3).map((c) => (
                  <span
                    key={c.trigger}
                    className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: '#2A2F3A',
                      color: '#D4A853',
                    }}
                  >
                    {c.trigger}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
