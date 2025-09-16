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
      maxWidth: { wrap: "1120px", wrapWide: "1280px", prose: "72ch" },
      colors: {
        brand: {
          DEFAULT: "#0070F2",
          light: "#4DB1FF",
          ink: "#0F172A"
        }
      },
      boxShadow: { soft: "0 10px 30px rgba(2, 6, 23, 0.08)" },
      keyframes: {
        gradientShift: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        floatSlow: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        pulseTag: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.06)" } }
      },
      animation: {
        gradient: "gradientShift 18s ease infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        pulseTag: "pulseTag 2.6s ease-in-out infinite"
      },
      boxShadow: { soft: "0 10px 30px rgba(2, 6, 23, 0.08)", lift: "0 12px 32px rgba(2,6,23,.12)" }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;