# CLAUDE.md

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

이 파일은 AI 코딩 도구가 이 블로그 프로젝트를 구현할 때 반드시 따라야 하는 작업 규칙이다.

---

## 1. 프로젝트 목표

AI 시대에 개발자, 연구자, 직장인이 실제로 써먹을 수 있는 AI 도구, 바이브코딩, 업무 자동화, 리서치 워크플로우를 직접 실험하고 검증하는 블로그를 만든다.

블로그는 SEO 친화적이고, 향후 Google AdSense를 붙일 수 있어야 한다.

---

## 2. 작업 전 반드시 읽을 문서

아래 순서로 읽고 작업한다.

1. `docs/README.md`
2. `docs/00_overview/PRODUCT_BRIEF.md`
3. `docs/00_overview/OPEN_QUESTIONS.md`
4. `docs/10_content/CONTENT_STRATEGY.md`
5. `docs/10_content/CONTENT_MODEL.md`
6. `docs/20_site/SERVICE_IA.md`
7. `docs/20_site/SCREEN_INVENTORY.md`
8. `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
9. `docs/40_architecture/ARCHITECTURE.md`
10. `docs/50_execution/ROADMAP.md`

문서와 충돌하는 구현을 하지 않는다.

---

## 3. 핵심 구현 원칙

- 콘텐츠 페이지는 정적 HTML을 우선한다.
- 클라이언트 전용 SPA로 블로그 본문을 렌더링하지 않는다.
- 모든 글 상세 페이지는 고유한 title, description, canonical, Open Graph, JSON-LD를 가진다.
- sitemap, robots.txt, RSS를 제공한다.
- 모바일에서 읽기 쉬운 레이아웃을 우선한다.
- 글 본문은 JS 없이도 읽을 수 있어야 한다.
- draft 글은 production에서 노출하지 않는다.
- 광고 슬롯은 만들 수 있지만, 승인 전 실제 광고 로딩은 비활성화한다.

---

## 4. 추천 구현 순서

1. 프로젝트 생성
2. 기본 레이아웃
3. MDX content model
4. 글 목록
5. 글 상세
6. 카테고리/태그 생성
7. About / Contact / Privacy
8. SEO metadata
9. sitemap / robots.txt / RSS
10. 광고 슬롯 컴포넌트, 기본 비활성화
11. 샘플 글 3개 작성
12. 빌드/배포 검증

---

## 5. 변경 규칙

신규 페이지를 만들면 아래 문서를 확인한다.

- `docs/20_site/SERVICE_IA.md`
- `docs/20_site/SCREEN_INVENTORY.md`

새 글 타입이나 frontmatter 필드를 추가하면 아래 문서를 갱신한다.

- `docs/10_content/CONTENT_MODEL.md`
- `docs/10_content/ARTICLE_TEMPLATE.md`

SEO나 광고 관련 구현을 바꾸면 아래 문서를 갱신한다.

- `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`

큰 기술 결정을 바꾸면 ADR을 추가한다.

---

## 6. 금지

- 문서에 없는 주요 URL 구조를 임의로 만든다.
- 글 상세를 클라이언트 렌더링만으로 만든다.
- 모든 글에 같은 meta description을 쓴다.
- 광고 클릭을 유도하는 UI를 만든다.
- 빈 카테고리/태그 페이지를 대량 생성한다.
- AI 생성 일반론 글을 샘플 콘텐츠로 대량 추가한다.
- Privacy Policy 없이 광고/분석 코드를 붙인다.

---

## 7. 샘플 글 작성 규칙

샘플 글은 lorem ipsum 대신 실제 블로그 방향을 보여주는 내용으로 작성한다.

초기 샘플 후보:

1. 바이브코딩으로 독립 블로그를 만들 때 먼저 문서화할 것들
2. Cursor로 Astro 블로그를 만들어본 과정과 실패한 점
3. AdSense 신청 전 AI 블로그 체크리스트

각 샘플 글은 `docs/10_content/ARTICLE_TEMPLATE.md` 구조를 따른다.
