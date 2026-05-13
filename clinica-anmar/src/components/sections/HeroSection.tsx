import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; opacityDelta: number
    }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        opacityDelta: (Math.random() - 0.5) * 0.005,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.opacity += p.opacityDelta
        if (p.opacity <= 0.05 || p.opacity >= 0.5) p.opacityDelta *= -1
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`
        ctx.fill()
      })

      // Connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(201, 169, 110, ${0.06 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Particles */}
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-anmar-gold/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-anmar-gold/30 bg-anmar-gold/5 rounded-full px-5 py-2 mb-8"
        >
          <Sparkles size={12} className="text-anmar-gold" />
          <span className="text-xs font-body text-anmar-gold/80 tracking-widest uppercase">
            Emagrecimento · Estética · Cardiologia · Manaus
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-display text-display-xl text-anmar-ivory mb-6 text-balance"
        >
          Sua transformação
          <br />
          <span className="gold-shimmer">começa aqui.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-body text-lg text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Protocolos médicos personalizados de emagrecimento e estética — com segurança cardiovascular,
          tecnologia de ponta e resultados que você pode visualizar antes de decidir.
        </motion.p>

        {/* Doctors name drop */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-sm font-body text-anmar-gold/60 tracking-wide mb-12"
        >
          Dr. Angelo Pagotto · Cardiologista&nbsp;&nbsp;|&nbsp;&nbsp;Dra. Marina Pagotto · Emagrecimento & Estética
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#transformacao" className="btn-primary">
            Visualizar Minha Transformação
          </a>
          <a href="#tratamentos" className="btn-outline">
            Ver Tratamentos
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '2019', label: 'Fundada em' },
            { value: '3+', label: 'Especialidades' },
            { value: 'AM', label: 'Referência no' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl text-anmar-gold font-light">{stat.value}</div>
              <div className="text-xs font-body text-white/40 mt-1 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={20} className="text-white/30" />
      </motion.div>
    </section>
  )
}
