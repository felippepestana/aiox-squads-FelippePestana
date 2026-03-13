import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import { Send, Paperclip, Square, X } from 'lucide-react'
import type { AgentDefinition, UploadedFile } from '../../types'
import { CommandSuggestions } from './CommandSuggestions'

interface ChatInputProps {
  activeAgent: AgentDefinition | null
  isStreaming: boolean
  pendingFiles: UploadedFile[]
  onSend: (text: string, files: UploadedFile[]) => void
  onFileUpload: (file: File) => Promise<UploadedFile | null>
  onRemoveFile: (fileId: string) => void
  onStop: () => void
}

const MAX_CHARS = 10000
const MAX_HEIGHT = 200

export const ChatInput: React.FC<ChatInputProps> = ({
  activeAgent,
  isStreaming,
  pendingFiles,
  onSend,
  onFileUpload,
  onRemoveFile,
  onStop,
}) => {
  const [text, setText] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [commandFilter, setCommandFilter] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, MAX_HEIGHT) + 'px'
  }, [])

  useEffect(() => {
    resizeTextarea()
  }, [text, resizeTextarea])

  // Detect `*` command trigger
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      setText(val)

      // Show command suggestions when text starts with or contains * at start of word
      const lastWord = val.split(/\s/).pop() || ''
      if (lastWord.startsWith('*')) {
        setCommandFilter(lastWord.slice(1))
        setShowCommands(true)
      } else {
        setShowCommands(false)
        setCommandFilter('')
      }
    },
    []
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        setShowCommands(false)
        return
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, pendingFiles, isStreaming, showCommands]
  )

  const handleSend = useCallback(() => {
    if (isStreaming) return
    const trimmed = text.trim()
    if (!trimmed && pendingFiles.length === 0) return
    setShowCommands(false)
    onSend(trimmed, pendingFiles)
    setText('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, pendingFiles, isStreaming, onSend])

  const handleCommandSelect = useCallback(
    (command: string) => {
      // Replace the last *word with the selected command
      const words = text.split(/(\s+)/)
      const lastIdx = words.length - 1
      if (words[lastIdx].startsWith('*')) {
        words[lastIdx] = command
      } else {
        words.push(command)
      }
      const newText = words.join('')
      setText(newText)
      setShowCommands(false)
      textareaRef.current?.focus()
    },
    [text]
  )

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return
      setIsUploading(true)
      for (const file of files) {
        const uploaded = await onFileUpload(file)
        if (uploaded) {
          // Files are added to pendingFiles via parent
        }
      }
      setIsUploading(false)
      e.target.value = ''
    },
    [onFileUpload]
  )

  const canSend = !isStreaming && (text.trim().length > 0 || pendingFiles.length > 0)
  const charCount = text.length
  const isNearLimit = charCount > MAX_CHARS * 0.8

  return (
    <div
      className="flex-shrink-0"
      style={{
        borderTop: '1px solid #2A2F3A',
        background: '#111318',
        padding: '12px 16px',
      }}
    >
      {/* Pending files chips */}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {pendingFiles.map((f) => (
            <div
              key={f.fileId}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(79, 142, 247, 0.1)',
                border: '1px solid rgba(79, 142, 247, 0.2)',
                color: '#6BA3FF',
              }}
            >
              <span>📄 {f.filename}</span>
              {f.sizeKb && (
                <span style={{ color: '#5C6370' }}>({f.sizeKb} KB)</span>
              )}
              <button
                onClick={() => onRemoveFile(f.fileId)}
                className="flex items-center justify-center w-3.5 h-3.5 rounded-full transition-colors"
                style={{ color: '#5C6370' }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#E85454')
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#5C6370')
                }
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="relative flex items-end gap-2">
        {/* Command suggestions popover */}
        {showCommands && activeAgent && activeAgent.commands.length > 0 && (
          <CommandSuggestions
            commands={activeAgent.commands}
            filter={commandFilter}
            onSelect={handleCommandSelect}
            onClose={() => setShowCommands(false)}
            anchorRef={textareaRef}
          />
        )}

        {/* File upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || isUploading}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all"
          style={{
            background: 'transparent',
            border: '1px solid #2A2F3A',
            color: isUploading ? '#4F8EF7' : '#5C6370',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            opacity: isStreaming ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!isStreaming)
              (e.currentTarget as HTMLElement).style.borderColor = '#353B47'
          }}
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = '#2A2F3A')
          }
          title="Anexar arquivo (PDF, TXT, DOCX)"
        >
          <Paperclip size={16} className={isUploading ? 'animate-pulse-soft' : ''} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.txt,.md,.json,.csv,.png,.jpg,.jpeg,.webp,.gif,.docx"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              activeAgent
                ? `Mensagem para ${activeAgent.name}… (Enter para enviar, Shift+Enter para nova linha, * para comandos)`
                : 'Selecione um agente para começar…'
            }
            disabled={!activeAgent || isStreaming}
            rows={1}
            maxLength={MAX_CHARS}
            className="w-full resize-none text-sm rounded-lg px-4 py-2.5 transition-all"
            style={{
              background: '#1A1D24',
              border: '1px solid #2A2F3A',
              color: '#E8EAF0',
              outline: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6',
              minHeight: '44px',
              maxHeight: `${MAX_HEIGHT}px`,
              caretColor: '#4F8EF7',
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = '#4F8EF7')
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = '#2A2F3A')
            }
          />
          {/* Character counter */}
          {isNearLimit && (
            <span
              className="absolute bottom-2 right-3 text-xs"
              style={{
                color: charCount >= MAX_CHARS ? '#E85454' : '#E8A93A',
              }}
            >
              {charCount}/{MAX_CHARS}
            </span>
          )}
        </div>

        {/* Send / Stop button */}
        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all"
            style={{
              background: 'rgba(232, 84, 84, 0.15)',
              border: '1px solid rgba(232, 84, 84, 0.3)',
              color: '#E85454',
              cursor: 'pointer',
            }}
            title="Parar geração"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all"
            style={{
              background: canSend ? '#4F8EF7' : '#1A1D24',
              border: '1px solid ' + (canSend ? '#4F8EF7' : '#2A2F3A'),
              color: canSend ? '#0A0B0E' : '#5C6370',
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
            onMouseOver={(e) => {
              if (canSend)
                (e.currentTarget as HTMLElement).style.background = '#6BA3FF'
            }}
            onMouseOut={(e) => {
              if (canSend)
                (e.currentTarget as HTMLElement).style.background = '#4F8EF7'
            }}
            title="Enviar mensagem (Enter)"
          >
            <Send size={15} />
          </button>
        )}
      </div>

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className="inline-flex gap-0.5"
            style={{ color: '#4F8EF7' }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-1 h-1 rounded-full"
                style={{
                  background: '#4F8EF7',
                  animation: `typing-dot 1.4s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </span>
          <span className="text-xs" style={{ color: '#5C6370' }}>
            Aguardando resposta…
          </span>
        </div>
      )}
    </div>
  )
}
