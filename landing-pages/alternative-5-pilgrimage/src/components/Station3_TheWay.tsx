import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Sun, Hand } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Pillar {
  icon: LucideIcon;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  gradient: string;
  iconColor: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Heart,
    number: '01',
    title: 'Santuário Interior',
    subtitle: 'O refúgio da alma',
    description:
      'Cada pessoa carrega dentro de si um santuário — um espaço sagrado onde Deus habita. O primeiro passo do caminho é cultivar esse santuário interior: um lugar de silêncio, oração e encontro profundo com o divino. Maria é a guardiã desse espaço sagrado.',
    quote: '"Minha alma engrandece o Senhor." — Lc 1,46',
    gradient: 'from-purple-deep/10 via-purple-deep/5 to-transparent',
    iconColor: 'text-purple-deep',
  },
  {
    icon: Sun,
    number: '02',
    title: 'Vida Cotidiana como Oração',
    subtitle: 'Santificando o ordinário',
    description:
      'O caminho de Schoenstatt não se vive apenas nas igrejas. Cada gesto do dia — o trabalho, o estudo, a refeição, o encontro com o próximo — se torna oração quando oferecido com amor. A espiritualidade do cotidiano transforma o comum em extraordinário.',
    quote: '"Fazei tudo para a glória de Deus." — 1Cor 10,31',
    gradient: 'from-gold/10 via-gold/5 to-transparent',
    iconColor: 'text-gold',
  },
  {
    icon: Hand,
    number: '03',
    title: 'Instrumento nas Mãos de Maria',
    subtitle: 'Servir com entrega total',
    description:
      'O peregrino de Schoenstatt se oferece como instrumento nas mãos de Maria. Não é passividade — é a mais corajosa das entregas. É confiar que Maria, como Mãe e Educadora, guia cada passo para que possamos ser mãos e pés de Cristo no mundo.',
    quote: '"Eis aqui a serva do Senhor." — Lc 1,38',
    gradient: 'from-sage/10 via-sage/5 to-transparent',
    iconColor: 'text-sage',
  },
];

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      {/* Path connector */}
      {index < PILLARS.length - 1 && (
        <div className="hidden lg:block absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 h-16">
          <motion.div
            className="w-px h-full mx-auto"
            style={{
              background:
                'repeating-linear-gradient(to bottom, #B8860B 0px, #B8860B 6px, transparent 6px, transparent 12px)',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </div>
      )}

      <div
        className={`relative rounded-2xl p-8 md:p-12 bg-gradient-to-br ${pillar.gradient} border border-gold/10 overflow-hidden`}
      >
        {/* Large background number */}
        <span className="absolute top-4 right-6 font-serif text-[120px] leading-none text-charcoal/[0.03] font-bold select-none pointer-events-none">
          {pillar.number}
        </span>

        {/* Decorative shape */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.03]">
          <div className="w-full h-full rounded-full border-[20px] border-current" />
        </div>

        <div className="relative z-10">
          {/* Icon + number */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className={`w-14 h-14 rounded-xl bg-parchment shadow-sm flex items-center justify-center ${pillar.iconColor}`}
              whileInView={{ rotate: [0, -5, 5, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <pillar.icon size={28} strokeWidth={1.5} />
            </motion.div>
            <div>
              <span className="text-gold/50 font-serif text-sm tracking-[0.2em]">
                Parada {pillar.number}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-semibold">
                {pillar.title}
              </h3>
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-serif text-lg text-charcoal/50 italic mb-4">
            {pillar.subtitle}
          </p>

          {/* Description */}
          <p className="font-sans text-charcoal/70 leading-relaxed text-base md:text-lg mb-6 max-w-2xl">
            {pillar.description}
          </p>

          {/* Quote */}
          <div className="flex items-start gap-3">
            <span className="text-gold text-xl leading-none">&ldquo;</span>
            <p className="font-serif text-charcoal/60 italic text-sm md:text-base">
              {pillar.quote}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Station3_TheWay() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const decorY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="o-caminho"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-parchment-light overflow-hidden"
      aria-label="Estação 3: O Caminho"
    >
      {/* Decorative background */}
      <motion.div
        className="absolute left-0 top-1/4 w-48 h-48 opacity-[0.04]"
        style={{ y: decorY }}
      >
        <div className="w-full h-full">
          <svg viewBox="0 0 200 200" className="w-full h-full text-sage">
            <path
              d="M100 10 L190 60 L190 140 L100 190 L10 140 L10 60 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Station header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-sage/30" />
            <span className="font-serif text-sage/70 text-sm tracking-[0.3em] uppercase">
              Estação III
            </span>
            <div className="w-8 h-px bg-sage/30" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal font-light mb-6">
            O Caminho
          </h2>
          <p className="font-sans text-charcoal/60 text-lg max-w-2xl mx-auto">
            Três pilares sustentam a espiritualidade de Schoenstatt.
            Três paradas no caminho que transformam o peregrino.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-8 lg:space-y-16">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.number} pillar={pillar} index={i} />
          ))}
        </div>

        {/* Bottom reflection */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="ornamental-divider max-w-xs mx-auto mb-6">
            <span className="text-sm">✝</span>
          </div>
          <p className="font-serif text-charcoal/50 italic text-lg max-w-lg mx-auto">
            O caminho não é feito de passos perfeitos, mas de passos perseverantes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
