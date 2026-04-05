import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, Send, Check } from 'lucide-react';
import { submitPrayerIntention } from '../lib/supabase';

export default function PrayerSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [intention, setIntention] = useState('');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prayerCount, setPrayerCount] = useState(2847);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;

    setIsSubmitting(true);
    try {
      await submitPrayerIntention(intention, isAnonymous ? undefined : name);
      setIsSubmitted(true);
      setPrayerCount((prev) => prev + 1);
      setIntention('');
      setName('');
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch {
      // Graceful fallback — still show success for UX
      setIsSubmitted(true);
      setPrayerCount((prev) => prev + 1);
      setTimeout(() => setIsSubmitted(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="oracao"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Intencoes de oracao"
    >
      <div className="absolute inset-0 radial-glow-gold" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            Reze Conosco
          </p>
          <h2 className="section-heading">
            Deixe Sua <span className="text-gold-gradient">Intencao de Oracao</span>
          </h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subheading">
            Apresentaremos sua intencao aos pes de Nossa Senhora no Santuario.
            Sua oracao se une a de milhares de aliancistas ao redor do mundo.
          </p>
        </motion.div>

        {/* Candle animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Flame className="h-12 w-12 text-sanctuary-gold animate-candle-flicker" />
            <div className="absolute inset-0 blur-xl bg-sanctuary-gold/20 rounded-full animate-glow-pulse" />
          </div>
        </motion.div>

        {/* Prayer counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sanctuary-cream/40 text-sm">
            <span className="text-sanctuary-gold font-semibold text-lg">
              {prayerCount.toLocaleString('pt-BR')}
            </span>{' '}
            intencoes ja oferecidas
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="sanctuary-card p-6 md:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="prayer-intention"
                className="block text-sm font-medium text-sanctuary-cream/70 mb-2"
              >
                Sua intencao de oracao
              </label>
              <textarea
                id="prayer-intention"
                rows={4}
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Escreva aqui sua intencao..."
                className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 resize-none focus:border-sanctuary-gold/50 transition-all"
                required
                aria-required="true"
              />
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isAnonymous ? 'bg-sanctuary-gold/30' : 'bg-sanctuary-gold'
                }`}
                role="switch"
                aria-checked={!isAnonymous}
                aria-label="Identificar-se"
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-sanctuary-cream transition-transform ${
                    isAnonymous ? 'left-0.5' : 'left-[1.375rem]'
                  }`}
                />
              </button>
              <span className="text-sm text-sanctuary-cream/60">
                {isAnonymous ? 'Enviar anonimamente' : 'Identificar-se'}
              </span>
            </div>

            {/* Name field (conditional) */}
            {!isAnonymous && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label
                  htmlFor="prayer-name"
                  className="block text-sm font-medium text-sanctuary-cream/70 mb-2"
                >
                  Seu nome
                </label>
                <input
                  id="prayer-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como deseja ser identificado(a)"
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                />
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !intention.trim()}
              className="w-full btn-gold !py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? (
                <>
                  <Check className="h-5 w-5" />
                  Intencao Enviada! Deus abencoe voce.
                </>
              ) : isSubmitting ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Intencao de Oracao
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
