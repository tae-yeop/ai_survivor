# Slice 2.4 — 분류 페이지

Phase: 2 — Git-backed MDX Public Read
Status: Done (2026-05-06)

## Goal

categories / tags / series / tools 페이지가 MDX frontmatter 기준으로 동작한다.

## Tasks

- [x] `categoryBuckets`, `tagBuckets`, `seriesBuckets`, `toolBuckets` 헬퍼를 content loader 기준으로 구현
- [x] 각 분류 index/detail 페이지를 published 글만 사용하도록 교체
- [x] 빈 분류 페이지를 자동 생성하지 않도록 처리
- [x] 분류 slug normalization 규칙 문서화
- [x] 분류별 metadata/canonical 생성

## Acceptance

- 카테고리/태그/시리즈/도구 index에서 항목 클릭 시 해당 published 글 목록이 렌더링된다.
- draft/scheduled 글의 태그나 카테고리는 public 분류 집계에 나타나지 않는다.
