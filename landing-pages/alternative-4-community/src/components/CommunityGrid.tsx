import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface CommunityMember {
  name: string;
  role: string;
  shortQuote: string;
  fullTestimonial: string;
  initials: string;
  bgColor: string;
}

const members: CommunityMember[] = [
  {
    name: 'Maria Clara Silva',
    role: 'Juventude Feminina',
    shortQuote: 'Encontrei meu proposito aos 17 anos.',
    fullTestimonial: 'Na Alianca de Amor descobri que a fe nao precisa ser algo distante. Aqui encontrei amigas que caminham comigo, que rezam comigo e que me ajudam a ser uma pessoa melhor a cada dia.',
    initials: 'MC',
    bgColor: 'bg-pink-100',
  },
  {
    name: 'Joao Pedro Oliveira',
    role: 'Pai de Familia',
    shortQuote: 'Minha familia se transformou.',
    fullTestimonial: 'Quando minha esposa me convidou para conhecer o Movimento, eu tinha muitas resistencias. Hoje, depois de 8 anos, posso dizer que a Alianca de Amor salvou nosso casamento e nos ensinou a educar nossos filhos na fe.',
    initials: 'JP',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Irma Teresa de Maria',
    role: 'Vida Consagrada',
    shortQuote: 'Maria me chamou para servir.',
    fullTestimonial: 'Desde jovem senti o chamado da Mae de Deus. No Santuario de Schoenstatt, encontrei o lugar onde minha vocacao floresceu. A Alianca de Amor e a razao do meu sim diario.',
    initials: 'TM',
    bgColor: 'bg-amber-100',
  },
  {
    name: 'Roberto e Ana Santos',
    role: 'Casal',
    shortQuote: '25 anos de alianca juntos.',
    fullTestimonial: 'Renovamos nossa alianca de amor todos os 18 de cada mes. Essa fidelidade a Maria nos sustentou em tempos de crise, de doenca e de alegria. Nossos filhos cresceram vendo o poder da fe vivida em comunidade.',
    initials: 'RA',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Padre Lucas Mendes',
    role: 'Sacerdote Diocesano',
    shortQuote: 'Schoenstatt formou meu sacerdocio.',
    fullTestimonial: 'A espiritualidade da Alianca de Amor deu profundidade ao meu ministerio. Aprendi com Pe. Kentenich que a educacao pelo amor e a chave para tocar coracoes. Cada dia renovo minha entrega no Santuario.',
    initials: 'LM',
    bgColor: 'bg-emerald-100',
  },
  {
    name: 'Fernanda Costa',
    role: 'Profissional Liberal',
    shortQuote: 'Fe e trabalho caminham juntos.',
    fullTestimonial: 'Como advogada, muitas vezes me sentia sozinha nas decisoes eticas. No grupo de profissionais de Schoenstatt, encontrei apoio, reflexao e coragem para viver minha fe tambem no escritorio.',
    initials: 'FC',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Dona Lucia Ferreira',
    role: 'Peregrina de Mae',
    shortQuote: 'A Mae Peregrina mudou nossa rua.',
    fullTestimonial: 'Ha 15 anos carrego a imagem da Mae Tres Vezes Admiravel de casa em casa no meu bairro. Vi familias se reconciliarem, doentes encontrarem paz e jovens voltarem para a Igreja. Essa e a graca da Alianca.',
    initials: 'LF',
    bgColor: 'bg-rose-100',
  },
  {
    name: 'Carlos Eduardo Lima',
    role: 'Juventude Masculina',
    shortQuote: 'Aqui aprendi a ser homem de verdade.',
    fullTestimonial: 'No grupo de juventude masculina, encontrei amigos que me desafiam a ser melhor. Aprendemos juntos sobre lideranca, servico e compromisso. A Alianca de Amor me deu uma bussola para a vida.',
    initials: 'CE',
    bgColor: 'bg-teal-100',
  },
];

export default function CommunityGrid() {
  return (
    <section id="comunidade" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Nossa Comunidade</h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            Pessoas de todas as idades e caminhos de vida, unidas pela mesma Alianca de Amor com Maria.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative"
            >
              <div className="community-card p-6 h-full flex flex-col items-center text-center overflow-hidden">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-full ${member.bgColor} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110`}>
                  <span className="font-heading font-bold text-xl text-community-green">
                    {member.initials}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-heading font-bold text-community-green text-lg mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-community-rose font-semibold uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-community-brown/70 font-body italic">
                  "{member.shortQuote}"
                </p>

                {/* Hover overlay with full testimonial */}
                <div className="absolute inset-0 bg-community-green/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <Quote className="w-6 h-6 text-white/60 mb-3" />
                  <p className="text-white/90 text-sm font-body leading-relaxed mb-4">
                    "{member.fullTestimonial}"
                  </p>
                  <span className="text-white font-heading font-bold text-sm">
                    — {member.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
