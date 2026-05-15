import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060c17] via-[#0f1c2e] to-[#060c17]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.15) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(79,195,247,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <Badge variant="gold" className="mb-6">
            ✦ CFM Res. 2.336/2023 Compliant
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="text-white">Transforme a</span>
            <br />
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #f0d060 0%, #d4af37 40%, #c8960c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              experiência
            </span>
            <br />
            <span className="text-white">dos seus pacientes</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Materiais de marketing prontos para TV de recepção. Loop de 90 segundos com roteiros
            profissionais para Foto Terapia, Botox e Harmonização Íntima.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/display">
              <Button size="lg">
                Ver Display TV →
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="lg">
                Configurar Clínica
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          {[
            { value: '4', label: 'Procedimentos' },
            { value: '90s', label: 'Loop completo' },
            { value: '5×', label: 'Variações de copy' },
            { value: '100%', label: 'CFM Compliant' },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-2xl font-bold text-[#d4af37]">{s.value}</div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
