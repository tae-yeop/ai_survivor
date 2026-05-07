# Deployment Runbook

Status: Active
Owner: Solo operator
Last Updated: 2026-05-06
Decision Source: `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`

## 1. Production Shape

AI Vibe Lab is deployed as the `apps/web` Next.js application. Content is Git-tracked MDX and is bundled at build time. The active MVP does not require a database, authentication provider, object storage, or browser CMS.

Vercel should be configured with project root `apps/web` and production domain `https://aivibelab.com` after the domain is purchased and connected.

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

| Env                    | Preview            | Production                                      | Purpose                                   |
| ---------------------- | ------------------ | ----------------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Vercel preview URL | `https://aivibelab.com` after domain connection | canonical URLs, sitemap, RSS, OG URLs     |
| `ADS_ENABLED`          | `false`            | `false` until AdSense approval                  | enables ad rendering when ready           |
| `ADSENSE_CLIENT`       | empty              | `ca-pub-...` after approval                     | enables a valid `/ads.txt` publisher line |

Before buying/connecting the domain, use the Vercel preview URL for `NEXT_PUBLIC_SITE_URL` if canonical correctness matters during testing. After connecting the domain, switch production to `https://aivibelab.com` and redeploy.

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

1. Push `master` to GitHub.
2. Import the repository in Vercel.
3. Set root directory to `apps/web`.
4. Set the environment variables above.
5. Deploy Preview first.
6. Verify public routes, RSS, sitemap, robots, ads.txt, and policy pages.
7. Connect `aivibelab.com` when the domain is purchased.
8. Change Production `NEXT_PUBLIC_SITE_URL` to `https://aivibelab.com`.
9. Redeploy Production.
10. Submit sitemap to search consoles.

## 6. Launch Checklist

- [ ] `apps/web` production build passes.
- [ ] Vercel root directory is `apps/web`, not `./`.
- [ ] Vercel framework preset is Next.js, not Astro.
- [ ] `/`, `/posts`, at least one post, taxonomy pages, `/about`, `/privacy`, and `/contact` return 200.
- [ ] `/rss.xml` includes published posts only.
- [ ] `/sitemap.xml` includes published posts only.
- [ ] Draft, scheduled, and archived slugs are not reachable from public indexes, RSS, or sitemap.
- [ ] `/robots.txt` disallows admin and preview paths.
- [ ] Canonical URLs match the currently deployed domain.
- [ ] `/ads.txt` is a placeholder when `ADSENSE_CLIENT` is empty.
- [ ] Ad slots are inert while `ADS_ENABLED=false`.
- [ ] Google Search Console receives the production sitemap after domain connection.
- [ ] Naver Search Advisor receives the production sitemap after domain connection.

## 7. Content Publishing Flow

1. Draft freely in `articles/`.
2. Create a folder under `apps/web/content/posts/<slug>/`.
3. Add `index.mdx` with valid frontmatter.
4. Put optimized images under `apps/web/public/media/posts/<slug>/`.
5. Keep `status: draft` while editing.
6. Run the local verification commands.
7. Change to `status: published` when ready.
8. Commit and push; Vercel deploys from Git.

Scheduled posts should remain non-public until the publication date is intentionally reached and verified.

## 8. AdSense Readiness

Do not enable real ads at the first deployment. Recommended timing:

1. Deploy successfully on Vercel.
2. Buy/connect the production domain.
3. Set `NEXT_PUBLIC_SITE_URL=https://aivibelab.com` and redeploy.
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

## 9. Media Operations

Initial policy:

- optimized images can be committed to Git under `apps/web/public/media/posts/<slug>/`
- long videos and large originals should not be committed
- use YouTube/Vimeo for public long videos unless self-hosting is required
- consider Vercel Blob or Cloudflare R2 when upload frequency or file size grows

A future browser editor should upload media to object storage and write the resulting URL into MDX.

## 10. Rollback

Use Vercel's previous deployment rollback if production breaks. Because content is Git-backed, content rollback is a normal Git revert followed by redeploy.

For a bad post only, revert the content commit or set the post to `status: draft`, then redeploy.

## 11. Deferred Supabase Note

Supabase Auth, Supabase Postgres, Supabase Storage, OAuth redirects, RLS policies, and admin CMS deployment checks belong to the deferred ADR-002 path. They are not part of the active deployment runbook and should not be required for launch until a new ADR reactivates that architecture.

## GitHub-backed admin editor env

The `/admin` editor is disabled until these server-only variables are configured in Vercel Production/Preview:

- `ADMIN_GITHUB_LOGIN`: the only GitHub login allowed to administer the site.
- `ADMIN_GITHUB_ID`: optional numeric GitHub user ID for rename-safe owner checks.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: OAuth app credentials.
- `ADMIN_SESSION_SECRET`: 32+ random characters for HMAC session signing.
- `GITHUB_CONTENT_TOKEN`: fine-grained GitHub token with repository Contents read/write access.
- `GITHUB_REPO`: `tae-yeop/ai_survivor`.
- `GITHUB_BRANCH`: `master` unless the production branch changes.

### Admin in-place editing

`INPLACE_EDIT_ENABLED` — `true` (기본) / `false` 로 설정. `false` 면 공개 페이지에서 admin EditOverlay가 마운트되지 않음. 비상 시 빠른 토글용. 기본값 `true` 이므로 별도 설정 없이 활성화됨.

GitHub OAuth callback URL for production should be:

```text
https://aivibelab.com/api/admin/github/callback
```

Saving from `/admin` creates a GitHub commit. If Vercel Git integration is enabled, that commit can trigger the normal redeploy pipeline.
