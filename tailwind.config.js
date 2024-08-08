/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  fontFamily: {
    sans: ["Inter", ...defaultTheme.fontFamily.sans],
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
