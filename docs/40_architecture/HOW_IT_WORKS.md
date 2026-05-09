# How It Works — AI Survivor 구현 개요

> Current as of 2026-05-09. 이 문서는 현재 코드 기준으로 **공개 블로그**, **브라우저 글쓰기/관리자**, **로컬 개발**, **배포** 흐름을 한 번에 파악하기 위한 기술 개요다.

---

## 1. Big Picture

```text
Visitor browser
  -> Vercel / Next.js App Router app (apps/web)
      -> public pages: static/server-rendered blog UI
      -> content loader: apps/web/content/posts/<slug>/index.mdx
      -> SEO outputs: sitemap.xml, robots.txt, rss.xml, ads.txt

Owner browser
  -> /api/admin/github/login
      -> GitHub OAuth
      -> signed httpOnly session cookie
  -> /admin or /write
      -> rich editor + metadata form
      -> server action / upload route
      -> GitHub Contents API
      -> commit to apps/web/content/posts/<slug>/index.mdx or assets/*
      -> Vercel redeploys from Git
```

이 프로젝트의 핵심은 **DB 없는 Git-backed 콘텐츠 서비스**다.

- 글의 source of truth는 `apps/web/content/posts/<slug>/index.mdx`다.
- 공개 사이트는 빌드/서버 렌더 시 MDX 파일을 읽어 SEO 친화 HTML을 만든다.
- 관리자 글쓰기 화면은 별도 DB에 저장하지 않고 GitHub Contents API로 같은 MDX 파일을 커밋한다.
- 루트의 Astro 앱(`src/`)은 전환/참고용 레거시이고, 현재 배포 대상은 `apps/web/` Next.js 앱이다.

---

## 2. Tech Stack

### Active Web App

| 영역          | 선택                                             |
| ------------- | ------------------------------------------------ |
| App framework | Next.js App Router (`apps/web`)                  |
| Language      | TypeScript                                       |
| UI            | React 19 + Tailwind CSS                          |
| Content       | Git-tracked MDX-like files under `content/posts` |
| MDX render    | `next-mdx-remote/rsc` + custom MDX components    |
| Editor        | Novel/Tiptap-based rich editor                   |
| Auth          | GitHub OAuth owner login                         |
| Write storage | GitHub Contents API commits                      |
| Deploy        | Vercel project rooted at `apps/web`              |
| Tests         | Node test runner (`node --test`)                 |

### Legacy / Reference Surface

| 영역     | 선택                                                             |
| -------- | ---------------------------------------------------------------- |
| Root app | Astro 5 + Astro content collections                              |
| Location | root `src/`, root `package.json`                                 |
| Role     | transition/reference material, not the current production target |

---

## 3. 주요 파일 지도

```text
apps/web/
  app/
    (public)/
      page.tsx                         # home
      posts/page.tsx                   # post index
      posts/[slug]/page.tsx            # post detail, SSG params, MDX render
      posts/[slug]/save-action.ts      # in-place edit server action
      categories|tags|series|tools/    # taxonomy list/detail routes
      about|contact|privacy/           # AdSense/policy pages
      write/page.tsx                   # owner-only new post editor
    (admin)/
      admin/page.tsx                   # owner-only post list
      admin/posts/new/page.tsx         # new post form
      admin/posts/[slug]/page.tsx      # advanced edit form
      admin/actions.ts                 # save form -> GitHub commit
      admin/_components/post-form.tsx  # editor form shell
    api/admin/
      github/login/route.ts            # starts GitHub OAuth
      github/callback/route.ts         # verifies OAuth state + owner
      logout/route.ts                  # clears admin session
      me/route.ts                      # session probe
      upload/[slug]/route.ts           # image/audio/document upload -> GitHub content asset
    rss.xml/route.ts                   # RSS from published posts
    ads.txt/route.ts                   # AdSense declaration/placeholder
    robots.ts                          # blocks admin/preview crawling
    sitemap.ts                         # static + published post URLs
    layout.tsx                         # global shell

  content/
    posts/<slug>/index.mdx             # post source
    posts/<slug>/assets/*              # editor-uploaded post assets

  src/
    lib/content/posts.ts               # frontmatter parser, validation, public filtering
    lib/content/slugify.ts             # taxonomy slug normalization
    lib/admin/env.ts                   # admin env parsing
    lib/admin/session*.ts              # HMAC session token/cookie
    lib/admin/github-oauth.ts          # GitHub OAuth helpers
    lib/admin/github-content.ts        # GitHub Contents API read/write
    lib/admin/mdx.ts                   # admin draft <-> MDX serialization
    lib/seo/metadata.ts                # canonical, OG, Twitter metadata
    components/admin/RichEditor/*      # rich editor, slash menu, figure/audio/document serialization
    components/mdx/*                   # Figure, AudioEmbed, DocumentEmbed, YouTube mapping
    components/home/*                  # home sections
    components/post/*                  # post cards/detail helpers

docs/
  40_architecture/                     # architecture/how-it-works docs
  50_execution/                        # roadmap, phases, starter blueprint
  60_decisions/                        # ADRs
```

