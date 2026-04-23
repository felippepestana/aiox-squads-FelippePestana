import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const benefits = [
  {
    icon: '🕊️',
    title: 'Paz Interior',
    description: 'Encontre a serenidade que o mundo não pode dar. Uma paz que nasce da aliança com o Sagrado.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Família Fortalecida',
    description: 'Transforme seu lar em um santuário doméstico. Relações curadas, amor renovado, unidade restaurada.',
  },
  {
    icon: '🤝',
    title: 'Comunidade de Fé',
    description: 'Nunca mais caminhe sozinho. Uma rede de irmãos que apoiam, acolhem e caminham juntos.',
  },
  {
    icon: '🎯',
    title: 'Propósito de Vida',
    description: 'Descubra sua missão única. Deus tem um plano específico para você — a Aliança ajuda a revelá-lo.',
  },
  {
    icon: '💙',
    title: 'Conexão com Maria',
    description: 'A Mãe Três Vezes Admirável se torna sua guia, protetora e educadora na fé.',
  },
  {
    icon: '🔥',
    title: 'Transformação Real',
    description: 'Não é teoria. São mudanças concretas na sua vida, nas suas relações e na sua espiritualidade.',
  },
];

export default function BenefitsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="beneficios" className="section-padding bg-dark-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-flame-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-crimson-800/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-flame-500 font-display font-bold text-sm uppercase tracking-widest">
            O que você vai conquistar
          </span>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            Os Frutos da <span className="flame-text">Aliança</span>
          </h2>
          <p className="mt-4 text-dark-400 text-lg max-w-2xl mx-auto">
            Cada pessoa que faz a Aliança de Amor experimenta frutos reais e duradouros na sua vida.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-2xl bg-dark-800/40 border border-dark-700/50 hover:border-flame-600/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-crimson-800/20 border border-crimson-700/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>

              <h3 className="font-display font-bold text-xl text-white mb-3">{benefit.title}</h3>
              <p className="text-dark-400 leading-relaxed">{benefit.description}</p>

              {/* Corner flame accent on hover */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-flame-600/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
