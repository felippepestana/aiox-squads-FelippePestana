import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineStage {
  week: string
  label: string
  description: string
  progress: number
}

interface TransformTimelineProps {
  treatmentId: string
  isActive: boolean
}

const TIMELINES: Record<string, TimelineStage[]> = {
  semaglutida: [
    { week: 'Semana 1', label: 'Adaptação', description: 'Redução de apetite. Corpo se adaptando ao protocolo.', progress: 10 },
    { week: 'Mês 1', label: 'Início da perda', description: 'Primeiros quilos. Melhora na saciedade e energia.', progress: 25 },
    { week: 'Mês 3', label: 'Transformação visível', description: 'Silhueta se modifica. Resultados motivadores.', progress: 55 },
    { week: 'Mês 6', label: 'Nova composição', description: 'Meta atingida. Manutenção e consolidação.', progress: 80 },
  ],
  criolipolise: [
    { week: 'Dia 1', label: 'Procedimento', description: 'Sessão de 45-60 min. Sem downtime.', progress: 5 },
    { week: 'Semana 2', label: 'Processo celular', description: 'Apoptose celular em curso. Sem alteração visível ainda.', progress: 20 },
    { week: 'Mês 1', label: 'Primeiros resultados', description: 'Redução inicial de gordura localizada.', progress: 50 },
    { week: 'Mês 2', label: 'Resultado final', description: 'Contorno definido. Eliminação de até 25% da gordura local.', progress: 90 },
  ],
  sculptra: [
    { week: 'Sessão 1', label: 'Aplicação', description: 'Bioestimulador aplicado. Resultado imediato temporário.', progress: 15 },
    { week: 'Mês 1', label: 'Colágeno ativado', description: 'Neocolagênese em curso. Firmeza inicial.', progress: 35 },
    { week: 'Mês 3', label: 'Volume progressivo', description: 'Resultado natural se revela gradualmente.', progress: 65 },
    { week: 'Mês 6', label: 'Plenitude', description: 'Resultado completo. Duração de 18-24 meses.', progress: 95 },
  ],
  hifem: [
    { week: 'Sessão 1', label: 'Primeira sessão', description: '20.000 contrações musculares em 30 minutos.', progress: 20 },
    { week: 'Sessão 4', label: 'Protocolo completo', description: 'Quatro sessões completadas. Músculos reconstruídos.', progress: 60 },
    { week: 'Mês 1', label: 'Resultados iniciais', description: 'Definição muscular emergindo. Gordura reduzindo.', progress: 75 },
    { week: 'Mês 3', label: 'Resultado consolidado', description: '+16% massa muscular | -19% gordura localizada.', progress: 95 },
  ],
  harmonizacao: [
    { week: 'Consulta', label: 'Biomapping', description: 'Análise facial e planejamento personalizado.', progress: 5 },
    { week: 'Procedimento', label: 'Aplicação', description: 'Toxina + preenchimento. Sessão de 60-90 min.', progress: 30 },
    { week: 'Dia 14', label: 'Resultado botox', description: 'Efeito completo da toxina botulínica.', progress: 70 },
    { week: 'Mês 1', label: 'Resultado pleno', description: 'Harmonia facial estabelecida. Aparência natural.', progress: 95 },
  ],
}

const DEFAULT_TIMELINE: TimelineStage[] = [
  { week: 'Consulta', label: 'Avaliação', description: 'Anamnese completa e plano personalizado.', progress: 10 },
  { week: 'Início', label: 'Protocolo', description: 'Início do tratamento personalizado.', progress: 30 },
  { week: 'Meio', label: 'Progresso', description: 'Resultados em desenvolvimento.', progress: 60 },
  { week: 'Final', label: 'Resultado', description: 'Objetivo alcançado. Manutenção.', progress: 90 },
]

export function TransformTimeline({ treatmentId, isActive }: TransformTimelineProps) {
  const [activeStage, setActiveStage] = useState(0)
  const stages = TIMELINES[treatmentId] ?? DEFAULT_TIMELINE

  useEffect(() => {
    if (!isActive) {
      setActiveStage(0)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % stages.length
      setActiveStage(i)
    }, 1800)
    return () => clearInterval(interval)
  }, [isActive, stages.length, treatmentId])

  const current = stages[activeStage]

  return (
    <div className="space-y-4">
      {/* Timeline track */}
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold-gradient rounded-full"
          animate={{ width: `${current.progress}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Stage dots */}
      <div className="flex justify-between">
        {stages.map((stage, i) => (
          <button
            key={i}
            onClick={() => setActiveStage(i)}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                i <= activeStage
                  ? 'bg-anmar-gold border-anmar-gold'
                  : 'bg-transparent border-white/20 group-hover:border-white/40'
              }`}
              animate={i === activeStage ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <span className={`text-xs font-body transition-colors duration-300 whitespace-nowrap ${
              i === activeStage ? 'text-anmar-gold' : 'text-white/30'
            }`}>
              {stage.week}
            </span>
          </button>
        ))}
      </div>

      {/* Current stage info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-4 border-anmar-gold/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-anmar-gold/10 border border-anmar-gold/30 flex items-center justify-center text-xs text-anmar-gold font-body font-semibold">
              {current.progress}%
            </div>
            <div>
              <p className="text-sm font-body font-medium text-anmar-ivory">{current.label}</p>
              <p className="text-xs font-body text-white/50 mt-0.5">{current.description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
