# AI Vibe Lab Web

Next.js App Router implementation for the ADR-003 GitHub/MDX content workflow. The legacy root Astro app remains transition/reference material while this app is the current Vercel target under `apps/web/`.

## Scripts

- `npm run dev` ? local dev server
- `npm run test` ? content loader/frontmatter/public-exclusion tests
- `npm run format` ? Prettier check
- `npm run lint` ? ESLint
- `npm run typecheck` ? TypeScript only
- `npm run build` ? production build

## Current phase

Phase 2/7 local MVP is implemented:

- GitHub-backed MDX posts live in `content/posts/<slug>/index.mdx`.
- `src/lib/content/posts.ts` validates frontmatter, slug matching, safe body HTML, and published-only exposure.
- `/posts`, `/posts/[slug]`, taxonomy pages, sitemap, and RSS use the MDX loader.
- `draft`, `scheduled`, and `archived` posts are excluded from public collections.
- About, Privacy, Contact, `/ads.txt`, and disabled-by-default `AdSlot` are ready for AdSense review.

Supabase/Auth/Admin CMS/Tiptap are not part of the current MVP and should not be reintroduced without a new ADR.
