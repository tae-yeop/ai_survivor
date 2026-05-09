# Implementation Status — 2026-05-09

Status: Current code summary
Last Updated: 2026-05-09

현재 active app은 `apps/web/`이다. 루트 Astro 앱은 legacy/reference이며, 새 기능은 별도 요청이 없으면 `apps/web` 기준으로 판단한다.

## Active implementation

| 영역                             | 상태        | 근거                                                                    |
| -------------------------------- | ----------- | ----------------------------------------------------------------------- |
| Next.js active app               | Implemented | `apps/web/package.json`, `apps/web/app/*`                               |
| Git-backed MDX content           | Implemented | `apps/web/content/posts/*/index.mdx`                                    |
| Public post index/detail         | Implemented | `apps/web/app/(public)/posts/*`                                         |
| Taxonomy pages                   | Implemented | `categories`, `tags`, `series`, `tools` routes                          |
| Resources page                   | Implemented | `apps/web/app/(public)/resources/page.tsx`                              |
| SEO metadata                     | Implemented | `apps/web/src/lib/seo/metadata.ts`                                      |
| RSS / sitemap / robots / ads.txt | Implemented | `app/rss.xml`, `app/sitemap.ts`, `app/robots.ts`, `app/ads.txt`         |
| Baseline security headers        | Implemented | `apps/web/next.config.ts`                                               |
| Monetization components          | Implemented | `src/components/monetization/*`, `src/lib/monetization.ts`              |
| GitHub OAuth admin login         | Implemented | `app/api/admin/github/*`, `src/lib/admin/github-oauth.ts`               |
| Signed owner session             | Implemented | `src/lib/admin/session*.ts`                                             |
| Admin post list/form             | Implemented | `app/(admin)/admin/*`                                                   |
| GitHub Contents save             | Implemented | `app/(admin)/admin/actions.ts`, `src/lib/admin/github-content.ts`       |
| Rich editor                      | Implemented | `src/components/admin/RichEditor/*`                                     |
| Image/audio/document upload      | Implemented | `app/api/admin/upload/[slug]/route.ts`, `src/lib/admin/upload-asset.ts` |
| MDX media components             | Implemented | `Figure`, `AudioEmbed`, `DocumentEmbed`, `YouTube`                      |
| In-place post editing            | Implemented | `src/components/admin/EditOverlay.tsx`, `posts/[slug]/save-action.ts`   |
| Editor boundary doc              | Implemented | `docs/40_architecture/EDITOR_BOUNDARIES.md`                             |
| Large media object storage       | Not active  | `R2_*` placeholders only                                                |
| DB/Supabase CMS                  | Not active  | no active runtime dependency                                            |

## Important corrections from older docs

Older docs can mention Supabase Auth/Postgres/Storage, DB CRUD, or a deferred admin CMS. Current code uses:

- GitHub OAuth for owner login.
- HMAC-signed httpOnly cookie for admin session.
- GitHub Contents API for post and asset writes.
- Git-backed MDX as the source of truth.
- No active Supabase/Auth.js/DB CMS runtime dependency.

Use these as source of truth:

1. `docs/40_architecture/HOW_IT_WORKS.md`
2. `docs/40_architecture/EDITOR_BOUNDARIES.md`
3. `docs/50_execution/EXECUTION_STATUS.md`
4. this file
5. actual code under `apps/web/`

## Current test coverage

`apps/web` test script covers:

- baseline security headers
- site URL resolution
- monetization link/disclosure policy
- brand copy
- post loader/frontmatter/public filtering
- admin session token
- admin MDX parse/serialize
- HTML to MDX conversion
- upload asset MIME/extension validation
- GitHub content helper behavior
- in-place edit flag
- rich editor markdown/figure/audio/document serialization
- MDX figure layout/lightbox helpers

## Known follow-ups

| Priority | Work                                                                                         | Why                                                                 |
| -------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| High     | Set Vercel Production `NEXT_PUBLIC_SITE_URL` to the actual Vercel URL before domain purchase | Avoid fake canonical URLs                                           |
| High     | Connect custom domain when ready                                                             | Required for serious launch/Search Console/AdSense flow             |
| High     | Run external Lighthouse/browser smoke after domain switch                                    | Vercel URL verification does not prove operating-domain correctness |
| Medium   | Decide media storage policy for files >4MB                                                   | Current upload commits small images/audio/documents to GitHub       |
| Medium   | Add taxonomy admin UI if writing volume grows                                                | Frontmatter free-form works, but UI can reduce typos                |
| Low      | Decide whether to remove or archive root Astro app                                           | Reduces confusion for new maintainers                               |

## Similar-service ready stop condition

A new service can reuse this implementation when:

- public pages render without admin env vars,
- malformed content fails build/test,
- unpublished content never appears in public outputs,
- owner login is restricted to one GitHub account,
- admin save creates a GitHub commit,
- monetized links use shared disclosure/rel policy,
- media upload policy is explicit,
- Vercel deploys from Git commits,
- sitemap/RSS/robots/ads policy outputs are correct.
