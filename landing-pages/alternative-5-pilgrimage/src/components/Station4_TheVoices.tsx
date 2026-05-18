import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronDown } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  pullQuote: string;
  fullStory: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Clara Santos',
    role: 'Mãe de família, Membro desde 2008',
    location: 'Curitiba, PR',
    pullQuote:
      'A Aliança de Amor me ensinou que a santidade não está longe — está na cozinha, no abraço, no perdão diário.',
    fullStory:
      'Conheci Schoenstatt num momento de profunda crise familiar. Meu casamento estava por um fio, meus filhos se afastavam. Uma amiga me levou a um grupo de mães e ali, pela primeira vez em anos, senti que não estava sozinha. Maria se tornou minha companheira de jornada. Hoje, dezesseis anos depois, minha família é meu santuário. Não perfeita — mas inteira.',
  },
  {
    id: 2,
    name: 'Pe. Rafael Oliveira',
    role: 'Sacerdote, Padre de Schoenstatt',
    location: 'São Paulo, SP',
    pullQuote:
      'Quando selei minha aliança, entendi que não era eu quem escolhia Maria — era ela quem, há muito, me escolhia.',
    fullStory:
      'Minha vocação sacerdotal nasceu dentro de Schoenstatt. Aos 17 anos, num retiro, senti o chamado com uma clareza que nunca tinha experimentado. O caminho não foi fácil — houve dúvidas, noites escuras, tentações de desistir. Mas a Aliança de Amor foi minha âncora. Cada manhã, renovar essa aliança me dava forças para mais um dia de entrega.',
  },
  {
    id: 3,
    name: 'Ana Beatriz Ferreira',
    role: 'Jovem universitária, Juventude Feminina',
    location: 'Belo Horizonte, MG',
    pullQuote:
      'Meus amigos achavam estranho que eu rezasse. Hoje, vários deles pedem que eu reze por eles.',
    fullStory:
      'Entrei para a Juventude de Schoenstatt com 15 anos, praticamente arrastada pela minha avó. Achava tudo antiquado. Mas algo aconteceu naquele primeiro acampamento — uma experiência de comunidade que eu nunca tinha vivido nas redes sociais. Descobri que fé e juventude não são opostos. Hoje estudo psicologia e sonho em unir minha profissão à missão educadora de Schoenstatt.',
  },
  {
    id: 4,
    name: 'Carlos Eduardo Lima',
    role: 'Empresário, Liga de Casais',
    location: 'Florianópolis, SC',
    pullQuote:
      'A fé que encontrei em Schoenstatt me fez um marido melhor, um pai mais presente e um profissional mais ético.',
    fullStory:
      'Sempre fui um católico de domingo. Ia à missa, cumpria o mínimo. Quando minha esposa me apresentou Schoenstatt, resisti por anos. Achava que espiritualidade não era coisa de homem. A virada veio num retiro para casais onde entendi que ser forte é se entregar — a Deus, à família, ao próximo. Hoje coordeno um grupo de casais e minha vida tem um propósito que vai muito além do sucesso profissional.',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="bg-parchment rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
        {/* Pull quote */}
        <div className="p-6 md:p-8">
          <Quote className="w-6 h-6 text-gold/30 mb-4" strokeWidth={1} />
          <p className="font-serif text-xl md:text-2xl text-charcoal/80 italic leading-relaxed mb-4">
            &ldquo;{testimonial.pullQuote}&rdquo;
          </p>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-sage/20 flex items-center justify-center">
              <span className="font-serif text-gold font-semibold text-sm">
                {testimonial.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <p className="font-sans text-charcoal font-medium text-sm">
                {testimonial.name}
              </p>
              <p className="font-sans text-charcoal/50 text-xs">
                {testimonial.role} — {testimonial.location}
              </p>
            </div>
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-gold hover:text-gold-dark transition-colors font-sans text-sm group"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Recolher história' : 'Ler história completa'}</span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>
        </div>

        {/* Expanded story */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                <div className="border-t border-gold/10 pt-4">
                  <p className="font-sans text-charcoal/70 leading-relaxed drop-cap">
                    {testimonial.fullStory}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Station4_TheVoices() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="as-vozes"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-parchment-dark/30 parchment-texture overflow-hidden"
      aria-label="Estação 4: As Vozes"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Station header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-serif text-gold/70 text-sm tracking-[0.3em] uppercase mb-4">
            Estação IV
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal font-light mb-6">
            As Vozes
          </h2>
          <p className="font-sans text-charcoal/60 text-lg max-w-2xl mx-auto">
            Ao longo do caminho, encontramos outros peregrinos.
            Suas histórias iluminam os nossos passos.
          </p>
        </motion.div>

        {/* Testimonials — staggered grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className={i % 2 !== 0 ? 'md:mt-12' : ''}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Handwriting accent */}
        <motion.p
          className="mt-16 text-center handwriting-accent text-charcoal/30 text-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          ...e muitas outras vozes se juntam ao caminho
        </motion.p>
      </div>
    </section>
  );
}
