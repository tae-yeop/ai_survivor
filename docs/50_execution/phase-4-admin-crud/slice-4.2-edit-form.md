# Slice 4.2 — 새 글 / 편집 폼

Phase: 4 — Admin CRUD
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

글 작성/편집이 폼 단위로 가능.

## Tasks

- [ ] `/admin/posts/new`, `/admin/posts/[id]/edit`
- [ ] 필드: title, slug(자동 생성 + 수동 수정), description, category, tags, series, status
- [ ] Server action: `createPost`, `updatePost` — 모두 `requireAdmin()` 통과
- [ ] slug unique 충돌 처리

## Acceptance

- 폼에서 글을 만들고 published 로 바꾸면 공개 `/posts/<slug>` 에서 보인다.
