import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MapPin, Phone, Instagram, Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  phone: z.string().min(10, 'Informe um número válido com DDD'),
  treatment: z.string().min(1, 'Selecione um tratamento de interesse'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const treatmentOptions = [
  'Protocolo GLP-1 (Emagrecimento)',
  'Criolipólise',
  'Sculptra Corporal',
  'Escultura Muscular HIFEM',
  'Harmonização Facial',
  'Bioestimuladores de Colágeno',
  'Fios de Sustentação PDO',
  'Avaliação Cardiológica',
  'Não sei ainda — quero orientação',
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
  }

  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-anmar-navy to-[#050D1A] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-anmar-gold/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <p className="section-label mb-4">Agende sua Consulta</p>
              <h2 className="section-title mb-4">
                Sua transformação{' '}
                <span className="gold-text">começa com uma conversa</span>
              </h2>
              <p className="text-white/50 font-body leading-relaxed">
                A primeira consulta é a avaliação do seu perfil de saúde, objetivos e expectativas.
                Sem compromisso — com toda a atenção que você merece.
              </p>
            </div>

            <div className="divider-gold" />

            {/* Contact info */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-anmar-gold/10 border border-anmar-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-anmar-gold" />
                </div>
                <div>
                  <p className="font-body font-medium text-anmar-ivory text-sm mb-1">Endereço</p>
                  <p className="text-sm font-body text-white/50 leading-relaxed">
                    Rua Rio Ica, 310 — Sala 103<br />
                    Edifício Celebration Smart Office<br />
                    Nossa Senhora das Graças · Manaus, AM<br />
                    CEP 69053-100
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-anmar-gold/10 border border-anmar-gold/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-anmar-gold" />
                </div>
                <div>
                  <p className="font-body font-medium text-anmar-ivory text-sm mb-1">WhatsApp / Telefone</p>
                  <a href="https://wa.me/559298271-1200" className="text-sm font-body text-white/50 hover:text-anmar-gold transition-colors">
                    (92) 98271-1200
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-anmar-gold/10 border border-anmar-gold/20 flex items-center justify-center flex-shrink-0">
                  <Instagram size={16} className="text-anmar-gold" />
                </div>
                <div>
                  <p className="font-body font-medium text-anmar-ivory text-sm mb-1">Instagram</p>
                  <a
                    href="https://www.instagram.com/anmar.clinica/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-body text-white/50 hover:text-anmar-gold transition-colors"
                  >
                    @anmar.clinica
                  </a>
                </div>
              </div>
            </div>

            {/* Highlight box */}
            <div className="glass-card p-6 border-anmar-gold/20">
              <p className="text-anmar-gold text-sm font-body font-semibold mb-2">
                ✓ Avaliação inicial sem custo
              </p>
              <p className="text-xs font-body text-white/50 leading-relaxed">
                Nossa primeira consulta é dedicada a conhecer seu perfil, seus objetivos e construir juntos o melhor protocolo para você. Sem pressão de venda.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <CheckCircle size={48} className="text-anmar-gold mx-auto" />
                <h3 className="font-display text-2xl text-anmar-ivory">Mensagem enviada!</h3>
                <p className="text-white/50 font-body">
                  Nossa equipe entrará em contato em até 24 horas. Obrigado por confiar na Clínica AnMar.
                </p>
                <a href="https://wa.me/559298271-1200" className="btn-primary inline-block mt-4">
                  Falar pelo WhatsApp agora
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <p className="font-body font-semibold text-anmar-ivory mb-1 text-sm">Nome completo *</p>
                  <input
                    {...register('name')}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm font-body text-anmar-ivory placeholder:text-white/30 focus:outline-none focus:border-anmar-gold/50 focus:bg-white/10 transition-all duration-300"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1 font-body">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <p className="font-body font-semibold text-anmar-ivory mb-1 text-sm">WhatsApp / Telefone *</p>
                  <input
                    {...register('phone')}
                    placeholder="(92) 9xxxx-xxxx"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm font-body text-anmar-ivory placeholder:text-white/30 focus:outline-none focus:border-anmar-gold/50 focus:bg-white/10 transition-all duration-300"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1 font-body">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <p className="font-body font-semibold text-anmar-ivory mb-1 text-sm">Tratamento de interesse *</p>
                  <select
                    {...register('treatment')}
                    className="w-full bg-anmar-navy border border-white/15 rounded-xl px-4 py-3 text-sm font-body text-anmar-ivory focus:outline-none focus:border-anmar-gold/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="text-white/30">Selecione...</option>
                    {treatmentOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-anmar-navy text-anmar-ivory">{opt}</option>
                    ))}
                  </select>
                  {errors.treatment && (
                    <p className="text-xs text-red-400 mt-1 font-body">{errors.treatment.message}</p>
                  )}
                </div>

                <div>
                  <p className="font-body font-semibold text-anmar-ivory mb-1 text-sm">Mensagem (opcional)</p>
                  <textarea
                    {...register('message')}
                    placeholder="Conte um pouco sobre seus objetivos..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm font-body text-anmar-ivory placeholder:text-white/30 focus:outline-none focus:border-anmar-gold/50 focus:bg-white/10 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-anmar-navy/40 border-t-anmar-navy rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Solicitar Avaliação Gratuita
                    </>
                  )}
                </button>

                <p className="text-xs font-body text-white/30 text-center">
                  Seus dados são tratados com total confidencialidade e não são compartilhados com terceiros.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
