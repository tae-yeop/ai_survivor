# Deployment Runbook

Status: Active
Owner: Solo operator
Last Updated: 2026-05-09
Decision Source: `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`, `docs/60_decisions/ADR-004-github-backed-admin-editor.md`

## 1. Production Shape

AI 시대 생존기는 `apps/web` Next.js application으로 배포한다. 콘텐츠는 Git-tracked MDX이며 build time에 bundle된다. Active MVP는 database가 필요하지 않다. 브라우저 글쓰기는 owner가 GitHub OAuth와 server-only repository token을 설정했을 때 GitHub-backed admin editor로 동작한다.

Vercel은 project root를 `apps/web`로 설정한다. Custom domain을 구매하기 전에는 `NEXT_PUBLIC_SITE_URL`을 실제 Vercel production URL로 설정하고, 도메인 연결 후 운영 도메인으로 교체한다.

## 2. Vercel Project Settings

When importing the GitHub repository in Vercel, do **not** deploy the repository root Astro app.

| Setting          | Value                           |
| ---------------- | ------------------------------- |
| Repository       | `tae-yeop/ai_survivor`          |
| Root Directory   | `apps/web`                      |
| Framework preset | Next.js                         |
| Install command  | `npm install` or Vercel default |
| Build command    | `npm run build`                 |
| Output directory | leave empty / Next.js default   |

If Vercel shows **Astro** and root directory `./`, change root directory to `apps/web`. After that the preset should be Next.js.

## 3. Environment Variables

| Env                                         | Preview                | Production                                                              | Purpose                                   |
| ------------------------------------------- | ---------------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                      | Vercel preview URL     | Vercel production URL before domain, production domain after connection | canonical URLs, sitemap, RSS, OG URLs     |
| `ADS_ENABLED`                               | `false`                | `false` until AdSense approval                                          | enables ad rendering when ready           |
| `ADSENSE_CLIENT`                            | empty                  | `ca-pub-...` after approval                                             | enables a valid `/ads.txt` publisher line |
| `ADMIN_GITHUB_LOGIN`                        | owner login            | owner login                                                             | GitHub OAuth owner allowlist              |
| `ADMIN_GITHUB_ID`                           | optional owner id      | optional owner id                                                       | rename-safe owner check                   |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth app credentials  | OAuth app credentials                                                   | GitHub OAuth                              |
| `ADMIN_SESSION_SECRET`                      | 32+ random chars       | 32+ random chars                                                        | HMAC session signing                      |
| `GITHUB_CONTENT_TOKEN`                      | fine-grained token     | fine-grained token                                                      | GitHub Contents read/write                |
| `GITHUB_REPO`                               | `tae-yeop/ai_survivor` | `tae-yeop/ai_survivor`                                                  | content repository                        |
| `GITHUB_BRANCH`                             | `master`               | `master`                                                                | target branch                             |

Before buying/connecting the domain, use the Vercel production URL for Production `NEXT_PUBLIC_SITE_URL` if canonical correctness matters during testing. After connecting the domain, switch Production to `https://<domain>` and redeploy.

There are no required Supabase environment variables for the active MVP.

## 4. Local Verification

From `apps/web`:

```bash
npm run typecheck
npm run test
npm run lint
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
- `/resources`
- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`
- `/about`
- `/privacy`
- `/contact`
- `/admin/login` only when admin env is configured

## 5. Vercel Deployment Steps

1. Push `master` to GitHub.
2. Import the repository in Vercel.
3. Set root directory to `apps/web`.
4. Set Preview and Production environment variables separately.
5. Deploy Preview first.
6. Verify public routes, RSS, sitemap, robots, ads.txt, resources, and policy pages.
7. Connect the production custom domain when the domain is purchased.
8. Change Production `NEXT_PUBLIC_SITE_URL` to `https://<domain>`.
9. Redeploy Production.
10. Submit sitemap to search consoles.

## 6. Launch Checklist

