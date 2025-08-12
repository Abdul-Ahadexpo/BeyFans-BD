/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
      bungee: ['"Bungee"', 'sans-serif'],
        carter: ['"Carter One"', 'cursive'],
        changa: ['"Changa One"', 'sans-serif'],
        lilita: ['"Lilita One"', 'sans-serif'],
        passion: ['"Passion One"', 'sans-serif'],
        poetsen: ['"Poetsen One"', 'sans-serif'],
      },
    }
  },
  plugins: [],
};
