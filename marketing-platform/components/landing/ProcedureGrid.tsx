import Link from 'next/link'
import { PROCEDURES } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'

const audienceLabel: Record<string, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  misto: 'Todos os públicos',
}

const audienceVariant: Record<string, 'rose' | 'blue' | 'gold'> = {
  feminino: 'rose',
  masculino: 'blue',
  misto: 'gold',
}

export function ProcedureGrid() {
  return (
    <section id="procedimentos" className="py-24 bg-[#060c17]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#d4af37] text-sm font-semibold tracking-widest uppercase mb-3">
            Procedimentos cobertos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Roteiros prontos para
            <br />
            <span className="text-white/40">sua equipe de gravação</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {PROCEDURES.map((proc) => (
            <div
              key={proc.id}
              className="group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Color accent strip */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${proc.color_accent}, transparent)` }}
              />

              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-3xl"
                  style={{ color: proc.color_accent }}
                >
                  {proc.icon}
                </span>
                <Badge variant={audienceVariant[proc.audience]}>
                  {audienceLabel[proc.audience]}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{proc.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{proc.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">{proc.slides.length} slides × 15s</span>
                <Link
                  href={`/display?procedure=${proc.slug}`}
                  className="text-sm font-medium transition-colors"
                  style={{ color: proc.color_accent }}
                >
                  Ver display →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
