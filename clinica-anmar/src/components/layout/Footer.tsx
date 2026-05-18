import { MapPin, Phone, Instagram, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#050D1A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-anmar-navy border border-anmar-gold/40 flex items-center justify-center">
                <span className="font-display text-xl font-light text-anmar-gold">A</span>
              </div>
              <div>
                <div className="font-display text-lg font-medium text-anmar-ivory">Clínica AnMar</div>
                <div className="text-[10px] font-body text-white/40 tracking-[0.2em] uppercase">Medicina Estética · Manaus</div>
              </div>
            </div>
            <p className="text-sm font-body text-white/40 leading-relaxed max-w-xs">
              Transformação corporal com ciência, segurança e sofisticação. Emagrecimento, estética e cardiologia integrados.
            </p>
            <div className="flex gap-1">
              <div className="w-12 h-px bg-anmar-gold/60" />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="section-label">Localização</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm font-body text-white/50">
                <MapPin size={14} className="text-anmar-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p>Rua Rio Ica, 310 — Sala 103</p>
                  <p>Edifício Celebration Smart Office</p>
                  <p>Nossa Senhora das Graças</p>
                  <p>Manaus – AM · CEP 69053-100</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-body text-white/50">
                <Phone size={14} className="text-anmar-gold flex-shrink-0" />
                <a href="tel:+559298271-1200" className="hover:text-anmar-gold transition-colors">
                  (92) 98271-1200
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm font-body text-white/50">
                <Instagram size={14} className="text-anmar-gold flex-shrink-0" />
                <a
                  href="https://www.instagram.com/anmar.clinica/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-anmar-gold transition-colors"
                >
                  @anmar.clinica
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="section-label">Especialidades</h4>
            <ul className="space-y-2">
              {[
                'Emagrecimento & Metabolismo',
                'Harmonização Facial',
                'Estética Corporal',
                'Bioestimuladores de Colágeno',
                'Avaliação Cardiológica',
                'Criolipólise',
                'Toxina Botulínica',
              ].map((s) => (
                <li key={s}>
                  <a href="#tratamentos" className="text-sm font-body text-white/40 hover:text-anmar-gold/80 transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-white/25">
            © {new Date().getFullYear()} Clínica AnMar · CNPJ 33.144.608/0001-49 · Todos os direitos reservados
          </p>
          <p className="text-xs font-body text-white/25 flex items-center gap-1">
            Feito com <Heart size={10} className="text-anmar-gold/60" /> em Manaus, AM
          </p>
        </div>
      </div>
    </footer>
  )
}
