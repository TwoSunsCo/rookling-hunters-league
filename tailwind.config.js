/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          800: '#1E2D2F',
          900: '#162024',
        }
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};