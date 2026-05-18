import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Bell, ChevronDown } from 'lucide-react';

const WORDS = 'Todo grande caminho começa com um único passo de fé...'.split(' ');

function AnimatedWord({ word, index }: { word: string; index: number }) {
  return (
    <motion.span
      className="inline-block mr-[0.3em]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: 'easeOut' }}
    >
      {word}
    </motion.span>
  );
}

export default function Station1_TheCalling() {
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const isSubtitleInView = useInView(subtitleRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="o-chamado"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Estação 1: O Chamado"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-purple-deep/90 to-parchment" />
        {/* Subtle star-like dots */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-parchment rounded-full animate-pulse-soft"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 80}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ opacity }}
      >
        {/* Bell icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >
          <Bell className="w-10 h-10 text-gold mx-auto opacity-60" strokeWidth={1} />
        </motion.div>

        {/* Station label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-gold/70 text-sm tracking-[0.3em] uppercase mb-8"
        >
          Estação I
        </motion.p>

        {/* Main heading — word by word */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-parchment leading-tight mb-12">
          {WORDS.map((word, i) => (
            <AnimatedWord key={i} word={word} index={i} />
          ))}
        </h1>

        {/* Subtitle */}
        <div ref={subtitleRef}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isSubtitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="font-sans text-parchment/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Uma peregrinação espiritual através da Aliança de Amor.
            <br />
            <span className="text-gold/80 font-serif italic">
              Schoenstatt te convida a caminhar.
            </span>
          </motion.p>
        </div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="mt-12 flex items-center justify-center gap-4 text-gold/40"
        >
          <div className="w-16 h-px bg-gold/30" />
          <span className="text-gold text-lg">✝</span>
          <div className="w-16 h-px bg-gold/30" />
        </motion.div>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <span className="font-serif text-parchment/50 text-sm italic">
          Comece a caminhar
        </span>
        <ChevronDown
          className="w-6 h-6 text-gold/60 animate-scroll-hint"
          strokeWidth={1.5}
        />
      </motion.div>
    </section>
  );
}
