import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, ChevronRight } from 'lucide-react';

const locations = [
  { city: 'Sao Paulo', state: 'SP', sanctuaries: 5, groups: 42 },
  { city: 'Curitiba', state: 'PR', sanctuaries: 3, groups: 28 },
  { city: 'Santa Maria', state: 'RS', sanctuaries: 2, groups: 18 },
  { city: 'Belo Horizonte', state: 'MG', sanctuaries: 2, groups: 22 },
  { city: 'Rio de Janeiro', state: 'RJ', sanctuaries: 2, groups: 15 },
  { city: 'Brasilia', state: 'DF', sanctuaries: 1, groups: 12 },
  { city: 'Recife', state: 'PE', sanctuaries: 1, groups: 10 },
  { city: 'Florianopolis', state: 'SC', sanctuaries: 1, groups: 14 },
  { city: 'Porto Alegre', state: 'RS', sanctuaries: 1, groups: 16 },
  { city: 'Londrina', state: 'PR', sanctuaries: 1, groups: 9 },
  { city: 'Campinas', state: 'SP', sanctuaries: 1, groups: 11 },
  { city: 'Goiania', state: 'GO', sanctuaries: 1, groups: 8 },
];

const stats = [
  { value: '200+', label: 'Santuarios no mundo' },
  { value: '35+', label: 'Santuarios no Brasil' },
  { value: '500+', label: 'Grupos em atividade' },
  { value: '26', label: 'Estados com presenca' },
];

// Simple SVG Brazil map outline (simplified)
function BrazilMap() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simplified Brazil shape */}
      <path
        d="M180 40 C200 35, 240 38, 270 50 C300 62, 330 80, 345 110 C360 140, 365 170, 360 200 C355 230, 340 260, 320 280 C300 300, 280 320, 250 340 C220 360, 190 365, 160 350 C130 335, 100 310, 85 280 C70 250, 60 220, 65 190 C70 160, 80 130, 100 105 C120 80, 150 50, 180 40Z"
        fill="rgba(22, 101, 52, 0.08)"
        stroke="rgba(22, 101, 52, 0.3)"
        strokeWidth="2"
      />
      {/* Location dots */}
      {[
        { cx: 230, cy: 200, r: 6, label: 'SP' },
        { cx: 200, cy: 230, r: 5, label: 'PR' },
        { cx: 180, cy: 260, r: 4, label: 'RS' },
        { cx: 250, cy: 170, r: 4, label: 'MG' },
        { cx: 270, cy: 180, r: 4, label: 'RJ' },
        { cx: 215, cy: 155, r: 4, label: 'DF' },
        { cx: 310, cy: 120, r: 3, label: 'PE' },
        { cx: 210, cy: 240, r: 3, label: 'SC' },
        { cx: 195, cy: 145, r: 3, label: 'GO' },
        { cx: 280, cy: 100, r: 3, label: 'BA' },
        { cx: 300, cy: 90, r: 3, label: 'CE' },
        { cx: 160, cy: 120, r: 3, label: 'MT' },
      ].map((dot, i) => (
        <g key={i}>
          <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="#166534" opacity={0.6}>
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={dot.cx} cy={dot.cy} r={dot.r + 4} fill="none" stroke="#166534" strokeWidth="1" opacity={0.2}>
            <animate
              attributeName="r"
              values={`${dot.r + 2};${dot.r + 8};${dot.r + 2}`}
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

export default function MapSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Estamos Perto de Voce</h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            O Movimento de Schoenstatt esta presente em todo o Brasil. Encontre um grupo na sua cidade.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center bg-community-green/5 rounded-2xl p-6">
              <span className="font-heading font-black text-2xl md:text-3xl text-community-green">
                {stat.value}
              </span>
              <p className="text-sm text-community-brown/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <BrazilMap />
          </motion.div>

          {/* Search + List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-community-brown/40" />
              <input
                type="text"
                placeholder="Busque por cidade ou estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-community-green/20 bg-community-beige font-body text-community-brown placeholder:text-community-brown/40 focus:border-community-green focus:ring-2 focus:ring-community-green/10 transition-all"
              />
            </div>

            {/* Location list */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredLocations.length === 0 ? (
                <p className="text-community-brown/50 text-center py-8 font-body">
                  Nenhuma cidade encontrada. Mas estamos crescendo! Entre em contato para saber se ha um grupo proximo.
                </p>
              ) : (
                filteredLocations.map((loc) => (
                  <motion.a
                    key={`${loc.city}-${loc.state}`}
                    href="#contato"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-community-green/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-community-green/60 group-hover:text-community-green transition-colors" />
                      <div>
                        <span className="font-heading font-bold text-community-green">
                          {loc.city}
                        </span>
                        <span className="text-community-brown/50 ml-1 text-sm">
                          {loc.state}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-community-brown/50">
                      <span>{loc.sanctuaries} santuario{loc.sanctuaries > 1 ? 's' : ''}</span>
                      <span>{loc.groups} grupos</span>
                      <ChevronRight className="w-4 h-4 text-community-green/40 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