- [ ] `apps/web` production build passes.
- [ ] Vercel root directory is `apps/web`, not `./`.
- [ ] Vercel framework preset is Next.js, not Astro.
- [ ] `/`, `/posts`, at least one post, taxonomy pages, `/resources`, `/about`, `/privacy`, and `/contact` return 200.
- [ ] `/rss.xml` includes published posts only.
- [ ] `/sitemap.xml` includes published posts only.
- [ ] Draft, scheduled, and archived slugs are not reachable from public indexes, RSS, or sitemap.
- [ ] `/robots.txt` disallows admin and preview paths.
- [ ] Canonical URLs match the currently deployed domain.
- [ ] Baseline security headers are present.
- [ ] `/ads.txt` is a placeholder when `ADSENSE_CLIENT` is empty.
- [ ] Ad slots are inert while `ADS_ENABLED=false`.
- [ ] Google Search Console receives the production sitemap after domain connection.
- [ ] Naver Search Advisor receives the production sitemap after domain connection.

## 7. Content Publishing Flow

1. Draft freely in `articles/` or in the protected browser editor.
2. Save content to `apps/web/content/posts/<slug>/index.mdx`.
3. Put optimized images under `apps/web/public/media/posts/<slug>/` when committing static assets.
4. Keep `status: draft` while editing.
5. Run the local verification commands.
6. Change to `status: published` when ready.
7. Commit and push; Vercel deploys from Git.

Scheduled posts should remain non-public until the publication date is intentionally reached and verified.

## 8. AdSense Readiness

Do not enable real ads at the first deployment. Recommended timing:

1. Deploy successfully on Vercel.
2. Buy/connect the production domain.
3. Set `NEXT_PUBLIC_SITE_URL=https://<domain>` and redeploy.
4. Register Google Search Console and Naver Search Advisor.
5. Submit `/sitemap.xml`.
6. Publish more useful articles. Five posts is the minimum starting point; 10-15 high-quality, original posts is a safer application target.
7. Wait until pages begin indexing.
8. Apply for AdSense.
9. Only after approval, set `ADSENSE_CLIENT=ca-pub-...` and `ADS_ENABLED=true`.

Before applying or enabling ads:

- keep `/about`, `/contact`, and `/privacy` published
- keep navigation simple and crawlable
- avoid thin AI-generated bulk posts
- verify sitemap and RSS output
- confirm `ADS_ENABLED=false` during review
- configure `ADSENSE_CLIENT` only after the publisher id is available

## 9. Monetization Links

Use `AffiliateLink`, `ProductCard`, and `DisclosureBox` for affiliate/sponsored resources.

- Editorial links use `rel="noopener noreferrer"`.
- Affiliate/sponsored links use `rel="sponsored nofollow noopener noreferrer"`.
- Add reader-facing disclosure near affiliate/sponsored recommendations.

## 10. Media Operations

Initial policy:

- optimized images can be committed to Git under `apps/web/public/media/posts/<slug>/`
- long videos and large originals should not be committed
- use YouTube/Vimeo for public long videos unless self-hosting is required
- consider Vercel Blob or Cloudflare R2 when upload frequency or file size grows

A future browser editor should upload media to object storage and write the resulting URL into MDX.

## 11. Admin In-place Editing

`INPLACE_EDIT_ENABLED` defaults to enabled. Set it to `false` to stop mounting the admin `EditOverlay` on public post pages. Keep the default enabled for fast owner edits, but disable it immediately if a production incident requires removing the public edit entry point.

GitHub OAuth callback URL for production should be:

```text
https://<domain>/api/admin/github/callback
```

Saving from `/admin`, `/write`, or in-place edit creates a GitHub commit. If Vercel Git integration is enabled, that commit can trigger the normal redeploy pipeline.

## 12. Rollback

Use Vercel's previous deployment rollback if production breaks. Because content is Git-backed, content rollback is a normal Git revert followed by redeploy.

For a bad post only, revert the content commit or set the post to `status: draft`, then redeploy.

## 13. Deferred Supabase Note

Supabase Auth, Supabase Postgres, Supabase Storage, OAuth redirects, RLS policies, and admin CMS deployment checks belong to the deferred ADR-002 path. They are not part of the active deployment runbook and should not be required for launch until a new ADR reactivates that architecture.
