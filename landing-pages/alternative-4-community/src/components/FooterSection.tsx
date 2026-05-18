import { motion } from 'framer-motion';
import { Heart, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const sanctuaries = [
  { name: 'Santuario Tabor', city: 'Curitiba - PR' },
  { name: 'Santuario Mae de Deus', city: 'Sao Paulo - SP' },
  { name: 'Santuario Original Brasileiro', city: 'Santa Maria - RS' },
  { name: 'Santuario de Jacarepagua', city: 'Rio de Janeiro - RJ' },
];

const links = [
  { label: 'Sobre o Movimento', href: '#como-funciona' },
  { label: 'Comunidade', href: '#comunidade' },
  { label: 'Historias', href: '#historias' },
  { label: 'Grupos', href: '#grupos' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Contato', href: '#contato' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const communityStrip = [
  { initials: 'MC', bg: 'bg-pink-200/60' },
  { initials: 'JP', bg: 'bg-green-200/60' },
  { initials: 'TM', bg: 'bg-amber-200/60' },
  { initials: 'RA', bg: 'bg-blue-200/60' },
  { initials: 'LM', bg: 'bg-emerald-200/60' },
  { initials: 'FC', bg: 'bg-purple-200/60' },
  { initials: 'LF', bg: 'bg-rose-200/60' },
  { initials: 'CE', bg: 'bg-teal-200/60' },
  { initials: 'GA', bg: 'bg-indigo-200/60' },
  { initials: 'HR', bg: 'bg-orange-200/60' },
  { initials: 'MR', bg: 'bg-cyan-200/60' },
  { initials: 'AB', bg: 'bg-lime-200/60' },
];

export default function FooterSection() {
  return (
    <footer className="bg-community-green text-white">
      {/* Community photo strip */}
      <div className="overflow-hidden py-4 bg-community-green-dark/30">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-3 w-max"
        >
          {[...communityStrip, ...communityStrip].map((photo, i) => (
            <div
              key={i}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${photo.bg} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-xs font-heading font-bold text-community-green">
                {photo.initials}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg block leading-tight">
                  Alianca de Amor
                </span>
                <span className="text-xs text-white/60">Movimento de Schoenstatt</span>
              </div>
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed mb-6">
              Uma comunidade de fe viva, fundada por Pe. Jose Kentenich em 18 de outubro de 1914. Presente em mais de 120 paises, unidos pela Alianca de Amor com Maria.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Navegacao
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white font-body text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sanctuaries */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Santuarios
            </h4>
            <ul className="space-y-3">
              {sanctuaries.map((sanctuary) => (
                <li key={sanctuary.name} className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white/90 font-body text-sm block">
                      {sanctuary.name}
                    </span>
                    <span className="text-white/50 text-xs">
                      {sanctuary.city}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contato@aliancadeamor.org.br" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-white/40" />
                  contato@aliancadeamor.org.br
                </a>
              </li>
              <li>
                <a href="tel:+5541999999999" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-white/40" />
                  (41) 99999-9999
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-white/10">
              <p className="text-white/80 text-xs font-body leading-relaxed">
                "Nada sem voce, nada sem nos."
              </p>
              <p className="text-white/50 text-xs mt-1">
                — Pe. Jose Kentenich
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-body">
            &copy; {new Date().getFullYear()} Alianca de Amor — Movimento de Schoenstatt. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-white/40 text-xs">
            <span>Feito com</span>
            <Heart className="w-3 h-3 fill-community-rose text-community-rose" />
            <span>pela comunidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
