import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cross, Instagram, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  {
    title: 'O Movimento',
    links: [
      { label: 'Sobre Schoenstatt', href: '#sobre' },
      { label: 'Nossa Historia', href: '#historia' },
      { label: 'Alianca de Amor', href: '#jornada' },
      { label: 'Testemunhos', href: '#testemunhos' },
    ],
  },
  {
    title: 'Participe',
    links: [
      { label: 'Eventos e Retiros', href: '#eventos' },
      { label: 'Intencoes de Oracao', href: '#oracao' },
      { label: 'Campanha da Mae Peregrina', href: '#' },
      { label: 'Grupos de Formacao', href: '#' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Oracoes de Schoenstatt', href: '#' },
      { label: 'Textos do Pe. Kentenich', href: '#' },
      { label: 'Liturgia do Dia', href: '#' },
      { label: 'Loja do Santuario', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export default function FooterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer
      id="contato"
      className="relative border-t border-sanctuary-gold/10 bg-sanctuary-navy"
      aria-label="Rodape"
      ref={ref}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
        >
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <Cross className="h-6 w-6 text-sanctuary-gold" />
              <span className="font-serif text-xl font-semibold text-sanctuary-cream">
                Alianca de <span className="text-gold-gradient">Amor</span>
              </span>
            </a>
            <p className="text-sanctuary-cream/40 text-sm leading-relaxed mb-6 max-w-sm">
              Movimento de Schoenstatt — Uma alianca de amor com a Mae Tres Vezes Admiravel,
              transformando vidas, familias e comunidades pela forca da graca desde 1914.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sanctuary-cream/40 text-sm">
                <MapPin className="h-4 w-4 text-sanctuary-gold/50 flex-shrink-0" />
                <span>Santuario de Schoenstatt, Atibaia - SP, Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-sanctuary-cream/40 text-sm">
                <Phone className="h-4 w-4 text-sanctuary-gold/50" />
                <span>(11) 4411-0000</span>
              </div>
              <div className="flex items-center gap-2 text-sanctuary-cream/40 text-sm">
                <Mail className="h-4 w-4 text-sanctuary-gold/50" />
                <span>contato@schoenstatt.org.br</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-sanctuary-gold/20 flex items-center justify-center text-sanctuary-gold/50 hover:bg-sanctuary-gold/10 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sanctuary-cream font-semibold text-sm tracking-wider uppercase mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sanctuary-cream/40 text-sm hover:text-sanctuary-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sanctuary-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sanctuary-cream/25 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Movimento de Schoenstatt &mdash; Alianca de Amor. Todos os direitos reservados.
          </p>
          <p className="text-sanctuary-cream/20 text-xs italic font-serif">
            &ldquo;Nada sem voce, nada sem nos.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
