# Slice 6.4 — SEO 패널 강화

Phase: 6 — Content Ops
Status: Partial — basic metadata form implemented, advanced SEO panel backlog

> Current admin form already edits title, description, dates, status, category/tags/tools, series, cover image, and cover alt. Advanced SEO preview/canonical/noindex/OG generation is not implemented.

## Goal

글 작성 화면에서 SEO 메타와 OG 카드를 직접 제어할 수 있다.

## Tasks

- [x] title / description frontmatter 입력
- [x] cover image / cover alt 입력
- [x] status / publishedAt / updatedAt 입력
- [ ] canonical / noindex 필드 필요성 결정
- [ ] 검색결과/공유 카드 미리보기 UI 구현
- [ ] OG image 자동 생성은 운영 도메인 확정 후 검토

## Acceptance

- 모든 발행 글이 글별 고유 SEO 필드 + OG 이미지를 가진다.
- SEO 필드는 public metadata, sitemap, RSS와 일관된다.
