import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Event {
  id: number;
  date: string;
  month: string;
  day: string;
  title: string;
  location: string;
  description: string;
}

const events: Event[] = [
  {
    id: 1,
    date: '2026-05-18',
    month: 'Mai',
    day: '18',
    title: 'Retiro de Fim de Semana — Alianca e Vida',
    location: 'Santuario de Schoenstatt, Atibaia - SP',
    description:
      'Um final de semana para desconectar, refletir e renovar sua alianca. Inclui palestras, momentos de oracao e convivencia.',
  },
  {
    id: 2,
    date: '2026-06-08',
    month: 'Jun',
    day: '08',
    title: 'Encontro de Casais — Amor que Transforma',
    location: 'Centro Comunitario, Curitiba - PR',
    description:
      'Uma noite especial para casais descobrirem como fortalecer seu relacionamento atraves da espiritualidade do cotidiano.',
  },
  {
    id: 3,
    date: '2026-07-12',
    month: 'Jul',
    day: '12',
    title: 'Jornada Jovem — Encontre Seu Proposito',
    location: 'Santuario Mae Rainha, Londrina - PR',
    description:
      'Evento para jovens de 18 a 35 anos que buscam sentido, comunidade e direcao para a vida.',
  },
  {
    id: 4,
    date: '2026-10-18',
    month: 'Out',
    day: '18',
    title: 'Celebracao do 18 de Outubro',
    location: 'Todos os Santuarios do Brasil',
    description:
      'Data fundacional do Movimento. Celebracao especial com renovacao da Alianca de Amor em comunidades do Brasil inteiro.',
  },
];

export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="section-padding bg-covenant-gray"
      aria-labelledby="events-heading"
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-covenant-blue uppercase tracking-wider">
            Proximos Eventos
          </span>
          <h2
            id="events-heading"
            className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
          >
            Participe e viva a experiencia
          </h2>
          <p className="mt-4 text-covenant-gray-600 text-lg">
            Encontros, retiros e celebracoes para todos os momentos da vida.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {events.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`flex flex-col sm:flex-row gap-5 p-6 rounded-2xl transition-shadow duration-300 hover:shadow-md ${
                i % 2 === 0
                  ? 'bg-white border border-covenant-gray-200/50'
                  : 'bg-covenant-gray border border-covenant-gray-200/50'
              }`}
            >
              {/* Date badge */}
              <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 sm:min-w-[72px]">
                <div className="flex sm:flex-col items-center gap-2 sm:gap-0 bg-covenant-blue/10 rounded-xl px-4 py-3 sm:px-4 sm:py-3 text-center">
                  <Calendar size={16} className="text-covenant-blue sm:mb-1" />
                  <span className="text-xs font-semibold text-covenant-blue uppercase">
                    {event.month}
                  </span>
                  <span className="text-2xl font-extrabold text-covenant-blue-dark leading-none">
                    {event.day}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-covenant-blue-dark">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-covenant-gray-400">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <p className="mt-2 text-sm text-covenant-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center sm:items-start pt-0 sm:pt-1">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-covenant-blue hover:text-covenant-blue-dark transition-colors whitespace-nowrap"
                >
                  Saiba mais
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
