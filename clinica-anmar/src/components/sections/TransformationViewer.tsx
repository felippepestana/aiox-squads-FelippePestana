import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider'
import { AngleSelector, type BodyAngle } from '../ui/AngleSelector'
import { BodySilhouette } from '../ui/BodySilhouette'
import { TransformTimeline } from '../ui/TransformTimeline'
import { treatments, categoryLabels, type TreatmentCategory } from '../../data/treatments'

const categories: TreatmentCategory[] = ['emagrecimento', 'estetica-corporal', 'estetica-facial']

export function TransformationViewer() {
  const [selectedTreatment, setSelectedTreatment] = useState(treatments[0])
  const [angle, setAngle] = useState<BodyAngle>('front')
  const [animating, setAnimating] = useState(false)
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory | null>(null)

  const filteredTreatments = activeCategory
    ? treatments.filter((t) => t.category === activeCategory)
    : treatments.filter((t) => t.category !== 'saude')

  const handleAnimate = () => {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 8000)
  }

  return (
    <section id="transformacao" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-anmar-navy via-anmar-navy-light/30 to-anmar-navy pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-anmar-gold/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tecnologia de Visualização
          </motion.p>
          <motion.h2
            className="section-title mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Veja sua transformação{' '}
            <span className="gold-text">antes de decidir</span>
          </motion.h2>
          <motion.p
            className="text-white/50 font-body max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Selecione o tratamento e explore projeções de resultado em múltiplos ângulos.
            Visualização baseada em protocolos clínicos reais da Clínica AnMar.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Treatment selector panel */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-4 space-y-4">
              <p className="section-label text-[10px]">Selecione o Tratamento</p>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    activeCategory === null
                      ? 'border-anmar-gold bg-anmar-gold/10 text-anmar-gold'
                      : 'border-white/15 text-white/40 hover:border-white/25'
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      activeCategory === cat
                        ? 'border-anmar-gold bg-anmar-gold/10 text-anmar-gold'
                        : 'border-white/15 text-white/40 hover:border-white/25'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>

              {/* Treatment list */}
              <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence>
                  {filteredTreatments.map((t) => (
                    <motion.button
                      key={t.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => { setSelectedTreatment(t); setAnimating(false) }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                        selectedTreatment.id === t.id
                          ? 'border-anmar-gold/50 bg-anmar-gold/10 text-anmar-ivory'
                          : 'border-transparent hover:border-white/10 text-white/60 hover:text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <p className="text-sm font-body font-medium leading-tight">{t.name}</p>
                          <p className={`text-xs font-body mt-0.5 leading-tight ${
                            selectedTreatment.id === t.id ? 'text-anmar-gold/60' : 'text-white/30'
                          }`}>
                            {categoryLabels[t.category]}
                          </p>
                        </div>
                        {t.highlight && (
                          <span className="ml-auto text-[9px] font-body bg-anmar-gold/10 text-anmar-gold border border-anmar-gold/30 px-2 py-0.5 rounded-full tracking-wide">
                            Popular
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Selected treatment info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTreatment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{selectedTreatment.icon}</span>
                  <div>
                    <h3 className="font-body font-semibold text-anmar-ivory text-sm">{selectedTreatment.name}</h3>
                    <p className="text-xs text-anmar-gold/70 font-body italic mt-0.5">{selectedTreatment.tagline}</p>
                  </div>
                </div>
                <div className="divider-gold my-0" />
                <ul className="space-y-1.5">
                  {selectedTreatment.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs font-body text-white/50">
                      <span className="text-anmar-gold mt-0.5 flex-shrink-0">·</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 pt-1">
                  <div>
                    <p className="text-[10px] text-white/30 font-body uppercase tracking-wide">Duração</p>
                    <p className="text-xs font-body text-white/60 mt-0.5">{selectedTreatment.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 font-body uppercase tracking-wide">Sessões</p>
                    <p className="text-xs font-body text-white/60 mt-0.5">{selectedTreatment.sessions}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Main visualization panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Controls row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <AngleSelector angle={angle} onChange={setAngle} />
              <div className="flex gap-2">
                <button
                  onClick={handleAnimate}
                  disabled={animating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-anmar-gold/40 text-anmar-gold text-sm font-body hover:bg-anmar-gold/10 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {animating ? <Pause size={14} /> : <Play size={14} />}
                  {animating ? 'Simulando...' : 'Simular'}
                </button>
                <button
                  onClick={() => { setAnimating(false); setAngle('front') }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/40 text-sm font-body hover:border-white/25 hover:text-white/60 transition-all"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>

            {/* Visualization area */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Body silhouette */}
              <div className="glass-card p-6 h-[420px] relative">
                <div className="absolute top-4 left-4">
                  <p className="section-label text-[10px]">Projeção Corporal</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${angle}-${selectedTreatment.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <BodySilhouette
                      angle={angle}
                      treatmentId={selectedTreatment.id}
                      animating={animating}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Angle label */}
                <div className="absolute bottom-4 right-4">
                  <span className="text-xs font-body text-white/30 tracking-widest uppercase">
                    {angle === 'front' ? 'Vista Frontal' : angle === 'side' ? 'Perfil' : 'Vista Costas'}
                  </span>
                </div>
              </div>

              {/* Before/After slider */}
              <div className="glass-card p-4 space-y-4">
                <p className="section-label text-[10px]">Comparativo Antes/Depois</p>
                <BeforeAfterSlider
                  beforeLabel={selectedTreatment.beforeAfterLabel?.before ?? 'Antes'}
                  afterLabel={selectedTreatment.beforeAfterLabel?.after ?? 'Depois'}
                  treatment={selectedTreatment.name}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card p-6">
              <p className="section-label text-[10px] mb-4">Linha do Tempo do Resultado</p>
              <TransformTimeline treatmentId={selectedTreatment.id} isActive={animating} />
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-xs font-body text-white/40 mb-4">
                Visualização baseada em resultados clínicos reais. Resultados individuais podem variar.
              </p>
              <a href="#contato" className="btn-primary">
                Agendar Avaliação Presencial Gratuita
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
