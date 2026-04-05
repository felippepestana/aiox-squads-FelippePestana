import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';
import { subscribeNewsletter, trackEvent } from '../lib/supabase';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email, name || undefined, 'community');
      await trackEvent('community', 'newsletter_subscribed');
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-community-rose to-community-rose-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-heading font-semibold text-white">Toda semana na sua caixa</span>
          </div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Receba Historias que Inspiram
          </h2>
          <p className="text-white/80 font-body text-lg mb-8 max-w-xl mx-auto">
            Testemunhos reais, reflexoes e novidades da comunidade. Uma vez por semana, direto no seu e-mail.
          </p>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 inline-block"
          >
            <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-3" />
            <p className="font-heading font-bold text-xl text-white">
              Voce esta inscrito(a)!
            </p>
            <p className="text-white/80 font-body text-sm mt-1">
              Em breve voce recebera nossa primeira newsletter.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/95 text-community-brown font-body placeholder:text-community-brown/40 border-0 shadow-lg focus:ring-2 focus:ring-white/50"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white/95 text-community-brown font-body placeholder:text-community-brown/40 border-0 shadow-lg focus:ring-2 focus:ring-white/50"
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full bg-white text-community-rose font-heading font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-community-rose/30 border-t-community-rose rounded-full animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Inscrever
                </span>
              )}
            </motion.button>
          </motion.form>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-xs mt-4 font-body"
        >
          Sem spam. Voce pode cancelar a qualquer momento.
        </motion.p>
      </div>
    </section>
  );
}
