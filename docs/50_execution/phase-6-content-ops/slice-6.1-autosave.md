# Slice 6.1 — Autosave & Revisions

Phase: 6 — Content Ops
Status: Needs Rewrite for ADR-003

> This slice was written for the ADR-002 admin CMS path. Rework it into GitHub/MDX checklist, lint, or GitHub Actions workflow before implementation.

## Goal

작성 중 사고가 나도 내용이 보존되고, 필요 시 이전 버전으로 되돌릴 수 있다.

## Tasks

- [ ] 에디터 idle 5초 → debounce autosave server action
- [ ] 저장 시 `post_revisions` 에 스냅샷 추가 (최대 N개 보관)
- [ ] 편집 화면에서 리비전 비교/되돌리기 UI

## Acceptance

- 브라우저 탭 강제 종료 후에도 마지막 작성 내용이 유지된다.
