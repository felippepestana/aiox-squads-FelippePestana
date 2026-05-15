'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Procedure, Slide } from '@/types'

interface SlidePlayerProps {
  procedures: Procedure[]
  autoPlay?: boolean
}

const TRANSITION_MS = 1000

export function SlidePlayer({ procedures, autoPlay = true }: SlidePlayerProps) {
  const [procIdx, setProcIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(Date.now())

  const allSlides = procedures.flatMap((p) => p.slides.map((s) => ({ ...s, procedure: p })))
  const flatIdx = procedures.slice(0, procIdx).reduce((acc, p) => acc + p.slides.length, 0) + slideIdx
  const currentEntry = allSlides[flatIdx] ?? allSlides[0]
  const currentProc = procedures[procIdx] ?? procedures[0]
  const currentSlide = currentEntry
  const slideDuration = (currentSlide?.duration ?? 15) * 1000

  const advance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setProcIdx((pi) => {
        const nextSlide = slideIdx + 1
        if (nextSlide < procedures[pi].slides.length) {
          setSlideIdx(nextSlide)
          return pi
        }
        const nextProc = (pi + 1) % procedures.length
        setSlideIdx(0)
        return nextProc
      })
      setProgress(0)
      startRef.current = Date.now()
      setVisible(true)
    }, TRANSITION_MS)
  }, [slideIdx, procedures])

  useEffect(() => {
    if (!autoPlay || paused || procedures.length === 0) return
    startRef.current = Date.now()

    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / slideDuration) * 100, 100)
      setProgress(pct)
      if (elapsed >= slideDuration) {
        advance()
      }
    }, 50)

    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [autoPlay, paused, advance, slideDuration, procIdx, slideIdx, procedures.length])

  if (!currentSlide || !currentProc) return null

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden select-none"
      style={{ background: '#080d18' }}
      onClick={() => setPaused((p) => !p)}
    >
      {/* Background gradient per procedure */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${currentProc.color_primary}30 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top bar: procedure indicator */}
      <div className="relative z-10 flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl"
            style={{ color: currentProc.color_accent }}
          >
            {currentProc.icon}
          </span>
          <span className="text-white/40 text-sm font-medium uppercase tracking-widest">
            {currentProc.shortName}
          </span>
        </div>

        {/* Procedure dots */}
        <div className="flex gap-2">
          {procedures.map((p, i) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation()
                setProcIdx(i)
                setSlideIdx(0)
                setProgress(0)
                startRef.current = Date.now()
              }}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === procIdx ? currentProc.color_accent : 'rgba(255,255,255,0.15)',
                transform: i === procIdx ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-16 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.97)',
          transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
        }}
      >
        {currentSlide.type === 'cta' ? (
          <CTASlideContent slide={currentSlide} proc={currentProc} />
        ) : currentSlide.type === 'procedimentos' ? (
          <ProcedimentosSlideContent slide={currentSlide} proc={currentProc} />
        ) : (
          <DefaultSlideContent slide={currentSlide} proc={currentProc} />
        )}
      </div>

      {/* Slide dots */}
      <div className="relative z-10 flex justify-center gap-2 py-4">
        {currentProc.slides.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === slideIdx ? 24 : 8,
              background: i === slideIdx ? currentProc.color_accent : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5 bg-white/5">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${currentProc.color_accent}, ${currentProc.color_accent}80)`,
          }}
        />
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="text-white/60 text-sm font-medium">Clique para retomar</div>
        </div>
      )}
    </div>
  )
}

function DefaultSlideContent({ slide, proc }: { slide: Slide & { procedure?: Procedure }; proc: Procedure }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1
        className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6 whitespace-pre-line"
        style={{ letterSpacing: '-0.02em' }}
      >
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-xl md:text-2xl text-white/50 mb-8 leading-relaxed">{slide.subtitle}</p>
      )}
      {slide.body && (
        <ul className="space-y-2 text-left inline-block">
          {slide.body.map((item, i) => (
            <li key={i} className="text-white/70 text-lg">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ProcedimentosSlideContent({ slide, proc }: { slide: Slide & { procedure?: Procedure }; proc: Procedure }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-white/50 mb-8 uppercase tracking-widest">
        {slide.title}
      </h2>
      <ul className="space-y-4">
        {(slide.body ?? []).map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-4 text-2xl md:text-3xl font-semibold text-white"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span style={{ color: proc.color_accent, fontFamily: 'monospace', fontSize: '1.25rem' }}>
              {item.split(' ')[0]}
            </span>
            <span>{item.slice(item.indexOf(' ') + 1)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CTASlideContent({ slide, proc }: { slide: Slide & { procedure?: Procedure }; proc: Procedure }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="text-5xl md:text-6xl font-bold leading-[1.1] text-white mb-6 whitespace-pre-line"
        style={{ letterSpacing: '-0.02em' }}
      >
        {slide.title}
      </div>
      {slide.subtitle && (
        <p className="text-xl text-white/50 mb-10">{slide.subtitle}</p>
      )}
      {slide.cta && (
        <div
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold"
          style={{
            background: `${proc.color_accent}20`,
            border: `1.5px solid ${proc.color_accent}50`,
            color: proc.color_accent,
          }}
        >
          📲 {slide.cta}
        </div>
      )}
    </div>
  )
}
