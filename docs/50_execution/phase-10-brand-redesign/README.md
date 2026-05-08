# Phase 10. Brand Redesign

## 상태

완료. 이 phase는 Superpowers 계획 문서로 시작했고, 구현 후 운영 문서와 ADR로 정리했다.

## 목표

- 표시 브랜드를 AI 시대 생존기 / AI Survivor로 정리한다.
- AI Vibe Lab 중심의 초기 문서와 UI 카피를 새 포지셔닝으로 갱신한다.
- 카테고리/태그를 free-form frontmatter 값으로 다루되 route는 안정적인 slug를 사용한다.
- 홈과 글 상세 화면을 clean white editorial UI로 바꾼다.

## 구현된 결과

- `slugifyTaxonomy()` 기반 category/tag routing
- header posts dropdown
- `HeroCanvas` 기반 homepage hero
- homepage category filter와 card grid
- popular posts와 tag cloud
- post detail cover image, centered prose, floating TOC
- browser writing workflow와 in-place edit 흐름 유지

## 검증 기준

- category/tag static params와 rendered href가 같은 slug contract를 써야 한다.
- `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`가 통과해야 한다.
- published가 아닌 draft/scheduled 글은 RSS/sitemap에 노출되지 않아야 한다.

## 관련 문서

- Brand overview: `../../00_overview/BRAND_OVERVIEW.md`
- Product brief: `../../00_overview/PRODUCT_BRIEF.md`
- Content strategy: `../../10_content/CONTENT_STRATEGY.md`
- ADR-005: `../../60_decisions/ADR-005-ai-survivor-brand-and-freeform-taxonomy.md`
- ADR-006: `../../60_decisions/ADR-006-clean-white-home-and-post-redesign.md`

## 원본 계획 산출물

- `source-plans/2026-05-07-rebrand-survivor-implementation.md`
- `source-plans/2026-05-08-visual-redesign.md`

디자인 원본은 `../../60_decisions/design-notes/`에 보관한다.
