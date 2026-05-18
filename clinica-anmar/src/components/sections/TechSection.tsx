import { motion } from 'framer-motion'
import { Shield, Eye, Zap, Microscope, HeartPulse, Layers } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Visualização Preditiva',
    description: 'Veja o resultado projetado antes de iniciar qualquer procedimento. Tecnologia de simulação baseada em protocolos clínicos reais.',
  },
  {
    icon: HeartPulse,
    title: 'Segurança Cardiovascular',
    description: 'Único clínica de estética em Manaus com avaliação cardiológica integrada. Dr. Angelo Pagotto garante que cada transformação seja segura.',
  },
  {
    icon: Microscope,
    title: 'Ciência Metabólica',
    description: 'Protocolos GLP-1 e metabolismo com base nas mais recentes evidências científicas em medicina do emagrecimento.',
  },
  {
    icon: Layers,
    title: 'Protocolos Multimodais',
    description: 'Combinação estratégica de técnicas para resultados superiores: emagrecimento + escultura corporal + bioestimulação.',
  },
  {
    icon: Zap,
    title: 'Tecnologia HIFEM',
    description: '20.000 contrações musculares em 30 minutos. Equivalente a meses de treino intenso — sem esforço, sem downtime.',
  },
  {
    icon: Shield,
    title: 'Personalização Total',
    description: 'Cada protocolo é desenhado exclusivamente para seu perfil: genética, metabolismo, objetivos e histórico de saúde.',
  },
]

export function TechSection() {
  return (
    <section id="tecnologia" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-anmar-navy to-[#060E1C] pointer-events-none" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-4">Diferenciais AnMar</p>
            <h2 className="section-title mb-6">
              Medicina estética com{' '}
              <span className="gold-text">precisão científica</span>
            </h2>
            <p className="text-white/50 font-body leading-relaxed mb-8">
              Em Manaus, somos a primeira clínica a integrar avaliação cardiológica com protocolos estéticos e de emagrecimento — porque transformação segura começa com um coração avaliado.
            </p>
            <a href="#contato" className="btn-primary inline-block">
              Conhecer a Clínica
            </a>
          </motion.div>

          {/* Stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-6"
          >
            {[
              { value: '100%', label: 'Protocolos personalizados', desc: 'Nenhum tratamento é genérico' },
              { value: '3', label: 'Especialidades integradas', desc: 'Cardiologia · Estética · Emagrecimento' },
              { value: '2019', label: 'Fundação em Manaus', desc: 'Construindo histórias de transformação' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="text-3xl font-display font-light text-anmar-gold min-w-[80px] group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div>
                  <p className="font-body font-medium text-anmar-ivory text-sm">{stat.label}</p>
                  <p className="font-body text-white/40 text-xs mt-0.5">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group hover:border-anmar-gold/25 transition-all duration-500"
                whileHover={{ y: -3 }}
              >
                <div className="w-10 h-10 rounded-xl bg-anmar-gold/10 border border-anmar-gold/20 flex items-center justify-center mb-4 group-hover:bg-anmar-gold/15 transition-colors duration-300">
                  <Icon size={18} className="text-anmar-gold" />
                </div>
                <h3 className="font-body font-semibold text-anmar-ivory mb-2 text-sm">{feature.title}</h3>
                <p className="text-xs font-body text-white/45 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
