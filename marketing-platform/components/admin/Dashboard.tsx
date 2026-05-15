'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PROCEDURES, DEFAULT_CLINIC } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const audienceVariant: Record<string, 'rose' | 'blue' | 'gold'> = {
  feminino: 'rose',
  masculino: 'blue',
  misto: 'gold',
}

const audienceLabel: Record<string, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  misto: 'Misto',
}

export function Dashboard() {
  const [clinic, setClinic] = useState(DEFAULT_CLINIC)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#060c17] text-white">
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-60 flex flex-col border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#080d18' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#d4af37] text-xl">✦</span>
            <span className="font-semibold text-sm">AIOX Marketing</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Dashboard', href: '/admin', icon: '⬚' },
            { label: 'Procedimentos', href: '/admin', icon: '◈' },
            { label: 'Display TV', href: '/display', icon: '▶' },
            { label: 'Landing Page', href: '/', icon: '⌂' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="text-xs text-white/20">v1.0 · Marketing Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Painel Administrativo</h1>
            <p className="text-white/40 text-sm">Configure a clínica e gerencie os materiais de marketing</p>
          </div>

          {/* Clinic config */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <span className="text-[#d4af37]">◆</span> Configuração da Clínica
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Nome da Clínica', key: 'name', placeholder: 'Ex: Clínica Bella Vita' },
                { label: 'Contato (WhatsApp)', key: 'contact', placeholder: 'Ex: (11) 99999-9999' },
                { label: 'Tagline', key: 'tagline', placeholder: 'Ex: Estética com cuidado personalizado' },
              ].map((field) => (
                <div key={field.key} className={field.key === 'tagline' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wide">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={clinic[field.key as keyof typeof clinic]}
                    onChange={(e) => setClinic((c) => ({ ...c, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button onClick={handleSave} size="sm">
                {saved ? '✓ Salvo' : 'Salvar configurações'}
              </Button>
              <Link href="/display">
                <Button variant="outline" size="sm">Visualizar Display →</Button>
              </Link>
            </div>
          </div>

          {/* Procedures */}
          <div>
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <span className="text-[#d4af37]">◈</span> Procedimentos ({PROCEDURES.length})
            </h2>

            <div className="space-y-3">
              {PROCEDURES.map((proc) => (
                <div
                  key={proc.id}
                  className="rounded-xl p-5 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl" style={{ color: proc.color_accent }}>
                        {proc.icon}
                      </span>
                      <div>
                        <div className="font-medium text-white text-sm">{proc.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{proc.slides.length} slides · 90s loop</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={audienceVariant[proc.audience]}>
                        {audienceLabel[proc.audience]}
                      </Badge>
                      <Link
                        href={`/display?procedure=${proc.slug}`}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        Preview →
                      </Link>
                    </div>
                  </div>

                  {/* Slide list */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {proc.slides.map((slide) => (
                      <div
                        key={slide.id}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: `${proc.color_primary}20`,
                          color: 'rgba(255,255,255,0.5)',
                          border: `1px solid ${proc.color_primary}30`,
                        }}
                      >
                        {slide.order}. {slide.type}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export info */}
          <div
            className="mt-8 rounded-xl p-5"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <h3 className="text-sm font-semibold text-[#d4af37] mb-2">📁 Materiais para produção</h3>
            <p className="text-sm text-white/40 mb-4">
              Os roteiros completos, variações de copy e guia de produção estão em{' '}
              <code className="text-white/60 bg-white/5 px-1.5 py-0.5 rounded text-xs">output/marketing/</code>
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Guia de Produção', path: 'guia-de-producao.md' },
                { label: 'Roteiros de Vídeo', path: '*/roteiro-video.md' },
                { label: 'Slides Completos', path: '*/slides-imagem.md' },
                { label: 'PDF Consolidado', path: 'marketing-completo.pdf' },
              ].map((f) => (
                <div
                  key={f.path}
                  className="text-xs px-3 py-1.5 rounded-lg text-white/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  📄 {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
