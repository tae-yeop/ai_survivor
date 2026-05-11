---
title: "Similar Service Starter Pattern"
tags: ["starter", "reuse", "git-backed-content", "nextjs"]
created: 2026-05-11T12:18:58Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/50_execution/SIMILAR_SERVICE_STARTER.md", "docs/40_architecture/HOW_IT_WORKS.md"]
links: ["project-wiki-overview.md", "active-app-boundary.md", "content-model-and-public-filtering.md", "admin-auth-and-github-write-flow.md"]
category: pattern
confidence: high
schemaVersion: 1
---
# Similar Service Starter Pattern
Reusable pattern for building a small Git-backed content service.

## Target architecture
```text
Next.js App Router
  -> Git-tracked MDX content
  -> static/server-rendered public read pages
  -> owner-only browser editor
  -> GitHub Contents API commits
  -> Vercel deploy
```

## Good fit
- One or a few operators publish articles, reviews, research logs, or notes.
- SEO-friendly public pages matter.
- Git history is good enough for audit/revision history.
- Admin features only need owner login plus write/edit.

## Poor fit without more architecture
- Multi-user roles and permissions
- Comments, likes, payments, personalization
- High-frequency content mutation
- Heavy media upload/processing
- Non-developer-friendly block CMS requirements

## Minimal build order
1. Decide product/domain/content model.
2. Create Next.js + Tailwind app.
3. Define `content/posts/<slug>/index.mdx` convention.
4. Implement loader validation and public filtering.
5. Build posts/detail/taxonomy routes.
6. Add sitemap/RSS/robots/ads/policy pages.
7. Deploy on Vercel.
8. Add GitHub OAuth owner login.
9. Add GitHub Contents API save.
10. Extend rich editor/media/in-place editing only as needed.

## Copy first
When cloning this pattern, start from:

- `apps/web/src/lib/content/posts.ts`
- `apps/web/src/lib/content/slugify.ts`
- `apps/web/src/lib/admin/*`
- `apps/web/app/api/admin/*`
- `apps/web/app/(admin)/*`
- `apps/web/src/components/admin/RichEditor/*`
- `apps/web/src/components/mdx/*`
- SEO route handlers
- `apps/web/.env.example`

Keep public read path simple. Put admin/editor complexity behind owner-only boundaries.
