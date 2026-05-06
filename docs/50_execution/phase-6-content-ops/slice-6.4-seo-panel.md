# Slice 6.4 — SEO 패널 강화

Phase: 6 — Content Ops
Status: Needs Rewrite for ADR-003

> This slice was written for the ADR-002 admin CMS path. Rework it into GitHub/MDX checklist, lint, or GitHub Actions workflow before implementation.

## Goal

글 작성 화면에서 SEO 메타와 OG 카드를 직접 제어할 수 있다.

## Tasks

- [ ] 편집 폼 우측에 “SEO 패널”: SEO title, description, canonical, OG image, noindex
- [ ] OG image 자동 생성 (@vercel/og) — 기본값 폴백
- [ ] 미리보기에서 검색결과/공유 카드 시뮬레이션

## Acceptance

- 모든 발행 글이 글별 고유 SEO 필드 + OG 이미지를 가진다.
