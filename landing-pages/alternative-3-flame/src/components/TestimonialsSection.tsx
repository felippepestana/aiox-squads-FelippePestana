import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const videoTestimonials = [
  {
    name: 'Maria Clara Santos',
    role: 'Membro há 8 anos',
    quote: 'A Aliança de Amor salvou meu casamento e trouxe minha família de volta à fé.',
    thumbnail: 'bg-gradient-to-br from-crimson-800 to-flame-700',
  },
  {
    name: 'Pe. Roberto Silva',
    role: 'Assessor Espiritual',
    quote: 'Em 20 anos de sacerdócio, nunca vi algo tão poderoso quanto a transformação pela Aliança.',
    thumbnail: 'bg-gradient-to-br from-dark-700 to-crimson-900',
  },
];

const textTestimonials = [
  {
    name: 'Ana Paula Ferreira',
    city: 'São Paulo, SP',
    stars: 5,
    text: 'Eu estava completamente perdida. Sem fé, sem esperança. A Aliança de Amor me deu uma nova vida. Hoje tenho paz, propósito e uma comunidade que me acolhe como família.',
  },
  {
    name: 'Carlos Eduardo Lima',
    city: 'Belo Horizonte, MG',
    stars: 5,
    text: 'Minha família estava se desfazendo. Depois que fizemos a Aliança juntos, tudo mudou. Hoje rezamos juntos, nos amamos mais e nossa casa é um santuário doméstico.',
  },
  {
    name: 'Ir. Terezinha Alves',
    city: 'Curitiba, PR',
    stars: 5,
    text: 'A Mãe Três Vezes Admirável se tornou real na minha vida. Cada graça, cada proteção — sinto a presença dela todos os dias desde que fiz minha Aliança.',
  },
  {
    name: 'João Marcos Oliveira',
    city: 'Recife, PE',
    stars: 5,
    text: 'Como jovem, achava que fé era coisa de velho. A Aliança de Amor me mostrou que fé é fogo. Hoje coordeno um grupo de jovens e minha vida tem sentido.',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section id="depoimentos" className="section-padding bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson-800/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-flame-500 font-display font-bold text-sm uppercase tracking-widest">
            Histórias Reais de Transformação
          </span>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            Vidas <span className="flame-text">Transformadas</span>
          </h2>
        </motion.div>

        {/* Video testimonials */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {videoTestimonials.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setActiveVideo(activeVideo === i ? null : i)}
            >
              {/* Thumbnail */}
              <div
                className={`aspect-video ${video.thumbnail} flex items-center justify-center relative`}
              >
                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:bg-white/30 transition-colors"
                >
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900/90 to-transparent">
                  <p className="text-white font-display font-bold text-lg">{video.name}</p>
                  <p className="text-dark-300 text-sm">{video.role}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="p-5 bg-dark-800/80 border border-dark-700/50 border-t-0 rounded-b-2xl">
                <p className="text-dark-300 italic">&ldquo;{video.quote}&rdquo;</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Text testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {textTestimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-2xl bg-dark-800/50 border-l-4 border-crimson-800 hover:border-flame-600 transition-colors duration-300"
            >
              <StarRating count={t.stars} />
              <p className="mt-4 text-dark-300 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-flame-gradient flex items-center justify-center text-white font-bold text-sm">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm">{t.name}</p>
                  <p className="text-dark-500 text-xs">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
