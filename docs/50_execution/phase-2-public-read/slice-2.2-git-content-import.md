# Slice 2.2 — Git 콘텐츠 이식

Phase: 2 — Git-backed MDX Public Read
Status: Done (2026-05-06)

## Goal

기존 글 또는 샘플 글을 새 MDX content tree에 넣고, GitHub commit/PR 단위로 관리 가능한 구조를 만든다.

## Tasks

- [x] 기존 글 위치 확인 (`articles/`, `src/content/`, sample data 등)
- [x] 최소 3개, 가능하면 5개 글을 `content/posts/<slug>/index.mdx` 구조로 이식
- [x] 각 글에 고유 `title`, `description`, `date`, `category`, `tags`, `status: published` 지정
- [x] 이미지가 있는 글은 post 폴더 안 `cover.*` 또는 `assets/`로 이동하고 상대 경로로 참조
- [x] draft/scheduled 샘플 1개를 추가해 public exclusion 테스트 입력으로 사용
- [x] GitHub 웹 편집/PR에서 수정하기 쉬운 작성 가이드 초안 추가

## Acceptance

- 실제 MDX 글 3개 이상이 content tree에 존재한다.
- 각 글의 metadata가 중복 description 없이 검증을 통과한다.
- draft/scheduled 샘플은 public listing에 노출되지 않는다.
