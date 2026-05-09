# Slice 8.1 — Vercel & 환경 분리

Phase: 8 — Launch
Status: Partial — Vercel app published, env audit remains

## Goal

Preview / Production 환경이 독립적으로 동작하고 환경변수가 안전하게 분리.

## Tasks

- [x] Vercel app 출판 — owner report 기준
- [ ] GitHub 연동과 production branch 설정 확인
- [ ] Preview / Production 환경변수 분리 (`NEXT_PUBLIC_SITE_URL`, `ADS_ENABLED`, analytics/search verification 값)
- [ ] 도메인 구매 전 `NEXT_PUBLIC_SITE_URL`을 실제 Vercel production URL로 설정
- [ ] 도메인 연결 후 `NEXT_PUBLIC_SITE_URL`을 운영 도메인으로 변경
- [ ] Supabase/Auth 관련 환경변수가 필수값으로 남아 있지 않은지 확인
- [ ] GitHub admin 환경변수 입력: `ADMIN_GITHUB_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, `GITHUB_CONTENT_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`
- [ ] AdSense 운영 시점에 Hobby → Pro 업그레이드 필요 여부 결정

## Acceptance

- PR마다 Preview URL이 생성되고 Production은 production branch 기준으로 배포된다.
- canonical/sitemap/RSS가 현재 production URL 또는 운영 도메인을 가리킨다.
- 승인 전 광고는 `ADS_ENABLED=false`로 유지된다.
