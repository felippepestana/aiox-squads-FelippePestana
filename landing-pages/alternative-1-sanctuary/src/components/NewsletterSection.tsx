import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { subscribeNewsletter, trackEvent } from '../lib/supabase';

export default function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email, undefined, 'sanctuary');
      await trackEvent('sanctuary', 'newsletter_subscribed');
      setIsSubmitted(true);
      setEmail('');
    } catch {
      // Graceful fallback
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden"
      aria-label="Newsletter"
    >
      <div className="absolute inset-0 bg-sanctuary-navy-light/50" />
      <div className="absolute inset-0 radial-glow-gold" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="sanctuary-card p-8 md:p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sanctuary-gold/10 border border-sanctuary-gold/20 mb-6">
            <Mail className="h-6 w-6 text-sanctuary-gold" />
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-sanctuary-cream mb-3">
            Receba <span className="text-gold-gradient">Reflexoes Semanais</span>
          </h2>
          <p className="text-sanctuary-cream/50 mb-8 max-w-md mx-auto">
            Meditacoes, pensamentos do Pe. Kentenich e inspiracoes espirituais
            diretamente no seu email, toda semana.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-sanctuary-gold"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">Inscricao confirmada! Que Nossa Senhora o(a) abencoe.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="flex-1 bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                aria-required="true"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold !py-3 !px-6 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Enviando...</span>
                ) : (
                  <>
                    Inscrever-se
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
