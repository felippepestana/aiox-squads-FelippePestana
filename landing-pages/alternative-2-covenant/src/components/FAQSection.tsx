import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'O que e a Alianca de Amor?',
    answer:
      'A Alianca de Amor e o coracao do Movimento de Schoenstatt. E um compromisso pessoal e livre de caminhar junto com Maria, buscando transformar a vida cotidiana em algo com mais sentido e proposito. Nao e uma obrigacao, mas um convite para uma relacao de confianca e crescimento.',
  },
  {
    question: 'Preciso ser catolico para participar?',
    answer:
      'Embora o Movimento de Schoenstatt tenha raizes na tradicao catolica, nossas atividades sao abertas a todas as pessoas de boa vontade. Voce e bem-vindo independentemente de sua religiao ou espiritualidade. Valorizamos o dialogo e o respeito mutuo.',
  },
  {
    question: 'Como posso participar?',
    answer:
      'O primeiro passo e simples: preencha o formulario nesta pagina ou entre em contato conosco. Um membro da comunidade mais proxima entrara em contato para convidar voce para um encontro inicial, sem nenhum compromisso. Voce pode participar de grupos, retiros ou eventos especiais.',
  },
  {
    question: 'Quanto custa?',
    answer:
      'A participacao no movimento e gratuita. Alguns eventos especificos, como retiros com hospedagem, podem ter custos para cobrir alimentacao e infraestrutura, mas sempre buscamos tornar tudo acessivel. Ninguem deixa de participar por questoes financeiras.',
  },
  {
    question: 'Onde encontro um grupo perto de mim?',
    answer:
      'O Movimento de Schoenstatt esta presente em todas as regioes do Brasil e em mais de 40 paises. Ao preencher o formulario de contato, indicaremos o grupo mais proximo de voce. Tambem temos atividades online para quem nao tem um grupo na cidade.',
  },
  {
    question: 'Quais atividades estao disponiveis?',
    answer:
      'Oferecemos uma variedade de atividades: grupos semanais de reflexao, retiros de fim de semana, encontros de casais, grupos de jovens, formacao para familias e celebracoes especiais. Cada pessoa encontra o formato que melhor se encaixa na sua rotina.',
  },
];

function FAQItemComponent({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="border-b border-covenant-gray-200 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-covenant-blue-dark pr-4 group-hover:text-covenant-blue transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-covenant-gray-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-covenant-gray-600 text-sm leading-relaxed pr-8">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="section-padding bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-sm font-semibold text-covenant-blue uppercase tracking-wider">
            Duvidas
          </span>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
          >
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-covenant-gray-600 text-lg">
            Tudo o que voce precisa saber para dar o primeiro passo.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto bg-covenant-gray rounded-2xl px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FAQItemComponent key={faq.question} item={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
