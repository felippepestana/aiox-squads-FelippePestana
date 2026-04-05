import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

const sampleEvents: EventItem[] = [
  {
    id: 1,
    title: 'Retiro de Alianca de Amor',
    description:
      'Um final de semana de imersao espiritual para quem deseja aprofundar sua alianca com Nossa Senhora de Schoenstatt.',
    date: '15-17 Mai 2026',
    time: 'Sexta 19h - Domingo 16h',
    location: 'Santuario de Schoenstatt, Londrina - PR',
    type: 'Retiro',
  },
  {
    id: 2,
    title: 'Encontro de Familias',
    description:
      'Dia de formacao e convivencia para casais e familias aliancistas. Temas: educacao dos filhos e Santuario do Lar.',
    date: '07 Jun 2026',
    time: 'Sabado, 9h - 17h',
    location: 'Casa de Retiros MTA, Sao Paulo - SP',
    type: 'Encontro',
  },
  {
    id: 3,
    title: 'Peregrinacao ao Santuario Original',
    description:
      'Peregrinacao nacional ao Santuario Tabor, com celebracao solene e renovacao da Alianca de Amor.',
    date: '18 Out 2026',
    time: 'Domingo, 10h',
    location: 'Santuario Tabor, Atibaia - SP',
    type: 'Peregrinacao',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function EventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="eventos"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Proximos eventos"
    >
      <div className="absolute inset-0 radial-glow-rose" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            Venha Participar
          </p>
          <h2 className="section-heading">
            Proximos <span className="text-gold-gradient">Eventos</span>
          </h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subheading">
            Encontros, retiros e peregrinacoes para viver a Alianca de Amor em comunidade.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {sampleEvents.map((event) => (
            <motion.article
              key={event.id}
              variants={cardVariants}
              className="sanctuary-card overflow-hidden group hover:border-sanctuary-gold/40 transition-all duration-500"
            >
              {/* Top accent */}
              <div className="h-1 bg-gold-gradient" />

              <div className="p-6 md:p-8">
                {/* Type badge */}
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-sanctuary-gold bg-sanctuary-gold/10 px-3 py-1 rounded-full mb-4">
                  {event.type}
                </span>

                {/* Date */}
                <div className="flex items-center gap-2 text-sanctuary-cream/50 text-sm mb-3">
                  <Calendar className="h-4 w-4 text-sanctuary-gold/60" />
                  <span>{event.date}</span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-sanctuary-cream mb-3 group-hover:text-sanctuary-gold transition-colors">
                  {event.title}
                </h3>

                <p className="text-sanctuary-cream/50 text-sm leading-relaxed mb-5">
                  {event.description}
                </p>

                {/* Meta */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sanctuary-cream/40 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sanctuary-cream/40 text-xs">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-sanctuary-gold/30 text-sanctuary-gold text-sm font-medium hover:bg-sanctuary-gold/10 transition-all group/btn">
                  Inscreva-se
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
