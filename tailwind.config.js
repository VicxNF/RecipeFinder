const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)', ...fontFamily.sans],
        serif: ['var(--font-playfair)', ...fontFamily.serif],
      },
      colors: {
        'accent': '#F97316', // Naranja
        'accent-hover': '#EA580C', // Naranja más oscuro
      },
    },
  },
  // ...
}