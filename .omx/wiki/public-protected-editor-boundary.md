---
title: "Public Protected Editor Boundary"
tags: ["editor", "security", "public-surface", "admin"]
created: 2026-05-11T12:18:49Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/40_architecture/EDITOR_BOUNDARIES.md", "docs/40_architecture/HOW_IT_WORKS.md"]
links: ["project-wiki-overview.md", "admin-auth-and-github-write-flow.md", "content-model-and-public-filtering.md"]
category: decision
confidence: high
schemaVersion: 1
---
# Public Protected Editor Boundary
Public read paths and protected writing paths must stay separated. This is a core architecture rule.

## Public surface
Public visitors and crawlers can access:

- `/`
- `/posts`
- `/posts/[slug]`
- `/categories/*`
- `/tags/*`
- `/series/*`
- `/tools/*`
- `/about`, `/privacy`, `/contact`, `/resources`
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/ads.txt`

Public outputs must include published content only.

## Never on public surface
- GitHub write token
- Admin-only env imports
- Mutation server actions
- Draft/scheduled/archived content in indexes, RSS, or sitemap
- `/admin`, `/write`, or `/preview` links in public nav, RSS, or sitemap

## Protected writing surface
Admin/editor actions use GitHub OAuth owner login, signed session, server-only token, and GitHub Contents API commits.

## Monetization boundary
- Ads and affiliate widgets belong on published public content only.
- Admin/write/preview/draft surfaces should not show ads.
- Affiliate/sponsored links should use `rel="sponsored nofollow noopener noreferrer"` and reader-facing disclosure.
