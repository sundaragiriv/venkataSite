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
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Space Mono', 'JetBrains Mono', 'Courier New', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Space Mono', 'JetBrains Mono', 'monospace']
    },
    extend: {
      maxWidth: { wrap: "1120px", wrapWide: "1280px", prose: "72ch" },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "20px",
        xl: "40px",
        strong: "40px"
      },
      colors: {
        brand: {
          DEFAULT: "#00ff41",
          50: "#f0fff4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#33ff66",
          500: "#00ff41",
          600: "#00e639",
          700: "#00cc33",
          800: "#00b32d",
          900: "#009926",
          light: "#33ff66",
          ink: "#ffffff"
        },
        dark: {
          primary: "#000000",
          secondary: "#0a0a0a",
          tertiary: "#1a1a1a",
          card: "#111111"
        },
        text: {
          primary: "#ffffff",
          secondary: "#e5e5e5",
          muted: "#b0b0b0",
          accent: "#00ff41"
        },
        success: "#00ff41",
        warning: "#ffaa00",
        info: "#00ff41",
        vedic: "#00ff41"
      },
      boxShadow: { 
        soft: "0 2px 4px rgba(0, 0, 0, 0.5)",
        lift: "0 8px 16px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(0, 255, 65, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 255, 65, 0.4)",
        "card-hover": "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 65, 0.1)"
      },
      keyframes: {
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { "0%": { opacity: "0", transform: "translateX(-30px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideInRight: { "0%": { opacity: "0", transform: "translateX(30px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.8" } }
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out",
        slideInLeft: "slideInLeft 0.8s ease-out",
        slideInRight: "slideInRight 0.8s ease-out",
        float: "float 6s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;