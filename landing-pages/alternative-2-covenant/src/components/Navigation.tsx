import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Pilares', href: '#pilares' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Perguntas', href: '#faq' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav
        className="container-max flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Navegacao principal"
      >
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-covenant-blue-dark font-bold text-lg"
          aria-label="Alianca de Amor — Pagina inicial"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <circle cx="16" cy="16" r="14" stroke="#3B82F6" strokeWidth="2" />
            <path
              d="M16 8C12.5 8 10 11 10 14c0 5 6 10 6 10s6-5 6-10c0-3-2.5-6-6-6z"
              fill="#3B82F6"
              opacity="0.2"
            />
            <path
              d="M16 8C12.5 8 10 11 10 14c0 5 6 10 6 10s6-5 6-10c0-3-2.5-6-6-6z"
              stroke="#3B82F6"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M13 14.5l2 2 4-4"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Alianca de Amor</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-covenant-gray-600 hover:text-covenant-blue transition-colors duration-200 font-medium"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection('#contato')}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Quero Participar
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-covenant-gray-600 hover:text-covenant-blue transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-covenant-gray-200 overflow-hidden"
          >
            <ul className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="block w-full text-left px-3 py-3 text-covenant-gray-600 hover:text-covenant-blue hover:bg-covenant-gray rounded-lg transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => scrollToSection('#contato')}
                  className="btn-primary w-full text-sm"
                >
                  Quero Participar
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
