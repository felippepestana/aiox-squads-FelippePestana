import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Users, Compass } from 'lucide-react';

const pillars = [
  {
    icon: Heart,
    title: 'Fe',
    description:
      'Uma fe viva, enraizada na alianca com Maria. Atraves da oracao, da consagracao e da vida sacramental, cultivamos uma relacao profunda com Deus.',
  },
  {
    icon: Users,
    title: 'Familia',
    description:
      'O Santuario do Lar e o coracao de Schoenstatt. Familias fortalecidas na graca, unidas pela alianca de amor, irradiando o amor de Cristo na sociedade.',
  },
  {
    icon: Compass,
    title: 'Missao',
    description:
      'Enviados ao mundo como instrumentos de renovacao. Cada aliancista e chamado a transformar seu ambiente — trabalho, comunidade, cultura — pela forca da graca.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="sobre"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Sobre a Alianca de Amor"
    >
      {/* Background glow */}
      <div className="absolute inset-0 radial-glow-gold" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            Conheca Nossa Espiritualidade
          </p>
          <h2 className="section-heading">
            O que e a <span className="text-gold-gradient">Alianca de Amor</span>?
          </h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subheading">
            Fundado em 18 de outubro de 1914 pelo Pe. Jose Kentenich, o Movimento de Schoenstatt
            nasceu de uma alianca de amor entre uma comunidade de jovens e a Mae de Deus.
            Hoje, essa alianca se estende por mais de 100 paises, transformando vidas e familias
            pela forca da graca.
          </p>
        </motion.div>

        {/* Three pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="sanctuary-card p-8 md:p-10 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sanctuary-gold/10 border border-sanctuary-gold/20 mb-6 group-hover:candle-glow transition-all duration-500">
                  <Icon className="h-7 w-7 text-sanctuary-gold" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-sanctuary-cream mb-4">
                  {pillar.title}
                </h3>
                <p className="text-sanctuary-cream/60 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="font-serif italic text-xl md:text-2xl text-sanctuary-cream/50 max-w-3xl mx-auto">
            &ldquo;Maria e o caminho mais rapido, mais seguro e mais facil para chegar a Cristo.&rdquo;
          </p>
          <cite className="block mt-4 text-sanctuary-gold/60 text-sm not-italic">
            &mdash; Pe. Jose Kentenich, Fundador de Schoenstatt
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
