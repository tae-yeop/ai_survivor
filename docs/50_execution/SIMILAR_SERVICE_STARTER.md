# Similar Service Starter — Git-backed 콘텐츠 서비스 빠른 시작

> Current as of 2026-05-09. 이 문서는 AI Survivor 구현을 바탕으로 **비슷한 블로그/콘텐츠 서비스를 빠르게 시작**하기 위한 실행 순서다.

---

## 0. 목표 아키텍처

```text
Next.js App Router
  -> Git-tracked MDX content
  -> static/public read pages
  -> owner-only browser editor
  -> GitHub Contents API commits
  -> Vercel deploy
```

이 방식이 잘 맞는 서비스:

- 1인 또는 소수 운영자가 글/리뷰/리서치 로그를 발행한다.
- public SEO 페이지가 중요하다.
- DB/CMS를 먼저 붙이기보다 Git history로 변경 이력을 관리하고 싶다.
- 관리자 기능은 “로그인 후 글 쓰기/수정” 정도면 충분하다.

처음부터 다른 선택을 고려해야 하는 서비스:

- 다중 사용자 권한, 댓글, 좋아요, 결제, 개인화가 핵심이다.
- 초당/분당 빈번한 content mutation이 필요하다.
- 대용량 영상/이미지를 자체 업로드해야 한다.
- 비개발자가 복잡한 block CMS를 매일 써야 한다.

---

## 1. Phase 0 — 새 서비스 결정사항 잠금

산출물:

- `docs/00_overview/PRODUCT_BRIEF.md`
- `docs/10_content/CONTENT_MODEL.md`
- `docs/40_architecture/HOW_IT_WORKS.md`
- `docs/60_decisions/ADR-001-static-content-first.md`

체크리스트:

- [ ] 서비스 이름, 도메인, 언어, 대상 독자를 정한다.
- [ ] 콘텐츠 단위를 정한다. 예: post, tool review, case study, note.
- [ ] 공개 상태값을 정한다. 권장: `draft | published | scheduled | archived`.
- [ ] taxonomy를 정한다. 권장: category 1개 + tags 여러 개 + optional series/tools.
- [ ] media 정책을 정한다. 작은 이미지는 Git, 큰 영상은 외부 저장소.
- [ ] “DB 없음”이 현재 목표에 맞는지 확인한다.

AI Survivor에서 참고할 파일:

- `docs/40_architecture/HOW_IT_WORKS.md`
- `apps/web/src/lib/content/posts.ts`
- `apps/web/content/README.md`

---

## 2. Phase 1 — Next.js 앱 뼈대

산출물:

- `apps/web/package.json`
- `apps/web/app/layout.tsx`
- `apps/web/app/(public)/layout.tsx`
- `apps/web/src/lib/site.ts`
- `apps/web/src/styles/global.css`

작업:

1. Next.js App Router 앱을 만든다.
2. Tailwind를 연결한다.
3. `src/lib/site.ts`에 사이트 상수를 모은다.
4. public layout에 header/footer/skip link를 둔다.
5. `NEXT_PUBLIC_SITE_URL` 기반 `absoluteUrl()` helper를 만든다.

검증:

```bash
cd apps/web
npm run dev
npm run typecheck
npm run build
```

---

## 3. Phase 2 — Git-backed content read model

산출물:

```text
apps/web/content/posts/<slug>/index.mdx
apps/web/src/lib/content/posts.ts
apps/web/src/lib/content/slugify.ts
apps/web/app/(public)/posts/page.tsx
apps/web/app/(public)/posts/[slug]/page.tsx
apps/web/app/(public)/categories/[category]/page.tsx
apps/web/app/(public)/tags/[tag]/page.tsx
```

작업:

1. post folder convention을 고정한다.
2. frontmatter parser/validator를 만든다.
3. body safety check를 만든다.
4. public filter를 만든다.
   - `status === "published"`
   - `publishedAt <= today`
5. post index/detail을 렌더한다.
6. category/tag/series/tool bucket을 만든다.
7. slug collision을 production에서 실패시키도록 한다.

권장 frontmatter:

