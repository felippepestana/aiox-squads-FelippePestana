import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Secao principal"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-sanctuary-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,34,82,0.05)_0%,transparent_50%)]" />

      {/* Animated floating particles (candle-like dots) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-sanctuary-gold/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Cross glow */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div className="relative">
          {/* Vertical bar */}
          <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-sanctuary-gold/30 to-transparent mx-auto" />
          {/* Horizontal bar */}
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-sanctuary-gold/30 to-transparent absolute top-8 left-1/2 -translate-x-1/2" />
          {/* Center glow */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sanctuary-gold/50 animate-candle-flicker candle-glow" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto mt-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sanctuary-gold/80 font-sans text-sm md:text-base tracking-[0.3em] uppercase mb-6"
        >
          Movimento de Schoenstatt
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Descubra a{' '}
          <span className="text-gold-gradient">Alianca</span>
          <br />
          que Transforma Vidas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-sanctuary-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-4 font-light leading-relaxed"
        >
          Uma alianca de amor com a Mae Tres Vezes Admiravel.
          Um caminho de fe, entrega e transformacao interior que milhares de pessoas
          ja percorrem ao redor do mundo.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-sanctuary-gold/50 italic font-serif text-base md:text-lg mb-10"
        >
          &ldquo;Nada sem voce, nada sem nos.&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#jornada" className="btn-gold text-base">
            Faca Sua Alianca de Amor
          </a>
          <a href="#sobre" className="btn-gold-outline text-base">
            Conheca o Movimento
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-sanctuary-cream/30"
        >
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sanctuary-navy to-transparent" />
    </section>
  );
}
