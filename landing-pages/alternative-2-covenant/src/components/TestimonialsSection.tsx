import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Carolina Silva',
    role: 'Mae e educadora',
    quote:
      'A Alianca de Amor transformou minha forma de ver a maternidade. Encontrei uma comunidade que me acolheu e me ajudou a crescer como pessoa e como mae.',
    rating: 5,
    initials: 'AC',
  },
  {
    id: 2,
    name: 'Roberto Mendes',
    role: 'Empresario',
    quote:
      'Eu era cetico no inicio, mas a experiencia superou todas as expectativas. Aprendi a encontrar proposito em cada detalhe do meu trabalho e da minha vida familiar.',
    rating: 5,
    initials: 'RM',
  },
  {
    id: 3,
    name: 'Mariana e Pedro Costa',
    role: 'Casal, membros ha 8 anos',
    quote:
      'Nosso casamento ganhou uma profundidade que nao sabiamos ser possivel. A alianca nos ensinou a construir uma familia baseada em amor verdadeiro e proposito.',
    rating: 5,
    initials: 'MC',
  },
  {
    id: 4,
    name: 'Juliana Ferreira',
    role: 'Jovem universitaria',
    quote:
      'Encontrei na comunidade jovens como eu, buscando algo mais. As reunioes me ajudaram a lidar com a ansiedade e a encontrar clareza sobre meu futuro.',
    rating: 5,
    initials: 'JF',
  },
  {
    id: 5,
    name: 'Carlos Eduardo Lima',
    role: 'Medico, membro ha 15 anos',
    quote:
      'A espiritualidade do cotidiano mudou minha pratica medica. Cada paciente se tornou uma oportunidade de servir com mais humanidade e compaixao.',
    rating: 5,
    initials: 'CL',
  },
  {
    id: 6,
    name: 'Teresa Oliveira',
    role: 'Aposentada e voluntaria',
    quote:
      'Depois de perder meu marido, a comunidade foi meu apoio. Hoje, aos 72 anos, tenho mais energia e proposito do que nunca. A alianca me devolveu a alegria.',
    rating: 5,
    initials: 'TO',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? 'text-covenant-warm fill-covenant-warm' : 'text-covenant-gray-200'
          }
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="section-padding bg-white"
      aria-labelledby="testimonials-heading"
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
            Depoimentos
          </span>
          <h2
            id="testimonials-heading"
            className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
          >
            Historias reais de transformacao
          </h2>
          <p className="mt-4 text-covenant-gray-600 text-lg">
            Veja como a Alianca de Amor impactou a vida de pessoas como voce.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative bg-covenant-gray rounded-2xl p-6 border border-covenant-gray-200/50 hover:shadow-md transition-shadow duration-300"
            >
              {/* Blue accent line */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-covenant-blue/20" />

              <div className="pl-4">
                <Quote
                  size={20}
                  className="text-covenant-blue/20 mb-3"
                  aria-hidden="true"
                />

                <StarRating rating={t.rating} />

                <blockquote className="mt-3 text-covenant-gray-600 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-covenant-gray-200/60">
                  <div
                    className="w-10 h-10 rounded-full bg-covenant-blue/10 flex items-center justify-center text-covenant-blue text-xs font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-covenant-blue-dark">
                      {t.name}
                    </p>
                    <p className="text-xs text-covenant-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
