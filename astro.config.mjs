import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  site: 'https://venkata.info',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Architect Zero',
          short_name: 'Architect Zero',
          description: 'Architect Zero — an LMS platform for technical certifications. First series: Claude Certified Architect (CCA) exam prep.',
          theme_color: '#04040a',
          background_color: '#04040a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/architect-zero/',
          scope: '/architect-zero/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          navigateFallback: null,
          globPatterns: ['**/*.{js,css,html,svg,png,ico,txt,json}'],
          manifestTransforms: [
            async (entries) => ({
              manifest: entries.filter(({ url }) =>
                url.startsWith('architect-zero/')
                || url.startsWith('icons/')
                || url === 'manifest.webmanifest'
              ),
              warnings: [],
            }),
          ],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
              handler: 'NetworkOnly',
            },
          ],
        },
      }),
    ],
  },
});
