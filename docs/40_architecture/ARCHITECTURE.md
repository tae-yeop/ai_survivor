# Architecture

Status: Active
Owner: Solo operator
Last Updated: 2026-05-06
Decision Source: `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`

## 1. Architecture Summary

AI Vibe Lab is a public blog built with **Next.js App Router + Git-backed MDX**.

The current source of truth for post content is repository files under `apps/web/content/posts/<slug>/index.mdx`. The operator writes, reviews, and publishes posts through Git commits or pull requests. The deployed site reads those files at build time and serves static, SEO-friendly public pages.

Supabase Auth, Supabase Postgres, Supabase Storage, Tiptap, and a browser `/admin` CMS are deferred ADR-002 material. Do not implement them, add required environment variables for them, or expose admin routes without a new ADR.

## 2. Locked Values

| Area                  | Decision                                  |
| --------------------- | ----------------------------------------- |
| Product name          | `AI Vibe Lab`                             |
| Production domain     | `aivibelab.com`                           |
| Active app            | `apps/web/`                               |
| Content source        | Git-tracked MDX files                     |
| Post location         | `apps/web/content/posts/<slug>/index.mdx` |
| Deployment            | Vercel project rooted at `apps/web`       |
| Database/Auth/Storage | None for the active MVP                   |
| Active CMS            | GitHub pull request workflow              |

## 3. Design Principles

- Public pages should be readable by crawlers without client-side rendering dependencies.
- Content must be reviewable as plain repository files.
- Draft, scheduled, and archived posts must not appear in public lists, detail pages, taxonomy pages, RSS, or sitemap output.
- Metadata for SEO, Open Graph, RSS, JSON-LD, and taxonomy pages comes from frontmatter.
- The build should fail loudly for malformed content rather than silently publishing bad pages.
- AdSense infrastructure must be safe before approval: disabled by default, policy pages present, and `ads.txt` valid only when a publisher id exists.
- Deferred CMS work must stay isolated from the public route surface.

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
        about/
        contact/
        privacy/
      rss.xml/route.ts
      ads.txt/route.ts
      robots.ts
      sitemap.ts
    content/
      README.md
      posts/<slug>/index.mdx
    public/images/og/default.svg
    src/
      components/
      lib/content/posts.ts
    next.config.ts
    package.json
src/                      # legacy Astro app, retained as transition/reference material
docs/
```

The active deploy target is `apps/web`. The root Astro app can still build, but it is not the ADR-003 production target.

## 5. Content Model

Each post lives at:

```text
apps/web/content/posts/<slug>/index.mdx
```

Required frontmatter fields:

- `title`
- `description`
- `publishedAt`
- `updatedAt`
- `status`
- `category`
- `tags`
- `readingTime`
- `author`

Recommended frontmatter fields:

- `slug`
- `series`
- `seriesOrder`
- `tools`
- `heroImage`
- `heroAlt`
- `seoTitle`
- `seoDescription`
- `canonicalUrl`

Valid public status is `published`. Non-public statuses include `draft`, `scheduled`, and `archived`.

The content loader validates frontmatter, renders a safe Markdown/HTML subset, creates excerpts and table-of-contents entries, sorts posts by date, and builds category, tag, series, and tool buckets.

## 6. Runtime Boundaries

| Route                    | Purpose                       | Rendering                      |
| ------------------------ | ----------------------------- | ------------------------------ |
| `/`                      | Home and latest posts         | Static/server HTML             |
| `/posts`                 | Published post index          | Static/server HTML             |
| `/posts/[slug]`          | Published post detail         | SSG via `generateStaticParams` |
| `/categories/[category]` | Category archive              | SSG                            |
| `/tags/[tag]`            | Tag archive                   | SSG                            |
| `/series/[series]`       | Series archive                | SSG                            |
| `/tools/[tool]`          | Tool archive                  | SSG                            |
| `/about`                 | Site identity                 | Static                         |
| `/contact`               | Contact guidance              | Static                         |
| `/privacy`               | Privacy and ads policy        | Static                         |
| `/rss.xml`               | Published-post RSS            | Dynamic route output           |
| `/sitemap.xml`           | Published-post sitemap        | Next sitemap output            |
| `/robots.txt`            | Crawl policy                  | Next robots output             |
| `/ads.txt`               | AdSense publisher declaration | Dynamic route output           |

No active public route should depend on Supabase, an admin session, a database, or a browser editor.

## 7. SEO and Structured Data

Public pages provide:

- canonical URLs based on `NEXT_PUBLIC_SITE_URL`
- metadata titles and descriptions
- Open Graph and Twitter card fields
- Article JSON-LD for post pages
- sitemap entries for public pages and published posts only
- RSS entries for published posts only
- taxonomy routes for categories, tags, series, and tools

The default Open Graph image is `apps/web/public/images/og/default.svg`.

## 8. Ads and Policy Boundaries

AdSense is optional and disabled by default.

- `ADS_ENABLED=false` keeps ad slots inert.
- `ADSENSE_CLIENT` is required before `ads.txt` emits a Google publisher line.
- Policy pages `/about`, `/contact`, and `/privacy` must remain reachable.
- New ad slots should be added only where they do not interrupt article readability.

## 9. Security and Privacy

The active MVP has no user accounts, no private database, no private media bucket, and no server-side secrets beyond deployment configuration. The main security boundary is build-time content validation and avoiding accidental publication of non-public posts.

The content renderer allows only a small, explicit HTML subset and rejects unsafe tags, scripts, event handlers, JavaScript URLs, and iframes.

## 10. Deferred Surfaces

The following surfaces are deferred and non-active:

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Tiptap editor
- `/admin` browser CMS
- admin CRUD, preview, and media library workflows

Existing ADR-002 documents may remain as historical references. They are not active implementation instructions unless a new ADR reactivates that path.

## 11. Quality Gates

Before claiming an implementation complete for `apps/web`, run the relevant subset of:

```bash
npm run test
npm run format
npm run lint
npm run typecheck
npm run build
```

For release readiness, also smoke-test representative public URLs:

- `/`
- `/posts`
- one published post
- `/rss.xml`
- `/sitemap.xml`
- `/ads.txt`
- `/about`
- `/privacy`
- `/contact`

The stop condition is: active public routes work, non-public content stays hidden, SEO files include only published content, no stale required Supabase setup remains, and the build/test gates pass.
