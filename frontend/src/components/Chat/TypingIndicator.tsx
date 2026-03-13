import React from 'react'

interface TypingIndicatorProps {
  agentName: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentName }) => {
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <span className="text-xs" style={{ color: '#5C6370' }}>
        {agentName} está digitando
      </span>
      <span className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: '#4F8EF7',
              animation: `typing-dot 1.4s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </span>
    </div>
  )
}
