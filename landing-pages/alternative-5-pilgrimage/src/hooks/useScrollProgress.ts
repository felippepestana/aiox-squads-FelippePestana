import { useState, useEffect, useCallback, useRef } from 'react';

export interface Station {
  id: string;
  name: string;
  index: number;
}

export const STATIONS: Station[] = [
  { id: 'o-chamado', name: 'O Chamado', index: 0 },
  { id: 'a-historia', name: 'A História', index: 1 },
  { id: 'o-caminho', name: 'O Caminho', index: 2 },
  { id: 'as-vozes', name: 'As Vozes', index: 3 },
  { id: 'a-alianca', name: 'A Aliança', index: 4 },
  { id: 'o-proximo-passo', name: 'O Próximo Passo', index: 5 },
];

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStation, setActiveStation] = useState(0);
  const [visitedStations, setVisitedStations] = useState<Set<number>>(new Set([0]));
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);

      // Determine active station based on section elements in view
      const sections = STATIONS.map((station) =>
        document.getElementById(station.id),
      );

      let currentStation = 0;
      const viewportMiddle = scrollTop + window.innerHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollTop;
          if (viewportMiddle >= sectionTop) {
            currentStation = i;
            break;
          }
        }
      }

      setActiveStation(currentStation);
      setVisitedStations((prev) => {
        const next = new Set(prev);
        next.add(currentStation);
        return next;
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  const scrollToStation = useCallback((index: number) => {
    const station = STATIONS[index];
    if (station) {
      const element = document.getElementById(station.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return {
    scrollProgress,
    activeStation,
    visitedStations,
    stations: STATIONS,
    scrollToStation,
  };
}
