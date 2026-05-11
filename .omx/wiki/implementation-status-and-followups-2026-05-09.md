---
title: "Implementation Status and Followups 2026 05 09"
tags: ["status", "followups", "launch"]
created: 2026-05-11T12:19:03Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md"]
links: ["project-wiki-overview.md", "active-app-boundary.md", "deployment-runbook-essentials.md"]
category: session-log
confidence: high
schemaVersion: 1
---
# Implementation Status and Followups 2026-05-09
Current status document says active implementation is `apps/web/`; root Astro remains legacy/reference.

## Implemented
- Next.js active app
- Git-backed MDX content
- Public post index/detail
- Taxonomy pages
- Resources page
- SEO metadata
- RSS, sitemap, robots, ads.txt
- Baseline security headers
- Monetization components and policy helpers
- GitHub OAuth admin login
- Signed owner session
- Admin post list/form
- GitHub Contents save
- Rich editor
- Image/audio/document upload
- MDX media components
- In-place post editing
- Editor boundary doc

## Not active
- Large media object storage
- DB/Supabase CMS runtime

## Known follow-ups
High priority:

- Set Vercel Production `NEXT_PUBLIC_SITE_URL` to the actual Vercel URL before domain purchase.
- Connect custom domain when ready.
- Run external Lighthouse/browser smoke after domain switch.

Medium priority:

- Decide media storage policy for files larger than 4MB.
- Add taxonomy admin UI if writing volume grows.

Low priority:

- Decide whether to remove or archive the root Astro app to reduce maintainer confusion.

## Similar-service ready stop condition
A new service can reuse this implementation when public pages render without admin env vars, malformed content fails build/test, unpublished content never appears in public outputs, owner login is restricted, admin save creates GitHub commits, monetized links use shared disclosure/rel policy, media policy is explicit, Vercel deploys from Git, and SEO outputs are correct.
