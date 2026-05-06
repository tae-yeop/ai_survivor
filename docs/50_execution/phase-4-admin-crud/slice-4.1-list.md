# Slice 4.1 — 글 목록 & 상태 필터

Phase: 4 — Admin CRUD
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

DB 의 모든 글이 상태별로 보인다.

## Tasks

- [ ] `/admin/posts` — status 필터(draft/published/scheduled/archived), 검색
- [ ] 정렬: updated_at desc
- [ ] 행 액션: 편집, 복제, 삭제(soft)

## Acceptance

- DB 의 모든 글이 상태별로 필터링되어 보인다.
