import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Shield, Lock, Users, CheckCircle, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/supabase';

const schema = z.object({
  full_name: z.string().min(2, 'Por favor, digite seu nome completo'),
  email: z.string().email('Por favor, digite um email valido'),
  phone: z
    .string()
    .regex(/^(\+?\d{1,3}[\s-]?)?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/, 'Telefone invalido')
    .optional()
    .or(z.literal('')),
  interest: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const interests = [
  { value: '', label: 'Selecione seu interesse' },
  { value: 'conhecer', label: 'Quero conhecer o movimento' },
  { value: 'retiro', label: 'Participar de um retiro' },
  { value: 'grupo', label: 'Encontrar um grupo proximo' },
  { value: 'casal', label: 'Atividades para casais' },
  { value: 'jovem', label: 'Grupo de jovens' },
  { value: 'familia', label: 'Atividades para familias' },
  { value: 'outro', label: 'Outro' },
];

const trustBadges = [
  { icon: <Shield size={18} />, label: 'Dados protegidos' },
  { icon: <Lock size={18} />, label: 'Privacidade garantida' },
  { icon: <Users size={18} />, label: 'Comunidade acolhedora' },
];

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const { error } = await submitLead({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || undefined,
        interest: data.interest || undefined,
        landing_variant: 'covenant',
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      setSubmitError(
        'Desculpe, houve um problema. Por favor, tente novamente em alguns instantes.'
      );
    }
  };

  if (submitted) {
    return (
      <section id="contato" className="section-padding bg-white" aria-labelledby="form-heading">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-covenant-blue-dark">
              Obrigado pelo seu interesse!
            </h2>
            <p className="mt-3 text-covenant-gray-600">
              Recebemos suas informacoes e entraremos em contato em breve.
              Enquanto isso, fique a vontade para explorar mais sobre o
              movimento.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contato"
      className="section-padding bg-white"
      aria-labelledby="form-heading"
    >
      <div className="container-max">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-sm font-semibold text-covenant-blue uppercase tracking-wider">
              Comece Agora
            </span>
            <h2
              id="form-heading"
              className="mt-3 text-3xl md:text-4xl font-extrabold text-covenant-blue-dark"
            >
              De o Primeiro Passo
            </h2>
            <p className="mt-4 text-covenant-gray-600 text-lg">
              Preencha o formulario e um membro da comunidade entrara em contato
              com voce. Sem compromisso, sem pressao.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 bg-covenant-gray rounded-2xl p-6 sm:p-8 border border-covenant-gray-200/50"
          >
            {/* Name */}
            <div className="relative">
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-covenant-gray-600 mb-1.5"
              >
                Nome completo *
              </label>
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                {...register('full_name')}
                className={`w-full px-4 py-3 rounded-lg border bg-white text-covenant-gray-800 placeholder:text-covenant-gray-400 focus:outline-none focus:ring-2 focus:ring-covenant-blue/30 focus:border-covenant-blue transition-all text-sm ${
                  errors.full_name
                    ? 'border-red-400'
                    : 'border-covenant-gray-200'
                }`}
                placeholder="Seu nome completo"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-covenant-gray-600 mb-1.5"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-lg border bg-white text-covenant-gray-800 placeholder:text-covenant-gray-400 focus:outline-none focus:ring-2 focus:ring-covenant-blue/30 focus:border-covenant-blue transition-all text-sm ${
                  errors.email
                    ? 'border-red-400'
                    : 'border-covenant-gray-200'
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-covenant-gray-600 mb-1.5"
              >
                Telefone (opcional)
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                className={`w-full px-4 py-3 rounded-lg border bg-white text-covenant-gray-800 placeholder:text-covenant-gray-400 focus:outline-none focus:ring-2 focus:ring-covenant-blue/30 focus:border-covenant-blue transition-all text-sm ${
                  errors.phone
                    ? 'border-red-400'
                    : 'border-covenant-gray-200'
                }`}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Interest */}
            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-covenant-gray-600 mb-1.5"
              >
                Interesse (opcional)
              </label>
              <select
                id="interest"
                {...register('interest')}
                className="w-full px-4 py-3 rounded-lg border border-covenant-gray-200 bg-white text-covenant-gray-800 focus:outline-none focus:ring-2 focus:ring-covenant-blue/30 focus:border-covenant-blue transition-all text-sm appearance-none"
              >
                {interests.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error message */}
            {submitError && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {submitError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-base py-4 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Quero Participar
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 text-xs text-covenant-gray-400"
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
