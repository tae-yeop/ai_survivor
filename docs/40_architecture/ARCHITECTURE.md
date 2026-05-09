# Architecture

Status: Active
Owner: Solo operator
Last Updated: 2026-05-09
Decision Source: `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`, `docs/60_decisions/ADR-004-github-backed-admin-editor.md`

## 1. Architecture Summary

AI 시대 생존기는 **Next.js App Router + Git-backed MDX**로 만든 공개 블로그다.

The source of truth for post content is repository files under `apps/web/content/posts/<slug>/index.mdx`. Public pages read those files at build time and serve SEO-friendly pages. Owner writing/editing is available through a GitHub-backed admin editor that saves content with the GitHub Contents API.

Supabase Auth, Supabase Postgres, Supabase Storage, and a DB-backed CMS are deferred ADR-002 material. Do not make them required for the active launch path without a new ADR.

## 2. Locked Values

| Area              | Decision                                                                              |
| ----------------- | ------------------------------------------------------------------------------------- |
| Product name      | `AI 시대 생존기 / AI Survivor`                                                        |
| Production domain | Not purchased yet; use actual Vercel production URL until custom domain               |
| Active app        | `apps/web/`                                                                           |
| Content source    | Git-tracked MDX files                                                                 |
| Post location     | `apps/web/content/posts/<slug>/index.mdx`                                             |
| Deployment        | Vercel project rooted at `apps/web`                                                   |
| Database          | None for the active MVP                                                               |
| Admin auth        | GitHub OAuth + signed owner session                                                   |
| Admin writes      | GitHub Contents API                                                                   |
| Media             | small images in GitHub/public assets; large media deferred to R2/Vercel Blob decision |

## 3. Design Principles

- Public pages should be readable by crawlers without client-side rendering dependencies.
- Content must be reviewable as plain repository files.
- Draft, scheduled, and archived posts must not appear in public lists, detail pages, taxonomy pages, RSS, or sitemap output.
- Metadata for SEO, Open Graph, RSS, JSON-LD, and taxonomy pages comes from frontmatter.
- The build should fail loudly for malformed content rather than silently publishing bad pages.
- AdSense infrastructure must be safe before approval: disabled by default, policy pages present, and `ads.txt` valid only when a publisher id exists.
- Admin/editor code must stay behind owner session checks. See `EDITOR_BOUNDARIES.md`.

## 4. Repository Shape

```text
apps/
  web/
    app/
      (public)/
        page.tsx
        posts/
        categories/
        tags/
        series/
        tools/
        resources/
        about/
        contact/
        privacy/
        write/
      (admin)/
        admin/
      api/admin/
      rss.xml/route.ts
      ads.txt/route.ts
      robots.ts
      sitemap.ts
    content/
      posts/<slug>/index.mdx
    public/images/og/default.svg
    src/
      components/
        admin/
        ads/
        mdx/
        monetization/
      lib/
        admin/
        content/
        seo/
    next.config.ts
    package.json
src/                      # legacy Astro app, retained as transition/reference material
docs/
```

The active deploy target is `apps/web`. The root Astro app can still build, but it is not the active production target.

## 5. Content Model

Each post lives at:

```text
apps/web/content/posts/<slug>/index.mdx
```

Public rendering uses frontmatter fields such as title, description, status, publishedAt, updatedAt, category, tags, series, tools, and cover image. Only published posts whose date is not in the future should appear in public indexes, RSS, and sitemap.

## 6. Admin Model

Admin writing has two entry points:

- `/admin` and `/admin/posts/*`: protected admin shell.
- `/write`: protected quick writing route.
- public post in-place edit: public page entry point that still loads/saves through protected server actions.

Required server-only env:

- `ADMIN_GITHUB_LOGIN`
- `ADMIN_GITHUB_ID` optional
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ADMIN_SESSION_SECRET`
- `GITHUB_CONTENT_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

## 7. SEO / Monetization Model

- `src/lib/site.ts` resolves canonical base URL from `NEXT_PUBLIC_SITE_URL`, Vercel env, or localhost fallback.
- `app/sitemap.ts`, `app/robots.ts`, and `app/rss.xml/route.ts` derive public URLs from the same base.
- `AdSlot` is disabled unless `ADS_ENABLED=true`, `ADSENSE_CLIENT` is present, and a slot id is provided.
- `AffiliateLink`, `ProductCard`, and `DisclosureBox` centralize monetized link disclosure and rel policy.
- Baseline security headers are configured in `next.config.ts`.
