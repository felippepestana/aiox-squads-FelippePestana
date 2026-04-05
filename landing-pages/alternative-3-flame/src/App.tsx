import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import PainPointsSection from './components/PainPointsSection';
import SolutionSection from './components/SolutionSection';
import SocialProofBar from './components/SocialProofBar';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import BenefitsSection from './components/BenefitsSection';
import LeadForm from './components/LeadForm';
import GuaranteeSection from './components/GuaranteeSection';
import FinalCTA from './components/FinalCTA';
import FooterSection from './components/FooterSection';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-white font-body">
      <Navigation />
      <main>
        <HeroSection />
        <PainPointsSection />
        <SolutionSection />
        <SocialProofBar />
        <BenefitsSection />
        <TestimonialsSection />
        <EventsSection />
        <LeadForm />
        <GuaranteeSection />
        <FinalCTA />
      </main>
      <FooterSection />
    </div>
  );
}
