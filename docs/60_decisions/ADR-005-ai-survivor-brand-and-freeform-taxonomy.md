# ADR-005. AI Survivor Brand and Free-form Taxonomy

## Status

Accepted

## Context

초기 문서는 AI Vibe Lab 중심이었지만, 실제 제품 방향은 “AI 도구와 튜토리얼을 직접 끝까지 따라 해보고 생존 가능한 방법만 남기는 기록”으로 좁혀졌다.

또한 기존 category enum은 한국어/영어 혼합 카테고리, 튜토리얼 검증형 글, 도구별 사용기를 자연스럽게 담기 어렵다.

## Decision

- 표시 브랜드는 **AI 시대 생존기 / AI Survivor**로 둔다.
- 2026-05-09 update: 도메인은 아직 구매 전이므로 코드 기본값으로 특정 운영 도메인을 하드코딩하지 않는다. Vercel에서는 `NEXT_PUBLIC_SITE_URL` 또는 Vercel-provided URL을 사용하고, 도메인 구매 후 운영 도메인으로 교체한다.
- category와 tag는 frontmatter의 free-form 문자열로 받는다.
- route path에는 raw label을 쓰지 않고 `slugifyTaxonomy()` 결과를 쓴다.
- category/tag bucket은 같은 slug로 충돌하는 raw value를 감지해야 한다.

## Consequences

### Positive

- 한국어 카테고리와 mixed-case tool tag를 자연스럽게 쓸 수 있다.
- 브랜드가 “뉴스/소개”가 아니라 “직접 검증”에 맞춰진다.
- 콘텐츠가 블로그, 인스타, 유튜브로 확장되기 쉽다.

### Negative

- 모든 taxonomy 링크와 revalidation path가 slug helper를 공유해야 한다.
- raw label과 route slug가 분리되므로 테스트가 없으면 링크 drift가 생긴다.
- domain과 표시 브랜드가 당분간 다를 수 있다.

## Implementation Notes

- `apps/web/src/lib/content/slugify.ts`
- `apps/web/src/lib/content/posts.ts`
- `apps/web/src/components/layout/PostsNavDropdown.tsx`
- `apps/web/src/components/post/post-card.tsx`
- `apps/web/app/(public)/categories/[category]/page.tsx`
- `apps/web/app/(public)/tags/[tag]/page.tsx`

## Source Notes

- `docs/60_decisions/design-notes/2026-05-07-rebrand-survivor-design.md`
- `docs/50_execution/phase-10-brand-redesign/source-plans/2026-05-07-rebrand-survivor-implementation.md`
