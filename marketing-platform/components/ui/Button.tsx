'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        variant === 'primary' &&
          'bg-[#d4af37] text-[#060c17] hover:bg-[#f0d060] hover:scale-[1.02] active:scale-[0.98]',
        variant === 'ghost' &&
          'text-white/80 hover:text-white hover:bg-white/8',
        variant === 'outline' &&
          'border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
