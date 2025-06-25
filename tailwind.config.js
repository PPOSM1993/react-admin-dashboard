module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1rem',
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide') // instala con: npm i tailwind-scrollbar-hide

  ],
}
