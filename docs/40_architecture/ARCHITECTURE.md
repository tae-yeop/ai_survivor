# Architecture

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

## 1. 아키텍처 원칙

- 콘텐츠 페이지는 정적 HTML을 우선한다.
- 블로그 MVP에서는 서버 기능을 최소화한다.
- 댓글, 로그인, CMS, 복잡한 DB는 초기 범위에서 제외한다.
- SEO에 필요한 메타데이터는 빌드 시 생성한다.
- 글은 Markdown/MDX 파일로 관리한다.
- 클라이언트 JavaScript는 필요한 곳에만 쓴다.

---

## 2. 기본 기술 스택 가정

MVP 기본안:

```text
Framework: Astro
Content: MDX / Markdown
Styling: CSS Modules 또는 Tailwind CSS
Hosting: Vercel 또는 Cloudflare Pages
Analytics: Google Search Console + 필요 시 간단한 웹 분석
Ads: Google AdSense, 승인 후 활성화
```

대안:

```text
Next.js SSG/ISR
```

블로그 중심이면 Astro를 우선 고려하고, 웹앱 기능이 커지면 Next.js를 재검토한다.

---

## 3. 추천 폴더 구조

```text
/
├─ src/
│  ├─ content/
│  │  └─ posts/
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ post/
│  │  ├─ seo/
│  │  └─ ads/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ posts/
│  │  ├─ categories/
│  │  ├─ tags/
│  │  ├─ series/
│  │  ├─ tools/
│  │  ├─ about.astro
│  │  ├─ contact.astro
│  │  ├─ privacy.astro
│  │  ├─ rss.xml.ts
│  │  └─ 404.astro
│  ├─ lib/
│  │  ├─ posts.ts
│  │  ├─ taxonomy.ts
│  │  ├─ seo.ts
│  │  └─ reading-time.ts
│  └─ styles/
├─ public/
│  ├─ images/
│  ├─ robots.txt
│  └─ favicon.svg
├─ docs/
└─ CLAUDE.md
```

---

## 4. 컴포넌트 규칙

### Layout

- `BaseLayout`: HTML shell, global metadata, header/footer
- `PostLayout`: 글 상세 전용 레이아웃
- `ListLayout`: 글 목록/카테고리/태그 목록 공통

### Post

- `PostCard`
- `PostMeta`
- `TableOfContents`
- `RelatedPosts`
- `SeriesNav`
- `AuthorBox`

### SEO

- `SeoHead`
- `JsonLdArticle`
- `OpenGraphImage` 후보

### Ads

- `AdSlot`
- 승인 전에는 placeholder 또는 disabled 상태
- 광고 정책과 UX 원칙은 `SEO_ADSENSE_CHECKLIST.md`를 따른다.

---

## 5. 렌더링 규칙

- 글 상세, 목록, 카테고리, 태그, 시리즈는 정적으로 생성한다.
- draft 글은 production build에서 제외한다.
- slug 변경은 redirect를 고려한다.
- JS 없이도 본문 읽기가 가능해야 한다.
- 목차, 코드 하이라이트, 이미지, 내부 링크는 정적 HTML에 포함한다.

---

## 6. 데이터 흐름

```text
MDX Posts
  → Content Collection / Post Loader
  → Taxonomy Builder
  → Static Routes
  → SEO Metadata
  → Sitemap / RSS
```

---

## 7. 비범위

MVP에서 하지 않는다.

- DB 기반 글 관리
- 관리자 CMS
- 로그인
- 댓글
- 개인화 추천
- 복잡한 검색 서버
- 실시간 기능
