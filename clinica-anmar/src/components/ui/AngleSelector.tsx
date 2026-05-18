import { motion } from 'framer-motion'

export type BodyAngle = 'front' | 'side' | 'back'

interface AngleSelectorProps {
  angle: BodyAngle
  onChange: (angle: BodyAngle) => void
}

const angles: { id: BodyAngle; label: string; icon: React.ReactNode }[] = [
  {
    id: 'front',
    label: 'Frontal',
    icon: (
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <ellipse cx="10" cy="4" rx="4" ry="4" fill="currentColor" fillOpacity="0.8"/>
        <path d="M5 10 C3 10 2 12 2 14 L2 20 L5 20 L5 28 L15 28 L15 20 L18 20 L18 14 C18 12 17 10 15 10 Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
    ),
  },
  {
    id: 'side',
    label: 'Perfil',
    icon: (
      <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
        <ellipse cx="8" cy="4" rx="4" ry="4" fill="currentColor" fillOpacity="0.8"/>
        <path d="M6 10 C4 10 3 12 3 14 L3 20 L5 20 L5 28 L10 28 L10 20 L10 14 C11 12 13 12 13 10 C11 9 8 9 6 10 Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
    ),
  },
  {
    id: 'back',
    label: 'Costas',
    icon: (
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <ellipse cx="10" cy="4" rx="4" ry="4" fill="currentColor" fillOpacity="0.8"/>
        <path d="M5 10 C3 10 2 12 2 14 L2 20 L5 20 L5 28 L15 28 L15 20 L18 20 L18 14 C18 12 17 10 15 10 Z" fill="currentColor" fillOpacity="0.8"/>
        <line x1="10" y1="10" x2="10" y2="22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

export function AngleSelector({ angle, onChange }: AngleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-body text-white/40 tracking-widest uppercase mr-2">Ângulo</span>
      {angles.map((a) => (
        <motion.button
          key={a.id}
          onClick={() => onChange(a.id)}
          className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all duration-300
            ${angle === a.id
              ? 'border-anmar-gold bg-anmar-gold/10 text-anmar-gold'
              : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
            }`}
          whileTap={{ scale: 0.95 }}
        >
          {angle === a.id && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-anmar-gold/5"
              layoutId="angle-indicator"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
          <span className="relative z-10">{a.icon}</span>
          <span className="relative z-10 text-xs font-body tracking-wide">{a.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
