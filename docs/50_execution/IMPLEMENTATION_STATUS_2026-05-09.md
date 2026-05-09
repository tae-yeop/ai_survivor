# Implementation Status — 2026-05-09

> 현재 코드 기준 구현 상태 요약. 자세한 구조는 `../40_architecture/HOW_IT_WORKS.md`를 본다.

---

## 1. Active implementation

| 영역                         | 상태        | 근거                                                                  |
| ---------------------------- | ----------- | --------------------------------------------------------------------- |
| Active app                   | Implemented | `apps/web/package.json`, `apps/web/app/*`                             |
| Legacy Astro                 | Retained    | root `package.json`, root `src/*`                                     |
| Git-backed MDX content       | Implemented | `apps/web/content/posts/*/index.mdx`                                  |
| Public post index/detail     | Implemented | `app/(public)/posts/*`                                                |
| Taxonomy pages               | Implemented | `categories`, `tags`, `series`, `tools` routes                        |
| Resources page               | Implemented | `app/(public)/resources/page.tsx`                                     |
| SEO metadata                 | Implemented | `src/lib/seo/metadata.ts`                                             |
| RSS                          | Implemented | `app/rss.xml/route.ts`                                                |
| Sitemap                      | Implemented | `app/sitemap.ts`                                                      |
| Robots                       | Implemented | `app/robots.ts`                                                       |
| Baseline security headers    | Implemented | `next.config.ts`                                                      |
| AdSense placeholder          | Implemented | `app/ads.txt/route.ts`, `ADS_ENABLED`                                 |
| Monetization link components | Implemented | `src/components/monetization/*`, `src/lib/monetization.ts`            |
| GitHub OAuth admin login     | Implemented | `app/api/admin/github/*`, `src/lib/admin/github-oauth.ts`             |
| Signed owner session         | Implemented | `src/lib/admin/session*.ts`                                           |
| Admin post list              | Implemented | `app/(admin)/admin/page.tsx`                                          |
| New/edit post form           | Implemented | `app/(admin)/admin/_components/post-form.tsx`                         |
| GitHub Contents save         | Implemented | `app/(admin)/admin/actions.ts`, `src/lib/admin/github-content.ts`     |
| Rich editor                  | Implemented | `src/components/admin/RichEditor/*`                                   |
| Image upload to GitHub       | Implemented | `app/api/admin/upload/[slug]/route.ts`                                |
| In-place post editing        | Implemented | `src/components/admin/EditOverlay.tsx`, `posts/[slug]/save-action.ts` |
| Editor boundary doc          | Implemented | `docs/40_architecture/EDITOR_BOUNDARIES.md`                           |
| Large media object storage   | Not active  | `R2_*` env placeholders only                                          |
| DB/Supabase CMS              | Not active  | no active runtime dependency                                          |

---

## 2. Important corrections from older docs

Some older docs describe the admin CMS as deferred or Supabase-based. Current code has moved to:

- GitHub OAuth for owner login.
- HMAC-signed httpOnly cookie for admin session.
- GitHub Contents API for post and asset writes.
- No Supabase Auth/Postgres/Storage in the active path.

Use these documents as current source of truth:

1. `docs/50_execution/EXECUTION_STATUS.md`
2. `docs/50_execution/PRE_LAUNCH_DEV_CHECKLIST.md`
3. `docs/40_architecture/HOW_IT_WORKS.md`
4. `docs/40_architecture/EDITOR_BOUNDARIES.md`
5. `docs/50_execution/SIMILAR_SERVICE_STARTER.md`
6. `apps/web/.env.example`
7. actual code under `apps/web/src/lib/admin/*`

---

## 3. Current quality gates

For `apps/web`:

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

Current `test` script covers:

- Next.js baseline security headers
- site URL resolution
- monetization link rel/disclosure policy
- brand copy
- post loader/frontmatter/public filtering
- admin session token
- admin MDX parse/serialize
- HTML to MDX conversion
- GitHub content helper behavior
- in-place edit flag
- rich editor markdown/figure serialization
- MDX figure layout/lightbox helpers

---

## 4. Known follow-ups

| Priority | Work                                                                                         | Why                                                     |
| -------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| High     | Set Vercel Production `NEXT_PUBLIC_SITE_URL` to the actual Vercel URL before domain purchase | Avoid fake canonical URLs                               |
| High     | Connect custom domain when ready                                                             | Required for serious launch/Search Console/AdSense flow |
| High     | Run external Lighthouse/browser smoke on deployed URL                                        | Local build cannot prove production runtime UX          |
| Medium   | Decide media storage policy for files >4MB                                                   | Current upload commits small images to GitHub           |
| Medium   | Add taxonomy admin UI if writing volume grows                                                | Frontmatter free-form works, but UI can reduce typos    |
| Low      | Decide whether to remove or archive root Astro app                                           | Reduces confusion for new maintainers                   |

---

## 5. Stop condition for similar-service ready

A new service based on this implementation is ready when:

- public pages render without admin env vars,
- malformed content fails build/test,
- unpublished content never appears in public outputs,
- owner login is restricted to one GitHub account,
- admin save creates a GitHub commit,
- monetized links use the shared disclosure/rel policy,
- Vercel deploys from that commit,
- sitemap/RSS/robots/ads policy outputs are correct.
