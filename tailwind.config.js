/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Add flashy neon green and orange
        'neon-green': '#39FF14',
        'neon-orange': '#FF5F1F',
        // Add soothing pista green
        'pista': {
          100: '#E8F5E9',
          200: '#C8E6C9',
          300: '#A5D6A7',
          400: '#81C784',
          500: '#66BB6A',
          600: '#4CAF50',
        },
        // Navy colors for dark theme
        'navy': {
          600: '#1e3a5a',
          700: '#1a2e44',
          800: '#162238',
          900: '#0f172a',
        }
      },
      boxShadow: {
        'neon-green': '0 0 5px #39FF14, 0 0 10px #39FF14',
        'neon-orange': '0 0 5px #FF5F1F, 0 0 10px #FF5F1F',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px #39FF14, 0 0 10px #39FF14' },
          '50%': { boxShadow: '0 0 15px #39FF14, 0 0 20px #39FF14' },
        }
      },
      backgroundColor: {
        'body': '#39FF14',
      }
    },
  },
  plugins: [],
}