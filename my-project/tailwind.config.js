/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'serif'],
      },
      height: {
        '9/10': '90%',
      },
      width: {
        '9/10': '90%',
      },
      scale: {
        '300': '3.0'
      },
      screens: {
        'xl': '1440px',
      },
    },
  },
  plugins: [],
}
