import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#345ceb",
        "on-primary": "#ffffff",
        "primary-container": "#dde1ff",
        "on-primary-container": "",
        secondary: "#c334eb",
        accent: "#eb345c"
      },
      screens: {
        xs: "360px",
        s: "420px",
        ...defaultTheme.screens,
        "3xl": "1650px"
      }
    }
  },
  plugins: []
}
