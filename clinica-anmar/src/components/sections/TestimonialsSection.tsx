import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ana L.',
    age: 38,
    treatment: 'Protocolo GLP-1 + HIFEM',
    result: '-14kg em 4 meses',
    text: 'Jamais imaginei que emagrecimento poderia ser tão acompanhado e seguro. Dr. Angelo avaliou meu coração antes de tudo, e a Dra. Marina montou um protocolo perfeito pra mim. Me sinto uma pessoa nova.',
    stars: 5,
  },
  {
    id: 2,
    name: 'Fernanda M.',
    age: 42,
    treatment: 'Harmonização Facial + Bioestimuladores',
    result: 'Rejuvenescimento natural',
    text: 'Precisava de resultado natural, sem aquele look exagerado. A Dra. Marina entendeu exatamente o que eu queria. O mapeamento antes do procedimento me deu confiança total na decisão.',
    stars: 5,
  },
  {
    id: 3,
    name: 'Rodrigo S.',
    age: 35,
    treatment: 'Criolipólise + HIFEM',
    result: 'Abdômen definido em 8 semanas',
    text: 'Chegou a hora de encarar a academia que eu nunca ia. O HIFEM foi revolucionário — resultado visível em 4 sessões. A abordagem da AnMar é diferente: parece que realmente se importam com resultado.',
    stars: 5,
  },
  {
    id: 4,
    name: 'Juliana P.',
    age: 44,
    treatment: 'Sculptra Corporal',
    result: 'Volumização e firmeza duradouras',
    text: 'Tinha flacidez pós-emagrecimento e estava buscando resultado sem cirurgia. O Sculptra foi surpreendente — progressivo, natural, duradouro. A equipe é simplesmente incrível.',
    stars: 5,
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060E1C] to-anmar-navy pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-anmar-gold/4 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Histórias Reais
          </motion.p>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Transformações que{' '}
            <span className="gold-text">falam por si</span>
          </motion.h2>
        </div>

        {/* Testimonial card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-10 text-center border-anmar-gold/15"
            >
              {/* Quote mark */}
              <div className="text-6xl font-display text-anmar-gold/20 leading-none mb-4">"</div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-anmar-gold fill-anmar-gold" />
                ))}
              </div>

              {/* Text */}
              <blockquote className="font-body text-lg text-white/75 leading-relaxed mb-8 italic">
                {t.text}
              </blockquote>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 border border-anmar-gold/30 bg-anmar-gold/8 rounded-full px-5 py-2 mb-6">
                <span className="text-anmar-gold text-sm font-body font-semibold">{t.result}</span>
              </div>

              {/* Person */}
              <div>
                <p className="font-body font-medium text-anmar-ivory">{t.name}, {t.age} anos</p>
                <p className="font-body text-sm text-anmar-gold/60 mt-1">{t.treatment}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-anmar-gold/40 hover:text-anmar-gold transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2 bg-anmar-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-anmar-gold/40 hover:text-anmar-gold transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
