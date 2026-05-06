# Slice 8.1 — Vercel & 환경 분리

Phase: 8 — Launch
Status: Not Started

## Goal

Preview / Production 환경이 독립적으로 동작하고 환경변수가 안전하게 분리.

## Tasks

- [ ] Vercel 프로젝트 생성, GitHub 연동
- [ ] Preview / Production 환경변수 분리 (`NEXT_PUBLIC_SITE_URL`, `ADS_ENABLED`, analytics/search verification 값)
- [ ] Supabase/Auth 관련 환경변수가 필수값으로 남아 있지 않은지 확인
- [ ] AdSense 운영 시점에 Hobby → Pro 업그레이드

## Acceptance

- PR 마다 Preview URL 이 생성되고 Production 은 main 머지 시 배포된다.
