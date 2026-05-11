---
title: "Deployment Runbook Essentials"
tags: ["vercel", "deployment", "env", "launch"]
created: 2026-05-11T12:18:54Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/70_ops/DEPLOYMENT.md", "docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md"]
links: ["project-wiki-overview.md", "active-app-boundary.md", "admin-auth-and-github-write-flow.md"]
category: environment
confidence: high
schemaVersion: 1
---
# Deployment Runbook Essentials
Production deploy target is the `apps/web` Next.js app on Vercel.

## Vercel settings
| Setting | Value |
| --- | --- |
| Repository | `tae-yeop/ai_survivor` |
| Root Directory | `apps/web` |
| Framework preset | Next.js |
| Build command | `npm run build` |
| Output directory | Next.js default |

If Vercel detects Astro or root directory `./`, fix root directory to `apps/web`.

## Important env vars
- `NEXT_PUBLIC_SITE_URL`, canonical/RSS/sitemap/OG base URL
- `ADS_ENABLED`, keep `false` until ready
- `ADSENSE_CLIENT`, empty until approval
- `ADMIN_GITHUB_LOGIN`, owner allowlist
- `ADMIN_GITHUB_ID`, optional rename-safe owner id
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`, OAuth
- `ADMIN_SESSION_SECRET`, 32+ random chars
- `GITHUB_CONTENT_TOKEN`, fine-grained Contents read/write token
- `GITHUB_REPO`, usually `tae-yeop/ai_survivor`
- `GITHUB_BRANCH`, currently `master`

There are no required Supabase env vars for the active MVP.

## Local verification
```bash
cd apps/web
npm run typecheck
npm run test
npm run lint
npm run build
```

Optional smoke after `npm run start`:

- `/`
- `/posts`
- one published post URL
- `/resources`
- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`
- `/about`
- `/privacy`
- `/contact`
- `/admin/login` when admin env is configured

## Launch notes
- Use the actual Vercel production URL for `NEXT_PUBLIC_SITE_URL` before buying/connecting a domain.
- After custom domain connection, switch `NEXT_PUBLIC_SITE_URL` to `https://<domain>` and redeploy.
- Submit `/sitemap.xml` after production domain is correct.
- Rollback uses Vercel previous deployment rollback or Git revert for content.
