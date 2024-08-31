import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{svelte,js}'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Georgia', 'serif'], // Set Georgia as the default serif font
        'new-amsterdam': ['New Amsterdam', 'sans-serif'], // Adding New Amsterdam as a custom font
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

