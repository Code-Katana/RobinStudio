/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
    "./renderer/**/*.{js,ts,jsx,tsx}", // If you have a `renderer` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
