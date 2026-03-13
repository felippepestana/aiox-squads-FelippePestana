import React from 'react'
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'

interface CitationBlockProps {
  quote: string
  reference: string
  verified?: boolean | null // true=verified, false=warning, null=unknown
  className?: string
}

export const CitationBlock: React.FC<CitationBlockProps> = ({
  quote,
  reference,
  verified = null,
  className = '',
}) => {
  const hasTribunalRef = /\b(STJ|STF|TST|TJ[A-Z]{2}|TRF\d?)\b/.test(reference)

  return (
    <div
      className={`my-3 rounded-r-lg py-3 px-4 ${className}`}
      style={{
        borderLeft: '3px solid #D4A853',
        background: 'rgba(212, 168, 83, 0.06)',
      }}
    >
      {/* Quote text */}
      <p
        className="text-sm leading-relaxed italic"
        style={{ color: '#c8b87a' }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Reference + verification badge */}
      <div className="flex items-start justify-between mt-2 gap-2">
        <p
          className="text-xs font-mono leading-relaxed"
          style={{ color: '#5C6370' }}
        >
          {reference}
        </p>

        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {verified === true && (
            <span
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{
                color: '#4CAF7A',
                background: 'rgba(76, 175, 122, 0.12)',
                border: '1px solid rgba(76, 175, 122, 0.25)',
              }}
            >
              <CheckCircle size={10} />
              Verificado
            </span>
          )}
          {verified === false && (
            <span
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{
                color: '#E8A93A',
                background: 'rgba(232, 169, 58, 0.12)',
                border: '1px solid rgba(232, 169, 58, 0.25)',
              }}
            >
              <AlertTriangle size={10} />
              Verificar
            </span>
          )}
          {hasTribunalRef && (
            <a
              href={`https://www.stj.jus.br`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-xs"
              style={{ color: '#5C6370' }}
              title="Verificar no tribunal"
            >
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