---

## 4. 공개 읽기 흐름

### 4-1. Home / list / taxonomy

```text
Next route component
  -> import publishedPosts or bucket helpers from src/lib/content/posts.ts
  -> loadPosts()
      -> read apps/web/content/posts/*/index.mdx
      -> parse frontmatter
      -> validate required fields
      -> reject unsafe body patterns
      -> filter status === "published" and publishedAt <= today
      -> sort newest first
  -> render React/Tailwind UI
```

사용되는 대표 함수:

- `publishedPosts`
- `getPublishedPosts()`
- `categoryBuckets()`
- `tagBuckets()`
- `seriesBuckets()`
- `toolBuckets()`

중요한 구현 규칙:

- `draft`, `scheduled`, `archived`는 공개 목록, 상세, RSS, sitemap에 나오면 안 된다.
- `publishedAt`이 미래인 글도 공개되지 않는다.
- 카테고리/태그는 free-form 문자열이고, URL에는 `slugifyTaxonomy()` 결과를 쓴다.
- 같은 taxonomy slug로 정규화되는 서로 다른 label 충돌은 production build에서 실패시킨다.

### 4-2. Post detail

```text
/posts/[slug]
  -> generateStaticParams(): publishedPosts slugs
  -> getPostBySlug(slug)
  -> MDXRemote(source=post.body, components=mdxComponents)
  -> ArticleJsonLd
  -> EditOverlay wraps body for owner in-place editing
```

본문에서 지원하는 커스텀 컴포넌트:

- `<Figure />`
- `<AudioEmbed />`
- `<DocumentEmbed />`
- `<YouTube />`
- 기본 `<img />` lazy image wrapper

안전장치:

- `assertSafeMdxBody()`가 `script`, `style`, `object`, `embed`, inline event handler, `javascript:` URL을 거부한다.
- frontmatter slug와 폴더 slug가 다르면 실패한다.

---

## 5. 글쓰기 / 관리자 흐름

### 5-1. 로그인

```text
GET /api/admin/github/login
  -> getAdminAuthConfigStatus()
  -> create OAuth state
  -> set aiv_admin_oauth_state httpOnly cookie
  -> redirect to GitHub OAuth

GET /api/admin/github/callback
  -> validate state cookie
  -> exchange code for GitHub access token
  -> fetch https://api.github.com/user
  -> assert login === ADMIN_GITHUB_LOGIN
  -> optionally assert id === ADMIN_GITHUB_ID
  -> set aiv_admin_session httpOnly cookie
```

세션은 DB에 저장하지 않는다. `src/lib/admin/session-token.ts`가 JSON payload를 base64url로 인코딩하고 `ADMIN_SESSION_SECRET`으로 HMAC-SHA256 서명한다. 만료는 14일이다.

### 5-2. 관리자 목록

```text
/admin
  -> requireAdminSession()
  -> if GitHub content env configured:
       listAdminPostsFromGitHub()
     else:
       listAdminPostsFromLocalContent()
  -> render post table + links
```

