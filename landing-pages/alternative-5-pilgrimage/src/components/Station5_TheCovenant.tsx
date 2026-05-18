import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Crown, Heart } from 'lucide-react';

const YOU_PROMISE = [
  'Consagrar-se a Maria como Mãe e Educadora',
  'Viver a espiritualidade do cotidiano com fidelidade',
  'Cultivar o Santuário Interior diariamente',
  'Contribuir com o Capital de Graças através de orações e sacrifícios',
  'Ser instrumento de renovação na Igreja e no mundo',
];

const MARY_PROMISES = [
  'Acolher-te como filho(a) com amor materno',
  'Educar-te para a santidade no dia a dia',
  'Interceder por ti diante de seu Filho',
  'Guiar teus passos nos momentos de escuridão',
  'Transformar-te em instrumento de graça para outros',
];

export default function Station5_TheCovenant() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);
  const goldGlow = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      id="a-alianca"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Estação 5: A Aliança"
    >
      {/* Deep purple background transition */}
      <motion.div
        className="absolute inset-0 bg-purple-deep"
        style={{ opacity: bgOpacity }}
      />

      {/* Gold radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: goldGlow }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      </motion.div>

      {/* Decorative cross pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[300px] bg-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-px bg-gold" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Station header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <Crown className="w-8 h-8 text-gold mx-auto mb-4" strokeWidth={1} />
          <p className="font-serif text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Estação V
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-parchment font-light mb-6">
            A Aliança
          </h2>
          <p className="font-sans text-parchment/60 text-lg max-w-2xl mx-auto">
            O coração de Schoenstatt. O momento mais sagrado da peregrinação.
            Uma aliança de amor entre você e Maria — selada na confiança, vivida na entrega.
          </p>
        </motion.div>

        {/* Sacred scroll */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-2xl bg-parchment/10 backdrop-blur-sm border border-gold/20 p-8 md:p-12">
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/30 rounded-tl" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/30 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/30 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/30 rounded-br" />

            <div className="text-center mb-8">
              <Heart className="w-6 h-6 text-gold mx-auto mb-3" strokeWidth={1} />
              <h3 className="font-serif text-2xl md:text-3xl text-parchment font-semibold">
                O que é a Aliança de Amor?
              </h3>
            </div>

            <div className="sacred-text text-parchment/80 text-center space-y-4">
              <p>
                A Aliança de Amor é um pacto espiritual — livre, pessoal e recíproco —
                entre o peregrino e a Mãe de Deus, Rainha e Vencedora Três Vezes Admirável
                de Schoenstatt.
              </p>
              <p>
                Não é uma simples devoção. É um compromisso de vida. Um contrato de amor
                onde ambas as partes — você e Maria — se comprometem mutuamente.
              </p>
              <p className="text-gold italic">
                É o momento em que o caminho se torna morada.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Two columns: promises */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Your promises */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center md:text-left mb-8">
              <p className="font-serif text-gold text-sm tracking-[0.2em] uppercase mb-2">
                O que você promete
              </p>
              <h3 className="font-serif text-2xl text-parchment font-light">
                Sua entrega
              </h3>
            </div>
            <ul className="space-y-4">
              {YOU_PROMISE.map((promise, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold/60 flex-shrink-0" />
                  <span className="font-sans text-parchment/70 leading-relaxed">
                    {promise}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mary's promises */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center md:text-left mb-8">
              <p className="font-serif text-gold text-sm tracking-[0.2em] uppercase mb-2">
                O que Maria promete
              </p>
              <h3 className="font-serif text-2xl text-parchment font-light">
                Seu amor materno
              </h3>
            </div>
            <ul className="space-y-4">
              {MARY_PROMISES.map((promise, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                  <span className="font-sans text-parchment/70 leading-relaxed">
                    {promise}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Closing quote */}
        <motion.blockquote
          className="mt-20 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-gold/30" />
            <span className="text-gold text-xl">✝</span>
            <div className="w-8 h-px bg-gold/30" />
          </div>
          <p className="font-serif text-xl md:text-2xl text-parchment/80 italic leading-relaxed mb-4">
            &ldquo;A Aliança de Amor é o coração de Schoenstatt.
            Tudo nasce dela e tudo a ela retorna.&rdquo;
          </p>
          <cite className="font-sans text-parchment/40 text-sm not-italic">
            — Pe. José Kentenich
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
