import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        anmar: {
          navy:    '#0A1628',
          'navy-light': '#112240',
          gold:    '#C9A96E',
          'gold-light': '#E2C896',
          'gold-dark': '#A6854A',
          amazon:  '#2D5A3D',
          'amazon-light': '#3D7A52',
          ivory:   '#F8F4EE',
          'ivory-dark': '#EDE7DD',
          dark:    '#1A1A2E',
          muted:   '#8892B0',
          'text-light': '#E8E0D5',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.2rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.6rem, 3vw, 2.8rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease-out forwards',
        'fade-in':   'fadeIn 1s ease-out forwards',
        'shimmer':   'shimmer 2.5s linear infinite',
        'float':     'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 169, 110, 0.2)' },
          '50%':      { boxShadow: '0 0 60px rgba(201, 169, 110, 0.5)' },
        },
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C9A96E 0%, #E2C896 50%, #A6854A 100%)',
        'navy-gradient':  'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
        'hero-gradient':  'radial-gradient(ellipse at 30% 50%, #112240 0%, #0A1628 60%, #050D1A 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(201, 169, 110, 0.3)',
        'gold-lg': '0 0 60px rgba(201, 169, 110, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 48px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config