GitHub 목록 조회가 실패하면 local bundled content로 fallback하여 관리 UI가 완전히 깨지지 않게 한다.

### 5-3. 새 글 작성 / 고급 편집

```text
/write or /admin/posts/new
  -> requireAdminSession()
  -> createEmptyAdminPostDraft()
  -> AdminPostForm
  -> RichEditor body -> markdown/MDX
  -> savePostAction(formData)
      -> requireAdminSession()
      -> adminPostDraftFromFormData()
      -> serializeAdminPostDraft()
      -> savePostSourceToGitHub()
      -> GitHub Contents API PUT
      -> redirect to /admin/posts/<slug>?saved=1
```

새 글의 기본 status는 `draft`다. 공개하려면 metadata에서 `published`로 바꾸고 날짜 조건을 만족해야 한다.

### 5-4. 공개 글 상세 페이지에서 바로 수정

```text
/posts/[slug]
  -> EditOverlay
  -> loadInPlace(slug)
      -> require admin session
      -> read GitHub source and deployed bundled source
      -> choose editable source
  -> savePostInPlaceAction(formData)
      -> validate base SHA
      -> GitHub Contents API PUT
      -> conflict if current GitHub SHA changed
      -> revalidate post/list/taxonomy paths
```

in-place edit는 `_baseSha`를 함께 보내 GitHub 파일이 로드 이후 바뀌었는지 확인한다. 충돌 시 저장하지 않고 새로고침을 요구한다.

### 5-5. 파일 업로드

```text
RichEditor image/audio/document upload
  -> POST /api/admin/upload/[slug] multipart/form-data
      -> require admin session
      -> validate slug
      -> validate kind-specific MIME/ext/size <= 4MB
      -> image | audio | document
      -> putGitHubBinaryFile()
      -> apps/web/content/posts/<slug>/assets/<timestamp>-<safe-name>
      -> return raw.githubusercontent.com URL
```

현재 업로드는 4MB 이하 이미지, 오디오(`mp3`, `wav`, `m4a`, `ogg`, `webm`), 문서(`pdf`, Markdown/text, Word/PowerPoint/Excel 계열)를 GitHub에 직접 asset으로 커밋한다. 본문 저장 형식은 이미지 `<Figure />`, 오디오 `<AudioEmbed />`, 문서 `<DocumentEmbed />`이며 PDF는 public 렌더에서 브라우저 내장 iframe 뷰어로 열고 그 외 문서는 다운로드/새 탭 카드로 제공한다. 4MB를 넘는 오디오·문서·영상이나 큰 원본 파일은 Git에 넣지 말고 R2/Vercel Blob/YouTube 같은 외부 저장소를 붙이는 것이 다음 확장 지점이다.

---

## 6. SEO / monetization 흐름

```text
metadata.ts
  -> pageMetadata()
      -> canonical
      -> Open Graph
      -> Twitter card

sitemap.ts
  -> static paths + published posts + taxonomy buckets

rss.xml/route.ts
  -> latest 20 published posts

robots.ts
  -> allow public site
  -> disallow /admin and /preview

ads.txt/route.ts
  -> if ADSENSE_CLIENT exists: google.com line
  -> else: placeholder comment
```

AdSense는 기본적으로 비활성화한다.

- `ADS_ENABLED=false`면 광고 슬롯은 inert 상태다.
- `/about`, `/contact`, `/privacy`는 AdSense 심사/신뢰용 필수 정책 페이지 역할을 한다.
- `ADSENSE_CLIENT`가 설정되기 전까지 `/ads.txt`는 placeholder만 반환한다.

---

## 7. 환경 변수

`apps/web/.env.example` 기준 현재 필요한 값:

