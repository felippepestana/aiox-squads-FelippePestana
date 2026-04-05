import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PrayerSection() {
  const [prayer, setPrayer] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prayerCount, setPrayerCount] = useState(2847); // seed count

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prayer.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('prayer_intentions')
        .insert([{ prayer, name: name || 'Peregrino(a) anônimo(a)', source: 'pilgrimage-landing' }]);

      if (error) throw error;
    } catch {
      // Fallback for demo
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPrayerCount((prev) => prev + 1);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section
      className="relative py-24 md:py-32 bg-parchment-dark/20 overflow-hidden"
      aria-label="Deixe Sua Oração no Caminho"
    >
      {/* Parchment paper lines effect */}
      <div className="absolute inset-0 parchment-paper opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <Flame className="w-7 h-7 text-gold mx-auto mb-4 opacity-60" strokeWidth={1} />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-light mb-4">
            Deixe Sua Oração no Caminho
          </h2>
          <p className="font-sans text-charcoal/60 text-lg max-w-lg mx-auto">
            Como os antigos peregrinos que deixavam pedras e orações nos caminhos sagrados,
            deixe aqui a sua intenção.
          </p>
        </motion.div>

        {/* Prayer count */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
            <Flame size={14} className="text-gold" />
            <span className="font-sans text-charcoal/60 text-sm">
              <strong className="text-gold font-semibold">{prayerCount.toLocaleString('pt-BR')}</strong>{' '}
              orações deixadas por peregrinos
            </span>
          </div>
        </motion.div>

        {/* Prayer form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 rounded-2xl bg-parchment border border-gold/20 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-gold" />
                </div>
                <h4 className="font-serif text-xl text-charcoal mb-2">
                  Sua oração foi acolhida
                </h4>
                <p className="font-sans text-charcoal/50 text-sm">
                  Maria guarda cada intenção em seu coração materno.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setPrayer('');
                    setName('');
                  }}
                  className="mt-4 font-sans text-gold text-sm hover:text-gold-dark transition-colors"
                >
                  Deixar outra oração
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="rounded-2xl bg-parchment border border-gold/20 shadow-sm p-6 md:p-8"
              >
                <div className="mb-4">
                  <label htmlFor="prayer-name" className="block font-sans text-charcoal/60 text-sm mb-1.5">
                    Seu nome <span className="text-charcoal/30">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="prayer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pilgrimage-input"
                    placeholder="Peregrino(a)"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="prayer-text" className="block font-sans text-charcoal/60 text-sm mb-1.5">
                    Sua intenção de oração
                  </label>
                  <textarea
                    id="prayer-text"
                    required
                    rows={4}
                    value={prayer}
                    onChange={(e) => setPrayer(e.target.value)}
                    className="pilgrimage-input resize-none font-serif italic"
                    placeholder="Escreva sua intenção aqui..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !prayer.trim()}
                  className="btn-pilgrimage w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Enviando...</span>
                  ) : (
                    <>
                      Deixar Minha Oração
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="mt-3 font-sans text-charcoal/30 text-xs text-center">
                  Todas as intenções são tratadas com respeito e confidencialidade.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
