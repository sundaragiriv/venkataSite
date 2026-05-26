# Architect Zero / venkata.info — Roadmap & Open Work

Internal reference for what's deferred, what needs operator action, and the
order things should be picked up. Not user-facing.

Last updated: 2026-05-26 — at end of the pre-launch push (branch
`feat/auth-foundation`).

---

## Operator action items before merging to `main`

These are things the code can't do for you — they need to happen in the
Supabase dashboard, GitHub, or YouTube before / right after going live.

| # | Action | Where | Why |
|---|---|---|---|
| 1 | Apply migration `supabase/migrations/0004_newsletter.sql` | Supabase → SQL editor | Newsletter form will fail without the table |
| 2 | Apply migration `supabase/migrations/0005_contact.sql` | Supabase → SQL editor | Contact form will fail without the table |
| 3 | Confirm YouTube channel handle is `@architectzero` (or sweep a different handle through code) | YouTube Studio | Currently hardcoded in 4 spots: BrandFooter, ContactSection, BuildingSection, SocialIcons |
| 4 | Confirm X / Twitter handle is `@architectzero` (or tell Claude the actual handle) | x.com | Currently `https://x.com/architectzero` in SocialIcons + ContactSection |
| 5 | Smoke-test signup → dashboard → progress flow on `feat/auth-foundation` | `npm run dev` | Make sure migrations + auth work end-to-end before going live |
| 6 | Smoke-test newsletter form (submit your own email, check `newsletter_subscribers` table) | local + Supabase | Verify RLS policy works for anon insert |
| 7 | Smoke-test contact form (submit a test message, check `contact_messages` table) | local + Supabase | Same as above |
| 8 | Merge `feat/auth-foundation` → `main` and watch GH Actions deploy | GitHub | Triggers gh-pages publish, custom domain stays live |
| 9 | Verify https://venkata.info/ and https://venkata.info/architect-zero/ load post-deploy | Browser | Quick visual smoke |
| 10 | Install PWA on your phone (Safari Share → Add to Home Screen, or Chrome menu → Install app) | Phone | Sanity check the install flow |
| 11 | Add `venkata.info` property in Google Search Console; submit `sitemap-index.xml` | search.google.com/search-console | First SEO signal to Google |
| 12 | Run PageSpeed Insights on `/` and `/architect-zero/` | pagespeed.web.dev | Baseline performance score |

---

## Deferred features — pending, in priority order

### Phase 7.4 — Lesson comments  ← next up

Threaded one-level comments on each lesson page. Comments table + RLS already
defined in `supabase/migrations/0001_init.sql` and `0002_rls.sql` (triggers
enforce depth limit + 5-min edit window + soft-delete + flag count).

Still to build:
- Comment composer + thread view on `[lesson].astro`
- Report button + flag flow
- Basic keyword spam filter (client-side blocklist + DB trigger)
- Moderation queue in Supabase dashboard (no in-app moderator UI yet)
- Notification when someone replies to your comment (deferred — needs email
  service or in-app inbox)

Estimated: ~700 LOC, 2-3 commits.

### YouTube embed scaffolding  ← do once first video URL exists

- Add `youtubeId?` optional field to `src/content/config.ts` lesson schema
- Render an embed at the top of the lesson page when present
- Optional `/architect-zero/videos/` index listing all lessons that have
  videos
- ~80 LOC. Skip until the first real episode is recorded so the
  implementation choices (timestamps? chapters? auto-advance?) are informed
  by actual recordings.

### Static FAQ page  ← user writes copy, Claude scaffolds

- `/faq/` page using BrandLayout
- ~15 questions covering both Venkata.info and Architect Zero common asks
- Operator writes the Q&A copy; Claude wires the page
- ~150 LOC of layout + content slots

### Phase 7.3 — Leaderboard  ← waits for users

- `/architect-zero/leaderboard/` page
- View `public.leaderboard` already defined in
  `supabase/migrations/0003_leaderboard_view.sql` — anonymizes opt-out
  users, limit 100, ordered by readiness % then XP
- Account page already has opt-in toggle (off by default)
- Skip until there are real users to populate it. Empty leaderboard reads
  as "dead product."
- Estimated: ~400 LOC.

### Community Q&A v1  ← needs ~500 user signups

- Three-phase roadmap planned:
  - Phase 1 (~500 users): operator-curated FAQ — submit Q via contact form,
    Venkata answers + publishes to FAQ
  - Phase 2 (~1K users): community can submit Q's directly, moderation
    queue
  - Phase 3 (~1K+ active): community answers + voting + accepted-answer
    (real Stack Overflow-style)
- Don't skip phases. Empty Q&A is worse than no Q&A.

### Architecture for series #2  ← when series #2 actually starts

When you launch a second certification series (AWS / Azure / SAP / etc.):
- Add a top-level `SERIES` map alongside the existing `DOMAINS` array in
  `src/lib/domains.ts`
- URL structure shifts: `/architect-zero/learn/d0/` →
  `/architect-zero/cca/d0/`, with `/architect-zero/aws/d1/` for series #2
- Decide whether localStorage progress is global (`az_xp` covers all
  series) or per-series nested (`az_cca_xp`, `az_aws_xp`)
- `/architect-zero/` becomes a series picker / platform home, not the CCA
  dashboard directly
- Premature to do now. Refactor when series #2 content is being designed.

