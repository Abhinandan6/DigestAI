/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#1a2e4c',
          800: '#162241',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
}