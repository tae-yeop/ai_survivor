# Slice 2.3 — 정적/서버 글 렌더링

Phase: 2 — Git-backed MDX Public Read
Status: Done (2026-05-06)

## Goal

`/posts`, `/posts/[slug]`가 fixture가 아니라 Git MDX content tree에서 데이터를 읽어 HTML로 렌더링된다.

## Tasks

- [x] `src/lib/content/posts.ts` 작성: published 글 목록, slug 조회, related metadata helper
- [x] MDX compile/render 경로 결정 (`next-mdx-remote`, `@mdx-js/mdx`, Contentlayer 대안 검토 후 최소 구현)
- [x] `app/(public)/posts/page.tsx`를 content loader 기반으로 교체
- [x] `app/(public)/posts/[slug]/page.tsx`를 content loader + MDX body renderer 기반으로 교체
- [x] `generateStaticParams` 또는 정적 빌드 전략 확정
- [x] `generateMetadata`에서 title/description/canonical/OG를 frontmatter 기준으로 생성
- [x] JSON-LD `Article` 삽입

> Implementation note: MVP renderer uses validated frontmatter plus a safe HTML/Markdown subset, avoiding new MDX runtime dependencies until custom MDX components are needed.

## Acceptance

- 글 상세 페이지가 JS 비활성 환경에서도 본문 HTML을 보여준다.
- 존재하지 않는 slug는 404를 반환한다.
- `view-source`에 title/description/og/json-ld가 들어 있다.
