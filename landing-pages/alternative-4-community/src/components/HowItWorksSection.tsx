import { motion } from 'framer-motion';
import { BookOpen, Users, Footprints, Heart } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Conheca',
    subtitle: 'Descubra a espiritualidade',
    description: 'Participe de um encontro aberto, visite um Santuario ou converse com alguem da comunidade. O primeiro passo e simplesmente conhecer — sem compromisso, sem pressao.',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    number: '02',
    title: 'Participe',
    subtitle: 'Junte-se a um grupo',
    description: 'Encontre um grupo que combina com voce: juventude, casais, familias, profissionais ou vida consagrada. Cada grupo tem encontros regulares, retiros e atividades proprias.',
    icon: Users,
    color: 'bg-green-50 text-green-600',
    borderColor: 'border-green-200',
  },
  {
    number: '03',
    title: 'Caminhe',
    subtitle: 'Aprofunde sua fe',
    description: 'Com o acompanhamento da comunidade, voce vai crescendo na fe, na oracao e no servico. A espiritualidade de Schoenstatt e um caminho — nao um destino. Cada passo conta.',
    icon: Footprints,
    color: 'bg-amber-50 text-amber-600',
    borderColor: 'border-amber-200',
  },
  {
    number: '04',
    title: 'Pertenca',
    subtitle: 'Faca sua Alianca de Amor',
    description: 'Quando sentir no coracao, faca sua Alianca de Amor com Maria. E um compromisso livre e pessoal de entrega mutua — ela cuida de voce, e voce se compromete a crescer na santidade.',
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
    borderColor: 'border-rose-200',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="section-heading">Como Funciona</h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            Nao importa onde voce esta na sua jornada de fe. Aqui, todo caminho e bem-vindo.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Dotted line connector (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 border-t-2 border-dashed border-community-green/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative z-10 w-16 h-16 rounded-full ${step.color} border-2 ${step.borderColor} flex items-center justify-center mb-6 shadow-sm`}
                >
                  <step.icon className="w-7 h-7" />
                </motion.div>

                {/* Step number */}
                <span className="text-xs font-heading font-bold text-community-brown/30 uppercase tracking-widest mb-2">
                  Passo {step.number}
                </span>

                {/* Title */}
                <h3 className="font-heading font-bold text-2xl text-community-green mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-community-rose font-semibold mb-4">
                  {step.subtitle}
                </p>

                {/* Description */}
                <p className="text-community-brown/70 font-body text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Mobile connector arrow */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-community-green/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a href="#contato" className="btn-community text-lg">
            Comece Sua Jornada
          </a>
        </motion.div>
      </div>
    </section>
  );
}
