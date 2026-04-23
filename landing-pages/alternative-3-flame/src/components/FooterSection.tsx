import { motion } from 'framer-motion';

const footerLinks = {
  movimento: [
    { label: 'Sobre Schoenstatt', href: '#solucao' },
    { label: 'Aliança de Amor', href: '#beneficios' },
    { label: 'Pe. José Kentenich', href: '#' },
    { label: 'Santuários', href: '#' },
  ],
  participar: [
    { label: 'Próximos Eventos', href: '#eventos' },
    { label: 'Grupos de Oração', href: '#' },
    { label: 'Jovens', href: '#' },
    { label: 'Famílias', href: '#' },
  ],
  contato: [
    { label: 'Fale Conosco', href: '#formulario' },
    { label: 'WhatsApp', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
};

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function FooterSection() {
  return (
    <footer className="bg-dark-950 relative">
      {/* Flame accent top */}
      <div className="h-1 bg-flame-gradient-horizontal" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔥</span>
              <span className="font-display font-extrabold text-xl">
                <span className="flame-text">Aliança</span>{' '}
                <span className="text-white">de Amor</span>
              </span>
            </div>
            <p className="text-dark-500 text-sm leading-relaxed">
              Movimento de Schoenstatt. Transformando vidas pela Aliança de Amor com a Mãe Três
              Vezes Admirável desde 1914.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700/50 flex items-center justify-center text-dark-400 hover:text-flame-500 hover:border-flame-600/30 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-dark-400 mb-4">
              O Movimento
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.movimento.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-dark-500 hover:text-flame-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-dark-400 mb-4">
              Participar
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.participar.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-dark-500 hover:text-flame-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-dark-400 mb-4">
              Contato
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.contato.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-dark-500 hover:text-flame-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dark-600">
          <p>
            &copy; {new Date().getFullYear()} Aliança de Amor — Movimento de Schoenstatt. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-dark-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-dark-400 transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
