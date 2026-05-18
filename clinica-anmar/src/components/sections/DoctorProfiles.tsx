import { motion } from 'framer-motion'
import { Award, CheckCircle } from 'lucide-react'
import { doctors } from '../../data/doctors'

export function DoctorProfiles() {
  return (
    <section id="medicos" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060E1C] via-anmar-navy to-anmar-navy pointer-events-none" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-anmar-gold/0 via-anmar-gold/30 to-anmar-gold/0" />
      <div className="absolute bottom-0 right-1/4 w-px h-32 bg-gradient-to-b from-anmar-gold/0 via-anmar-gold/30 to-anmar-gold/0" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nossa Equipe Médica
          </motion.p>
          <motion.h2
            className="section-title mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            A dupla por trás da{' '}
            <span className="gold-text">Clínica AnMar</span>
          </motion.h2>
          <motion.p
            className="text-white/50 font-body max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            O nome <strong className="text-anmar-gold/80">AnMar</strong> une{' '}
            <strong className="text-white/70">An</strong>gelo e{' '}
            <strong className="text-white/70">Mar</strong>ina — dois médicos, uma missão:
            transformar saúde e autoestima com rigor científico e cuidado humano.
          </motion.p>
        </div>

        {/* Doctor cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 relative overflow-hidden group hover:border-anmar-gold/30 transition-all duration-500"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-anmar-gold/0 to-anmar-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                {/* Avatar placeholder */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-anmar-gold/20 to-anmar-gold/5 border border-anmar-gold/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-3xl text-anmar-gold font-light">
                      {doctor.name.split(' ').find((w) => w.length > 2 && w !== 'Dr.' && w !== 'Dra.')?.[0] ?? 'M'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-anmar-ivory text-lg leading-tight mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-anmar-gold text-sm font-body">{doctor.title}</p>
                    <p className="text-white/40 text-xs font-body mt-1 tracking-wide">{doctor.crm}</p>
                  </div>
                </div>

                <div className="divider-gold" />

                {/* Bio */}
                <p className="text-sm font-body text-white/60 leading-relaxed mb-6">
                  {doctor.bio}
                </p>

                {/* Focus highlight */}
                <div className="border border-anmar-gold/20 bg-anmar-gold/5 rounded-xl p-4 mb-6">
                  <p className="text-xs font-body text-anmar-gold/60 italic leading-relaxed">
                    "{doctor.focus}"
                  </p>
                </div>

                {/* Credentials */}
                <div className="space-y-2">
                  <p className="text-[10px] font-body text-white/30 tracking-widest uppercase flex items-center gap-2">
                    <Award size={10} className="text-anmar-gold" />
                    Formação & Especialidades
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.credentials.map((c) => (
                      <span
                        key={c}
                        className="flex items-center gap-1.5 text-xs font-body text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle size={10} className="text-anmar-gold/60 flex-shrink-0" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sub-specialties */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <p className="text-[10px] font-body text-white/30 tracking-widest uppercase mb-3">Áreas de Atuação</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {doctor.subSpecialties.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-xs font-body text-white/40">
                        <span className="w-1 h-1 rounded-full bg-anmar-gold/50 flex-shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
