import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cross } from 'lucide-react';

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#historia', label: 'Historia' },
  { href: '#testemunhos', label: 'Testemunhos' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#oracao', label: 'Oracao' },
  { href: '#contato', label: 'Contato' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-sanctuary-navy/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-sanctuary-gold/10'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Navegacao principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            aria-label="Alianca de Amor - Inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Cross className="h-6 w-6 text-sanctuary-gold group-hover:animate-glow-pulse transition-all" />
            <span className="font-serif text-lg md:text-xl font-semibold text-sanctuary-cream">
              Alianca de <span className="text-gold-gradient">Amor</span>
            </span>
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-sanctuary-gold bg-sanctuary-gold/10'
                    : 'text-sanctuary-cream/70 hover:text-sanctuary-cream hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#jornada')}
              className="ml-3 btn-gold !px-5 !py-2 text-sm"
            >
              Faca Sua Alianca
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-sanctuary-cream p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-sanctuary-navy/98 backdrop-blur-lg border-t border-sanctuary-gold/10"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-sanctuary-gold bg-sanctuary-gold/10'
                      : 'text-sanctuary-cream/70 hover:text-sanctuary-cream hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('#jornada')}
                className="w-full btn-gold !py-3 mt-4 text-base"
              >
                Faca Sua Alianca
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
