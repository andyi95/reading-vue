/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
  theme: {
    extend: {
      fontSize: {
        sxl: ['2.5rem', '1.75rem'],
      },
    },
  },
  plugins: [],
}

