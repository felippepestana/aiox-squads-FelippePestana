import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="py-24 bg-[#060c17]">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="relative rounded-3xl p-12 md:p-16 overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(27,79,114,0.4) 0%, rgba(212,175,55,0.15) 100%)',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 60%)',
            }}
          />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Configure sua clínica, visualize o display TV e exporte os materiais de produção.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/display">
                <Button size="lg">Ver Display TV →</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="lg">Painel Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
