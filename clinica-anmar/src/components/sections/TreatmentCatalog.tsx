import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { treatments, categoryLabels, type TreatmentCategory } from '../../data/treatments'

const ALL_CATEGORIES: (TreatmentCategory | 'all')[] = ['all', 'emagrecimento', 'estetica-corporal', 'estetica-facial', 'saude']

export function TreatmentCatalog() {
  const [filter, setFilter] = useState<TreatmentCategory | 'all'>('all')

  const filtered = filter === 'all' ? treatments : treatments.filter((t) => t.category === filter)

  return (
    <section id="tratamentos" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-anmar-navy to-[#060E1C] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Protocolos Clínicos
          </motion.p>
          <motion.h2
            className="section-title mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tratamentos que{' '}
            <span className="gold-text">transformam de verdade</span>
          </motion.h2>
          <motion.p
            className="text-white/50 font-body max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Cada protocolo é personalizado pelos nossos especialistas com base na sua saúde, objetivos e anatomia.
          </motion.p>
        </div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-body border transition-all duration-300 ${
                filter === cat
                  ? 'bg-anmar-gold text-anmar-navy border-anmar-gold font-semibold'
                  : 'border-white/15 text-white/50 hover:border-white/25 hover:text-white/70'
              }`}
            >
              {cat === 'all' ? 'Todos' : categoryLabels[cat]}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((treatment, i) => (
              <motion.div
                key={treatment.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative glass-card p-6 cursor-pointer hover:border-anmar-gold/30 transition-all duration-500 overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ y: -4 }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-anmar-gold/0 to-anmar-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Popular badge */}
                {treatment.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] font-body bg-anmar-gold/10 text-anmar-gold border border-anmar-gold/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                      Popular
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-3xl mb-4">{treatment.icon}</div>

                  {/* Category */}
                  <p className="text-[10px] font-body text-anmar-gold/60 tracking-widest uppercase mb-2">
                    {categoryLabels[treatment.category]}
                  </p>

                  {/* Name */}
                  <h3 className="font-body font-semibold text-anmar-ivory mb-2 leading-tight">
                    {treatment.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs font-body text-white/40 italic mb-4 leading-relaxed">
                    {treatment.tagline}
                  </p>

                  {/* Divider */}
                  <div className="w-8 h-px bg-anmar-gold/30 mb-4 group-hover:w-16 transition-all duration-500" />

                  {/* Stats */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-xs font-body text-white/40">
                      <span className="text-anmar-gold/60">⏱</span> {treatment.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body text-white/40">
                      <span className="text-anmar-gold/60">↗</span> {treatment.sessions}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="#contato"
                    className="flex items-center gap-1 text-xs font-body text-anmar-gold/60 group-hover:text-anmar-gold transition-colors duration-300"
                  >
                    Saber mais <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-white/50 mb-6">
            Todos os tratamentos são avaliados individualmente e personalizados para seu perfil de saúde.
          </p>
          <a href="#contato" className="btn-primary">
            Solicitar Avaliação Gratuita
          </a>
        </motion.div>
      </div>
    </section>
  )
}
