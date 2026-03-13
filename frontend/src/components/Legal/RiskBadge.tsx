import React from 'react'
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

type RiskLevel = 'alta' | 'média' | 'baixa'

interface RiskBadgeProps {
  level: RiskLevel
  label?: string
  className?: string
}

const RISK_CONFIG = {
  alta: {
    color: '#E85454',
    bg: 'rgba(232, 84, 84, 0.12)',
    border: 'rgba(232, 84, 84, 0.3)',
    icon: AlertCircle,
    label: 'Risco Alto',
  },
  média: {
    color: '#E8A93A',
    bg: 'rgba(232, 169, 58, 0.12)',
    border: 'rgba(232, 169, 58, 0.3)',
    icon: AlertTriangle,
    label: 'Risco Médio',
  },
  baixa: {
    color: '#4CAF7A',
    bg: 'rgba(76, 175, 122, 0.12)',
    border: 'rgba(76, 175, 122, 0.3)',
    icon: CheckCircle,
    label: 'Risco Baixo',
  },
} satisfies Record<RiskLevel, unknown>

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  label,
  className = '',
}) => {
  const config = RISK_CONFIG[level]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${className}`}
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={12} />
      {label || config.label}
    </span>
  )
}
