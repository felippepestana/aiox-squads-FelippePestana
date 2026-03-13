import React, { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import type { Message } from '../../types'
import { renderMarkdown, sanitizeHtml } from '../../utils/markdown'
import { TypingIndicator } from './TypingIndicator'

interface MessageBubbleProps {
  message: Message
  showAgent?: boolean
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAgent = true,
}) => {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isAgent = message.role === 'agent'

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = message.content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [message.content])

  // System messages
  if (isSystem) {
    return (
      <div className="flex justify-center my-1">
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{
            color: '#5C6370',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2A2F3A',
          }}
        >
          {message.content}
        </span>
      </div>
    )
  }

  const htmlContent = isAgent && message.content
    ? sanitizeHtml(renderMarkdown(message.content))
    : ''

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
      >
        {/* Label row */}
        <div
          className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {showAgent && isAgent && message.agentName && (
            <span className="text-xs font-medium" style={{ color: '#4F8EF7' }}>
              {message.agentName}
            </span>
          )}
          {isUser && (
            <span className="text-xs" style={{ color: '#5C6370' }}>
              Você
            </span>
          )}
          <span className="text-xs" style={{ color: '#5C6370' }}>
            {formatTime(message.timestamp)}
          </span>

          {/* Copy button */}
          {(hovered || copied) && message.content && !message.isStreaming && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition-all"
              style={{
                color: copied ? '#4CAF7A' : '#5C6370',
                background: 'rgba(255,255,255,0.05)',
              }}
              title="Copiar mensagem"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
            </button>
          )}
        </div>

        {/* Bubble */}
        <div
          className="relative rounded-lg"
          style={
            isUser
              ? {
                  background: 'rgba(79, 142, 247, 0.18)',
                  border: '1px solid rgba(79, 142, 247, 0.25)',
                  borderBottomRightRadius: '3px',
                  padding: '10px 14px',
                  maxWidth: '100%',
                }
              : {
                  background: '#1A1D24',
                  border: '1px solid #2A2F3A',
                  borderBottomLeftRadius: '3px',
                  padding: '10px 14px',
                  maxWidth: '100%',
                }
          }
        >
          {isUser ? (
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: '#E8EAF0' }}
            >
              {message.content}
            </p>
          ) : message.isStreaming && !message.content ? (
            <TypingIndicator agentName={message.agentName || 'Agente'} />
          ) : (
            <>
              {message.content && (
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}
              {message.isStreaming && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                  style={{
                    background: '#4F8EF7',
                    animation: 'pulse-soft 0.7s infinite',
                    verticalAlign: 'text-bottom',
                  }}
                />
              )}
            </>
          )}

          {/* Attached files indicator */}
          {message.files && message.files.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {message.files.map((f) => (
                <span
                  key={f.fileId}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(79, 142, 247, 0.1)',
                    border: '1px solid rgba(79, 142, 247, 0.2)',
                    color: '#6BA3FF',
                  }}
                >
                  📄 {f.filename}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
