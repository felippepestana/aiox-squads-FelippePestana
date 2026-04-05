import { motion } from 'framer-motion';
import { Home, Sparkles, Briefcase, Heart, Users2, Church } from 'lucide-react';

const groups = [
  {
    title: 'Familias',
    subtitle: 'Para familias que querem crescer juntas na fe',
    description: 'Encontros mensais, retiros em familia e apoio mutuo na educacao dos filhos. Um espaco onde pais e filhos aprendem a viver a Alianca no dia a dia do lar.',
    icon: Home,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderHover: 'hover:border-amber-300',
  },
  {
    title: 'Juventude',
    subtitle: 'Para jovens que buscam sentido e comunidade',
    description: 'Grupos semanais, acampamentos, peregrinacoes e projetos sociais. Um lugar onde jovens descobrem que a fe pode ser viva, alegre e transformadora.',
    icon: Sparkles,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderHover: 'hover:border-blue-300',
  },
  {
    title: 'Profissionais',
    subtitle: 'Para quem quer viver a fe no trabalho',
    description: 'Encontros de reflexao, mentoria e networking com proposito. Descubra como a espiritualidade de Schoenstatt ilumina suas decisoes profissionais.',
    icon: Briefcase,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderHover: 'hover:border-green-300',
  },
  {
    title: 'Maes',
    subtitle: 'Para maes que precisam de apoio e oracao',
    description: 'Liga de Maes que se encontram para rezar, partilhar desafios e celebrar a vocacao da maternidade. Maria, nossa Mae, caminha conosco.',
    icon: Heart,
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    borderHover: 'hover:border-rose-300',
  },
  {
    title: 'Casais',
    subtitle: 'Para casais que querem fortalecer seu amor',
    description: 'Retiros, encontros de formacao e acompanhamento espiritual para casais em todas as fases do matrimonio. Juntos, renovamos a alianca de amor.',
    icon: Users2,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderHover: 'hover:border-purple-300',
  },
  {
    title: 'Vida Consagrada',
    subtitle: 'Para quem sente o chamado a entrega total',
    description: 'Irmas de Maria, Padres e Irmaos de Schoenstatt: comunidades consagradas que vivem a radicalidade do Evangelho e da Alianca de Amor.',
    icon: Church,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderHover: 'hover:border-emerald-300',
  },
];

export default function GroupsSection() {
  return (
    <section id="grupos" className="py-20 md:py-28 bg-community-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Para Todos os Caminhos de Vida</h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            Nao importa sua idade, estado de vida ou momento espiritual. Ha um lugar para voce na nossa comunidade.
          </p>
        </motion.div>

        {/* Groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`community-card p-8 h-full ${group.borderHover} transition-all duration-300`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${group.bgColor} flex items-center justify-center mb-5`}>
                  <group.icon className={`w-7 h-7 ${group.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-xl text-community-green mb-1">
                  {group.title}
                </h3>
                <p className="text-sm text-community-rose font-semibold mb-3">
                  {group.subtitle}
                </p>
                <p className="text-community-brown/70 font-body text-sm leading-relaxed">
                  {group.description}
                </p>

                {/* CTA link */}
                <a
                  href="#contato"
                  className="inline-flex items-center gap-1 mt-4 text-community-green font-heading font-semibold text-sm hover:gap-2 transition-all duration-300"
                >
                  Quero saber mais
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
