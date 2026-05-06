# Slice 3.2 — Allowlist & 라우트 보호

Phase: 3 — Admin Auth
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

허용 이메일이 아니면 `/admin` 진입 불가.

## Tasks

- [ ] `middleware.ts` — `/admin/*` 접근 시 세션 + email allowlist 검증
- [ ] 비허용 시 403 페이지로 라우팅 (로그인 페이지 아님: 정보 노출 최소화)
- [ ] `lib/auth/requireAdmin.ts` 서버 헬퍼 — 모든 admin server action / API 진입점에서 사용
- [ ] e2e: 비허용 계정 로그인 → `/admin` 403 확인

## Acceptance

- allowlist 외 계정은 어떤 admin URL/API 도 200 을 받지 못한다.

## Risks

- 이 Slice 가 끝나기 전엔 어떤 admin write 기능도 구현하지 않는다 (Phase 4 게이트).
