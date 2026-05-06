# CLAUDE.md

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

이 파일은 AI 코딩 도구가 `AI Vibe Lab` 프로젝트를 구현할 때 반드시 따라야 하는 작업 규칙이다.

---

## 1. 프로젝트 목표

AI 시대에 개발자, 연구자, 직장인이 실제로 써먹을 수 있는 AI 도구, 바이브코딩, 업무 자동화, 리서치 워크플로우를 직접 실험하고 검증하는 블로그를 만든다.

블로그는 SEO 친화적이고, 향후 Google AdSense를 붙일 수 있어야 한다.

현재 구현 방향은 `ADR-003`에 따라 **Next.js + GitHub + MDX + Vercel 기반 공개 블로그**다. `ADR-002`의 Supabase + Tiptap 비공개 관리자 CMS는 보류한다.

---

## 2. 작업 전 반드시 읽을 문서

아래 순서로 읽고 작업한다.

1. `docs/README.md`
2. `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`
3. `docs/40_architecture/ARCHITECTURE.md`
4. `docs/00_overview/PRODUCT_BRIEF.md`
5. `docs/00_overview/OPEN_QUESTIONS.md`
6. `docs/10_content/CONTENT_STRATEGY.md`
7. `docs/10_content/CONTENT_MODEL.md`
8. `docs/20_site/SERVICE_IA.md`
9. `docs/20_site/SCREEN_INVENTORY.md`
10. `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
11. `docs/70_ops/DEPLOYMENT.md`
12. `docs/50_execution/IMPLEMENTATION_PLAN.md`

문서와 충돌하는 구현을 하지 않는다. 충돌이 있으면 `ADR-003`와 `IMPLEMENTATION_PLAN.md`가 현재 MVP 판단에서 우선한다. `AUTH_AND_PERMISSIONS.md`, `admin-cms.md`, `media-library.md`는 ADR-002 보류 문서다.

---

## 3. 핵심 구현 원칙

- 신규 Next.js 앱은 `apps/web/`에 만든다.
- 콘텐츠 원본은 GitHub repository의 MDX 파일이다.
- 글은 `content/posts/<slug>/index.mdx` 또는 Phase 2에서 확정한 동등한 폴더 구조로 관리한다.
- 공개 글 상세 페이지는 서버에서 HTML로 렌더링한다.
- 클라이언트 전용 SPA로 블로그 본문을 렌더링하지 않는다.
- 모든 글 상세 페이지는 고유한 title, description, canonical, Open Graph, JSON-LD를 가진다.
- sitemap, robots.txt, RSS, ads.txt를 제공한다.
- 모바일에서 읽기 쉬운 레이아웃을 우선한다.
- 글 본문은 JS 없이도 읽을 수 있어야 한다.
- draft, scheduled, archived 글은 production 공개 경로, sitemap, RSS에 노출하지 않는다.
- `/admin` 링크는 공개 메뉴, footer, sitemap, RSS에 넣지 않는다.
- `/admin`, `/api/admin/*`, Supabase, Tiptap, runtime media upload는 현재 MVP에서 구현하지 않는다.
- 광고 슬롯은 만들 수 있지만, 승인 전 실제 광고 로딩은 비활성화한다.
- 관리자, preview, draft 화면에는 AdSense를 마운트하지 않는다.

---

## 4. 추천 구현 순서

1. Phase 0 문서와 결정값 확인
2. `apps/web/` Next.js App Router 프로젝트 생성
3. TypeScript, Tailwind, shadcn/ui 기본 설정
4. public route group 골격 생성 (`/admin`은 공개하지 않고 보류)
5. 기존 Astro 디자인 토큰과 레이아웃 이식
6. GitHub/MDX content tree와 frontmatter schema 구현
7. `/posts`, `/posts/[slug]`를 MDX HTML 렌더링으로 연결
8. taxonomy, sitemap, robots.txt, RSS를 published MDX 기준으로 연결
9. Privacy/Contact/AdSense 준비
10. Vercel production 배포와 도메인 연결

---

## 5. 변경 규칙

신규 공개 페이지를 만들면 아래 문서를 확인한다.

- `docs/20_site/SERVICE_IA.md`
- `docs/20_site/SCREEN_INVENTORY.md`

신규 관리자 기능을 되살리려면 먼저 ADR을 추가하고 아래 보류 문서를 확인한다.

- `docs/20_features/admin-cms.md`
- `docs/40_architecture/AUTH_AND_PERMISSIONS.md`

새 글 타입이나 metadata 필드를 추가하면 아래 문서를 갱신한다.

- `docs/10_content/CONTENT_MODEL.md`
- `docs/10_content/ARTICLE_TEMPLATE.md`

이미지/파일 정책을 바꾸면 아래 문서를 갱신한다.

- `docs/20_features/media-library.md`
- `docs/40_architecture/AUTH_AND_PERMISSIONS.md`

SEO나 광고 관련 구현을 바꾸면 아래 문서를 갱신한다.

- `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`

배포, 환경변수, 도메인 설정을 바꾸면 아래 문서를 갱신한다.

- `docs/70_ops/DEPLOYMENT.md`

큰 기술 결정을 바꾸면 ADR을 추가한다.

---

## 6. 금지

- 문서에 없는 주요 URL 구조를 임의로 만든다.
- 글 상세를 클라이언트 렌더링만으로 만든다.
- 모든 글에 같은 meta description을 쓴다.
- `/admin`을 공개 메뉴나 sitemap에 넣는다.
- ADR 없이 Supabase/Auth/Admin CMS/Tiptap 작업을 되살린다.
- draft/scheduled 글을 공개 sitemap/RSS에 노출한다.
- 광고 클릭을 유도하는 UI를 만든다.
- Privacy Policy 없이 광고/분석 코드를 붙인다.
- 빈 카테고리/태그 페이지를 대량 생성한다.
- AI 생성 일반론 글을 샘플 콘텐츠로 대량 추가한다.

---

## 7. 샘플 글 작성 규칙

샘플 글은 lorem ipsum 대신 실제 블로그 방향을 보여주는 내용으로 작성한다.

초기 샘플 후보:

1. 바이브코딩으로 독립 블로그를 만들 때 먼저 문서화할 것들
2. Cursor로 Astro 블로그를 만들어본 과정과 실패한 점
3. AdSense 신청 전 AI 블로그 체크리스트

각 샘플 글은 `docs/10_content/ARTICLE_TEMPLATE.md` 구조를 따른다.