---

## Polish / future improvements

### OG image — landscape, not portrait

Currently `og:image` and `twitter:image` point at `/Avatar.jpeg`, a portrait
3:4 crop intended for the hero frame. Social platforms (Facebook, LinkedIn,
Slack, Discord) prefer 1200×630 landscape. They'll crop the portrait, but
the result is suboptimal.

When ready: create a 1200×630 PNG with the Architect Zero logo + tagline,
save as `public/og-default.png`, update `src/components/SeoMeta.astro`
default from `/Avatar.jpeg` to `/og-default.png`.

### Native iOS / Android wrappers

The PWA we shipped is the mobile app. Going native (Capacitor / React
Native) is a real engineering cost (4-8 weeks) and a real ongoing burden
(App Store review delays, version fragmentation, native bug surface).

Honest threshold to revisit: when users are actively asking "is there an
iOS app?" — which means real demand, not hypothetical. Until then, the
"Install on phone" instructions in the InstallSection cover the gap.

### History scrub — anon key in git

Supabase anon key was committed to `.env.example` in commit `5d9573d0`
(Codex's Phase 7.0). Anon keys are designed to be public (the SDK ships
them in the client bundle; Row Level Security on the DB is the actual
gate). So this is cosmetic, not a security incident. Only worth scrubbing
if you ever want to make the repo public and have a clean history.

To scrub: `git filter-repo --replace-text` with the key replaced by a
placeholder.

### Q&A v2 — community answers + voting

After the curated-FAQ phase stabilizes and there's enough question volume,
add community answers with upvote/downvote, accepted-answer logic, and
basic reputation. This is the version of "ask a question that publishes to
FAQ" the operator originally described — but it earns its way in based on
real usage, not built upfront.

---

## Operational notes

### Deploy pipeline

- Branch `main` → push triggers `.github/workflows/deploy.yml`
- Builds Astro (`npm run build`) on Node 20
- Copies `dist/*` to a fresh `gh-pages` branch
- Writes `dist/CNAME = venkata.info` for the custom domain
- GH Pages serves from `gh-pages` branch via Cloudflare HTTPS
- Total deploy time: ~90-150 seconds

Env vars in deploy: `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
must be set as GitHub Actions secrets on the repo. They're inlined into
the static build at compile time.

### Applying Supabase migrations

Two paths:
1. **Manual (current approach):** open the `.sql` files in
   `supabase/migrations/`, copy/paste into Supabase Dashboard → SQL Editor,
   run. Order matters: 0001 → 0002 → 0003 → 0004 → 0005.
2. **Supabase CLI (recommended once you commit to it):** `supabase login`,
   `supabase link --project-ref <ref>`, `supabase db push` — applies all
   pending migrations in order, tracks state via the `supabase_migrations`
   schema.

### Where things live

- Brand site source: `src/pages/index.astro` + `src/components/brand/*`
- Architect Zero app source: `src/pages/architect-zero/*`
- Auth pages: `src/pages/architect-zero/auth/*`
- Layouts: `src/layouts/{BrandLayout,BaseLayout,AuthLayout}.astro`
- Shared components: `src/components/{SeoMeta,SocialIcons,AzFooter}.astro`
- Auth + sync logic: `src/lib/{supabase,auth,progress,database.types}.ts`
- Per-domain content: `src/lib/domains.ts` (canonical), `src/content/lessons/{d0..d6}/*.md`
- Supabase schema: `supabase/migrations/000X_*.sql`
- PWA config: `astro.config.mjs` (VitePWA plugin)
- Deploy: `.github/workflows/deploy.yml`

---

## Branch state

`feat/auth-foundation` is currently 17 commits ahead of `main`. The full
commit log of what's about to ship:

```
d7e48cae feat: contact form, az footer, social icons, drop gmail mailto
ba5799ec feat(seo): centralized SeoMeta component + per-page meta + JSON-LD
fe83a4b4 feat(az): platform header band + REC indicator on dashboard
cea4a4b1 feat(newsletter): supabase-backed signup form in footer
f25e9e23 feat(brand): footer rebrand, privacy + terms pages, pwa install card
a532ff63 fix(brand): recalibrate ambient field to support terminal avatar
9182f987 feat(brand): avatar treatment — disconnected-terminal + old-photo
ed8b6e13 feat(brand): wire real avatar photo into hero frame
ceb6df9e feat(brand): hero copy refresh + Space Grotesk on body paragraph only
f2c35dbb brand: reposition Architect Zero as LMS platform, retire The Quantum Learn
737eb39a chore(brand): unify "CCA Study App" naming under "Architect Zero"
ec794d9d feat(sync): cloud sync of az_* localStorage to supabase
297ec952 chore(brand): remove custom cursor on homepage
a7cdfde2 fix(auth): re-run gate on view transitions to prevent infinite "loading"
8018290b feat(auth): client-side gate + sign-in/up/account/reset pages
7ef2878b style: blue brand palette, umbrella nav, typography alignment
ebaa4c68 style: re-palette to indigo + violet brand, soften az cyan
5d9573d0 feat(auth): supabase client + smoke test
7b8f3c1a feat(db): supabase schema, rls, triggers, leaderboard view
```

(That's 19 commits; squash-merge if you want a tidy main log, or merge
commit if you prefer to preserve the history.)
