import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          navy: '#0A1628',
          'navy-light': '#0F2040',
          'navy-lighter': '#162D54',
          gold: '#C9A84C',
          'gold-light': '#D4BA6A',
          'gold-dark': '#A68A3A',
          cream: '#FAF7F0',
          'cream-dark': '#E8E2D4',
          rose: '#8B2252',
          'rose-light': '#A63068',
          'rose-dark': '#6B1A3F',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'candle-flicker': 'flicker 3s ease-in-out infinite alternate',
        'glow-pulse': 'glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'sanctuary-gradient': 'linear-gradient(180deg, #0A1628 0%, #0F2040 50%, #0A1628 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #D4BA6A 50%, #A68A3A 100%)',
        'rose-gradient': 'linear-gradient(135deg, #8B2252 0%, #A63068 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
