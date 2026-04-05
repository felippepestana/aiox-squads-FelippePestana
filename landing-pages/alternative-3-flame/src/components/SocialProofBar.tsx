import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-display font-black text-3xl md:text-4xl flame-text">
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 110, suffix: '+', label: 'Anos de História' },
  { value: 40, suffix: '+', label: 'Países no Mundo' },
  { value: 5000, suffix: '+', label: 'Vidas Transformadas' },
  { value: 200, suffix: '+', label: 'Santuários' },
];

export default function SocialProofBar() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-crimson-900/10 via-dark-800/80 to-crimson-900/10" />
      <div className="absolute inset-0 border-y border-dark-700/30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              <p className="mt-1 text-dark-400 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Scrolling text */}
        <div className="mt-8 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 whitespace-nowrap text-dark-600 text-sm font-medium"
          >
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex gap-8">
                <span>✦ Aprovado pela Santa Sé</span>
                <span>✦ Movimento Apostólico Internacional</span>
                <span>✦ Fundado em 1914</span>
                <span>✦ Padre José Kentenich</span>
                <span>✦ Mater Ter Admirabilis</span>
                <span>✦ Santuário Original em Schoenstatt, Alemanha</span>
                <span>✦ Presente em todos os continentes</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
