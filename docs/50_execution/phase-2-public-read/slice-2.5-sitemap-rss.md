# Slice 2.5 — Sitemap / Robots / RSS 실콘텐츠 연결

Phase: 2 — Git-backed MDX Public Read
Status: Done (2026-05-06)

## Goal

검색엔진과 RSS 구독자가 Git MDX content tree의 published 글 URL만 받는다.

## Tasks

- [x] `app/sitemap.ts`에 published 글 + 분류 페이지 포함
- [x] `app/robots.ts`에서 `/admin`, `/preview/*`, draft 경로 Disallow 유지
- [x] `app/rss.xml/route.ts` 최신 published 글 20개 출력
- [x] draft / scheduled / archived 글은 절대 sitemap/RSS에 들어가지 않는 검증 추가
- [x] RSS item의 title/description/link/pubDate가 frontmatter와 일치하는지 확인

## Acceptance

- sitemap이 실제 published 글 URL을 포함한다.
- RSS가 published 글만 포함한다.
- draft/scheduled/archived 글은 public listing, sitemap, RSS 어디에도 노출되지 않는다.
