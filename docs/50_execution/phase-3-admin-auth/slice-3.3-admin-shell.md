# Slice 3.3 — Admin Shell UI

Phase: 3 — Admin Auth
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

로그인된 관리자가 보는 `/admin` 레이아웃이 존재.

## Tasks

- [ ] `app/(admin)/layout.tsx` — 좌측 네비, 상단 사용자 메뉴, 로그아웃
- [ ] `/admin` 대시보드 placeholder (글 수, 최근 글 등)
- [ ] noindex meta + robots Disallow 재확인

## Acceptance

- 관리자 로그인 후 `/admin` 진입 시 일관된 레이아웃이 보인다.
