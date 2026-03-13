/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0B0E',
        'bg-secondary': '#111318',
        'bg-tertiary': '#1A1D24',
        'bg-hover': '#22262F',
        'border-default': '#2A2F3A',
        'border-light': '#353B47',
        'accent': '#4F8EF7',
        'accent-hover': '#6BA3FF',
        'accent-gold': '#D4A853',
        'text-primary': '#E8EAF0',
        'text-secondary': '#9BA3B2',
        'text-muted': '#5C6370',
        'success': '#4CAF7A',
        'warning': '#E8A93A',
        'danger': '#E85454',
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '10px',
      },
      animation: {
        'typing-dot': 'typing-dot 1.4s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s infinite',
      },
      keyframes: {
        'typing-dot': {
          '0%, 60%, 100%': { opacity: '0.2', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-4px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
