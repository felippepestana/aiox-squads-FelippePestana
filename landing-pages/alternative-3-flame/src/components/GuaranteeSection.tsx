import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const trustBadges = [
  {
    icon: '🛡️',
    title: 'Movimento Aprovado',
    text: 'Reconhecido oficialmente pela Santa Sé desde sua fundação.',
  },
  {
    icon: '🔒',
    title: 'Privacidade Garantida',
    text: 'Seus dados são protegidos e nunca serão compartilhados.',
  },
  {
    icon: '💳',
    title: 'Zero Custo',
    text: 'A Aliança de Amor é gratuita. Fé não tem preço.',
  },
  {
    icon: '🤝',
    title: 'Sem Compromisso',
    text: 'Conheça no seu ritmo. Sem pressão, sem obrigações.',
  },
];

export default function GuaranteeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 md:py-20 bg-dark-900 relative">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-black text-3xl md:text-4xl">
            Sem Compromisso. Sem Custo.{' '}
            <span className="flame-text">Apenas Fé.</span>
          </h2>
          <p className="mt-3 text-dark-400 text-lg">
            Tudo o que pedimos é um coração aberto.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="flex items-start gap-4 p-5 rounded-xl bg-dark-800/40 border border-dark-700/30"
            >
              <div className="text-3xl flex-shrink-0">{badge.icon}</div>
              <div>
                <h3 className="font-display font-bold text-white mb-1">{badge.title}</h3>
                <p className="text-dark-400 text-sm">{badge.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
