import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { STATIONS } from '../hooks/useScrollProgress';

interface NavigationProps {
  scrollProgress: number;
  activeStation: number;
  scrollToStation: (index: number) => void;
}

export default function Navigation({
  scrollProgress,
  activeStation,
  scrollToStation,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsScrolled(scrollProgress > 0.02);
  }, [scrollProgress]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-parchment/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gold/30 w-full">
          <motion.div
            className="h-full bg-gold"
            style={{ width: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollToStation(0)}
              className="flex items-center gap-2 group"
              aria-label="Voltar ao início"
            >
              <span className="text-gold text-2xl">✝</span>
              <span
                className={`font-serif text-lg font-semibold transition-colors duration-300 ${
                  isScrolled ? 'text-charcoal' : 'text-parchment'
                }`}
              >
                Aliança de Amor
              </span>
            </button>

            {/* Active station name - desktop */}
            <AnimatePresence mode="wait">
              {isScrolled && (
                <motion.div
                  key={activeStation}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="hidden md:flex items-center gap-2"
                >
                  <span className="text-gold text-sm font-serif italic">
                    Estação {activeStation + 1}:
                  </span>
                  <span className="text-charcoal font-serif font-medium">
                    {STATIONS[activeStation].name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {STATIONS.map((station, i) => (
                <button
                  key={station.id}
                  onClick={() => scrollToStation(i)}
                  className={`text-sm font-sans transition-all duration-300 ${
                    activeStation === i
                      ? 'text-gold font-semibold'
                      : isScrolled
                        ? 'text-charcoal/60 hover:text-charcoal'
                        : 'text-parchment/70 hover:text-parchment'
                  }`}
                >
                  {station.name}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-charcoal' : 'text-parchment'
              }`}
              aria-label="Menu de navegação"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-parchment/98 backdrop-blur-lg pt-20"
          >
            <nav className="flex flex-col items-center gap-6 p-8">
              {STATIONS.map((station, i) => (
                <button
                  key={station.id}
                  onClick={() => {
                    scrollToStation(i);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-serif text-xl transition-all ${
                    activeStation === i
                      ? 'text-gold font-semibold'
                      : 'text-charcoal/60'
                  }`}
                >
                  <span className="text-gold/40 text-sm mr-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {station.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
