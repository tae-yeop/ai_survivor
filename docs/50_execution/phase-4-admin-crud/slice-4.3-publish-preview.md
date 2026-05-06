# Slice 4.3 — 발행 / 미리보기 흐름

Phase: 4 — Admin CRUD
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

발행 토글 + 비공개 미리보기 흐름이 안전하게 동작.

## Tasks

- [ ] `/admin/posts/[id]/preview` — draft 도 인증된 관리자에게는 보임
- [ ] 공개 페이지에서 draft slug 직접 접근 시 404
- [ ] published_at 자동 채움 (최초 published 전이면 now)

## Acceptance

- 발행 토글로 글이 공개되고, 비발행 글은 외부에서 절대 보이지 않는다.
