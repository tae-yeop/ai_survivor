# Phase 8 — Production Launch

Status: Partial / credential-gated
Goal: Vercel production URL에서 운영 도메인, 검색엔진, AdSense 신청까지 연결된 “세상에 보이는” 상태.

## Current Situation

- Owner report 기준: Vercel app에는 이미 출판되어 있다.
- 아직 남은 launch 핵심: custom domain, DNS, canonical URL 최종화, Search Console/Naver 등록, AdSense 신청.
- 도메인 전 개발-only 체크는 [`../PRE_LAUNCH_DEV_CHECKLIST.md`](../PRE_LAUNCH_DEV_CHECKLIST.md)를 따른다.

## Slices

| # | 파일 | 한 줄 |
| --- | --- | --- |
| 8.1 | [slice-8.1-vercel-env.md](./slice-8.1-vercel-env.md) | Vercel 프로젝트 + 환경 분리 |
| 8.2 | [slice-8.2-domain.md](./slice-8.2-domain.md) | Custom Domain + HTTPS |
| 8.3 | [slice-8.3-search-consoles.md](./slice-8.3-search-consoles.md) | Search Console / Naver Search Advisor 등록 |
| 8.4 | [slice-8.4-adsense-apply.md](./slice-8.4-adsense-apply.md) | AdSense 신청 + 광고 단위 연결 |

## Phase Exit Criteria

- [ ] `https://<운영도메인>`에서 GitHub/MDX 기반 사이트가 정상 동작한다.
- [ ] canonical, sitemap, RSS, OG URL이 운영 도메인을 사용한다.
- [ ] Google Search Console과 Naver Search Advisor에 sitemap이 제출되어 있다.
- [ ] AdSense 심사 또는 승인 이후 광고 단위 연결 절차가 진행되어 있다.
