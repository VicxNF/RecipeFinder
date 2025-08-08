const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-playfair)', ...fontFamily.serif],
      },
      colors: {
        'accent': '#F97316',       // Naranja vibrante para acentos
        'accent-hover': '#EA580C', // Naranja más oscuro para hover
        'surface': '#1f2937', 
      },
    },
  },
  // ...
}