import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        community: {
          beige: '#FDF8F0',
          'beige-dark': '#F5EDE0',
          green: '#166534',
          'green-light': '#22863A',
          'green-dark': '#0F4A25',
          brown: '#78350F',
          'brown-light': '#92400E',
          rose: '#BE185D',
          'rose-light': '#DB2777',
          'rose-dark': '#9D174D',
          cream: '#FFFBEB',
          'cream-dark': '#FEF3C7',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'soft-bounce': 'softBounce 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseWarm: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(22, 101, 52, 0.2)' },
          '50%': { boxShadow: '0 0 0 12px rgba(22, 101, 52, 0)' },
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(180deg, #FDF8F0 0%, #FFFBEB 50%, #FDF8F0 100%)',
        'green-gradient': 'linear-gradient(135deg, #166534 0%, #22863A 100%)',
        'rose-gradient': 'linear-gradient(135deg, #BE185D 0%, #DB2777 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
