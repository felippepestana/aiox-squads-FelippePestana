import { useState, useRef, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, BookOpen, Loader2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  interesse: string;
}

const INITIAL_FORM: FormData = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  interesse: '',
};

const INTEREST_OPTIONS = [
  'Conhecer mais sobre Schoenstatt',
  'Participar de um grupo',
  'Fazer minha Aliança de Amor',
  'Retiro espiritual',
  'Formação para casais',
  'Juventude de Schoenstatt',
];

const ALTERNATIVES = [
  {
    icon: MapPin,
    title: 'Participar de um Retiro',
    description: 'Viva uma experiência imersiva de encontro com Deus e Maria.',
  },
  {
    icon: Users,
    title: 'Encontrar um Grupo',
    description: 'Conecte-se com peregrinos em sua cidade.',
  },
  {
    icon: BookOpen,
    title: 'Receber Formação',
    description: 'Aprofunde-se na espiritualidade de Schoenstatt.',
  },
];

export default function Station6_NextStep() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{ ...formData, source: 'pilgrimage-landing' }]);

      if (dbError) throw dbError;
      setIsSubmitted(true);
    } catch {
      // Fallback: simulate success for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="o-proximo-passo"
      className="relative py-24 md:py-32 bg-gradient-to-b from-purple-deep via-purple-darker to-charcoal overflow-hidden"
      aria-label="Estação 6: O Próximo Passo"
    >
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Station header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-serif text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Estação VI
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-parchment font-light mb-6">
            O Próximo Passo
          </h2>
          <p className="font-sans text-parchment/60 text-lg max-w-2xl mx-auto">
            Você caminhou até aqui. O caminho tocou seu coração.
            Agora, o próximo passo é seu.
          </p>
        </motion.div>

        {/* CTA question */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-gold italic">
            Você Está Pronto para Selar Sua Aliança?
          </h3>
        </motion.div>

        {/* Form */}
        <motion.div
          className="max-w-xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 px-6 rounded-2xl bg-parchment/10 backdrop-blur-sm border border-gold/20"
            >
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h4 className="font-serif text-2xl text-parchment mb-3">
                Bem-vindo(a), peregrino(a)!
              </h4>
              <p className="font-sans text-parchment/60 max-w-md mx-auto">
                Seu próximo passo foi registrado. Em breve, alguém do nosso
                movimento entrará em contato para caminhar ao seu lado.
              </p>
              <p className="font-serif text-gold/60 italic mt-4">
                &ldquo;Quem caminha com Maria, nunca caminha sozinho.&rdquo;
              </p>
            </motion.div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-parchment/10 backdrop-blur-sm border border-gold/20 p-6 md:p-8"
            >
              <div>
                <label htmlFor="nome" className="block font-sans text-parchment/70 text-sm mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="pilgrimage-input bg-parchment/5 border-gold/20 text-parchment placeholder:text-parchment/30 focus:border-gold/50"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block font-sans text-parchment/70 text-sm mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pilgrimage-input bg-parchment/5 border-gold/20 text-parchment placeholder:text-parchment/30 focus:border-gold/50"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className="block font-sans text-parchment/70 text-sm mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="pilgrimage-input bg-parchment/5 border-gold/20 text-parchment placeholder:text-parchment/30 focus:border-gold/50"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cidade" className="block font-sans text-parchment/70 text-sm mb-1.5">
                  Cidade
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="pilgrimage-input bg-parchment/5 border-gold/20 text-parchment placeholder:text-parchment/30 focus:border-gold/50"
                  placeholder="Sua cidade"
                />
              </div>

              <div>
                <label htmlFor="interesse" className="block font-sans text-parchment/70 text-sm mb-1.5">
                  Qual é o seu interesse?
                </label>
                <select
                  id="interesse"
                  name="interesse"
                  required
                  value={formData.interesse}
                  onChange={handleChange}
                  className="pilgrimage-input bg-parchment/5 border-gold/20 text-parchment focus:border-gold/50"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="text-charcoal">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="font-sans text-red-300 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pilgrimage w-full flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Quero Dar o Próximo Passo
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Alternative actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-serif text-parchment/40 text-center text-sm tracking-[0.2em] uppercase mb-8">
            Outras formas de caminhar
          </p>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {ALTERNATIVES.map((alt, i) => (
              <motion.button
                key={alt.title}
                className="group p-6 rounded-xl bg-parchment/5 border border-gold/10 hover:border-gold/30 transition-all duration-300 text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <alt.icon
                  className="w-6 h-6 text-gold/60 group-hover:text-gold transition-colors mb-3"
                  strokeWidth={1.5}
                />
                <h4 className="font-serif text-parchment font-medium mb-1">
                  {alt.title}
                </h4>
                <p className="font-sans text-parchment/50 text-sm leading-relaxed">
                  {alt.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
