# ADR-006. Clean White Home and Post Redesign

## Status

Accepted

## Context

브랜드가 AI 시대 생존기로 바뀌면서 public site도 “도구 소개 목록”보다 “실전 기록 아카이브”처럼 보여야 했다. 홈은 최신 글만 나열하기보다, hero, 카테고리 필터, 인기 글, 태그 탐색을 한 화면에서 제공해야 한다.

글 상세는 읽기 폭, cover image, 목차가 필요했다. 긴 튜토리얼 글이 늘어날수록 탐색성과 읽기 경험이 중요해진다.

## Decision

- 전체 시각 방향은 clean white editorial UI로 둔다.
- 홈 상단은 `HeroCanvas`로 브랜드 문장을 보여준다.
- 홈 글 목록은 3-column card grid와 category filter를 사용한다.
- 보조 탐색으로 popular posts와 tag cloud를 둔다.
- 글 상세는 680px 중심 prose, cover image, floating TOC를 기준으로 한다.
- 추가 animation dependency는 넣지 않는다. canvas와 browser API로 처리한다.

## Consequences

### Positive

- 브랜드 메시지가 첫 화면에서 바로 보인다.
- 긴 튜토리얼 글의 읽기 경험이 좋아진다.
- 카테고리/태그 탐색이 홈에서 더 빨라진다.

### Negative

- canvas hero는 접근성과 성능 검증이 필요하다.
- 카드/필터/TOC가 늘면서 UI 컴포넌트 간 route contract 테스트가 중요해졌다.
- 카피가 깨지면 첫 화면 품질이 바로 무너진다.

## Implementation Notes

- `apps/web/src/components/home/HeroCanvas.tsx`
- `apps/web/src/components/home/HomePostsSection.tsx`
- `apps/web/src/components/post/PostCardGrid.tsx`
- `apps/web/src/components/post/PostCoverImage.tsx`
- `apps/web/src/components/post/TableOfContents.tsx`
- `apps/web/app/(public)/page.tsx`
- `apps/web/app/(public)/posts/[slug]/page.tsx`

## Source Notes

- `docs/60_decisions/design-notes/2026-05-08-visual-redesign-design.md`
- `docs/50_execution/phase-10-brand-redesign/source-plans/2026-05-08-visual-redesign.md`
