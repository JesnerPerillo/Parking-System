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
    },
  },
  plugins: [],
}
