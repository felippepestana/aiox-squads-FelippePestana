import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const transformations = [
  {
    icon: '🔥',
    title: 'Despertar Interior',
    description:
      'Uma chama que se acende por dentro, trazendo clareza, paz e um senso renovado de propósito divino.',
  },
  {
    icon: '🛡️',
    title: 'Proteção de Maria',
    description:
      'A Mãe Três Vezes Admirável se torna sua aliada, guia e protetora no caminho da santidade.',
  },
  {
    icon: '⚡',
    title: 'Transformação Real',
    description:
      'Não é teoria. São vidas, famílias e comunidades inteiras que experimentaram mudança profunda.',
  },
];

const beforeAfter = [
  { before: 'Solidão espiritual', after: 'Comunidade viva de fé' },
  { before: 'Oração mecânica', after: 'Relação íntima com Deus' },
  { before: 'Família fragilizada', after: 'Família fortalecida na aliança' },
  { before: 'Falta de propósito', after: 'Missão clara e transformadora' },
];

export default function SolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="solucao" className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-900" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-flame-500 font-display font-bold text-sm uppercase tracking-widest">
            A Resposta que Você Procura
          </span>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            A Aliança de Amor é a{' '}
            <span className="flame-text">Resposta</span>
          </h2>
          <p className="mt-4 text-dark-400 text-lg max-w-2xl mx-auto">
            Fundada em 18 de outubro de 1914 pelo Padre José Kentenich, a Aliança de Amor é um
            pacto espiritual com a Mãe Três Vezes Admirável que transforma de dentro para fora.
          </p>
        </motion.div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-0 md:gap-0 rounded-2xl overflow-hidden border border-dark-700/50">
            {/* Before column */}
            <div className="bg-dark-800/60 p-8">
              <h3 className="font-display font-bold text-lg text-dark-400 uppercase tracking-wider mb-6">
                ❌ Antes
              </h3>
              <ul className="space-y-4">
                {beforeAfter.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-dark-400"
                  >
                    <span className="w-2 h-2 rounded-full bg-dark-600 flex-shrink-0" />
                    <span className="line-through">{item.before}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* After column */}
            <div className="bg-gradient-to-br from-crimson-900/20 to-dark-800/80 p-8 border-t md:border-t-0 md:border-l border-dark-700/50">
              <h3 className="font-display font-bold text-lg text-flame-500 uppercase tracking-wider mb-6">
                ✅ Depois da Aliança
              </h3>
              <ul className="space-y-4">
                {beforeAfter.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-white font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-flame-500 flex-shrink-0" />
                    {item.after}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Three transformation promises */}
        <div className="grid md:grid-cols-3 gap-6">
          {transformations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
              className="group relative p-8 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-flame-600/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
              <p className="text-dark-400 leading-relaxed">{item.description}</p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-flame-gradient-horizontal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
