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
        280: "83.5rem",

        "1/12": "8.333333%",
        "11/12": "91.666667%",
      },
      keyframes: {
        flow: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        flow: "flow 20s linear infinite",
      },
    },
  },
  plugins: [],
};
