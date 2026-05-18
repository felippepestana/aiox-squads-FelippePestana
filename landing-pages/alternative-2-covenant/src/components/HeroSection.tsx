import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center bg-white overflow-hidden pt-16"
      aria-labelledby="hero-heading"
    >
      <div className="container-max w-full px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-covenant-blue/10 text-covenant-blue text-xs font-semibold mb-6">
              <Heart size={14} />
              <span>Movimento de Schoenstatt</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-covenant-blue-dark leading-[1.1] tracking-tight text-balance"
            >
              Uma Alianca de Amor que{' '}
              <span className="text-covenant-blue">Muda Tudo</span>
            </h1>

            <p className="mt-6 text-lg text-covenant-gray-600 leading-relaxed max-w-lg">
              Ha mais de 110 anos, milhares de pessoas encontraram proposito,
              comunidade e transformacao por meio de uma alianca de amor.
              Descubra como essa experiencia pode mudar a sua vida tambem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => scrollTo('#contato')}
                className="btn-primary text-base px-8 py-4 gap-2"
              >
                Comece Sua Jornada
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo('#sobre')}
                className="btn-ghost text-base px-8 py-4"
              >
                Conhecer Mais
              </button>
            </div>

            <div className="flex items-center gap-4 mt-10 text-sm text-covenant-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-covenant-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-covenant-gray-600"
                    aria-hidden="true"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>
                Junte-se a <strong className="text-covenant-gray-800">milhares</strong> de
                familias
              </span>
            </div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-covenant-blue/5 to-covenant-blue/10" />

              {/* Geometric pattern representing unity/covenant */}
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="w-full h-full"
              >
                {/* Outer ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  opacity="0.15"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  opacity="0.1"
                />

                {/* Interlocking covenant rings */}
                <circle
                  cx="170"
                  cy="190"
                  r="60"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  opacity="0.6"
                />
                <circle
                  cx="230"
                  cy="190"
                  r="60"
                  stroke="#1E3A5F"
                  strokeWidth="2.5"
                  opacity="0.6"
                />

                {/* Heart in the intersection */}
                <path
                  d="M200 170c-4-8-14-12-20-8s-8 14 0 22l20 18 20-18c8-8 6-18 0-22s-16 0-20 8z"
                  fill="#E8985E"
                  opacity="0.7"
                />

                {/* Radiating lines */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                  (angle) => (
                    <line
                      key={angle}
                      x1="200"
                      y1="200"
                      x2={200 + 170 * Math.cos((angle * Math.PI) / 180)}
                      y2={200 + 170 * Math.sin((angle * Math.PI) / 180)}
                      stroke="#3B82F6"
                      strokeWidth="0.5"
                      opacity="0.08"
                    />
                  )
                )}

                {/* Small dots around */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <circle
                    key={angle}
                    cx={200 + 140 * Math.cos((angle * Math.PI) / 180)}
                    cy={200 + 140 * Math.sin((angle * Math.PI) / 180)}
                    r="3"
                    fill="#3B82F6"
                    opacity="0.2"
                  />
                ))}

                {/* Cross at top */}
                <line
                  x1="200"
                  y1="30"
                  x2="200"
                  y2="60"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                  opacity="0.3"
                />
                <line
                  x1="185"
                  y1="42"
                  x2="215"
                  y2="42"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                  opacity="0.3"
                />

                {/* Text arc placeholder */}
                <text
                  x="200"
                  y="350"
                  textAnchor="middle"
                  fill="#3B82F6"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                  opacity="0.3"
                  letterSpacing="4"
                >
                  ALIANCA DE AMOR
                </text>
              </svg>

              {/* Floating accent elements */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-12 right-12 w-16 h-16 rounded-2xl bg-covenant-warm/10 flex items-center justify-center"
              >
                <Heart className="text-covenant-warm" size={24} />
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-20 left-8 w-14 h-14 rounded-xl bg-covenant-blue/10 flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full border-2 border-covenant-blue" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
