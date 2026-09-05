/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js",
    "./core/**/*.py",
    "./blog/**/*.py",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#10b981',
          secondary: '#14b8a6',
          accent: '#84cc16',
        }
      }
    },
  },
  plugins: [],
}
