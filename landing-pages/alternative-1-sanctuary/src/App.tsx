import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import HistoryTimeline from './components/HistoryTimeline';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import PrayerSection from './components/PrayerSection';
import LeadForm from './components/LeadForm';
import NewsletterSection from './components/NewsletterSection';
import FooterSection from './components/FooterSection';
import { trackEvent } from './lib/supabase';

export default function App() {
  useEffect(() => {
    trackEvent('sanctuary', 'page_view').catch(() => {
      // Analytics failure should not impact user experience
    });
  }, []);

  return (
    <div className="min-h-screen bg-sanctuary-navy text-sanctuary-cream">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <HistoryTimeline />
        <TestimonialsSection />
        <EventsSection />
        <PrayerSection />
        <LeadForm />
        <NewsletterSection />
      </main>
      <FooterSection />
    </div>
  );
}
