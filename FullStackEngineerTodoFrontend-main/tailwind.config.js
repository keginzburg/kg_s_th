module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        'mplus': ['"M PLUS Rounded 1c"', 'sans-serif'],
        'marmelad': ['Marmelad', 'sans-serif'],
        'pacifico': ['Pacifico', 'sans-serif']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}