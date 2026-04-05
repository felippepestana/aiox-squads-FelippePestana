import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F5F0E8',
          light: '#FAF7F2',
          dark: '#E8E0D0',
        },
        purple: {
          deep: '#4C1D95',
          darker: '#3B0F7A',
          light: '#7C3AED',
        },
        sage: {
          DEFAULT: '#6B8E6B',
          light: '#8BAF8B',
          dark: '#4A6B4A',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4A017',
          dark: '#8B6508',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          light: '#4A4A4A',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'scroll-hint': 'scrollHint 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(12px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
