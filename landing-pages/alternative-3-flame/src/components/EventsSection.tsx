import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const events = [
  {
    title: 'Retiro de Aliança de Amor',
    date: 'Maio 2026',
    location: 'Santuário de Schoenstatt — São Paulo, SP',
    spots: 30,
    type: 'Retiro',
    description: 'Um final de semana de imersão profunda na espiritualidade da Aliança. Palestras, adoração e renovação da aliança.',
  },
  {
    title: 'Encontro Nacional de Jovens',
    date: 'Junho 2026',
    location: 'Centro de Formação — Atibaia, SP',
    spots: 50,
    type: 'Encontro',
    description: 'Jovens de todo o Brasil unidos pela chama da fé. Música, testemunhos e formação vibrante.',
  },
  {
    title: 'Peregrinação ao Santuário',
    date: 'Outubro 2026',
    location: 'Santuário Original — Schoenstatt, Alemanha',
    spots: 15,
    type: 'Peregrinação',
    description: 'Viagem ao coração do Movimento. Conheça onde tudo começou em 18 de outubro de 1914.',
  },
];

export default function EventsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [eventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });
  const countdown = useCountdown(eventDate);

  return (
    <section id="eventos" className="section-padding bg-dark-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-crimson-800/8 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-flame-500 font-display font-bold text-sm uppercase tracking-widest">
            Não perca esta oportunidade
          </span>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            PRÓXIMO RETIRO <span className="flame-text">EM:</span>
          </h2>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-4 md:gap-6 mb-16"
        >
          {[
            { value: countdown.days, label: 'Dias' },
            { value: countdown.hours, label: 'Horas' },
            { value: countdown.minutes, label: 'Min' },
            { value: countdown.seconds, label: 'Seg' },
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl bg-gradient-to-br from-crimson-900/40 to-dark-800 border border-crimson-800/30">
                <span className="font-display font-black text-3xl md:text-4xl text-white">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs text-dark-400 mt-2 block font-medium">{unit.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Event cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="group relative rounded-2xl bg-dark-800/60 border border-dark-700/50 overflow-hidden hover:border-flame-600/30 transition-all duration-300"
            >
              {/* Top accent */}
              <div className="h-1 bg-flame-gradient-horizontal" />

              <div className="p-6">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-flame-600/20 text-flame-400 text-xs font-bold uppercase">
                    {event.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-crimson-800/20 text-crimson-400 text-xs font-bold uppercase animate-pulse">
                    🔥 Vagas Limitadas
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-2">{event.title}</h3>
                <p className="text-dark-400 text-sm mb-4">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-dark-300">
                    <svg className="w-4 h-4 text-flame-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-dark-300">
                    <svg className="w-4 h-4 text-flame-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>

                {/* Spots remaining */}
                <div className="mt-4 pt-4 border-t border-dark-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-dark-400">Vagas restantes</span>
                    <span className="text-xs font-bold text-flame-500">{event.spots} vagas</span>
                  </div>
                  <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${100 - event.spots}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                      className="h-full bg-flame-gradient-horizontal rounded-full"
                    />
                  </div>
                </div>

                <a
                  href="#formulario"
                  className="mt-5 w-full flame-btn !py-3 !text-sm text-center block"
                >
                  GARANTA SUA VAGA
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
