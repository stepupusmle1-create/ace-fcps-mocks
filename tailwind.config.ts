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
          DEFAULT: "#0f172a",
          400: "#64748b",
          500: "#475569",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          400: "#818cf8",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        gold: {
          50: "#fdf8ec",
          100: "#f8ecc9",
          200: "#f0da93",
          300: "#e9cf7a",
          400: "#dfc05a",
          500: "#c9a227",
          600: "#a6841f",
          700: "#7a6117",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 4px 16px -4px rgb(15 23 42 / 0.12)",
        premium: "0 24px 48px -16px rgb(15 23 42 / 0.22), 0 2px 8px -2px rgb(15 23 42 / 0.08)",
        glow: "0 0 0 1px rgb(199 162 39 / 0.18), 0 12px 28px -10px rgb(199 162 39 / 0.4)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(1100px circle at 15% -10%, rgb(79 70 229 / 0.10), transparent 55%), radial-gradient(900px circle at 100% 0%, rgb(201 162 39 / 0.10), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
