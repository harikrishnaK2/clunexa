/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':         '#0B0B14',
        'surface':      '#141426',
        'surface-alt':  '#1E1E38',
        'brand':        '#7C3AED',
        'brand-light':  '#A78BFA',
        'cyan-glow':    '#06B6D4',
        'amber-hot':    '#F59E0B',
        'emerald-alive':'#10B981',
        'crimson-clash':'#EF4444',
        'ink':          '#F8FAFC',
        'muted':        '#94A3B8',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'slide-up':   'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fade-in 0.3s ease-out forwards',
        'shake':      'shake 0.45s ease-in-out',
        'stamp-in':   'stamp-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'score-pop':  'score-pop 0.45s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        'slide-up':  {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in':   {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-10px)' },
          '40%':      { transform: 'translateX(10px)' },
          '60%':      { transform: 'translateX(-6px)' },
          '80%':      { transform: 'translateX(6px)' },
        },
        'stamp-in': {
          '0%':   { transform: 'scale(2.5) rotate(-20deg)', opacity: '0' },
          '60%':  { transform: 'scale(0.9) rotate(-7deg)',  opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-8deg)',    opacity: '1' },
        },
        'score-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.15)' },
          '70%':  { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { 'text-shadow': '0 0 20px rgba(124, 58, 237, 0.4)' },
          '50%':      { 'text-shadow': '0 0 40px rgba(124, 58, 237, 0.8), 0 0 80px rgba(124, 58, 237, 0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
