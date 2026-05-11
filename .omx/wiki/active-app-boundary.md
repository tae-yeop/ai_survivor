---
title: "Active App Boundary"
tags: ["nextjs", "apps-web", "legacy", "boundary"]
created: 2026-05-11T12:18:32Z
updated: 2026-05-11T12:42:00Z
sources: ["AGENTS.md", "CLAUDE.md", "docs/40_architecture/HOW_IT_WORKS.md", "docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md"]
links: ["project-wiki-overview.md", "how-it-works-doc-contract.md"]
category: architecture
confidence: high
schemaVersion: 1
---
# Active App Boundary
The active product app is `apps/web/`. The root `src/` Astro app is legacy/reference only.

## Active stack
- Next.js App Router under `apps/web/`
- TypeScript, React, Tailwind
- Git-tracked MDX content under `apps/web/content/posts/<slug>/index.mdx`
- Public routes under `apps/web/app/(public)/**`
- Admin routes under `apps/web/app/(admin)/**`
- Admin APIs under `apps/web/app/api/admin/**`
- SEO outputs from `apps/web/app/sitemap.ts`, `robots.ts`, `rss.xml/route.ts`, `ads.txt/route.ts`

## Non-active or deferred
- Supabase/Auth.js/DB CMS is not active architecture.
- Large media object storage is not active yet.
- The root Astro app should not receive product feature work unless the user explicitly asks for it.

## Working rule
When routes, content flow, admin/write flow, env vars, GitHub storage, SEO outputs, or deployment behavior change, update [[how-it-works-doc-contract]] and related docs in the same patch.
