# ADR-003: GitHub + MDX Content Workflow

Status: Accepted
Date: 2026-05-06
Owner: 개인 운영자
Supersedes: ADR-002 data, auth, storage, and web-admin CMS scope

## Context

ADR-002 selected Supabase Postgres, Supabase Auth, Supabase Storage, and a Tiptap-based `/admin` CMS. During execution, Supabase free-project limits became a near-term blocker. Sharing an existing Supabase project was rejected because it risks mixing unrelated project data and policies.

The product is primarily a personal blog and documentation site. The content is important, but it does not require runtime database writes for the MVP. GitHub already provides version history, review, rollback, and a safe publishing trail.

## Decision

The current implementation path uses GitHub as the content source of truth.

- Framework remains: Next.js App Router in `apps/web/`
- Content source: repository files under `content/` or `apps/web/content/`
- Authoring format: MDX with frontmatter metadata
- Rendered output: static/server-rendered HTML generated from MDX
- Media: colocated image/assets folders committed to Git
- Publishing workflow: Git commit or pull request; optional Pages CMS/Decap CMS UI later
- Database/Auth/Storage/admin CMS: deferred until a real need appears

The preferred content unit is a folder per post:

```text
content/posts/<slug>/
├─ index.mdx
├─ cover.png
└─ assets/
```

`index.mdx` frontmatter is the typed metadata contract:

```mdx
---
title: "Post title"
description: "Search result summary"
date: "2026-05-06"
updated: "2026-05-06"
category: "vibe-coding-lab"
tags: ["nextjs", "seo"]
series: "building-ai-blog"
status: "published"
---

# Body

Markdown, MDX components, and limited safe HTML are allowed.
```

## Consequences

Benefits:

- Removes the Supabase project-limit blocker.
- Keeps content versioned, reviewable, and recoverable in Git.
- Avoids mixing this blog with another Supabase project.
- Reduces MVP scope by removing Auth/RLS/Storage/admin write paths.
- Preserves SEO: pages are generated as HTML from structured MDX.

Costs:

- New posts require a Git commit/PR or a Git-backed CMS UI.
- Publishing is build-triggered, not instant database-driven ISR.
- Non-technical editing needs a later UI layer such as Pages CMS or Decap CMS.
- Runtime comments, memberships, or personalized content would require a new data decision.

## Non-Negotiables

- MDX frontmatter must validate before build succeeds.
- `draft`, `scheduled`, and `archived` content must never appear in sitemap, RSS, or public listing pages.
- Public pages must render meaningful HTML without relying on client-only body rendering.
- Media paths must be repository-local or explicitly allowlisted remote URLs.
- Raw HTML in MDX is allowed only when it remains safe, reviewable, and lintable.

## Deferred Scope

The following ADR-002 choices are parked, not deleted:

- Supabase Auth + Google OAuth
- Supabase Postgres content tables
- Supabase Storage media library
- Tiptap `/admin` editor
- Admin-only server actions/API routes

Revive them only with a new ADR if Git-based publishing becomes the bottleneck.

## Revisit Trigger

Revisit this decision when one of these becomes true:

- Multiple non-technical editors need browser-only publishing.
- Scheduled publishing must happen without a deploy.
- Media uploads become too frequent or too large for Git.
- Runtime user features require a database.
- GitHub-based editorial tooling becomes slower than a hosted CMS.
