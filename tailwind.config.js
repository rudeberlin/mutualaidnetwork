/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f7f8fa',
          100: '#eff2f5',
          200: '#d5dce4',
          300: '#aab5c7',
          400: '#7a8a9f',
          500: '#536278',
          600: '#3f4a5e',
          700: '#2d3447',
          800: '#1a1f2e',
          900: '#0f1219',
        },
        gold: {
          50: '#fefdf7',
          100: '#fdf9eb',
          200: '#fbf1d1',
          300: '#f7e5a5',
          400: '#f1d66f',
          500: '#e8bf3c',
          600: '#d4a825',
          700: '#b28f1f',
          800: '#8a6d1a',
          900: '#6d5715',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(232, 191, 60, 0.15)',
        'glow-lg': '0 0 40px rgba(232, 191, 60, 0.25)',
        'glow-xl': '0 0 60px rgba(232, 191, 60, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
