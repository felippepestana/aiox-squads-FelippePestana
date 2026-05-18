import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Mail, Phone } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
];

export default function FooterSection() {
  return (
    <footer
      className="relative bg-purple-deep text-parchment overflow-hidden"
      role="contentinfo"
    >
      {/* Top ornamental border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Tagline */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold text-3xl">✝</span>
          <h2 className="font-serif text-2xl md:text-3xl text-parchment/80 font-light mt-4 mb-2">
            O caminho continua...
          </h2>
          <p className="font-sans text-parchment/40 text-sm max-w-md mx-auto">
            Cada dia é um novo passo na peregrinação. Cada oração, um marco no caminho.
            Caminhe conosco.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-3 gap-10 md:gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-serif text-gold text-lg font-medium mb-4">
              Aliança de Amor
            </h3>
            <p className="font-sans text-parchment/50 text-sm leading-relaxed">
              Movimento de Schoenstatt — fundado em 18 de outubro de 1914.
              Uma aliança de amor com Maria que transforma vidas há mais de um século.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-gold text-lg font-medium mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contato@aliancadeamor.org.br"
                  className="flex items-center gap-2 font-sans text-parchment/50 text-sm hover:text-gold transition-colors"
                >
                  <Mail size={14} strokeWidth={1.5} />
                  contato@aliancadeamor.org.br
                </a>
              </li>
              <li>
                <a
                  href="tel:+5511999999999"
                  className="flex items-center gap-2 font-sans text-parchment/50 text-sm hover:text-gold transition-colors"
                >
                  <Phone size={14} strokeWidth={1.5} />
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-serif text-gold text-lg font-medium mb-4">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-parchment/50 hover:text-gold hover:border-gold/50 transition-all duration-300"
                >
                  <link.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="font-sans text-parchment/30 text-xs mt-4">
              Siga-nos e faça parte desta peregrinação digital.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-parchment/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-parchment/30 text-xs">
            &copy; {new Date().getFullYear()} Movimento de Schoenstatt — Aliança de Amor.
            Todos os direitos reservados.
          </p>
          <p className="font-serif text-parchment/20 text-xs italic">
            &ldquo;Nada sem vocês, nada sem nós.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
