import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Scale } from 'lucide-react'
import { RiskBadge } from './RiskBadge'
import { extractRiskLevel } from '../../utils/markdown'

interface CaseBriefSection {
  title: string
  content: string
}

interface CaseBriefCardProps {
  content: string
  agentName: string
}

// Try to parse a structured case brief from agent output
function parseCaseBrief(content: string): CaseBriefSection[] | null {
  const sections: CaseBriefSection[] = []

  // Match Roman numeral sections like "I. DOS FATOS" or "II. DO DIREITO"
  const sectionPattern = /\*{0,2}([IVX]+\.\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)\*{0,2}\n([\s\S]*?)(?=\n\*{0,2}[IVX]+\.\s+|$)/gi
  let match

  while ((match = sectionPattern.exec(content)) !== null) {
    sections.push({
      title: match[1].trim().replace(/\*/g, ''),
      content: match[2].trim(),
    })
  }

  return sections.length >= 2 ? sections : null
}

export const CaseBriefCard: React.FC<CaseBriefCardProps> = ({
  content,
  agentName,
}) => {
  const [expanded, setExpanded] = useState(true)
  const sections = parseCaseBrief(content)
  const riskLevel = extractRiskLevel(content)

  if (!sections) return null

  return (
    <div
      className="mt-3 rounded-lg overflow-hidden"
      style={{
        border: '1px solid #353B47',
        background: '#131620',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid #2A2F3A' : 'none', background: '#1A1D24' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Scale size={15} style={{ color: '#D4A853' }} />
          <span className="text-sm font-semibold" style={{ color: '#E8EAF0' }}>
            Peça Processual — {agentName}
          </span>
          {riskLevel && (
            <RiskBadge level={riskLevel} className="ml-2" />
          )}
        </div>
        <button
          className="flex items-center gap-1 text-xs"
          style={{ color: '#5C6370' }}
        >
          <FileText size={12} />
          {sections.length} seções
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Sections */}
      {expanded && (
        <div className="divide-y" style={{ borderColor: '#2A2F3A' }}>
          {sections.map((section, idx) => (
            <div key={idx} className="px-4 py-3">
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#D4A853', letterSpacing: '0.8px' }}
              >
                {section.title}
              </h4>
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: '#9BA3B2' }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
