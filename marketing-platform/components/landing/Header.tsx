'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#060c17]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#d4af37] text-xl font-bold tracking-tight">✦</span>
          <span className="text-white font-semibold text-sm tracking-wide">AIOX Marketing</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <Link href="#procedimentos" className="hover:text-white transition-colors">Procedimentos</Link>
          <Link href="#como-funciona" className="hover:text-white transition-colors">Como funciona</Link>
          <Link href="/display" className="hover:text-white transition-colors">Display TV</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/display">
            <Button variant="outline" size="sm">Ver Display</Button>
          </Link>
          <Link href="/admin">
            <Button size="sm">Painel Admin</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
