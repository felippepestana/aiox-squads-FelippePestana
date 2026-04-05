import { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
}

const sampleTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Fernanda Silva',
    role: 'Aliancista ha 12 anos',
    quote:
      'A Alianca de Amor transformou minha familia. Encontramos na Mae de Schoenstatt uma intercessora poderosa e um caminho de unidade que parecia impossivel. Hoje, nosso lar e um Santuario.',
  },
  {
    id: 2,
    name: 'Joao Pedro Oliveira',
    role: 'Juventude Masculina de Schoenstatt',
    quote:
      'Entrei no Movimento ainda jovem, sem muita fe. A alianca com Nossa Senhora foi me conquistando aos poucos, com uma pedagogia de amor. Hoje, sei que nunca caminho sozinho.',
  },
  {
    id: 3,
    name: 'Ana Carolina Mendes',
    role: 'Mae de familia, Campanha do Santuario',
    quote:
      'Quando a imagem da Mae Peregrina chegou ao nosso bairro, a graca comecou a operar de forma visivel. Familias se reconciliaram, doentes encontraram paz, e a comunidade renasceu na fe.',
  },
  {
    id: 4,
    name: 'Pe. Roberto Santos',
    role: 'Sacerdote diocesano aliancista',
    quote:
      'A espiritualidade de Schoenstatt me ajudou a viver meu sacerdocio com mais profundidade. A alianca com Maria e um ancoradouro nos momentos de tempestade e uma fonte de alegria no servico pastoral.',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const goTo = (index: number) => {
    if (index < 0) setCurrentIndex(sampleTestimonials.length - 1);
    else if (index >= sampleTestimonials.length) setCurrentIndex(0);
    else setCurrentIndex(index);
  };

  const current = sampleTestimonials[currentIndex];

  return (
    <section
      id="testemunhos"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Testemunhos"
    >
      <div className="absolute inset-0 radial-glow-gold" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            Vozes da Alianca
          </p>
          <h2 className="section-heading">
            Vidas <span className="text-gold-gradient">Transformadas</span>
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="sanctuary-card p-8 md:p-12 max-w-3xl mx-auto relative"
        >
          {/* Gold quote mark */}
          <Quote className="absolute top-6 left-6 h-10 w-10 text-sanctuary-gold/20" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-2 border-sanctuary-gold/40 mx-auto mb-6 overflow-hidden bg-sanctuary-navy-lighter flex items-center justify-center">
                <span className="font-serif text-2xl text-sanctuary-gold">
                  {current.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-lg md:text-xl text-sanctuary-cream/80 italic leading-relaxed mb-6">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <p className="font-semibold text-sanctuary-cream">{current.name}</p>
                <p className="text-sanctuary-gold/60 text-sm mt-1">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="p-2 rounded-full border border-sanctuary-gold/20 text-sanctuary-gold/60 hover:bg-sanctuary-gold/10 hover:text-sanctuary-gold transition-all"
              aria-label="Testemunho anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {sampleTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'bg-sanctuary-gold w-6'
                      : 'bg-sanctuary-gold/30 hover:bg-sanctuary-gold/50'
                  }`}
                  aria-label={`Ir para testemunho ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(currentIndex + 1)}
              className="p-2 rounded-full border border-sanctuary-gold/20 text-sanctuary-gold/60 hover:bg-sanctuary-gold/10 hover:text-sanctuary-gold transition-all"
              aria-label="Proximo testemunho"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
