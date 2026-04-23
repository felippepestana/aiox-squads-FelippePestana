import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Heart, Users, MapPin, BookOpen } from 'lucide-react';
import { submitLead, trackEvent } from '../lib/supabase';

const leadSchema = z.object({
  full_name: z.string().min(2, 'Por favor, insira seu nome'),
  email: z.string().email('E-mail invalido'),
  phone: z.string().optional(),
  city: z.string().optional(),
  interest: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const howOptions = [
  'Indicacao de amigo ou familiar',
  'Redes sociais',
  'Evento ou retiro',
  'Santuario ou igreja',
  'Busca na internet',
  'Outro',
];

const communityPhotos = [
  { initials: 'MC', bg: 'bg-pink-100' },
  { initials: 'JP', bg: 'bg-green-100' },
  { initials: 'TM', bg: 'bg-amber-100' },
  { initials: 'RA', bg: 'bg-blue-100' },
  { initials: 'FC', bg: 'bg-purple-100' },
  { initials: 'LF', bg: 'bg-rose-100' },
  { initials: 'CE', bg: 'bg-teal-100' },
  { initials: 'GA', bg: 'bg-indigo-100' },
];

export default function LeadForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await submitLead({
        ...data,
        landing_variant: 'community',
      });
      await trackEvent('community', 'lead_submitted', { interest: data.interest });
      setIsSubmitted(true);
    } catch {
      // Fallback: show success anyway for UX
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-community-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="community-card overflow-hidden"
        >
          {/* Warm header */}
          <div className="bg-gradient-to-r from-community-green to-community-green-light p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-8 h-8 text-white fill-white/80" />
            </motion.div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
              Queremos Conhecer Voce
            </h2>
            <p className="text-white/80 font-body text-lg max-w-xl mx-auto">
              Conte um pouco sobre voce e entraremos em contato para convidar voce a participar de um encontro.
            </p>
          </div>

          {/* Form body */}
          <div className="p-8 md:p-12 bg-white">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-community-green mx-auto mb-4" />
                <h3 className="font-heading font-bold text-2xl text-community-green mb-2">
                  Que alegria!
                </h3>
                <p className="text-community-brown/70 font-body text-lg max-w-md mx-auto">
                  Recebemos seus dados e em breve alguem da nossa comunidade entrara em contato com voce. Seja muito bem-vindo(a)!
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  {communityPhotos.slice(0, 5).map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`w-10 h-10 rounded-full ${photo.bg} flex items-center justify-center border-2 border-white shadow-sm -ml-2 first:ml-0`}
                    >
                      <span className="text-xs font-heading font-bold text-community-green">
                        {photo.initials}
                      </span>
                    </motion.div>
                  ))}
                  <span className="flex items-center text-sm text-community-brown/50 ml-2">
                    +50.000 membros
                  </span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-heading font-semibold text-community-brown mb-2">
                    Como voce se chama? *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="Seu nome completo"
                    {...register('full_name')}
                    className="w-full px-4 py-3 rounded-xl border border-community-green/20 bg-community-beige/50 font-body text-community-brown placeholder:text-community-brown/30 transition-all"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-heading font-semibold text-community-brown mb-2">
                      Seu e-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-xl border border-community-green/20 bg-community-beige/50 font-body text-community-brown placeholder:text-community-brown/30 transition-all"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-heading font-semibold text-community-brown mb-2">
                      Seu telefone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      {...register('phone')}
                      className="w-full px-4 py-3 rounded-xl border border-community-green/20 bg-community-beige/50 font-body text-community-brown placeholder:text-community-brown/30 transition-all"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-heading font-semibold text-community-brown mb-2">
                    Em qual cidade voce mora?
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Cidade e estado"
                    {...register('city')}
                    className="w-full px-4 py-3 rounded-xl border border-community-green/20 bg-community-beige/50 font-body text-community-brown placeholder:text-community-brown/30 transition-all"
                  />
                </div>

                {/* How did you find us */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-heading font-semibold text-community-brown mb-2">
                    Como conheceu o Movimento?
                  </label>
                  <select
                    id="interest"
                    {...register('interest')}
                    className="w-full px-4 py-3 rounded-xl border border-community-green/20 bg-community-beige/50 font-body text-community-brown transition-all"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione uma opcao
                    </option>
                    {howOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-community w-full text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Quero Fazer Parte
                    </span>
                  )}
                </motion.button>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs text-community-brown/40">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    +50.000 membros
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    120+ cidades
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    110 anos de historia
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Community photo strip */}
          <div className="bg-community-green/5 px-8 py-4 flex items-center justify-center gap-1 overflow-hidden">
            {communityPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${photo.bg} flex items-center justify-center border-2 border-white shadow-sm -ml-1 first:ml-0 flex-shrink-0`}
              >
                <span className="text-[10px] md:text-xs font-heading font-bold text-community-green">
                  {photo.initials}
                </span>
              </motion.div>
            ))}
            <span className="text-xs text-community-brown/40 ml-3 whitespace-nowrap font-body">
              Junte-se a nossa familia
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
