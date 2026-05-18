import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Globe, Users, Church } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  {
    icon: <Clock size={24} />,
    value: 110,
    suffix: '+',
    label: 'anos de historia',
  },
  {
    icon: <Globe size={24} />,
    value: 40,
    suffix: '+',
    label: 'paises com presenca',
  },
  {
    icon: <Users size={24} />,
    value: 10000,
    suffix: '+',
    label: 'familias transformadas',
  },
  {
    icon: <Church size={24} />,
    value: 300,
    suffix: '+',
    label: 'santuarios no mundo',
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1800;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  const formatted =
    target >= 10000
      ? `${Math.round(count / 1000)}mil`
      : count.toLocaleString('pt-BR');

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-covenant-gray border-y border-covenant-gray-200" aria-label="Estatisticas">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-covenant-blue/10 text-covenant-blue mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-covenant-blue-dark">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-sm text-covenant-gray-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
