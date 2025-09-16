import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }]
      ]
    }),
    react()
  ],
  build: { outDir: 'dist', sourcemap: false },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
