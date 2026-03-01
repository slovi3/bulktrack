/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        panel: "#121826",
        border: "rgba(255,255,255,0.08)",
        neon: "#39FF14",
        violet: "#A855F7",
      },
      boxShadow: {
        glow: "0 0 18px rgba(57,255,20,0.25)",
        glowV: "0 0 18px rgba(168,85,247,0.25)",
      },
    },
  },
  plugins: [],
};

