/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
 theme: {
  extend: {
    colors: {
      primary: "#4F8CFF",
      soft: "#F3F7FF",
      muted: "#6B7280",
    },
    borderRadius: {
      xl: "1rem",
      "2xl": "1.25rem",
      "3xl": "1.75rem",
    },
    boxShadow: {
      soft: "0 10px 25px rgba(79,140,255,0.08)",
    },
  },
},

  plugins: [],
}
