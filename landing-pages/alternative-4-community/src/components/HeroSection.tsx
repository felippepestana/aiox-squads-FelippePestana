import { motion } from 'framer-motion';
import { ArrowDown, Users, Heart, MapPin } from 'lucide-react';

const floatingPhotos = [
  { size: 'w-20 h-20 md:w-28 md:h-28', top: '10%', left: '5%', delay: 0, initials: 'MA', bg: 'bg-community-green/20' },
  { size: 'w-16 h-16 md:w-24 md:h-24', top: '20%', right: '8%', delay: 0.2, initials: 'JC', bg: 'bg-community-rose/20' },
  { size: 'w-14 h-14 md:w-20 md:h-20', top: '55%', left: '3%', delay: 0.4, initials: 'FS', bg: 'bg-amber-200/40' },
  { size: 'w-18 h-18 md:w-24 md:h-24', top: '60%', right: '5%', delay: 0.6, initials: 'LP', bg: 'bg-community-green/15' },
  { size: 'w-12 h-12 md:w-16 md:h-16', top: '35%', left: '10%', delay: 0.8, initials: 'RC', bg: 'bg-community-rose/15' },
  { size: 'w-14 h-14 md:w-20 md:h-20', top: '40%', right: '12%', delay: 1, initials: 'TM', bg: 'bg-amber-100/50' },
];

const stats = [
  { icon: Users, value: '50.000+', label: 'Membros ativos' },
  { icon: MapPin, value: '120+', label: 'Cidades no Brasil' },
  { icon: Heart, value: '110', label: 'Anos de historia' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-community-beige via-community-cream to-community-beige">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #166534 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Floating community photos */}
      {floatingPhotos.map((photo, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: photo.delay + 0.5, duration: 0.6, ease: 'easeOut' }}
          className={`absolute ${photo.size} hidden md:flex`}
          style={{ top: photo.top, left: photo.left, right: photo.right }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            className={`${photo.size} rounded-full ${photo.bg} border-4 border-white shadow-lg flex items-center justify-center`}
          >
            <span className="font-heading font-bold text-community-green text-sm md:text-lg">
              {photo.initials}
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-community-green/10 text-community-green px-5 py-2 rounded-full mb-8"
        >
          <Heart className="w-4 h-4 fill-community-green" />
          <span className="text-sm font-heading font-semibold">Movimento de Schoenstatt</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-community-green leading-tight mb-6"
        >
          Encontre Sua{' '}
          <span className="relative">
            <span className="relative z-10">Familia na Fe</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
              className="absolute bottom-1 left-0 h-3 md:h-4 bg-community-rose/20 rounded-sm -z-0"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-community-brown/70 max-w-3xl mx-auto mb-10 font-body leading-relaxed"
        >
          Milhares de pessoas ja encontraram amor, proposito e comunidade na{' '}
          <strong className="text-community-green">Alianca de Amor</strong>.
          Venha fazer parte dessa familia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href="#contato" className="btn-community text-lg px-10 py-4">
            Junte-se a Nos
          </a>
          <a href="#historias" className="btn-community-outline text-lg px-10 py-4">
            Conheca Nossas Historias
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className="flex flex-col items-center"
            >
              <stat.icon className="w-6 h-6 text-community-green mb-2" />
              <span className="font-heading font-black text-2xl md:text-3xl text-community-green">
                {stat.value}
              </span>
              <span className="text-sm text-community-brown/60 font-body">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-community-brown/40"
        >
          <span className="text-xs font-heading">Conheca mais</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
