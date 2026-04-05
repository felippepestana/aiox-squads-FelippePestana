import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="sobre"
      className="section-padding bg-covenant-gray"
      aria-labelledby="video-heading"
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-sm font-semibold text-covenant-blue uppercase tracking-wider">
            Nossa Historia
          </span>
          <h2
            id="video-heading"
            className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
          >
            Conheca Nossa Historia em 3 Minutos
          </h2>
          <p className="mt-4 text-covenant-gray-600 text-lg">
            Desde 1914, a Alianca de Amor tem transformado vidas ao redor do
            mundo. Assista e descubra como tudo comecou.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-covenant-blue/10 bg-covenant-blue-dark aspect-video"
        >
          {!playing ? (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group cursor-pointer"
              aria-label="Reproduzir video sobre a Alianca de Amor"
            >
              {/* Thumbnail placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-covenant-blue-dark via-covenant-blue-dark/90 to-covenant-blue/30" />

              {/* Decorative elements */}
              <svg
                className="absolute inset-0 w-full h-full opacity-5"
                viewBox="0 0 800 450"
                aria-hidden="true"
              >
                <circle cx="400" cy="225" r="200" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="400" cy="225" r="150" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="400" cy="225" r="100" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>

              <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <div className="w-16 h-16 rounded-full bg-covenant-blue flex items-center justify-center shadow-lg shadow-covenant-blue/40">
                  <Play size={28} className="text-white ml-1" fill="white" />
                </div>
              </div>

              <span className="relative z-10 text-white/70 text-sm font-medium">
                Clique para assistir
              </span>
            </button>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
              title="Video sobre a Alianca de Amor e o Movimento de Schoenstatt"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
