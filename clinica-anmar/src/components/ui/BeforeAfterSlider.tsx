import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BeforeAfterSliderProps {
  beforeLabel?: string
  afterLabel?: string
  treatment: string
}

// SVG body silhouettes encoded as gradient fills simulating body contour changes
const BODY_STATES = {
  before: {
    path: 'M160,40 C180,35 200,38 210,45 C225,55 228,70 225,90 C230,110 240,125 238,145 C242,170 245,190 240,215 C238,235 235,255 230,275 C226,295 222,315 215,335 C210,355 205,375 200,395 C196,410 192,425 190,440 C192,425 196,415 200,400 C200,400 205,380 210,360 C215,340 220,320 222,300 C225,280 225,260 220,240 C215,218 210,198 208,178 C205,158 205,140 208,120 C211,100 215,82 212,62 C208,48 196,40 180,38 C170,36 158,38 150,42 C140,48 132,58 128,72 C122,90 122,108 126,126 C130,148 132,168 130,190 C128,212 122,232 118,252 C114,272 112,292 112,312 C113,332 116,352 120,370 C124,388 130,405 132,422 C134,436 134,448 132,460 L168,460 C166,448 166,436 168,422 C170,405 176,388 180,370 C184,352 187,332 188,312 C188,292 188,272 184,252 C180,232 174,212 172,190 C170,168 172,148 176,126 C180,108 180,90 174,72 C170,58 162,48 152,42',
    fill: 'rgba(180, 140, 110, 0.15)',
    stroke: 'rgba(180, 140, 110, 0.4)',
  },
  after: {
    path: 'M160,40 C175,36 192,38 200,44 C212,52 215,66 213,84 C216,103 222,118 220,136 C222,158 224,176 220,198 C218,216 216,234 212,252 C208,270 205,288 200,306 C196,322 193,338 190,354 C188,366 186,378 185,390 C186,378 188,368 190,355 C190,355 194,340 198,324 C202,308 206,292 208,275 C211,258 212,240 208,222 C204,202 200,184 198,165 C196,146 196,128 198,110 C200,92 202,76 200,60 C197,48 188,41 175,38 C168,36 158,37 150,41 C142,47 136,57 133,70 C128,87 128,104 132,120 C136,141 138,159 136,180 C134,200 129,218 126,237 C122,256 121,274 122,292 C123,310 126,328 130,345 C134,362 140,377 142,393 C144,406 144,418 142,430 L168,430 C166,418 166,406 168,393 C170,377 176,362 180,345 C184,328 187,310 188,292 C188,274 187,256 183,237 C180,218 175,200 173,180 C171,159 173,141 177,120 C181,104 181,87 176,70 C173,57 167,47 158,41',
    fill: 'rgba(201, 169, 110, 0.12)',
    stroke: 'rgba(201, 169, 110, 0.5)',
  },
}

export function BeforeAfterSlider({ beforeLabel = 'Antes', afterLabel = 'Depois', treatment }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) updateSlider(e.clientX)
  }, [isDragging, updateSlider])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) updateSlider(e.touches[0].clientX)
  }, [isDragging, updateSlider])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMouseMove, handleTouchMove])

  return (
    <div className="relative select-none" ref={containerRef}>
      <div className="relative h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-anmar-navy-light">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* BEFORE side */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 350 480" className="h-full max-w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="bodyGradBefore" cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#3A2820" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#1A1018" stopOpacity="0.3"/>
              </radialGradient>
            </defs>
            <ellipse cx="175" cy="280" rx="95" ry="170" fill="url(#bodyGradBefore)" />
            <path d={BODY_STATES.before.path} fill={BODY_STATES.before.fill} stroke={BODY_STATES.before.stroke} strokeWidth="1.5"/>
            {/* Measurement lines */}
            <line x1="110" y1="180" x2="240" y2="180" stroke="rgba(180,140,110,0.25)" strokeWidth="1" strokeDasharray="4,4"/>
            <line x1="112" y1="250" x2="238" y2="250" stroke="rgba(180,140,110,0.25)" strokeWidth="1" strokeDasharray="4,4"/>
            <text x="248" y="183" fill="rgba(180,140,110,0.5)" fontSize="9" fontFamily="Inter">cintura</text>
            <text x="242" y="253" fill="rgba(180,140,110,0.5)" fontSize="9" fontFamily="Inter">quadril</text>
          </svg>
          <div className="absolute bottom-4 left-4">
            <span className="text-xs font-body text-white/40 tracking-widest uppercase border border-white/20 px-3 py-1 rounded-full">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* AFTER side — clipped by slider */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-anmar-navy/80 to-anmar-navy" />
          <svg viewBox="0 0 350 480" className="h-full max-w-full relative z-10" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="bodyGradAfter" cx="50%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#2A1E10" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#100C08" stopOpacity="0.2"/>
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <ellipse cx="175" cy="265" rx="80" ry="150" fill="url(#bodyGradAfter)" />
            <path
              d={BODY_STATES.after.path}
              fill={BODY_STATES.after.fill}
              stroke="rgba(201, 169, 110, 0.7)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            {/* Glow effect on outline */}
            <path d={BODY_STATES.after.path} fill="none" stroke="rgba(201, 169, 110, 0.2)" strokeWidth="6"/>
            {/* Measurement lines — tighter */}
            <line x1="118" y1="180" x2="232" y2="180" stroke="rgba(201,169,110,0.35)" strokeWidth="1" strokeDasharray="4,4"/>
            <line x1="120" y1="248" x2="230" y2="248" stroke="rgba(201,169,110,0.35)" strokeWidth="1" strokeDasharray="4,4"/>
            <text x="235" y="183" fill="rgba(201,169,110,0.7)" fontSize="9" fontFamily="Inter">cintura</text>
            <text x="234" y="251" fill="rgba(201,169,110,0.7)" fontSize="9" fontFamily="Inter">quadril</text>
          </svg>
          <div className="absolute bottom-4 right-4">
            <span className="text-xs font-body text-anmar-gold/70 tracking-widest uppercase border border-anmar-gold/40 px-3 py-1 rounded-full bg-anmar-gold/10">
              {afterLabel}
            </span>
          </div>
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center cursor-ew-resize z-20"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="w-px h-full bg-anmar-gold/60 relative">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-anmar-navy border-2 border-anmar-gold rounded-full flex items-center justify-center shadow-gold"
              animate={{ scale: isDragging ? 1.15 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path d="M1 6h16M1 6l4-4M1 6l4 4M17 6l-4-4M17 6l-4 4" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-white/30 font-body tracking-widest uppercase">
        Arraste para comparar · {treatment}
      </div>
    </div>
  )
}
