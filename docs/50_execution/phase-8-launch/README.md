# Phase 8 — Production Launch

Status: Partial / live Vercel verified / credential-gated
Goal: Vercel production URL에서 운영 도메인, 검색엔진, AdSense 신청까지 연결된 “세상에 보이는” 상태.

## Current Situation

- Live smoke passed on the Vercel production URL: `https://aisurvivor.vercel.app`.
- Canonical, sitemap, RSS, robots, ads.txt, and security headers were verified against the Vercel URL.
- Remaining launch blockers are external: custom domain, DNS, operating-domain canonical switch, Search Console/Naver registration, and AdSense application.
- Domain-before-development checks are tracked in [`../PRE_LAUNCH_DEV_CHECKLIST.md`](../PRE_LAUNCH_DEV_CHECKLIST.md).

## Slices

| #   | 파일                                                           | 한 줄                                      |
| --- | -------------------------------------------------------------- | ------------------------------------------ |
| 8.1 | [slice-8.1-vercel-env.md](./slice-8.1-vercel-env.md)           | Vercel 프로젝트 + 환경 분리                |
| 8.2 | [slice-8.2-domain.md](./slice-8.2-domain.md)                   | Custom Domain + HTTPS                      |
| 8.3 | [slice-8.3-search-consoles.md](./slice-8.3-search-consoles.md) | Search Console / Naver Search Advisor 등록 |
| 8.4 | [slice-8.4-adsense-apply.md](./slice-8.4-adsense-apply.md)     | AdSense 신청 + 광고 단위 연결              |

## Live Vercel Verification

2026-05-09 live verification:

- Public routes and policy routes returned 200.
- `/api/admin/me` returns 200 `{ "admin": false }` for anonymous visitors.
- Sitemap contains 55 URLs, includes `/resources`, excludes `/admin` and `/write`.
- PageSpeed report `icpca7ddqh`: Desktop 84/100/100/100, Mobile 96/100/100/100.

## Phase Exit Criteria

- [ ] `https://<운영도메인>`에서 GitHub/MDX 기반 사이트가 정상 동작한다.
- [ ] canonical, sitemap, RSS, OG URL이 운영 도메인을 사용한다.
- [ ] Google Search Console과 Naver Search Advisor에 sitemap이 제출되어 있다.
- [ ] AdSense 심사 또는 승인 이후 광고 단위 연결 절차가 진행되어 있다.
