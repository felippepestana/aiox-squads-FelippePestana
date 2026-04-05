import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Flame gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-crimson-900 via-crimson-800 to-flame-700" />

      {/* Animated overlay */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent"
      />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-flame-500/20 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
            🔥 O chamado é agora
          </span>

          <h2 className="mt-6 font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Não Deixe Para Amanhã
            <br />
            <span className="text-gold-400">o Chamado de Hoje</span>
          </h2>

          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-xl mx-auto">
            Cada dia sem a Aliança é um dia sem a plenitude que Deus preparou para você. A chama
            está acesa. Basta dar o primeiro passo.
          </p>

          <motion.a
            href="#formulario"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center justify-center px-10 py-5 bg-white text-crimson-800 font-display font-black text-xl rounded-lg shadow-2xl shadow-dark-900/50 hover:bg-gold-400 hover:text-dark-900 transition-colors duration-300 animate-pulse-flame"
          >
            🔥 QUERO FAZER MINHA ALIANCA AGORA
          </motion.a>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/60 text-sm flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            Apenas 30 vagas restantes para o próximo retiro
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
