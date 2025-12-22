/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./examples/src/**/*.{ts,tsx}"],
  // Note: In Tailwind v4, theme customization is done in CSS using @theme blocks
  // See src/index.css and examples/src/index.css for custom theme values
};
