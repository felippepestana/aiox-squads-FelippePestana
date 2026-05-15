import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'blue' | 'rose' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variant === 'gold' && 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30',
        variant === 'blue' && 'bg-[#4fc3f7]/15 text-[#4fc3f7] border border-[#4fc3f7]/30',
        variant === 'rose' && 'bg-[#f2d0c0]/15 text-[#f2d0c0] border border-[#f2d0c0]/30',
        variant === 'neutral' && 'bg-white/8 text-white/70 border border-white/10',
        className
      )}
    >
      {children}
    </span>
  )
}
