/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#232340',
          600: '#2d2d52',
          500: '#3a3a6e',
        },
        gold: {
          DEFAULT: '#f5a623',
          light: '#f7c469',
          dark: '#d48817',
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f3d99e',
          300: '#eec56d',
          400: '#f5a623',
          500: '#d48817',
          600: '#a96a10',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(245,166,35,0)' },
        },
      },
    },
  },
  plugins: [],
};
