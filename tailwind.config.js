/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFF9F5',
          100: '#F5EDE6',
          200: '#EDE0D8',
          300: '#E8D5CF',
          400: '#D8B7AE',
          500: '#C49B8F',
          600: '#A87A6C',
          700: '#8A5D52',
          800: '#6B4239',
          900: '#3A2E2A',
        },
        warm: {
          50: '#FEFCFA',
          100: '#FDF6F0',
          200: '#F9EBE2',
          300: '#F3D8CA',
          400: '#E9C0AD',
          500: '#D9A08B',
          600: '#C27D63',
          700: '#A35D43',
          800: '#7D4131',
          900: '#59291F',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(58, 46, 42, 0.08)',
        'warm-lg': '0 8px 40px rgba(58, 46, 42, 0.12)',
        'warm-xl': '0 16px 60px rgba(58, 46, 42, 0.16)',
        'inner-warm': 'inset 0 2px 8px rgba(58, 46, 42, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
