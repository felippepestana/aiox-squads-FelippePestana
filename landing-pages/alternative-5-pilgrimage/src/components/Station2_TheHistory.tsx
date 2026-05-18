import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineEvent[] = [
  {
    year: '1885',
    title: 'O Nascimento de um Visionário',
    description:
      'José Kentenich nasce em Gymnich, Alemanha. Uma vida que será inteiramente dedicada a Deus e a Maria.',
  },
  {
    year: '1912',
    title: 'O Jovem Sacerdote',
    description:
      'Ordenado sacerdote, Pe. Kentenich é enviado como diretor espiritual dos seminaristas palotinos em Schoenstatt.',
  },
  {
    year: '18 Out 1914',
    title: 'O Ato Fundador',
    description:
      'Numa pequena capela dedicada a São Miguel, um grupo de seminaristas e seu diretor espiritual selam uma aliança com Maria. Nasce o Movimento de Schoenstatt — um ato de fé radical em tempos de guerra.',
  },
  {
    year: '1914–2024',
    title: 'Um Movimento Mundial',
    description:
      'De uma pequena capela na Alemanha, a Aliança de Amor se espalha por mais de 120 países. Milhões de peregrinos visitam o Santuário Original todos os anos.',
  },
];

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex items-start gap-6 md:gap-12 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <motion.span
          className="inline-block font-serif text-gold text-3xl md:text-4xl font-light mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {event.year}
        </motion.span>
        <h3 className="font-serif text-xl md:text-2xl text-charcoal font-semibold mb-3">
          {event.title}
        </h3>
        <p className="font-sans text-charcoal/70 leading-relaxed max-w-md inline-block">
          {event.description}
        </p>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center">
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-gold bg-parchment z-10"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
      </div>

      {/* Spacer for alignment */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

export default function Station2_TheHistory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="a-historia"
      ref={sectionRef}
      className="relative py-24 md:py-32 parchment-texture overflow-hidden"
      aria-label="Estação 2: A História"
    >
      {/* Decorative background element */}
      <motion.div
        className="absolute right-0 top-20 w-64 h-64 opacity-5"
        style={{ y: parallaxY }}
      >
        <div className="w-full h-full rounded-full border-[40px] border-purple-deep" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Station header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <BookOpen className="w-8 h-8 text-gold mx-auto mb-4 opacity-60" strokeWidth={1} />
          <p className="font-serif text-gold/70 text-sm tracking-[0.3em] uppercase mb-4">
            Estação II
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal font-light mb-6">
            A História
          </h2>
          <p className="font-sans text-charcoal/60 text-lg max-w-2xl mx-auto">
            Como um jovem sacerdote e um grupo de seminaristas mudaram a história
            da espiritualidade católica para sempre.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <motion.div
              className="w-full bg-gold/20"
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>

          <div className="space-y-16 md:space-y-20">
            {TIMELINE.map((event, i) => (
              <TimelineCard key={event.year} event={event} index={i} />
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.blockquote
          className="mt-20 md:mt-28 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6 text-gold/40">
            <div className="w-12 h-px bg-gold/30" />
            <span className="text-2xl text-gold/50">&ldquo;</span>
            <div className="w-12 h-px bg-gold/30" />
          </div>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal font-light italic leading-relaxed mb-6">
            Nada sem vocês, nada sem nós.
          </p>
          <footer className="font-sans text-charcoal/50 text-sm">
            <cite className="not-italic">
              — Pe. José Kentenich, 18 de outubro de 1914
            </cite>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
