# Slice 2.1 — MDX 콘텐츠 모델

Phase: 2 — Git-backed MDX Public Read
Status: Done (2026-05-06)

## Goal

블로그 글의 원본 포맷과 메타데이터 계약을 확정한다. 모든 공개 글은 GitHub에 저장된 MDX 파일과 검증된 frontmatter에서 나온다.

## Tasks

- [x] 콘텐츠 루트 결정: `apps/web/content/posts/` 또는 `content/posts/` 중 하나로 고정
- [x] post 폴더 규칙 확정: `apps/web/content/posts/<slug>/index.mdx`, `cover.*`, `assets/`
- [x] frontmatter schema 작성 (`title`, `description`, `publishedAt`, `updatedAt`, `category`, `tags`, `series`, `tools`, `status`, `coverImage`)
- [x] `status` enum 정의: `draft`, `published`, `scheduled`, `archived`
- [x] slug 충돌, 누락 metadata, 빈 description을 test/typecheck/build에서 잡는 검증 추가
- [x] MDX에서 허용할 raw HTML/iframe/embed allowlist 기준 문서화

## Acceptance

- 잘못된 frontmatter를 가진 샘플 글을 넣으면 검증이 실패한다.
- published 글만 public loader가 반환한다.
- 문서만 보고도 새 글 폴더를 만들 수 있다.

> Implementation note: Authoring guide lives at `apps/web/content/README.md`; content root is `apps/web/content/posts/`.
