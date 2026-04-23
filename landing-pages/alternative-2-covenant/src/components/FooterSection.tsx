import { Heart } from 'lucide-react';

const footerLinks = {
  about: {
    title: 'Sobre',
    links: [
      { label: 'O Movimento', href: '#sobre' },
      { label: 'Nossa Historia', href: '#sobre' },
      { label: 'Pilares', href: '#pilares' },
      { label: 'Depoimentos', href: '#depoimentos' },
    ],
  },
  links: {
    title: 'Links Uteis',
    links: [
      { label: 'Proximos Eventos', href: '#eventos' },
      { label: 'Perguntas Frequentes', href: '#faq' },
      { label: 'Quero Participar', href: '#contato' },
      { label: 'Encontre um Santuario', href: '#contato' },
    ],
  },
  contact: {
    title: 'Contato',
    links: [
      { label: 'contato@aliancadeamor.org', href: 'mailto:contato@aliancadeamor.org' },
      { label: '(11) 3333-4444', href: 'tel:+551133334444' },
      { label: 'Sao Paulo, SP — Brasil', href: '#' },
    ],
  },
  social: {
    title: 'Redes Sociais',
    links: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
      { label: 'WhatsApp', href: 'https://wa.me/' },
    ],
  },
};

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-covenant-blue-dark text-white/70" role="contentinfo">
      <div className="container-max px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Heart size={14} className="text-covenant-warm" />
            <span>
              {currentYear} Alianca de Amor — Movimento de Schoenstatt
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Politica de Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