```yaml
title: "Example post"
description: "Search/list summary"
slug: "example-post"
publishedAt: 2026-05-09
updatedAt: 2026-05-09
status: draft
category: "vibe-coding-lab"
tags:
  - ai
  - workflow
series: null
seriesOrder: null
author: owner
difficulty: beginner
tools:
  - ChatGPT
coverImage: null
coverAlt: null
featured: false
```

검증:

```bash
cd apps/web
npm run test
npm run build
```

테스트에서 반드시 잠글 것:

- draft/scheduled/archived는 public collection에서 제외된다.
- 미래 `publishedAt`은 제외된다.
- slug와 folder명이 다르면 실패한다.
- unsafe body가 실패한다.
- taxonomy slug collision이 감지된다.

---

## 4. Phase 3 — SEO 기본 출력

산출물:

```text
apps/web/src/lib/seo/metadata.ts
apps/web/app/sitemap.ts
apps/web/app/robots.ts
apps/web/app/rss.xml/route.ts
apps/web/app/ads.txt/route.ts
apps/web/app/(public)/about/page.tsx
apps/web/app/(public)/contact/page.tsx
apps/web/app/(public)/privacy/page.tsx
```

작업:

1. 모든 public page에 title/description/canonical을 둔다.
2. post detail에 Article JSON-LD를 둔다.
3. RSS는 published posts만 최대 N개 내보낸다.
4. sitemap은 static pages + published posts + taxonomy pages만 포함한다.
5. robots는 `/admin`, `/preview`를 disallow한다.
6. `ads.txt`는 publisher id가 없으면 placeholder만 반환한다.
7. About/Contact/Privacy를 먼저 완성한다.

검증:

- [ ] `/rss.xml`이 XML로 열린다.
- [ ] `/sitemap.xml`에 draft가 없다.
- [ ] `/robots.txt`가 admin을 막는다.
- [ ] `/ads.txt`가 publisher id 없이도 안전하게 응답한다.

---

## 5. Phase 4 — Owner-only GitHub admin

산출물:

```text
apps/web/src/lib/admin/env.ts
apps/web/src/lib/admin/session-token.ts
apps/web/src/lib/admin/session.ts
apps/web/src/lib/admin/github-oauth.ts
apps/web/src/lib/admin/github-content.ts
apps/web/src/lib/admin/mdx.ts
apps/web/app/api/admin/github/login/route.ts
apps/web/app/api/admin/github/callback/route.ts
apps/web/app/api/admin/logout/route.ts
apps/web/app/(admin)/admin/page.tsx
apps/web/app/(admin)/admin/actions.ts
apps/web/app/(admin)/admin/_components/post-form.tsx
```

작업:

1. GitHub OAuth App을 만든다.
2. callback URL을 설정한다.
   - local: `http://localhost:3000/api/admin/github/callback`
   - prod: `https://<domain>/api/admin/github/callback`
3. OAuth state cookie를 검증한다.
4. GitHub user login/id allowlist를 검증한다.
5. `ADMIN_SESSION_SECRET`으로 서명된 httpOnly session cookie를 만든다.
6. `/admin`과 mutation server action에서 `requireAdminSession()`을 호출한다.
7. GitHub Contents API read/list/write helper를 만든다.
8. save action은 MDX serialize 후 `PUT /repos/{owner}/{repo}/contents/{path}`로 커밋한다.

필수 env:

```env
ADMIN_GITHUB_LOGIN=""
ADMIN_GITHUB_ID=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
ADMIN_SESSION_SECRET=""
GITHUB_CONTENT_TOKEN=""
GITHUB_REPO="owner/repo"
GITHUB_BRANCH="master"
```

검증:

- [ ] env가 없을 때 public build는 실패하지 않는다.
- [ ] env가 없을 때 admin UI에만 설정 경고가 나온다.
- [ ] 허용되지 않은 GitHub 계정은 로그인되지 않는다.
- [ ] 새 글은 기본 `draft`로 저장된다.
- [ ] 저장 결과가 GitHub commit으로 남는다.

---

## 6. Phase 5 — Editor / media

산출물:

```text
apps/web/src/components/admin/RichEditor/*
apps/web/src/components/mdx/Figure.tsx
apps/web/src/components/mdx/AudioEmbed.tsx
apps/web/src/components/mdx/DocumentEmbed.tsx
apps/web/src/components/mdx/YouTube.tsx
apps/web/src/components/mdx/mdx-components.tsx
apps/web/app/api/admin/upload/[slug]/route.ts
```

작업:

1. 처음에는 textarea/markdown editor로 시작해도 된다.
2. 반복 작성이 필요해지면 Tiptap/Novel rich editor를 붙인다.
3. editor output은 최종적으로 MDX string이어야 한다.
4. `<Figure />`, `<AudioEmbed />`, `<DocumentEmbed />` 같은 커스텀 컴포넌트를 MDX render와 editor serialize 양쪽에서 맞춘다.
5. 이미지/오디오/문서 업로드는 owner session, slug, MIME, 확장자, 용량을 모두 검증한다.
6. 4MB 이하 작은 이미지·오디오·문서만 GitHub에 커밋한다. PDF는 내장 iframe 뷰어, 그 외 문서는 다운로드/새 탭 카드로 렌더링한다.
7. 큰 media는 R2/Vercel Blob/YouTube/외부 URL로 분리한다.

검증:

- [ ] 붙여넣은 이미지가 안전한 URL 또는 업로드 URL로 변환된다.
- [ ] 오디오/문서 파일 업로드가 `<AudioEmbed />`/`<DocumentEmbed />`로 저장된다.
- [ ] figure/audio/document가 editor -> MDX -> public render 왕복에서 깨지지 않는다.
- [ ] 잘못된 MIME/확장자/큰 파일은 거부된다.

---

## 7. Phase 6 — In-place editing

산출물:

```text
apps/web/src/components/admin/EditOverlay.tsx
apps/web/app/(public)/posts/[slug]/save-action.ts
```

작업:

1. public post detail에 editor overlay를 감싼다.
2. owner session이 없으면 일반 방문자는 아무 차이를 보지 못하게 한다.
3. edit 시작 시 GitHub remote source와 deployed bundled source를 비교한다.
4. 저장 시 base SHA를 제출해 충돌을 감지한다.
5. 충돌하면 저장하지 않고 새로고침/재시도를 안내한다.

검증:

- [ ] 일반 방문자는 edit UI를 볼 수 없다.
- [ ] owner는 post detail에서 바로 수정할 수 있다.
- [ ] 동일 글을 다른 곳에서 먼저 저장하면 conflict가 난다.

---

## 8. Phase 7 — Launch

작업:

1. Vercel project root를 `apps/web`으로 설정한다.
2. production env를 넣는다.
3. GitHub content token 권한을 최소화한다.
4. 첫 published 글 3~5개를 준비한다.
5. Search Console/Naver Search Advisor를 등록한다.
6. AdSense는 정책 페이지와 충분한 content 이후 신청한다.

Release smoke URLs:

- `/`
- `/posts`
- one `/posts/<slug>`
- `/categories`
- `/tags`
- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`
- `/about`
- `/contact`
- `/privacy`
- `/admin/login`

---

## 9. 복제 시 우선순위

### 꼭 가져갈 것

- content loader + tests
- public route set
- SEO route handlers
- GitHub OAuth/session/content write helpers
- admin save action
- `.env.example`
- docs/ADR skeleton

### 서비스마다 다시 만들 것

- brand copy
- home page information architecture
- category/tag naming
- article template
- visual system
- monetization policy
- media storage policy

### 나중에 붙일 것

- full CMS
- DB
- multi-user roles
- analytics dashboard
- newsletter/subscription
- comment/community features
- large media processing

---

## 10. 최소 작업 순서 요약

```text
1. Product/domain/content model 결정
2. Next.js + Tailwind app 생성
3. content/posts/<slug>/index.mdx 규칙 생성
4. loader validation + public filter 구현
5. posts/detail/taxonomy route 구현
6. sitemap/rss/robots/ads/policy pages 구현
7. Vercel 배포
8. GitHub OAuth owner login 구현
9. GitHub Contents API save 구현
10. rich editor/media/in-place edit는 필요해진 만큼 확장
```

가장 중요한 원칙: **public read path는 항상 단순하게 유지하고, admin/editor 복잡도는 public rendering과 분리한다.**
