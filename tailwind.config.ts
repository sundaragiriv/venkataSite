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
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0070F2",
          600: "#0056cc",
          700: "#003d99",
          900: "#1e3a8a",
          light: "#4DB1FF",
          ink: "#0F172A"
        },
        success: "#10b981",
        warning: "#f59e0b",
        info: "#3b82f6",
        vedic: "#d97706"
      },
      boxShadow: { 
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        lift: "0 12px 32px rgba(2,6,23,.12)",
        glow: "0 0 20px rgba(0, 112, 242, 0.15)",
        "glow-lg": "0 0 40px rgba(0, 112, 242, 0.2)"
      },
      keyframes: {
        gradientShift: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        floatSlow: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        pulseTag: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.06)" } },
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        glow: { "0%, 100%": { boxShadow: "0 0 20px rgba(0, 112, 242, 0.15)" }, "50%": { boxShadow: "0 0 30px rgba(0, 112, 242, 0.25)" } }
      },
      animation: {
        gradient: "gradientShift 18s ease infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        pulseTag: "pulseTag 2.6s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.6s ease-out",
        glow: "glow 3s ease-in-out infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;