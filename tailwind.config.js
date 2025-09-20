/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'], // MUY importante incluir .html y .ts
  theme: {
    extend: {},
    // Asegura breakpoints por defecto:
    screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px' },
  },
  plugins: [],
};