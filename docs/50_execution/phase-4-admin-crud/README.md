# Phase 4 — Admin Posts CRUD (text only)

Status: Done via ADR-004
Goal: 운영자가 브라우저에서 MDX 글을 만들고 수정하면 GitHub commit으로 저장된다.

> Current path: 실제 구현은 DB CRUD가 아니라 GitHub Contents API 기반 파일 저장이다. 아래 slice들은 ADR-002의 DB 기반 admin CRUD 경로를 위한 historical reference이며, 현재 진행률 계산에는 포함하지 않는다.

## Current implementation

| 기능 | 상태 | 근거 |
| --- | --- | --- |
| admin post list | Implemented | `apps/web/app/(admin)/admin/page.tsx` |
| new/edit post routes | Implemented | `apps/web/app/(admin)/admin/posts/*` |
| post form | Implemented | `apps/web/app/(admin)/admin/_components/post-form.tsx` |
| MDX parse/serialize | Implemented | `apps/web/src/lib/admin/mdx.ts` |
| GitHub Contents save | Implemented | `apps/web/app/(admin)/admin/actions.ts`, `apps/web/src/lib/admin/github-content.ts` |

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 4.1 | [slice-4.1-list.md](./slice-4.1-list.md) | 글 목록 + 상태 필터 |
| 4.2 | [slice-4.2-edit-form.md](./slice-4.2-edit-form.md) | 새 글 / 편집 폼 |
| 4.3 | [slice-4.3-publish-preview.md](./slice-4.3-publish-preview.md) | 발행 / 미리보기 흐름 |

## Reactivation Criteria

- GitHub Contents API 기반 작성 흐름이 운영 병목이라는 근거가 생긴다.
- 새 ADR에서 DB/파일 저장 전략과 발행 권한 모델을 다시 정한다.
