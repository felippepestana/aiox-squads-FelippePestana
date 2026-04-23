import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CommunityGrid from './components/CommunityGrid';
import StoriesSection from './components/StoriesSection';
import HowItWorksSection from './components/HowItWorksSection';
import GroupsSection from './components/GroupsSection';
import MapSection from './components/MapSection';
import EventsSection from './components/EventsSection';
import LeadForm from './components/LeadForm';
import NewsletterSection from './components/NewsletterSection';
import FooterSection from './components/FooterSection';
import { trackEvent } from './lib/supabase';

export default function App() {
  useEffect(() => {
    trackEvent('community', 'page_view');
  }, []);

  return (
    <div className="min-h-screen bg-community-beige">
      <Navigation />
      <main>
        <HeroSection />
        <CommunityGrid />
        <StoriesSection />
        <HowItWorksSection />
        <GroupsSection />
        <MapSection />
        <EventsSection />
        <LeadForm />
        <NewsletterSection />
      </main>
      <FooterSection />
    </div>
  );
}
