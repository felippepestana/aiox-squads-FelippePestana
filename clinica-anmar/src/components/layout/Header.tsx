import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '#transformacao', label: 'Visualizador' },
  { href: '#tratamentos', label: 'Tratamentos' },
  { href: '#medicos', label: 'Médicos' },
  { href: '#tecnologia', label: 'Tecnologia' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-anmar-navy/95 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-anmar-navy border border-anmar-gold/40 flex items-center justify-center group-hover:border-anmar-gold transition-colors duration-300">
              <span className="font-display text-xl font-light text-anmar-gold leading-none">A</span>
            </div>
            <div>
              <div className="font-display text-lg font-medium text-anmar-ivory leading-tight tracking-wide">
                Clínica <span className="gold-text">AnMar</span>
              </div>
              <div className="text-[10px] font-body text-white/40 tracking-[0.2em] uppercase leading-tight">
                Medicina Estética · Manaus
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-white/60 hover:text-anmar-gold transition-colors duration-300 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+559200000000"
              className="flex items-center gap-2 text-sm font-body text-white/50 hover:text-anmar-gold transition-colors duration-300"
            >
              <Phone size={14} />
              <span>(92) 98271-1200</span>
            </a>
            <a href="#contato" className="btn-primary text-xs py-3 px-6">
              Agendar Consulta
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white/60 hover:text-anmar-gold transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-anmar-navy/98 backdrop-blur-md border-t border-white/5 overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-body text-white/70 hover:text-anmar-gold transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a href="#contato" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-4">
                Agendar Consulta
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
