# Slice 0.1 — ADR & 신규 문서 골격

Phase: 0 — Foundations
Status: Completed

## Goal

피벗 결정과 관련 문서를 만들어 LLM/사람이 같은 기준을 본다.

## Tasks

- [x] `docs/60_decisions/ADR-002-nextjs-supabase-admin-cms.md` 작성 (배경, 대안, 결정, 결과)
- [x] `docs/60_decisions/ADR-003-github-mdx-content-workflow.md` 작성 (Supabase 제약으로 현재 MVP 경로 재결정)
- [x] `docs/20_features/admin-cms.md` 골격 작성 (기능 목록만)
- [x] `docs/20_features/media-library.md` 골격 작성
- [x] `docs/40_architecture/AUTH_AND_PERMISSIONS.md` 골격 작성
- [x] `docs/70_ops/DEPLOYMENT.md` 골격 작성
- [x] `docs/40_architecture/ARCHITECTURE.md` 갱신 (Astro → Next.js, DB/Storage 추가)
- [x] `docs/README.md` 문서 인덱스에 신규 5종 반영
- [x] `CLAUDE.md` “2. 작업 전 반드시 읽을 문서” 갱신

## Acceptance

- 새 LLM 세션이 ADR-003 + 실행 계획만 읽어도 현재 GitHub/MDX 경로를 이해할 수 있다.

## Notes

- 기존 `ADR-001-static-content-first-blog.md` 는 “Superseded by ADR-002 (부분)” 헤더만 추가하고 본문은 보존.
- ADR-002는 Next.js 결정만 유효하게 남기고 Supabase/Auth/Storage/Tiptap 관리자 CMS 범위는 ADR-003에 의해 보류한다.
