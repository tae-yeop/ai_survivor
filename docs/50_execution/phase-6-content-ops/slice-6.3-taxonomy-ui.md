# Slice 6.3 — 카테고리/태그/시리즈 관리 UI

Phase: 6 — Content Ops
Status: Partial — free-form public taxonomy implemented, admin UI backlog

> Current public site reads taxonomy from MDX frontmatter and routes by slugified labels. A dedicated `/admin/taxonomy` CRUD screen is not implemented.

## Goal

코드 수정 없이 새 분류 체계를 만들 수 있다.

## Tasks

- [x] public category/tag/series/tool pages are generated from frontmatter
- [x] taxonomy route slug uses normalized labels, not raw label strings
- [ ] admin category input을 fixed select에서 free-form 또는 managed list로 바꿀지 결정
- [ ] `/admin/taxonomy` CRUD 필요성은 운영 중 taxonomy 충돌이 반복될 때 재검토
- [ ] tag rename/merge는 대량 MDX 변경 도구가 필요해질 때 구현

## Acceptance

- 코드 수정 없이 새 카테고리/시리즈를 만들 수 있다.
- public route에서 taxonomy slug collision이 발생하지 않는다.
