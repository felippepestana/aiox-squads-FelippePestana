import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        covenant: {
          white: '#FFFFFF',
          blue: '#3B82F6',
          'blue-light': '#60A5FA',
          'blue-dark': '#1E3A5F',
          gray: '#F8FAFC',
          'gray-200': '#E2E8F0',
          'gray-400': '#94A3B8',
          'gray-600': '#475569',
          'gray-800': '#1E293B',
          warm: '#E8985E',
          'warm-light': '#F0B88A',
          'warm-dark': '#C47A3F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'count-up': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
