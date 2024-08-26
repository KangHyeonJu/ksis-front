/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      weight: {
        75: "15rem",
      },
      height: {
        75: "18rem",
        128: "32rem",
        140: "35rem",
      },
    },
  },
  plugins: [],
};
