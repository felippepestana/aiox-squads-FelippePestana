import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { submitLead, trackEvent } from '../lib/supabase';

const leadSchema = z.object({
  full_name: z.string().min(2, 'Por favor, informe seu nome completo'),
  email: z.string().email('Informe um email valido'),
  phone: z.string().optional(),
  city: z.string().optional(),
  interest: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const interestOptions = [
  { value: '', label: 'Selecione seu interesse' },
  { value: 'alianca', label: 'Fazer minha Alianca de Amor' },
  { value: 'retiro', label: 'Participar de um retiro' },
  { value: 'grupo', label: 'Encontrar um grupo perto de mim' },
  { value: 'familia', label: 'Movimento de familias' },
  { value: 'juventude', label: 'Juventude de Schoenstatt' },
  { value: 'conhecer', label: 'Apenas conhecer o Movimento' },
  { value: 'outro', label: 'Outro interesse' },
];

export default function LeadForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setServerError('');
    try {
      await submitLead({
        ...data,
        landing_variant: 'sanctuary',
      });
      await trackEvent('sanctuary', 'lead_submitted', { interest: data.interest });
      setIsSuccess(true);
      reset();
    } catch {
      setServerError('Ocorreu um erro. Por favor, tente novamente.');
    }
  };

  return (
    <section
      id="jornada"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Formulario de contato"
    >
      <div className="absolute inset-0 radial-glow-rose" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sanctuary-gold text-sm tracking-[0.2em] uppercase mb-4 font-sans">
            De o Primeiro Passo
          </p>
          <h2 className="section-heading">
            Comece Sua <span className="text-gold-gradient">Jornada Espiritual</span>
          </h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subheading">
            Preencha o formulario abaixo e um de nossos aliancistas entrara em contato para
            acompanha-lo(a) nessa caminhada de fe e amor.
          </p>
        </motion.div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sanctuary-card p-8 md:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sanctuary-gold/10 border border-sanctuary-gold/30 mb-6">
              <Check className="h-8 w-8 text-sanctuary-gold" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-sanctuary-cream mb-4">
              Sua jornada comecou!
            </h3>
            <p className="text-sanctuary-cream/60 mb-2">
              Recebemos sua mensagem. Em breve, um de nossos aliancistas entrara em contato.
            </p>
            <p className="text-sanctuary-gold/50 italic font-serif">
              Que Nossa Senhora o(a) abencoe e guie nessa caminhada.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-8 btn-gold-outline !py-2 !px-6 text-sm"
            >
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="sanctuary-card p-6 md:p-10"
            noValidate
          >
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium text-sanctuary-cream/70 mb-2">
                  Nome completo *
                </label>
                <input
                  id="lead-name"
                  type="text"
                  {...register('full_name')}
                  placeholder="Seu nome completo"
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                  aria-invalid={!!errors.full_name}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-sanctuary-rose flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium text-sanctuary-cream/70 mb-2">
                  Email *
                </label>
                <input
                  id="lead-email"
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-sanctuary-rose flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="lead-phone" className="block text-sm font-medium text-sanctuary-cream/70 mb-2">
                  Telefone / WhatsApp
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="lead-city" className="block text-sm font-medium text-sanctuary-cream/70 mb-2">
                  Cidade
                </label>
                <input
                  id="lead-city"
                  type="text"
                  {...register('city')}
                  placeholder="Sua cidade"
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream placeholder:text-sanctuary-cream/30 transition-all"
                />
              </div>

              {/* Interest */}
              <div>
                <label htmlFor="lead-interest" className="block text-sm font-medium text-sanctuary-cream/70 mb-2">
                  Qual seu interesse?
                </label>
                <select
                  id="lead-interest"
                  {...register('interest')}
                  className="w-full bg-sanctuary-navy/60 border border-sanctuary-gold/20 rounded-lg px-4 py-3 text-sanctuary-cream transition-all appearance-none"
                >
                  {interestOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-sanctuary-navy text-sanctuary-cream">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="p-3 rounded-lg bg-sanctuary-rose/10 border border-sanctuary-rose/30 text-sanctuary-rose text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold !py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Enviando...</span>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Quero Conhecer a Alianca de Amor
                  </>
                )}
              </button>

              <p className="text-center text-xs text-sanctuary-cream/30 mt-2">
                Seus dados estao seguros e nao serao compartilhados com terceiros.
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
