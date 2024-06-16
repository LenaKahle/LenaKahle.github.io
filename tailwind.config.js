import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{svelte,js}'],
  darkMode: false,
  theme: {
    fontFamily: {
      'sans': ['Montserrat'],
    },
    extend: {
      colors: {
        secondary: {
          DEFAULT: colors.neutral[300],
          hover: colors.neutral[200],
          text: colors.neutral[700],
          'text-light': colors.neutral[600],
          'text-dark': colors.neutral[800],
          dark: colors.neutral[800],
          'dark-hover': colors.neutral[900],
          light: colors.neutral[100],
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

