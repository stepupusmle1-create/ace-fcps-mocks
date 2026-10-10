import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0c1f1f",
          400: "#6b7280",
          500: "#4b5563",
        },
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bfe5cf",
          300: "#8fd0ac",
          400: "#5aab80",
          500: "#3f9a6e",
          600: "#1f6b4f",
          700: "#0f5a42",
          800: "#064e3b",
          900: "#053d2e",
          950: "#04382b",
        },
        gold: {
          50: "#fffbeb",
          100: "#fdf0dc",
          200: "#f3d48a",
          300: "#f5cf62",
          400: "#e6a83c",
          500: "#e08a2e",
          600: "#c97a2b",
          700: "#9a5a1a",
        },
        mint: {
          DEFAULT: "#f0fdf4",
          2: "#dcfce7",
          grey: "#f8fafb",
          line: "#e5ece8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 8px 0 0 #dff3e7",
        premium: "0 14px 0 0 #e9b56a, 0 30px 60px -30px rgb(6 78 59 / 0.4)",
        glow: "0 0 0 1px rgb(224 138 46 / 0.2), 0 12px 28px -10px rgb(224 138 46 / 0.45)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(rgba(6,78,59,0.09) 1.2px, transparent 1.2px)",
      },
    },
  },
  plugins: [],
};

export default config;
