import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { ProcedureGrid } from '@/components/landing/ProcedureGrid'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTASection } from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProcedureGrid />
        <HowItWorks />
        <CTASection />
      </main>
      <footer
        className="border-t py-10 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#060c17' }}
      >
        <p className="text-white/20 text-sm">
          AIOX Marketing Platform · CFM Res. 2.336/2023 Compliant ·{' '}
          <a href="/display" className="hover:text-white/50 transition-colors">Display TV</a>
          {' · '}
          <a href="/admin" className="hover:text-white/50 transition-colors">Admin</a>
        </p>
      </footer>
    </>
  )
}
