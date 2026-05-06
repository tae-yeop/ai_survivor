# Deployment Runbook

Status: Active
Owner: Solo operator
Last Updated: 2026-05-06
Decision Source: `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`

## 1. Production Shape

AI Vibe Lab is deployed as the `apps/web` Next.js application. Content is Git-tracked MDX and is bundled at build time. The active MVP does not require a database, authentication provider, object storage, or browser CMS.

Vercel should be configured with project root `apps/web` and production domain `https://aivibelab.com`.

## 2. Required Settings

| Setting             | Value                           |
| ------------------- | ------------------------------- |
| Vercel project root | `apps/web`                      |
| Framework preset    | Next.js                         |
| Install command     | Vercel default or `npm install` |
| Build command       | `npm run build`                 |
| Output directory    | Next.js default                 |
| Production domain   | `aivibelab.com`                 |
| Canonical site URL  | `https://aivibelab.com`         |

## 3. Environment Variables

| Env                    | Preview                  | Production                     | Purpose                                   |
| ---------------------- | ------------------------ | ------------------------------ | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | preview URL or local URL | `https://aivibelab.com`        | canonical URLs, sitemap, RSS, OG URLs     |
| `ADS_ENABLED`          | `false`                  | `false` until AdSense approval | enables ad rendering when ready           |
| `ADSENSE_CLIENT`       | empty                    | `ca-pub-...` after approval    | enables a valid `/ads.txt` publisher line |

There are no required Supabase environment variables for the active ADR-003 MVP.

## 4. Local Verification

From `apps/web`:

```bash
npm run test
npm run format
npm run lint
npm run typecheck
npm run build
```

Optional local smoke check:

```bash
npm run start
```

Then verify representative URLs:

- `/`
- `/posts`
- one published post URL
- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`
- `/about`
- `/privacy`
- `/contact`

## 5. Vercel Deployment Steps

1. Create or update the Vercel project with root directory `apps/web`.
2. Set `NEXT_PUBLIC_SITE_URL=https://aivibelab.com` in Production.
3. Keep `ADS_ENABLED=false` until AdSense approval is complete.
4. Leave `ADSENSE_CLIENT` empty until Google provides the publisher id.
5. Connect `aivibelab.com` and optionally redirect `www.aivibelab.com` to the apex domain.
6. Deploy the current branch to Preview and verify the public routes.
7. Promote to Production only after the checklist below passes.

## 6. Launch Checklist

- [ ] `apps/web` production build passes.
- [ ] `/`, `/posts`, at least one post, taxonomy pages, `/about`, `/privacy`, and `/contact` return 200.
- [ ] `/rss.xml` includes published posts only.
- [ ] `/sitemap.xml` includes published posts only.
- [ ] Draft, scheduled, and archived slugs are not reachable from public indexes, RSS, or sitemap.
- [ ] `/robots.txt` disallows admin and preview paths.
- [ ] Canonical URLs use `https://aivibelab.com`.
- [ ] `/ads.txt` is a placeholder when `ADSENSE_CLIENT` is empty.
- [ ] `/ads.txt` emits one valid Google line after `ADSENSE_CLIENT` is configured.
- [ ] Ad slots are inert while `ADS_ENABLED=false`.
- [ ] Search Console receives the production sitemap.
- [ ] Naver Search Advisor receives the production sitemap.

## 7. Content Publishing Flow

1. Create a folder under `apps/web/content/posts/<slug>/`.
2. Add `index.mdx` with valid frontmatter.
3. Keep `status: draft` while editing.
4. Run the local verification commands.
5. Change to `status: published` when ready.
6. Commit and deploy through the normal Git workflow.

Scheduled posts should remain non-public until the publication date is intentionally reached and verified.

## 8. AdSense Readiness

Before applying or enabling ads:

- keep `/about`, `/contact`, and `/privacy` published
- publish at least five useful articles
- verify sitemap and RSS output
- confirm `ADS_ENABLED=false` during review
- configure `ADSENSE_CLIENT` only after the publisher id is available

## 9. Rollback

Use Vercel's previous deployment rollback if production breaks. Because content is Git-backed, content rollback is a normal Git revert followed by redeploy.

For a bad post only, revert the content commit or set the post to `status: draft`, then redeploy.

## 10. Deferred Supabase Note

Supabase Auth, Supabase Postgres, Supabase Storage, OAuth redirects, RLS policies, and admin CMS deployment checks belong to the deferred ADR-002 path. They are not part of the active deployment runbook and should not be required for launch until a new ADR reactivates that architecture.
