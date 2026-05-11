---
title: "Admin Auth and GitHub Write Flow"
tags: ["admin", "auth", "github", "write-path"]
created: 2026-05-11T12:18:45Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/40_architecture/HOW_IT_WORKS.md", "docs/40_architecture/EDITOR_BOUNDARIES.md", "docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md", "docs/70_ops/DEPLOYMENT.md"]
links: ["project-wiki-overview.md", "public-protected-editor-boundary.md", "deployment-runbook-essentials.md"]
category: architecture
confidence: high
schemaVersion: 1
---
# Admin Auth and GitHub Write Flow
The active admin/write path is GitHub OAuth plus GitHub Contents API. Supabase/Auth.js/DB CMS is not active.

## Flow
```text
Owner browser
  -> /api/admin/github/login
  -> GitHub OAuth
  -> signed httpOnly session cookie
  -> /admin or /write
  -> editor + metadata form
  -> server action or upload route
  -> GitHub Contents API
  -> commit to apps/web/content/posts/<slug>/index.mdx or assets/*
  -> Vercel redeploys from Git
```

## Protected surfaces
- `/admin/login`
- `/admin`
- `/admin/posts/new`
- `/admin/posts/[slug]`
- `/write`
- `/api/admin/*`
- In-place edit save actions

Protected pages/actions must call the admin session guard before owner-only reads or writes.

## Server-only secrets
Never expose these as `NEXT_PUBLIC_*`:

- `GITHUB_CLIENT_SECRET`
- `ADMIN_SESSION_SECRET`
- `GITHUB_CONTENT_TOKEN`

Owner/admin env:

```env
ADMIN_GITHUB_LOGIN=""
ADMIN_GITHUB_ID=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
ADMIN_SESSION_SECRET=""
GITHUB_CONTENT_TOKEN=""
GITHUB_REPO="owner/repo"
GITHUB_BRANCH="master"
```

## Write safety
- Writes happen through server actions or route handlers only.
- GitHub token stays server-side.
- Saves create GitHub commits.
- In-place edits must check owner session and base SHA/conflict state.
- A failed admin save should not break public rendering.

## Incident lever
`INPLACE_EDIT_ENABLED=false` disables public post page edit overlay mounting if the production edit entry point must be removed quickly.
