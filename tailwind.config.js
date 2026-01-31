/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ scan everything in src
  ],
  theme: {
    extend: {
      colors: {
        "shop-green": "#4E8F5A",
        "shop-green-light": "#6FBF8E",
        "shop-blue": "#1F4E79",
        "shop-blue-dark": "#163A5F",
        "shop-bg": "#F4F6F8",
        "shop-gray": "#6B7280",
      },
    },
  },
  plugins: [],
};
