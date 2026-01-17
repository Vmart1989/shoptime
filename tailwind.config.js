/** @type {import('tailwindcss').Config} */
// Configuración de Tailwind con los colores de ShopTime
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F4E79",     // Azul ShopTime
        primaryLight: "#3A6EA5",
        accent: "#1EC773",      // Verde ShopTime
        background: "#F5F7FA",
      },
    },
  },
  plugins: [],
};
