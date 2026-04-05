import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import PillarsSection from './components/PillarsSection';
import VideoSection from './components/VideoSection';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import LeadForm from './components/LeadForm';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import FooterSection from './components/FooterSection';
import { trackEvent } from './lib/supabase';

export default function App() {
  useEffect(() => {
    trackEvent('covenant', 'page_view').catch(() => {
      // Analytics failure should not block the page
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-covenant-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Pular para o conteudo principal
      </a>

      <Navigation />

      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <PillarsSection />
        <VideoSection />
        <TestimonialsSection />
        <EventsSection />
        <LeadForm />
        <FAQSection />
        <CTASection />
      </main>

      <FooterSection />
    </div>
  );
}
