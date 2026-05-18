import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const painPoints = [
  {
    text: 'Sente que falta algo na sua vida espiritual?',
    detail: 'Uma inquietação interior que não passa, mesmo fazendo tudo "certo".',
  },
  {
    text: 'Busca uma comunidade de fé autêntica?',
    detail: 'Cansado de superficialidade e deseja relações profundas na fé.',
  },
  {
    text: 'Quer fortalecer sua família?',
    detail: 'Sente que a família precisa de um alicerce espiritual mais forte.',
  },
  {
    text: 'Deseja uma conexão mais profunda com Deus?',
    detail: 'A oração parece mecânica e você quer algo que toque o coração.',
  },
  {
    text: 'Procura propósito e direção na vida?',
    detail: 'Sabe que foi chamado para algo maior, mas não encontrou o caminho.',
  },
];

export default function PainPointsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-20 md:py-28 bg-dark-950 overflow-hidden">
      {/* Red accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crimson-800/10 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-flame-500 font-display font-bold text-sm uppercase tracking-widest">
            Seja honesto consigo mesmo
          </span>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            Você se <span className="flame-text">identifica</span>?
          </h2>
        </motion.div>

        <div className="space-y-4">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="group relative flex items-start gap-4 p-5 md:p-6 rounded-xl bg-dark-900/80 border border-dark-700/50 hover:border-crimson-800/50 transition-all duration-300"
            >
              {/* Checkmark */}
              <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-crimson-800/20 border border-crimson-700/40 flex items-center justify-center group-hover:bg-crimson-800/40 transition-colors">
                <svg
                  className="w-4 h-4 text-flame-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg md:text-xl text-white">
                  {point.text}
                </h3>
                <p className="mt-1 text-dark-400 text-sm md:text-base">{point.detail}</p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-crimson-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-10 text-center text-lg md:text-xl text-dark-300"
        >
          Se você marcou{' '}
          <span className="text-flame-500 font-bold">pelo menos um</span>, a Aliança de Amor foi
          feita para você.
        </motion.p>
      </div>
    </section>
  );
}
