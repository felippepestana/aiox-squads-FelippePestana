import { motion } from 'framer-motion';
import { Quote, Heart } from 'lucide-react';

interface Story {
  name: string;
  age: number;
  location: string;
  role: string;
  initials: string;
  pullQuote: string;
  paragraphs: string[];
  bgColor: string;
}

const stories: Story[] = [
  {
    name: 'Mariana e Rafael Souza',
    age: 42,
    location: 'Curitiba, PR',
    role: 'Casados ha 18 anos',
    initials: 'MR',
    pullQuote: 'A Alianca de Amor nos ensinou que o casamento e um santuario vivo.',
    bgColor: 'bg-rose-100',
    paragraphs: [
      'Quando chegamos ao Movimento de Schoenstatt em 2010, nosso casamento estava por um fio. Tinhamos dois filhos pequenos, dividas, e ja nao conseguiamos conversar sem brigar. Uma amiga nos convidou para um retiro de casais e, mesmo sem acreditar muito, fomos.',
      'Naquele final de semana, diante do Santuario, fizemos nossa primeira Alianca de Amor juntos. Nao foi magico — os problemas nao sumiram da noite para o dia. Mas algo mudou profundamente: aprendemos a olhar um para o outro com os olhos de Maria. A comunidade nos acolheu, nos deu ferramentas, e sobretudo nos deu esperanca.',
      'Hoje, 14 anos depois, coordenamos o grupo de casais da nossa cidade. Ja acompanhamos mais de 30 casais em crise. Nosso lema e o que Pe. Kentenich ensinou: "Nada sem voce, nada sem nos." Cada dia 18, renovamos nossa alianca e agradecemos por essa familia que nos salvou.',
    ],
  },
  {
    name: 'Gabriel Henrique Alves',
    age: 23,
    location: 'Belo Horizonte, MG',
    role: 'Universitario',
    initials: 'GA',
    pullQuote: 'Eu achava que fe era coisa de gente velha. Schoenstatt me mostrou que e coisa de gente corajosa.',
    bgColor: 'bg-blue-100',
    paragraphs: [
      'Entrei para a Juventude Masculina de Schoenstatt com 16 anos, quase "arrastado" pelo meu irmao mais velho. Na epoca, eu nao via sentido na Igreja e achava que religiao era so para os domingos. Os encontros da juventude mudaram completamente minha visao.',
      'No grupo, encontrei amigos que me desafiavam a ser melhor — nao de forma moralista, mas pelo exemplo. Juntos, estudavamos, faziamos servico social, e reavamos. Quando entrei na faculdade de Engenharia, o grupo foi minha ancora. Enquanto muitos colegas se perdiam, eu tinha uma comunidade que me sustentava.',
      'Hoje faco parte da equipe de formacao e coordeno acampamentos para adolescentes. Ver um jovem de 14 anos descobrir que e amado por Deus e pela Mae — isso nao tem preco. A Alianca de Amor me deu identidade, proposito e irmaos para a vida toda.',
    ],
  },
  {
    name: 'Dona Helena Ribeiro',
    age: 78,
    location: 'Santa Maria, RS',
    role: 'Peregrina ha 30 anos',
    initials: 'HR',
    pullQuote: 'A cada porta que se abre para a Mae Peregrina, um milagre acontece em silencio.',
    bgColor: 'bg-amber-100',
    paragraphs: [
      'Comecei a levar a imagem da Mae Tres Vezes Admiravel de casa em casa em 1994, quando meu marido faleceu e eu precisava de algo para preencher o vazio. Uma vizinha me apresentou a Campanha da Mae Peregrina e, sem saber, me apresentou a razao de viver dos meus proximos 30 anos.',
      'Ja perdi a conta de quantas familias visitei. Mas nunca vou esquecer a dona Aparecida, que nao falava com a filha ha 5 anos e, na semana em que a Mae ficou na casa dela, a filha ligou. Ou o seu Joaquim, que era alcoolatra e, depois de um mes rezando o terco com a imagem, procurou ajuda. Esses nao sao "casos" — sao pessoas que eu amo e que Maria tocou.',
      'Meus filhos dizem que eu devia descansar, mas como posso descansar quando sei que tem uma familia na proxima rua precisando da visita da Mae? Enquanto minhas pernas aguentarem, eu vou caminhar. Essa e minha alianca.',
    ],
  },
];

export default function StoriesSection() {
  return (
    <section id="historias" className="py-20 md:py-28 bg-community-beige">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="section-heading">
            Historias Reais, Vidas Transformadas
          </h2>
          <div className="warm-divider mb-6" />
          <p className="section-subheading">
            Cada pessoa carrega uma historia unica de encontro com Maria. Estas sao algumas delas.
          </p>
        </motion.div>

        {/* Stories */}
        <div className="space-y-20 md:space-y-28">
          {stories.map((story, i) => (
            <motion.article
              key={story.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-start`}
            >
              {/* Photo + pull quote side */}
              <div className="w-full md:w-2/5 flex flex-col items-center md:sticky md:top-28">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${story.bgColor} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <span className="font-heading font-black text-3xl md:text-4xl text-community-green">
                    {story.initials}
                  </span>
                </motion.div>

                <h3 className="font-heading font-bold text-xl md:text-2xl text-community-green text-center mb-1">
                  {story.name}
                </h3>
                <p className="text-sm text-community-brown/60 text-center mb-1">
                  {story.age} anos — {story.location}
                </p>
                <p className="text-xs text-community-rose font-semibold uppercase tracking-wider text-center mb-6">
                  {story.role}
                </p>

                {/* Pull quote */}
                <div className="relative bg-community-green/5 rounded-2xl p-6 border-l-4 border-community-green">
                  <Quote className="w-5 h-5 text-community-green/40 mb-2" />
                  <p className="font-heading font-bold text-community-green text-base md:text-lg italic leading-snug">
                    "{story.pullQuote}"
                  </p>
                </div>
              </div>

              {/* Paragraphs */}
              <div className="w-full md:w-3/5">
                {story.paragraphs.map((paragraph, j) => (
                  <motion.p
                    key={j}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * (j + 1) }}
                    className="text-community-brown/80 font-body text-base md:text-lg leading-relaxed mb-6 last:mb-0"
                  >
                    {paragraph}
                  </motion.p>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 mt-6 text-community-rose"
                >
                  <Heart className="w-4 h-4 fill-community-rose" />
                  <span className="text-sm font-heading font-semibold">
                    Historia compartilhada com autorizacao
                  </span>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
