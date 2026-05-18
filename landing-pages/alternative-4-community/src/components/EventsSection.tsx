import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Camera } from 'lucide-react';

interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'upcoming' | 'past';
  category: string;
  bgColor: string;
}

const events: EventItem[] = [
  {
    title: 'Retiro de Casais — "Juntos na Alianca"',
    date: '26-27 de Abril, 2026',
    time: 'Sabado 8h - Domingo 17h',
    location: 'Santuario Tabor, Curitiba - PR',
    description: 'Um final de semana para casais renovarem sua alianca conjugal a luz da espiritualidade de Schoenstatt. Inclui palestras, momentos de oracao a dois e celebracao eucaristica.',
    type: 'upcoming',
    category: 'Retiro',
    bgColor: 'bg-rose-50',
  },
  {
    title: 'Acampamento de Juventude — Verao 2026',
    date: '10-14 de Julho, 2026',
    time: 'Semana completa',
    location: 'Centro de Formacao, Santa Maria - RS',
    description: 'Cinco dias de aventura, formacao e comunidade. Atividades ao ar livre, dinamicas de grupo, via sacra viva e a tradicional fogueira da alianca.',
    type: 'upcoming',
    category: 'Acampamento',
    bgColor: 'bg-blue-50',
  },
  {
    title: '18 de Outubro — Dia da Alianca de Amor',
    date: '18 de Outubro, 2026',
    time: 'Programacao especial o dia todo',
    location: 'Todos os Santuarios do Brasil',
    description: 'Celebracao do aniversario da fundacao do Movimento. Missas, peregrinacoes, renovacao de aliancas e festividades em todos os santuarios do pais.',
    type: 'upcoming',
    category: 'Celebracao',
    bgColor: 'bg-amber-50',
  },
];

const pastEvents = [
  {
    title: 'Peregrinacao ao Santuario Original',
    description: 'Mais de 200 peregrinos brasileiros visitaram Schoenstatt, na Alemanha.',
    initials: 'PS',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Congresso Nacional de Familias',
    description: '1.500 familias reunidas em Curitiba para tres dias de formacao e celebracao.',
    initials: 'CF',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Encontrao da Juventude 2025',
    description: '800 jovens de todo o Brasil unidos por musica, oracao e servico.',
    initials: 'EJ',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Retiro de Maes — "No Coracao de Maria"',
    description: '120 maes renovaram suas forcas em um final de semana de acolhimento.',
    initials: 'RM',
    bgColor: 'bg-rose-100',
  },
];

export default function EventsSection() {
  return (
    <section id="eventos" className="py-20 md:py-28 bg-community-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Proximos Eventos</h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            Momentos de encontro, formacao e celebracao. Venha viver a comunidade de perto.
          </p>
        </motion.div>

        {/* Upcoming events */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="community-card overflow-hidden flex flex-col"
            >
              {/* Color header */}
              <div className={`${event.bgColor} px-6 py-4`}>
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-community-brown/50">
                  {event.category}
                </span>
                <h3 className="font-heading font-bold text-lg text-community-green mt-1">
                  {event.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-community-brown/70">
                    <Calendar className="w-4 h-4 text-community-green/60" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-community-brown/70">
                    <Clock className="w-4 h-4 text-community-green/60" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-community-brown/70">
                    <MapPin className="w-4 h-4 text-community-green/60" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-sm text-community-brown/60 font-body leading-relaxed flex-1">
                  {event.description}
                </p>

                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 mt-4 text-community-green font-heading font-bold text-sm group"
                >
                  Quero participar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Past events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-heading font-bold text-2xl text-community-green text-center mb-8">
            <Camera className="w-6 h-6 inline-block mr-2 mb-1" />
            Momentos que Marcaram
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                {/* Photo placeholder */}
                <div className={`${event.bgColor} aspect-[4/3] flex items-center justify-center`}>
                  <span className="font-heading font-black text-3xl text-community-green/30">
                    {event.initials}
                  </span>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-community-green/90 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <h4 className="font-heading font-bold text-white text-sm mb-2">
                    {event.title}
                  </h4>
                  <p className="text-white/80 text-xs font-body">
                    {event.description}
                  </p>
                  <span className="mt-3 text-white/60 text-xs font-heading flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Veja mais fotos
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
