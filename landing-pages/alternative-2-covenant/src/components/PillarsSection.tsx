import { motion } from 'framer-motion';
import { Heart, Sun, Users, ArrowRight } from 'lucide-react';

const pillars = [
  {
    icon: <Heart size={28} />,
    title: 'Alianca com Maria',
    description:
      'Uma relacao pessoal e profunda com Maria, a Mae Tres Vezes Admiravel. Nao uma devocao distante, mas uma parceria real que transforma seu dia a dia.',
    link: '#contato',
  },
  {
    icon: <Sun size={28} />,
    title: 'Santificacao do Cotidiano',
    description:
      'Transforme cada momento comum em algo extraordinario. Descubra como encontrar sentido e proposito nas atividades mais simples da sua rotina.',
    link: '#contato',
  },
  {
    icon: <Users size={28} />,
    title: 'Comunidade Viva',
    description:
      'Faca parte de uma comunidade acolhedora presente em mais de 40 paises. Conexoes reais, apoio mutuo e crescimento em grupo.',
    link: '#contato',
  },
];

export default function PillarsSection() {
  return (
    <section
      id="pilares"
      className="section-padding bg-white"
      aria-labelledby="pillars-heading"
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-covenant-blue uppercase tracking-wider">
            Nossos Pilares
          </span>
          <h2
            id="pillars-heading"
            className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
          >
            Tres caminhos, uma transformacao
          </h2>
          <p className="mt-4 text-covenant-gray-600 text-lg">
            O Movimento de Schoenstatt se apoia em tres pilares que, juntos,
            criam uma experiencia unica de fe e comunidade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative bg-covenant-gray rounded-2xl p-8 hover:shadow-lg hover:shadow-covenant-blue/5 transition-all duration-300 border border-transparent hover:border-covenant-gray-200"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-covenant-blue to-covenant-blue-dark flex items-center justify-center text-white mb-6">
                {pillar.icon}
              </div>

              <h3 className="text-xl font-bold text-covenant-blue-dark mb-3">
                {pillar.title}
              </h3>

              <p className="text-covenant-gray-600 leading-relaxed mb-6">
                {pillar.description}
              </p>

              <a
                href={pillar.link}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-covenant-blue group-hover:gap-2.5 transition-all duration-200"
              >
                Saiba mais
                <ArrowRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