| Env                    | 공개 여부             | 용도                                      |
| ---------------------- | --------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | public                | canonical, sitemap, RSS, OG URL           |
| `ADS_ENABLED`          | server/public config  | 광고 슬롯 활성화 여부                     |
| `ADSENSE_CLIENT`       | public after approval | ads.txt / AdSense client                  |
| `ADMIN_GITHUB_LOGIN`   | server                | 허용할 GitHub login                       |
| `ADMIN_GITHUB_ID`      | server optional       | login rename 보호용 numeric id            |
| `GITHUB_CLIENT_ID`     | server                | GitHub OAuth app client id                |
| `GITHUB_CLIENT_SECRET` | secret                | GitHub OAuth app secret                   |
| `ADMIN_SESSION_SECRET` | secret                | 32자 이상 HMAC session secret             |
| `GITHUB_CONTENT_TOKEN` | secret                | repo contents read/write token            |
| `GITHUB_REPO`          | server                | `owner/repo` 형식                         |
| `GITHUB_BRANCH`        | server                | content commit 대상 branch, 기본 `master` |
| `R2_*`                 | secret/config         | 향후 큰 media upload용 placeholder        |

GitHub content token은 가능한 fine-grained token으로 만들고, 대상 repo의 Contents read/write 권한만 준다.

---

## 8. 로컬 개발

Active app:

```bash
cd apps/web
npm install
npm run dev
```

품질 확인:

```bash
cd apps/web
npm run test
npm run format
npm run lint
npm run typecheck
npm run build
```

루트 Astro reference app:

```bash
npm install
npm run dev
npm run build
```

새 작업은 특별한 이유가 없으면 `apps/web`에서 진행한다.

---

## 9. 배포 흐름

```text
Code/content commit to GitHub branch
  -> Vercel detects change
  -> next build in apps/web
      -> validate post files
      -> generate public routes
      -> emit sitemap/rss/ads route handlers
  -> deploy
```

브라우저 관리자에서 저장해도 결과는 결국 GitHub commit이다. 따라서 배포/롤백/감사는 Git history를 source of truth로 삼는다.

---

## 10. 비슷한 서비스로 복제할 때 핵심 추출물

가장 먼저 복사할 핵심 모듈:

1. `apps/web/src/lib/content/posts.ts`
2. `apps/web/src/lib/content/slugify.ts`
3. `apps/web/src/lib/admin/*`
4. `apps/web/app/api/admin/*`
5. `apps/web/app/(admin)/*`
6. `apps/web/app/(public)/write/page.tsx`
7. `apps/web/src/components/admin/RichEditor/*`
8. `apps/web/src/components/mdx/*`
9. `apps/web/app/sitemap.ts`, `robots.ts`, `rss.xml/route.ts`, `ads.txt/route.ts`
10. `apps/web/.env.example`

새 서비스에서 반드시 바꿀 값:

- `src/lib/site.ts`의 사이트 이름/설명/URL
- `content/posts`의 frontmatter taxonomy
- `components/home/*`의 랜딩 페이지 카피와 섹션
- `src/lib/brand-copy.ts`
- GitHub OAuth callback URL
- `GITHUB_REPO`, `GITHUB_BRANCH`, token 권한
- AdSense/analytics 설정

더 구체적인 실행 순서는 `../50_execution/SIMILAR_SERVICE_STARTER.md`를 따른다.

---

## 11. 관련 문서

| 문서                                                     | 내용                           |
| -------------------------------------------------------- | ------------------------------ |
| `ARCHITECTURE.md`                                        | 상위 아키텍처 원칙과 경계      |
| `AUTH_AND_PERMISSIONS.md`                                | 관리자 권한 모델 정리          |
| `../10_content/CONTENT_MODEL.md`                         | post frontmatter/content 규칙  |
| `../20_features/github-backed-admin-editor.md`           | GitHub-backed editor 기능 설명 |
| `../50_execution/SIMILAR_SERVICE_STARTER.md`             | 유사 서비스 시작 체크리스트    |
| `../50_execution/IMPLEMENTATION_STATUS_2026-05-09.md`    | 현재 구현 상태                 |
| `../60_decisions/ADR-003-github-mdx-content-workflow.md` | Git + MDX content 결정         |
| `../60_decisions/ADR-004-github-backed-admin-editor.md`  | GitHub-backed admin 결정       |
