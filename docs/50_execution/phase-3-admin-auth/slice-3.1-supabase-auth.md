# Slice 3.1 — Supabase Auth 연동

Phase: 3 — Admin Auth
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

Google OAuth 로그인이 동작한다.

## Tasks

- [ ] Supabase Auth Google provider 설정 (콘솔 + .env)
- [ ] `@supabase/ssr` 기반 server client / browser client 분리
- [ ] `app/(admin)/login/page.tsx` — Google 로그인 버튼
- [ ] OAuth callback 라우트 처리

## Acceptance

- 임의 Google 계정으로 로그인 후 세션 쿠키가 설정된다.
