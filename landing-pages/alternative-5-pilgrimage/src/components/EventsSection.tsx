import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  date: string;
  month: string;
  title: string;
  location: string;
  type: string;
}

const EVENTS: Event[] = [
  {
    date: '12',
    month: 'Mai',
    title: 'Retiro de Aliança de Amor',
    location: 'Santuário de Schoenstatt, Atibaia - SP',
    type: 'Retiro',
  },
  {
    date: '25',
    month: 'Mai',
    title: 'Encontro Nacional da Juventude',
    location: 'Centro de Formação, Londrina - PR',
    type: 'Encontro',
  },
  {
    date: '08',
    month: 'Jun',
    title: 'Peregrinação ao Santuário',
    location: 'Santuário Tabor, Santa Maria - RS',
    type: 'Peregrinação',
  },
  {
    date: '18',
    month: 'Out',
    title: 'Celebração do Dia da Aliança',
    location: 'Todos os Santuários do Brasil',
    type: 'Celebração',
  },
];

export default function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-parchment parchment-texture overflow-hidden"
      aria-label="Encontros no Caminho"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <Calendar className="w-7 h-7 text-gold mx-auto mb-4 opacity-60" strokeWidth={1} />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-light mb-4">
            Encontros no Caminho
          </h2>
          <p className="font-sans text-charcoal/60 text-lg max-w-xl mx-auto">
            Marcos no caminho onde peregrinos se encontram.
          </p>
        </motion.div>

        {/* Events as path milestones */}
        <div className="relative">
          {/* Dashed path line */}
          <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px hidden sm:block">
            <motion.div
              className="w-full h-full"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #B8860B 0px, #B8860B 6px, transparent 6px, transparent 14px)',
                opacity: 0.25,
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          </div>

          <div className="space-y-8">
            {EVENTS.map((event, i) => (
              <motion.div
                key={`${event.date}-${event.month}`}
                className="relative flex items-start gap-4 sm:gap-8 pl-0 sm:pl-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Date marker */}
                <div className="flex-shrink-0 w-12 md:w-20 text-center relative z-10">
                  <div className="bg-parchment border border-gold/20 rounded-lg p-2 md:p-3 shadow-sm">
                    <span className="block font-serif text-2xl md:text-3xl text-gold font-semibold leading-none">
                      {event.date}
                    </span>
                    <span className="block font-sans text-charcoal/50 text-xs uppercase tracking-wider mt-0.5">
                      {event.month}
                    </span>
                  </div>
                </div>

                {/* Event content */}
                <div className="flex-1 pt-1">
                  <span className="inline-block font-sans text-xs text-gold/70 bg-gold/10 px-2 py-0.5 rounded-full mb-2">
                    {event.type}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-charcoal font-medium mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-charcoal/50">
                    <MapPin size={14} strokeWidth={1.5} />
                    <span className="font-sans text-sm">{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
