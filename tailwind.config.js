import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#345ceb",
        "dark-primary": "#b8c4ff",
        "primary-container": "#dde1ff",
        "dark-primary-container": "#818ec8",
        "secondary": "#c334eb",
        "dark-secondary": "#d748ea",
        "accent": "#eb345c",
        "dark-accent": "#ef476c"
      },
      screens: {
        "xs": "360px",
        "s": "420px",
        "xs-md": "500px",
        ...defaultTheme.screens,
        "3xl": "1650px"
      }
    }
  },
  plugins: []
}
