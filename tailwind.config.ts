import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050308",
        surface: "#0D0A14",
        panel: "#120D1E",
        line: "rgba(168, 130, 255, 0.14)",
        violet: {
          50: "#F4EEFF",
          200: "#D9C4FF",
          400: "#B389FF",
          500: "#9B5CFF",
          600: "#8237FF",
          700: "#6620D6",
          900: "#2A0E63",
        },
        mag: "#FF4FD8",
        cyan: "#4FE3FF",
        ink: {
          100: "#F1EEFA",
          300: "#B9B0D1",
          500: "#7C7396",
          700: "#453D5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(155, 92, 255, 0.35)",
        "glow-sm": "0 0 18px rgba(155, 92, 255, 0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(155,92,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(155,92,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
