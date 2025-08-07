import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{svelte,js}'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'new-amsterdam': ['New Amsterdam', 'sans-serif'],
      },
      colors: {
        dark: colors.stone[950],
        bright: colors.orange[100],
        accent1: {
          DEFAULT: colors.red[950],
          hover: colors.red[900]
        },
        accent2: colors.amber[600],
        accent3: '#60682E',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

