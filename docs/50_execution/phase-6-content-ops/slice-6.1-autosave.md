# Slice 6.1 — Autosave & Revisions

Phase: 6 — Content Ops
Status: Backlog — rewrite for ADR-004

> This slice was written for the ADR-002 DB CMS path. Current implementation uses GitHub-backed MDX writes, so do not add `post_revisions` or DB autosave without a new ADR.

## Goal

작성 중 사고가 나도 내용이 보존되고, 필요 시 이전 버전으로 되돌릴 수 있다.

## Tasks

- [ ] 브라우저 local draft preservation 필요성 확인
- [ ] GitHub commit history만으로 리비전 요구가 충분한지 운영 후 판단
- [ ] 필요 시 slug별 local draft 저장 + 복구 배너 구현
- [ ] GitHub commit diff/rollback UI는 운영 병목 확인 후 별도 ADR로 결정

## Acceptance

- 브라우저 탭 강제 종료 후에도 마지막 작성 내용이 유지된다.
- DB 없이 GitHub-backed write path와 충돌하지 않는다.
