import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" } },
    extend: {
      maxWidth: { wrap: "1200px", prose: "72ch" },
      colors: {
        brand: {
          DEFAULT: "#0070F2",
          light: "#4DB1FF",
          ink: "#0F172A"
        }
      },
      boxShadow: { soft: "0 10px 30px rgba(2, 6, 23, 0.08)" },
      keyframes: {
        gradientShift: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } }
      },
      animation: { gradient: "gradientShift 14s ease infinite" }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;