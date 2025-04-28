/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#de00ff",

          secondary: "#00bcff",

          accent: "#0084b9",
          neutral: "#030905",
          "base-100": "#2c1c24",
          info: "#00c8e5",
          success: "#00ea8d",
          warning: "#c11900",
          error: "#f84a53",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
