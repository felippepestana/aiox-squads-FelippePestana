import { useScrollProgress } from './hooks/useScrollProgress';
import Navigation from './components/Navigation';
import ProgressIndicator from './components/ProgressIndicator';
import Station1_TheCalling from './components/Station1_TheCalling';
import Station2_TheHistory from './components/Station2_TheHistory';
import Station3_TheWay from './components/Station3_TheWay';
import Station4_TheVoices from './components/Station4_TheVoices';
import Station5_TheCovenant from './components/Station5_TheCovenant';
import Station6_NextStep from './components/Station6_NextStep';
import EventsSection from './components/EventsSection';
import PrayerSection from './components/PrayerSection';
import FooterSection from './components/FooterSection';

export default function App() {
  const {
    scrollProgress,
    activeStation,
    visitedStations,
    scrollToStation,
  } = useScrollProgress();

  return (
    <div className="min-h-screen">
      <Navigation
        scrollProgress={scrollProgress}
        activeStation={activeStation}
        scrollToStation={scrollToStation}
      />

      <ProgressIndicator
        activeStation={activeStation}
        visitedStations={visitedStations}
        scrollToStation={scrollToStation}
        scrollProgress={scrollProgress}
      />

      <main>
        <Station1_TheCalling />
        <Station2_TheHistory />
        <Station3_TheWay />
        <Station4_TheVoices />
        <Station5_TheCovenant />
        <Station6_NextStep />
        <EventsSection />
        <PrayerSection />
      </main>

      <FooterSection />
    </div>
  );
}
