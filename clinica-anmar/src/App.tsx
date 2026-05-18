import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { TransformationViewer } from './components/sections/TransformationViewer'
import { TreatmentCatalog } from './components/sections/TreatmentCatalog'
import { DoctorProfiles } from './components/sections/DoctorProfiles'
import { TechSection } from './components/sections/TechSection'
import { TestimonialsSection } from './components/sections/TestimonialsSection'
import { ContactSection } from './components/sections/ContactSection'

export default function App() {
  return (
    <div className="min-h-screen bg-anmar-navy text-anmar-ivory">
      <Header />
      <main>
        <HeroSection />
        <TransformationViewer />
        <TreatmentCatalog />
        <TechSection />
        <DoctorProfiles />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
