import { motion } from 'framer-motion';
import { STATIONS } from '../hooks/useScrollProgress';

interface ProgressIndicatorProps {
  activeStation: number;
  visitedStations: Set<number>;
  scrollToStation: (index: number) => void;
  scrollProgress: number;
}

export default function ProgressIndicator({
  activeStation,
  visitedStations,
  scrollToStation,
  scrollProgress,
}: ProgressIndicatorProps) {
  return (
    <>
      {/* Desktop sidebar indicator */}
      <div
        className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0"
        role="navigation"
        aria-label="Estações da peregrinação"
      >
        {STATIONS.map((station, i) => (
          <div key={station.id} className="flex flex-col items-center">
            {/* Connecting line */}
            {i > 0 && (
              <div className="relative w-[2px] h-8">
                <div className="absolute inset-0 bg-gold/20" />
                <motion.div
                  className="absolute top-0 left-0 w-full bg-gold"
                  initial={{ height: '0%' }}
                  animate={{
                    height: visitedStations.has(i) ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}

            {/* Station dot + label */}
            <button
              onClick={() => scrollToStation(i)}
              className="group flex items-center gap-3"
              aria-label={`Ir para ${station.name}`}
              aria-current={activeStation === i ? 'step' : undefined}
            >
              <div
                className={`station-dot ${
                  activeStation === i
                    ? 'active'
                    : visitedStations.has(i)
                      ? 'visited'
                      : ''
                }`}
              />
              <motion.span
                className="absolute left-8 whitespace-nowrap font-serif text-sm pointer-events-none"
                initial={{ opacity: 0, x: -5 }}
                animate={{
                  opacity: activeStation === i ? 1 : 0,
                  x: activeStation === i ? 0 : -5,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-gold font-medium">{station.name}</span>
              </motion.span>
            </button>
          </div>
        ))}
      </div>

      {/* Mobile top progress dots */}
      <motion.div
        className="lg:hidden fixed top-16 left-0 right-0 z-30 flex justify-center gap-3 py-2 bg-parchment/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0.02 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        role="navigation"
        aria-label="Progresso da peregrinação"
      >
        {STATIONS.map((station, i) => (
          <button
            key={station.id}
            onClick={() => scrollToStation(i)}
            className="flex flex-col items-center gap-1"
            aria-label={station.name}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full border border-gold transition-all duration-300 ${
                activeStation === i
                  ? 'bg-gold scale-125 shadow-md shadow-gold/30'
                  : visitedStations.has(i)
                    ? 'bg-gold/60'
                    : 'bg-parchment'
              }`}
            />
            {activeStation === i && (
              <motion.span
                className="text-[10px] font-serif text-gold absolute top-full mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layoutId="mobile-station-label"
              >
                {station.name}
              </motion.span>
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}
