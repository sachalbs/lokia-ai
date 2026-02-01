import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark mode palette
        dark: {
          bg: "#0a0f1a",
          sidebar: "#0d1424",
          card: "#111827",
          accent: "#3b82f6",
          border: "#1e293b",
          text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
            muted: "#64748b",
          },
        },
        // Light mode palette
        light: {
          bg: "#f0f9ff",
          sidebar: "#e0f2fe",
          card: "#ffffff",
          accent: "#0ea5e9",
          border: "#bae6fd",
          text: {
            primary: "#0f172a",
            secondary: "#475569",
            muted: "#94a3b8",
          },
        },
        // Accent colors
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "typing": "typing 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "glow": "0 0 20px rgba(59, 130, 246, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
