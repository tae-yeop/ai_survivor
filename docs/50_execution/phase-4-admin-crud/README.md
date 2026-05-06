# Phase 4 — Admin Posts CRUD (text only)

Status: Deferred by ADR-003
Goal: 현재 MVP에서는 실행하지 않는다. 글 작성/발행은 GitHub commit 또는 pull request가 담당한다.

> Historical plan: 아래 slice들은 ADR-002의 DB 기반 admin CRUD 경로를 위한 보관 문서다. ADR-003 경로에서는 PR 기반 작성/검수 계획으로 대체한다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 4.1 | [slice-4.1-list.md](./slice-4.1-list.md) | 글 목록 + 상태 필터 |
| 4.2 | [slice-4.2-edit-form.md](./slice-4.2-edit-form.md) | 새 글 / 편집 폼 |
| 4.3 | [slice-4.3-publish-preview.md](./slice-4.3-publish-preview.md) | 발행 / 미리보기 흐름 |

## Reactivation Criteria

- GitHub 기반 작성 흐름이 운영 병목이라는 근거가 생긴다.
- 새 ADR에서 DB/파일 저장 전략과 발행 권한 모델을 다시 정한다.
