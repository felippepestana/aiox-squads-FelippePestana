import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { submitLead } from '../lib/supabase';

type FormStep = 1 | 2;

export default function LeadForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const [step, setStep] = useState<FormStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: 'retiro',
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Preencha seu nome e e-mail para continuar.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        city: form.city || undefined,
        interest: form.interest,
        source: 'flame-landing-page',
      });
      setSubmitted(true);
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="formulario" className="section-padding bg-dark-900 relative">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-10 rounded-2xl bg-dark-800/50 border border-dark-700/50"
          >
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="font-display font-black text-3xl flame-text mb-3">
              A Chama Foi Acesa!
            </h3>
            <p className="text-dark-300 text-lg">
              Bem-vindo(a) à Aliança de Amor, <strong className="text-white">{form.name}</strong>!
              Você receberá um e-mail com os próximos passos.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-crimson-800/10 border border-crimson-800/20">
              <p className="text-sm text-dark-400">
                Enquanto isso, conheça mais sobre o Movimento de Schoenstatt e a Mãe Três Vezes
                Admirável.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="section-padding bg-dark-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson-800/8 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl">
            COMECE SUA <span className="flame-text">TRANSFORMAÇÃO</span> AGORA
          </h2>
          <p className="mt-3 text-dark-400">
            Preencha seus dados e dê o primeiro passo rumo à Aliança de Amor.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-dark-800/60 border border-dark-700/50 overflow-hidden"
        >
          {/* Step indicator */}
          <div className="px-6 py-4 bg-dark-800/80 border-b border-dark-700/50 flex items-center justify-between">
            <span className="text-sm font-medium text-dark-400">
              Passo <span className="text-white font-bold">{step}</span> de 2
            </span>
            <div className="flex gap-2">
              <div
                className={`h-2 w-12 rounded-full transition-colors ${
                  step >= 1 ? 'bg-flame-gradient-horizontal' : 'bg-dark-600'
                }`}
              />
              <div
                className={`h-2 w-12 rounded-full transition-colors ${
                  step >= 2 ? 'bg-flame-gradient-horizontal' : 'bg-dark-600'
                }`}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-dark-300 mb-2">
                    Seu Nome Completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Ex: Maria da Silva"
                    required
                    className="w-full px-4 py-3.5 rounded-lg bg-dark-900/80 border border-dark-600 text-white placeholder:text-dark-500 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-dark-300 mb-2">
                    Seu Melhor E-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="maria@exemplo.com"
                    required
                    className="w-full px-4 py-3.5 rounded-lg bg-dark-900/80 border border-dark-600 text-white placeholder:text-dark-500 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
                  />
                </div>

                {error && (
                  <p className="text-crimson-400 text-sm font-medium">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="flame-btn !w-full !text-center"
                >
                  CONTINUAR &rarr;
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-dark-300 mb-2">
                    WhatsApp (opcional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3.5 rounded-lg bg-dark-900/80 border border-dark-600 text-white placeholder:text-dark-500 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-dark-300 mb-2">
                    Cidade (opcional)
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full px-4 py-3.5 rounded-lg bg-dark-900/80 border border-dark-600 text-white placeholder:text-dark-500 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-semibold text-dark-300 mb-2">
                    Interesse Principal
                  </label>
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={(e) => update('interest', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg bg-dark-900/80 border border-dark-600 text-white focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
                  >
                    <option value="retiro">Participar de um Retiro</option>
                    <option value="conhecer">Conhecer o Movimento</option>
                    <option value="alianca">Fazer a Aliança de Amor</option>
                    <option value="comunidade">Encontrar uma Comunidade</option>
                    <option value="jovens">Grupo de Jovens</option>
                    <option value="familias">Movimento de Famílias</option>
                  </select>
                </div>

                {error && (
                  <p className="text-crimson-400 text-sm font-medium">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-lg border border-dark-600 text-dark-300 hover:text-white hover:border-dark-400 transition-colors font-semibold"
                  >
                    &larr; Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flame-btn !flex-1 !text-center animate-pulse-flame disabled:opacity-50 disabled:animate-none"
                  >
                    {submitting ? 'Enviando...' : '🔥 ACENDER MINHA CHAMA'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Social proof below form */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="pt-5 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-dark-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Dados seguros e protegidos
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-flame-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                +5.000 pessoas já fizeram sua Aliança
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
