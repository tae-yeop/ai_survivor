# ADR-003: GitHub + MDX Content Workflow

Status: Accepted
Date: 2026-05-06
Owner: 개인 운영자
Supersedes: ADR-002 data, auth, storage, and web-admin CMS scope for the current MVP

## Context

ADR-002 selected Supabase Postgres, Supabase Auth, Supabase Storage, and a Tiptap-based `/admin` CMS. During execution, Supabase free-project limits became a near-term blocker. Sharing an existing Supabase project was rejected because it risks mixing unrelated project data and policies.

The product is primarily a personal blog and documentation site. The content matters, but the MVP does not require runtime database writes. GitHub already provides version history, review, rollback, and a safe publishing trail.

The operator also writes drafts in `articles/`. Those drafts are useful as a working area, but they should not automatically become public pages.

## Decision

The current implementation path uses GitHub as the content source of truth.

- Framework: Next.js App Router in `apps/web/`
- Draft workspace: `articles/`
- Published content source: `apps/web/content/posts/<slug>/index.mdx`
- Authoring format: MDX with frontmatter metadata
- Rendered output: static/server-rendered HTML generated at build time
- Small media: Git-tracked public assets under `apps/web/public/media/posts/<slug>/`
- Large media: external object/video storage, not Git
- Publishing workflow: Git commit or pull request
- Database/Auth/Storage/admin CMS: deferred until a real need appears

The preferred published content unit is a folder per post:

```text
apps/web/content/posts/<slug>/
└─ index.mdx

apps/web/public/media/posts/<slug>/
├─ cover.webp
└─ screenshot-01.webp
```

## Consequences

Benefits:

- Removes the Supabase project-limit blocker.
- Keeps content versioned, reviewable, and recoverable in Git.
- Avoids mixing this blog with another Supabase project.
- Reduces MVP scope by removing Auth/RLS/Storage/admin write paths.
- Preserves SEO: pages are generated as HTML from structured MDX.

Costs:

- New posts require a Git commit/PR or a future Git-backed editor UI.
- Publishing is build-triggered, not instant database-driven ISR.
- Non-technical browser-only editing needs a later UI layer.
- Large media needs an external storage decision.
- Runtime comments, memberships, or personalized content would require a new data decision.

## Non-Negotiables

- MDX frontmatter must validate before build succeeds.
- `draft`, `scheduled`, and `archived` content must never appear in sitemap, RSS, or public listing pages.
- Public pages must render meaningful HTML without relying on client-only body rendering.
- `articles/` is not a public content source.
- Media paths must be repository-local public assets or explicitly allowlisted remote URLs.
- Raw HTML in MDX is allowed only when it remains safe, reviewable, and lintable.

## Media Policy

- Optimized images may be committed under `apps/web/public/media/posts/<slug>/`.
- Very small demo videos may be committed only when they are essential and optimized.
- Long videos, audio, large originals, and frequent uploads should go to external storage such as Vercel Blob, Cloudflare R2, YouTube, or Vimeo.
- The repository should not become the media archive.

## Browser Editor Direction

A browser login/editor is desirable later, but it should not revive the full Supabase CMS by default.

Preferred future path:

1. Login with GitHub OAuth or another single-owner auth provider.
2. Write posts through a private `/admin` UI.
3. Save post changes by committing MDX files back to GitHub.
4. Upload media to Vercel Blob or another object store.
5. Trigger normal Vercel deployment from the Git commit.

This future path is captured in `ADR-004-github-backed-admin-editor.md` as a proposed extension.

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
