/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Architect Zero Brand System
        az: {
          black:    '#04040a',
          deep:     '#07070f',
          surface:  '#0d0d1c',
          card:     '#111125',
          border:   '#1a1a30',
          muted:    '#35355a',
          subtle:   '#6a6a9a',
          text:     '#dde1f0',
          white:    '#ffffff',
          // Brand colours
          electric: '#00e5ff',
          signal:   '#ff3d71',
          gold:     '#ffd60a',
          green:    '#00f593',
          indigo:   '#6366f1',
          purple:   '#8b5cf6',
          amber:    '#f59e0b',
          red:      '#ef4444',
          cyan:     '#06b6d4',
        },
        // Domain colours
        domain: {
          d0: '#06b6d4',
          d1: '#6366f1',
          d2: '#8b5cf6',
          d3: '#10b981',
          d4: '#f59e0b',
          d5: '#ef4444',
          d6: '#00e5ff',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up':     'fadeUp 0.5s ease forwards',
        'scan':        'scan 3s linear infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        scan: {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 8px #00e5ff44' },
          '50%':     { boxShadow: '0 0 20px #00e5ff88' },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(#1a1a30 1px, transparent 1px),
          linear-gradient(90deg, #1a1a30 1px, transparent 1px)
        `,
        'az-gradient': 'linear-gradient(135deg, #04040a 0%, #07070f 50%, #0d0d1c 100%)',
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
      boxShadow: {
        'electric': '0 0 20px #00e5ff33',
        'signal':   '0 0 20px #ff3d7133',
        'gold':     '0 0 20px #ffd60a33',
      },
    },
  },
  plugins: [],
};
