import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const timelineEvents = [
  {
    year: '1914',
    title: 'A Fundacao',
    description:
      'Em 18 de outubro, na pequena capela de Schoenstatt, Alemanha, o Pe. Jose Kentenich e um grupo de jovens seminaristas firmam a primeira Alianca de Amor com a Mae Tres Vezes Admiravel.',
  },
  {
    year: '1935',
    title: 'Chegada ao Brasil',
    description:
      'O Movimento chega ao Brasil, encontrando coracao aberto no povo brasileiro. Primeiros Santuarios sao construidos e comunidades comecam a florescer em diversas cidades.',
  },
  {
    year: '1952',
    title: 'Santuario Original Replicado',
    description:
      'Mais de 200 Santuarios-filiais se espalham pelo mundo, levando a graca da Alianca de Amor a todos os continentes.',
  },
  {
    year: '1968',
    title: 'Legado Eterno',
    description:
      'Pe. Kentenich retorna a Schoenstatt apos anos de exilio e prisao, celebrando missa no Santuario Original. Falece em 15 de setembro, deixando um legado espiritual imenso.',
  },
  {
    year: 'Hoje',
    title: 'Presenca Global',
    description:
      'Presente em mais de 100 paises, o Movimento de Schoenstatt reune milhoes de aliancistas em familias, juventudes, sacerdotes e comunidades consagradas, renovando a Igreja e o mundo.',
  },
];

export default function HistoryTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="historia"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Historia do Movimento"
    >
      <div className="absolute inset-0 radial-glow-rose" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            Uma Historia de Graca
          </p>
          <h2 className="section-heading">
            <span className="text-gold-gradient">Mais de um Seculo</span> de Alianca
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Gold vertical line */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sanctuary-gold/50 via-sanctuary-gold/20 to-transparent md:-translate-x-[1px]"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + index * 0.2 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Glowing dot */}
                  <div className="absolute left-4 md:left-1/2 top-1 md:-translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-sanctuary-gold animate-glow-pulse" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-sanctuary-gold/30 animate-ping" />
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-4 flex-shrink-0 md:hidden" />

                  {/* Content card */}
                  <div
                    className={`flex-1 md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    {/* Empty spacer on the other side (desktop) */}
                    <div className="hidden md:block" />

                    <div className="sanctuary-card p-6 ml-4 md:ml-0">
                      <span className="inline-block text-sanctuary-gold font-serif text-2xl font-bold mb-2">
                        {event.year}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-sanctuary-cream mb-3">
                        {event.title}
                      </h3>
                      <p className="text-sanctuary-cream/60 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty half for desktop layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
