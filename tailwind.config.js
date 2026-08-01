/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        bone: "#ffffff",
        gold: "#d4af37",
        cream: "#F1EBE1",
        surface: "#f5f5f5",
        carbon: "#111111",
        mist: "#e0e0e0",
        edge: "#2a2a2a",
        sale: "#A8341F",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Manrope"', "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
      },
      maxWidth: { shell: "1280px" },
      borderRadius: {
        DEFAULT: "10px",
        card: "10px",
        sm: "10px",
        md: "10px",
        lg: "10px",
        xl: "10px",
        "2xl": "10px",
        "3xl": "10px",
      },
    },
  },
  plugins: [],
};
