# Slice 1.3 — 정적 더미 데이터로 라우트 골격

Phase: 1 — Next.js Skeleton
Status: Completed

## Goal

데이터 없이도 모든 공개 URL 이 존재한다 (404 금지).

## Tasks

- [x] `/`, `/posts`, `/posts/[slug]`, `/categories`, `/categories/[c]`, `/tags`, `/tags/[t]`, `/series`, `/series/[s]`, `/tools`, `/tools/[t]`, `/about`, `/contact`, `/privacy`, `/404` 라우트 생성
- [x] 각 페이지에 더미 placeholder 컴포넌트 + `generateMetadata` 기본 구현
- [x] `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/route.ts` 기본 응답 (빈 배열)

## Acceptance

- 모든 SERVICE_IA URL 이 200 을 낸다.
- `/sitemap.xml`, `/robots.txt`, `/rss.xml` 가 형식상 valid.

## Verification

- Smoke test on `next start -p 3100`: public SERVICE_IA routes returned 200.
- `/404` returned HTTP 404 with the custom 404 page, which is the correct runtime status for a not-found page.
- `/admin` returned 404 and is not linked from public nav/footer/sitemap/RSS.
