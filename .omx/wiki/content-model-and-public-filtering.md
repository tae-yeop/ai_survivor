---
title: "Content Model and Public Filtering"
tags: ["content", "mdx", "publishing", "seo"]
created: 2026-05-11T12:18:40Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/10_content/CONTENT_MODEL.md", "docs/40_architecture/HOW_IT_WORKS.md", "docs/50_execution/SIMILAR_SERVICE_STARTER.md"]
links: ["project-wiki-overview.md", "active-app-boundary.md", "public-protected-editor-boundary.md"]
category: architecture
confidence: high
schemaVersion: 1
---
# Content Model and Public Filtering
Published content source of truth is `apps/web/content/posts/<slug>/index.mdx`.

## Content locations
- Draft/freeform workspace: `articles/`
- Site-rendered posts: `apps/web/content/posts/<slug>/index.mdx`
- Small CMS-uploaded assets: `apps/web/content/posts/<slug>/assets/*`
- Static optimized media: `apps/web/public/media/posts/<slug>/*`

## Required public filter
Public list/detail/taxonomy/RSS/sitemap outputs must include only posts where:

- `status === "published"`
- `publishedAt <= today`

`draft`, `scheduled`, and `archived` content must not appear in public collections, RSS, or sitemap.

## Core frontmatter
```yaml
title: "Example post"
description: "Search/list summary"
slug: "example-post"
publishedAt: "2026-05-09"
updatedAt: "2026-05-09"
status: "draft"
category: "vibe-coding-lab"
tags:
  - ai
  - workflow
author: "owner"
difficulty: "beginner"
```

Optional fields include `series`, `seriesOrder`, `tools`, `coverImage`, `coverAlt`, `canonical`, and `ogImage`.

## Hard failures and safety checks
- Folder slug and frontmatter slug must match.
- Unsafe MDX body such as `<script>`, inline event handlers, or `javascript:` URLs must be rejected.
- Taxonomy slug collisions should fail production builds.
- Every body image should have useful alt text.

## Publishing flow
1. Draft in `articles/` or the protected editor.
2. Move final content to `apps/web/content/posts/<slug>/index.mdx`.
3. Keep `status: draft` during editing.
4. Run verification.
5. Change status to `published` when ready.
6. Commit and push. Vercel deploys from Git.
