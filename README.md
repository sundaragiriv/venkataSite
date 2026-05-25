# Venkata.Info

Single Astro site for the Venkata.Info brand and Architect Zero.

## Routes

- `/` - Venkata brand homepage, built from Astro components in `src/components/brand/`.
- `/architect-zero/*` - Architect Zero CCA study app, migrated from the donor Astro app.

## Stack

- Astro 4
- Astro content collections for Architect Zero lessons, quiz data, and flashcards
- React islands available through `@astrojs/react`
- Tailwind integration installed for compatibility, with AZ pages primarily using scoped CSS
- `vite-plugin-pwa` scoped to `/architect-zero/`
- `@astrojs/sitemap` for sitemap generation

## Source Layout

- `src/pages/index.astro` - brand homepage entry
- `src/layouts/BrandLayout.astro` - brand shell and inline interaction script
- `src/components/brand/` - brand homepage sections
- `src/pages/architect-zero/` - Architect Zero app routes
- `src/layouts/BaseLayout.astro` - Architect Zero app shell
- `src/content/` - Architect Zero content collections
- `public/architect-zero/content/` - runtime quiz and flashcard JSON used by client-side pages

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

GitHub Actions builds Astro to `dist/` and publishes to GitHub Pages with `venkata.info` as the custom domain. Do not merge `astro-rewrite` into `main` until cutover review is complete.
