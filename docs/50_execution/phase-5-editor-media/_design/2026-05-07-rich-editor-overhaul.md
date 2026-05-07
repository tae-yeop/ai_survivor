# Design — Rich Editor Overhaul (Phase 5 reactivation)

Status: Proposed
Date: 2026-05-07
Owner: 개인 운영자
Drives: ADR-004 Phase C/D execution
Touches: `phase-5-editor-media/` slices 5.1 ~ 5.6

> 본 문서는 ADR-004 (GitHub-backed Admin Editor) 의 Phase C/D 를 실행 가능한 단위로 풀어쓴 설계 스펙이다. ADR-004의 Open Questions 4개 (로그인 / 브랜치 / 미디어 / 에디터) 가 모두 본 스펙으로 답해진다.
>
> 스펙은 `IMPLEMENTATION_PLAN.md` 의 Phase 5 와 6개의 slice 파일(`slice-5.1` ~ `slice-5.6`) 로 분해되어 실행된다.

---

## 1. 결정 컨텍스트

### 1.1 현재 상태 (As-is)

- `apps/web/src/components/admin/NovelBodyEditor.tsx` — Novel + Tiptap 기반, 슬래시 메뉴 + 4-버튼 bubble menu
- 이미지 업로드: 슬래시 → 파일 피커 → `POST /api/admin/upload/[slug]` → GitHub PUT API → raw URL → 에디터 삽입
- YouTube: 슬래시 → `prompt()` URL 입력 → `<YouTube id />` MDX 직렬화
- 메타데이터 폼 + 본문 에디터: `app/(admin)/admin/posts/[slug]/page.tsx` — 별도 admin 라우트 only
- 공개 페이지에 admin이 들어가도 별도 admin 라우트로 점프해야 편집 가능 (`EditPostButton`)

### 1.2 페인 포인트 (사용자 요청)

1. 이미지 클립보드 paste / 드래그&드롭 안 됨
2. YouTube/X(트위터)/CodePen 등 URL 한 줄 paste로 카드가 자동으로 안 박힘
3. 동영상 파일(mp4 등) 직접 업로드 불가
4. 툴바가 빈약 (제목 토글, 색상, 정렬, 표 없음)
5. 이미지 좌/우 정렬·크기 드래그 조정 불가
6. 공개 페이지에서 바로 편집 불가 — 매번 `/admin` 라우트로 점프해야 함

### 1.3 결정값

| 항목 | 결정 |
|---|---|
| 범위 | 풀패키지 — paste/D&D + 이미지 정렬·크기, YouTube/X/Spotify/Notion/CodePen/Gist/GitHubRepo/Vimeo/일반 OG, 비디오 파일 업로드 |
| 인플레이스 편집 | Edit 토글 모델 — 공개 페이지에 admin이면 Edit 버튼, 본문 자리에서 RichEditor swap. `/admin` 목록·새 글·draft 관리는 유지 |
| 이미지 호스팅 | GitHub repo (현행) + 외부 URL paste도 허용 (`<img loading="lazy" referrerpolicy="no-referrer">`) |
| 비디오 호스팅 | Cloudflare R2 + r2.dev 공개 URL (도메인 vercel.app 그대로) |
| 콘텐츠 모델 | MDX + 커스텀 컴포넌트 (`<Figure>`, `<Video>`, `<YouTube>` …). `tiptap-markdown` 으로 round-trip |
| 에디터 베이스 | 기존 Novel + Tiptap 유지, NodeView·paste plugin·툴바를 직접 작성 |
| ADR | 신규 ADR 없음. ADR-004 footer 에 본 스펙 링크 추가로 Open Questions 답변 |
| Phase 매핑 | Phase 5 (`phase-5-editor-media/`) 재가동, slice 5.1 ~ 5.6 |

### 1.4 글로벌 NOT-DO (이번 작업에서)

- ADR-002 의 Supabase + Tiptap 경로 부활 (이전 historical slice는 `_archive-adr-002/`로 이관, 재구현 안 함)
- 공개 페이지에 비-admin JS 추가
- 광고 슬롯·AdSense 구조 변경
- draft / scheduled 글을 sitemap·RSS 에 노출
- raw HTML 태그 무제한 허용 (등록된 컴포넌트 레지스트리만 통과)

---

## 2. 전체 아키텍처

### 2.1 레이어

```
┌──────────────────────────────────────────────────────────────┐
│  공개 페이지  /posts/[slug]                                  │
│  ─ Server: getAdminSession() → isAdmin                       │
│  ─ 기본 SSR: MDX → HTML (next-mdx-remote)                    │
│  ─ admin이면 <EditOverlay> lazy 마운트 (우상단 floating)     │
│     └─ Edit 클릭 → 본문 자리가 RichEditor로 swap             │
│        Save → server action → GitHub commit → revalidatePath │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  RichEditor  (apps/web/src/components/admin/RichEditor/)     │
│  ─ Tiptap 기반, NodeView·paste plugin·툴바 자체 작성         │
│  ─ Bubble menu (full toolbar) + Sticky 상단 툴바 + Slash menu│
│  ─ Paste/Drop handler: 이미지·비디오·URL 자동 분기           │
│  ─ NodeView: ResizableFigure, Video, Embed cards (12종)      │
│  ─ 출력: MDX-호환 Markdown                                   │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  업로드 API  (Next route handlers, admin-only)               │
│  ─ POST /api/admin/upload/[slug]        ← 이미지 → GitHub    │
│  ─ POST /api/admin/upload-video/[slug]  ← 비디오 → R2 (신규) │
│  ─ GET  /api/admin/og?url=...           ← OG 메타 (신규)     │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  MDX 컴포넌트 카탈로그 (12종)                                 │
│  Figure / Video / YouTube / Vimeo / Tweet / CodePen / Gist / │
│  Spotify / Notion / GitHubRepo / Embed / Callout             │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  공개 페이지 MDX 렌더러                                      │
│  ─ next-mdx-remote + components 레지스트리                   │
│  ─ iframe lazy + sandbox + 외부 fetch는 unstable_cache(1h)   │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 핵심 변화 포인트

1. `NovelBodyEditor` → `RichEditor` 사실상 리라이트. Novel 패키지 high-level 래퍼는 유지하되 paste 핸들러·NodeView·툴바를 우리가 작성 (NodeView·paste 룰 표현이 Novel 기본만으로는 부족).
2. 공개 라우트가 admin-aware. `/posts/[slug]` 가 클라이언트 컴포넌트 일부를 가짐. **본문 SSR 그대로**, 에디터는 Edit 토글 시에만 lazy import.
3. 업로드 엔드포인트 분리 — 이미지(GitHub 4MB) vs 비디오(R2 큰 파일). OG 메타는 별도 GET.
4. Frontmatter 는 본문 위 collapsible Metadata 패널로. 새 글·draft 관리는 기존 `/admin`.

### 2.3 신규 의존성

- `@aws-sdk/client-s3` (R2 = S3 호환)
- `@tiptap/extension-table` + `table-row` + `table-cell` + `table-header`
- `@tiptap/extension-text-align`
- `@tiptap/extension-color` + `extension-text-style`
- `@tiptap/extension-highlight`
- `@tiptap/extension-underline`
- `@tiptap/extension-subscript` + `superscript`
- `cheerio` (서버 OG 스크랩)

기존 Tiptap 2.27 / Novel 1.0 / `tiptap-markdown` / `lowlight` 그대로.

### 2.4 신규 환경변수

```
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET            # ai-vibe-lab-media
R2_PUBLIC_URL        # https://pub-xxxxxxxx.r2.dev
INPLACE_EDIT_ENABLED # 안전 토글, 기본 'true'
```

Vercel Production / Preview / Development 모두 등록.

---

## 3. 인플레이스 편집 흐름

### 3.1 페이지 진입

```
GET /posts/[slug]
  │
  ▼
posts/[slug]/page.tsx (Server Component)
  ├─ getPostBySlug(slug) → MDX source + frontmatter + sha
  ├─ getAdminSession() → admin?
  └─ render:
      ┌─ <ArticleHeader>
      ├─ <ArticleBody> (서버 SSR HTML — 비-admin 종착점)
      └─ {isAdmin && <EditOverlay slug initialSource initialMeta baseSha />}
```

비-admin: 추가 JS 0. EditOverlay 코드는 `dynamic({ ssr: false })`.

### 3.2 EditOverlay 동작

1. 초기 `mode = "view"`, 우상단 floating Edit 버튼만 그림.
2. Edit 클릭 → `mode = "editing"`:
   - SSR된 `<ArticleBody>` 를 hide
   - 같은 자리에 `<RichEditor initialContent={initialSource} />` mount
   - 본문 위에 `<MetadataPanel collapsible defaultOpen={false} />`
   - 우상단 버튼: `Save` · `Cancel` · `Open in /admin`
3. Save → `savePostInPlaceAction(slug, mdx, meta, baseSha)`:
   - sha 충돌 가드 (3.4)
   - 통과 시 GitHub commit (`savePostSourceToGitHub` 재사용)
   - `revalidatePath('/posts/[slug]', '/posts', '/categories/[c]', '/tags/[t]')`
   - 성공 시 `mode = "view"` + `router.refresh()`
4. Cancel → dirty 시 confirm → 로컬 폐기 + view 복귀
5. Open in /admin → `/admin/posts/[slug]` 로 이동 (탈출구)

### 3.3 메타데이터 패널

본문 위 한 줄 요약 + 펼치면 풀 폼:

```
┌─ 📝 Metadata  status:published · category:ai-tool-review · 3 tags  [▼] ┐
└─────────────────────────────────────────────────────────────────────────┘
   펼치면:
   - title / description / publishedAt / updatedAt / status
   - category / difficulty / tags / tools
   - series / seriesOrder / coverImage / coverAlt
```

기존 `app/(admin)/admin/_components/post-form.tsx` 의 메타 필드를 별도 `<MetadataPanel>` 컴포넌트로 추출하여 양쪽이 재사용.

### 3.4 동시 편집 충돌

- 페이지 로드 시 받은 `baseSha` 를 hidden state.
- Save 시 server action 이 GitHub 최신 sha 다시 fetch → `baseSha` 와 다르면 reject + "다른 곳에서 수정됨, reload 후 재시도" 안내.
- 자동 머지 안 함. 풀 conflict-resolution은 과한 스코프.

### 3.5 키보드 / UX

- Cmd/Ctrl+S → Save (브라우저 dialog 가로채기)
- Esc → Cancel (dirty 시 confirm)
- 페이지 이탈 dirty → `beforeunload` 경고
- Save 중: 버튼 spinner + 에디터 readonly
- 실패 시: 에디터 상태 유지 + 빨간 배너 + 재시도 가능

### 3.6 Edit 버튼 위치

- 데스크탑: 우상단 viewport sticky, article 컬럼 바깥
- 모바일: 하단 우측 FAB
- 비-admin: DOM 미진입

### 3.7 Draft·Scheduled 글 in-place 편집

Admin이면 공개 라우트에서 draft 글도 접근 가능 → in-place 편집 가능. 비-admin 은 404 (현행 정책 유지). 본 작업에서 현재 동작 검증·명시화.

---

## 4. 미디어 / 임베드 데이터 흐름

### 4.1 통합 paste & drop 핸들러

ProseMirror plugin 하나로 분기:

```
paste / drop
  │
  ├─ DataTransfer.files 있음?
  │    ├─ image/* → 이미지 업로드 파이프라인
  │    └─ video/* → 비디오 업로드 파이프라인
  │
  └─ 텍스트가 URL 한 줄?
       ├─ youtube.com/youtu.be → <YouTube id />
       ├─ vimeo.com/<id>       → <Vimeo id />
       ├─ twitter.com|x.com/<u>/status/<id> → <Tweet id author />
       ├─ codepen.io/<u>/pen/<id>           → <CodePen user id />
       ├─ gist.github.com/<u>/<id>          → <Gist user id />
       ├─ open.spotify.com/(track|episode|album|playlist|show)/<id>
       │                                     → <Spotify type id />
       ├─ notion.so/...-<32hex> | *.notion.site/* → <Notion pageId />
       ├─ github.com/<o>/<r>                 → <GitHubRepo owner repo />
       └─ 그 외 https?://
             → placeholder 카드 + GET /api/admin/og?url=… → <Embed ... />
                실패 시 평범한 링크 폴백
```

URL 매칭은 Tiptap `addPasteRules` + `addInputRules` 로 일반 링크 처리보다 먼저 가로챔.

### 4.2 이미지 업로드 파이프라인

```
File ──▶ 클라이언트
  ├─ pre-flight: 4MB? MIME (png/jpg/webp/gif/avif/svg)
  ├─ placeholder NodeView 즉시 삽입 (blob URL + spinner)
  │
  ▼
POST /api/admin/upload/[slug]   (현행 라우트)
  ├─ 인증/슬러그/MIME/사이즈
  └─ GitHub PUT → raw URL 반환
  │
  ▼
placeholder ──▶ <Figure src=raw_url …> 로 swap
실패 → 빨간 retry 카드
```

- 외부 URL 이미지 paste: 같은 placeholder→`<Figure>` 경로, src 는 외부 그대로.
- 멀티 paste: 병렬 업로드, 자기 자리에서 swap.

### 4.3 이미지 리사이즈 / 정렬 (NodeView)

선택 시 코너 핸들 드래그 → width % (10~100, 5단위 스냅).
이미지 클릭 → 위쪽 floating bar:

```
◀ 좌정렬 │ ◼ 가운데 │ 우정렬 ▶ │ ─ 풀폭 │ ✏ 캡션 │ 🗑 삭제
```

직렬화:

```mdx
<Figure
  src="https://raw.githubusercontent.com/.../assets/12345-shot.png"
  alt="에디터 스크린샷"
  width="60%"
  align="left"
  caption="툴바 모습"
/>
```

기본값 (생략): `align="center"`, `width="100%"`, `caption=""`. 단순 케이스에선 `<Figure src="..." alt="..." />` 만 박힘.

모바일: 좌/우 정렬은 자동 center 폴백 (CSS media query).

### 4.4 비디오 업로드 파이프라인 (R2)

```
File ──▶ 클라이언트
  ├─ pre-flight: 200MB / video/mp4|webm|quicktime
  ├─ placeholder NodeView (파일명 + progress bar)
  │
  ▼
POST /api/admin/upload-video/[slug]
  ├─ 인증/슬러그/MIME/사이즈
  ├─ key: posts/<slug>/<timestamp>-<safename>.<ext>
  ├─ S3Client.PutObjectCommand (R2 endpoint)
  ├─ ContentType, CacheControl: public, max-age=31536000, immutable
  └─ { url: ${R2_PUBLIC_URL}/${key}, key, size }
  │
  ▼
placeholder ──▶ <Video src={url} /> 로 swap
```

진행률: `XMLHttpRequest.upload.onprogress` (fetch ReadableStream 진행률보다 안정).

직렬화:

```mdx
<Video
  src="https://pub-xxx.r2.dev/posts/my-slug/1704123456-demo.mp4"
  poster="https://raw.githubusercontent.com/.../assets/1704123456-demo-poster.jpg"
  caption="에디터 데모"
/>
```

`poster` 자동 생성은 phase 후순위 (ffmpeg 의존성 회피). 수동으로 별도 이미지 paste → poster 필드에 넣음.

### 4.5 OG 카드 엔드포인트

`GET /api/admin/og?url=<encoded>` (admin 전용):

1. URL 파싱 실패 → 400
2. https 외 거부
3. host == localhost / 127.0.0.1 / 0.0.0.0 → 400
4. RFC1918 (10.0.0.0/8, 172.16-31, 192.168) → 400
5. 169.254.0.0/16 (link-local, AWS metadata) → 400
6. DNS resolve 후 다시 IP 체크
7. fetch redirect ≤ 3, 각 redirect도 위 체크
8. 응답 1MB 컷, `text/html` 만 파싱
9. timeout 5s
10. cheerio: `og:title` / `og:description` / `og:image` / `og:site_name` / `<title>` / `<meta name="description">`
11. JSON: `{ url, title?, description?, image?, siteName? }`

캐시 별도 안 둠 (결과는 곧 MDX 인라인되어 영구화).

### 4.6 검증 / 보안 정리

| 항목 | 한도 |
|---|---|
| 이미지 사이즈 | 4MB |
| 이미지 MIME | png, jpg, webp, gif, avif, svg+xml |
| 비디오 사이즈 | 200MB |
| 비디오 MIME | video/mp4, webm, quicktime |
| 비디오 파일명 | `[a-z0-9-_]` 슬러그화 + 타임스탬프 prefix |
| OG fetch | 5s, 1MB, 3-redirect, RFC1918 차단 |
| 모든 admin 라우트 | `getAdminSession()` 필수 |
| R2 secret | server-only env, 클라이언트 미노출 |

---

## 5. MDX 컴포넌트 카탈로그 (12종)

각 컴포넌트는 (a) 직렬화 형식 (b) Tiptap NodeView (c) 공개 페이지 렌더 컴포넌트 세 가지를 모두 가진다.

### 5.1 컴포넌트 표

| 이름 | Props | 직렬화 예시 | 렌더 동작 |
|---|---|---|---|
| `<Figure>` | `src`, `alt`, `width?`, `align?`, `caption?` | `<Figure src="…" alt="…" width="60%" align="left" caption="…" />` | `<figure><img></figure>`. left/right=`float`, full=풀폭. 외부 URL 시 `loading="lazy" referrerpolicy="no-referrer"` |
| `<Video>` | `src`, `poster?`, `caption?`, `autoplay?` | `<Video src="…r2.dev/…demo.mp4" poster="…" />` | `<video controls preload="metadata" playsInline poster=…>` |
| `<YouTube>` | `id`, `start?` | `<YouTube id="dQw4w9WgXcQ" />` | `youtube-nocookie.com/embed/<id>` iframe 16:9 lazy sandbox |
| `<Vimeo>` | `id` | `<Vimeo id="76979871" />` | `player.vimeo.com/video/<id>` iframe lazy sandbox |
| `<Tweet>` | `id`, `author?`, `quoted?` | `<Tweet id="123…" author="elonmusk" />` | 서버 syndication API fetch + cache(1h). 실패 시 "View on X" 폴백 |
| `<CodePen>` | `user`, `id`, `defaultTab?` | `<CodePen user="ty-kim" id="abc" defaultTab="result" />` | `codepen.io/<user>/embed/<id>` iframe |
| `<Gist>` | `user`, `id`, `file?` | `<Gist user="ty-kim" id="abc" />` | `<script src=".js">` (sandbox 어려움 → wrapping iframe 옵션 후순위) |
| `<Spotify>` | `type`, `id` | `<Spotify type="track" id="…" />` | `open.spotify.com/embed/<type>/<id>` iframe |
| `<Notion>` | `pageId`, `title?` | `<Notion pageId="…32hex…" title="…" />` | iframe (`*.notion.site/*` 공개 페이지). 비공개면 사용자가 공유 토글 켜야 함 |
| `<GitHubRepo>` | `owner`, `repo` | `<GitHubRepo owner="ty-kim" repo="ai_survivor" />` | 서버 GitHub API fetch + cache(1h). 카드: 이름·설명·⭐·🍴·언어·라이선스. 실패 시 OG 폴백 |
| `<Embed>` | `url`, `title?`, `description?`, `image?`, `siteName?` | `<Embed url="…" title="…" image="…" />` | 가로 카드 `<a href={url}>` |
| `<Callout>` | `type?` (`info\|warn\|tip\|danger`), children | `<Callout type="warn">…</Callout>` | 색상 박스 |

> Markdown native (heading, list, blockquote, code block, table, hr, link, bold/italic/strike/code/underline) 는 컴포넌트 아님 — Tiptap → tiptap-markdown 그대로.

### 5.2 직렬화 규칙

- 모든 prop은 string 또는 number. 표현식 `{...}` 안 씀.
- prop 누락은 컴포넌트 default.
- HTML-unsafe 는 entity escape.
- 멀티라인 caption/description: 한 줄로 압축 (진짜 멀티라인 필요해지면 child syntax 도입).

### 5.3 컴포넌트 레지스트리

`apps/web/src/components/mdx/index.ts`:

```ts
export const mdxComponents = {
  Figure, Video, YouTube, Vimeo, Tweet, CodePen, Gist,
  Spotify, Notion, GitHubRepo, Embed, Callout,
  // ...markdown native overrides
};
```

`<MDXRemote components={mdxComponents} />` 한 곳에서 주입.

### 5.4 Tiptap ↔ MDX 매핑

```
모두 → Node (atom 또는 block, draggable, NodeView 풀 컨트롤)
Callout → Node (block, content="block+", NodeView wrapper)
```

각 Node:
- `addAttributes()` → 위 표 props
- `parseHTML()` → MDX 렌더 결과 HTML 패턴 매칭 (round-trip)
- `renderHTML()` → 에디터 안 모양
- `addNodeView()` → React 컴포넌트로 풀 인터랙션

### 5.5 보안 / 위생

- 사용자 정의 raw HTML 비허용 — `next-mdx-remote` 옵션으로 등록된 컴포넌트만 통과
- iframe sandbox: `sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"`
- Gist는 `<script>` 형태라 sandbox 직접 불가 — 1차 그대로, wrapping iframe 격리는 후순위
- `<Embed>` image src 외부 URL: `referrerpolicy="no-referrer" loading="lazy"` 강제

---

## 6. Phase 5 Slice 분할

### 6.1 폴더 정리

```
docs/50_execution/phase-5-editor-media/
  README.md                          ← 재작성: Active, ADR-004 근거
  slice-5.1-rich-editor-core.md      ← 신규
  slice-5.2-image-pipeline.md        ← 신규
  slice-5.3-video-r2-pipeline.md     ← 신규
  slice-5.4-embed-pack.md            ← 신규
  slice-5.5-inplace-editing.md       ← 신규
  slice-5.6-callout-and-polish.md    ← 신규
  _design/
    2026-05-07-rich-editor-overhaul.md  ← 본 문서
  _archive-adr-002/                  ← 기존 deferred 파일 git mv 이관
    slice-5.1-tiptap.md
    slice-5.2-storage-upload.md
    slice-5.3-media-library.md
    slice-5.4-rich-blocks.md
```

`IMPLEMENTATION_PLAN.md` Phase 5 라인:
- 변경: `Active: ADR-004 Phase C/D 실행 — 리치 에디터 + 비디오 R2 + 인플레이스 편집`

### 6.2 Slice 5.1 — Rich Editor Core

**Goal:** 풀 툴바·슬래시 메뉴를 갖춘 `RichEditor` 로 교체. 텍스트 기능만으로 "게시판" 인상 확보.

**Tasks**
- [ ] `components/admin/RichEditor/` 폴더 신설 (`index.tsx`, `extensions.ts`, `toolbar.tsx`, `slash-menu.tsx`, `bubble.tsx`)
- [ ] Tiptap extensions 추가: Underline, TextAlign, Color, TextStyle, Highlight, Subscript/Superscript, Table+TableRow/Cell/Header, Typography
- [ ] 풀 Bubble menu (B/I/U/S/code/Link/Color/Highlight/H2-H4/L/C/R/J)
- [ ] Sticky 상단 툴바 + 모바일 대응
- [ ] Slash menu에 Table, Heading 토글 추가
- [ ] `tiptap-markdown` round-trip 검증 (table = GFM)
- [ ] `post-form.tsx` import 교체, 회귀 0

**Acceptance**
- 기존 글 편집 → Save → diff 동등 (서식 손실 0)
- 표·정렬·색상·하이라이트 round-trip 일관

### 6.3 Slice 5.2 — Image Pipeline

**Goal:** 이미지 paste/D&D + 리사이즈/정렬.

**Tasks**
- [ ] `Figure` Tiptap Node + NodeView (코너 핸들, floating align bar, 캡션 인라인 편집)
- [ ] ProseMirror plugin: paste/drop 의 image File → placeholder → GitHub 업로드 → swap
- [ ] 외부 URL 이미지 paste 도 placeholder→`<Figure>` (외부 src 그대로)
- [ ] `<Figure>` MDX 컴포넌트 + 공개 페이지 렌더러 (`mdx/Figure.tsx`)
- [ ] 기존 `![]()` round-trip 호환 (parseHTML)
- [ ] 외부 src `loading="lazy"` + `referrerpolicy="no-referrer"`
- [ ] 진행률 / 실패 / retry UX

**Acceptance**
- Cmd+V 스크린샷 → 즉시 placeholder → GitHub 커밋 후 raw URL swap
- 코너 드래그 width 5% 단위 스냅, 좌/중/우/풀폭 정렬 동작
- 새로고침 후에도 동일 모양 (round-trip)

### 6.4 Slice 5.3 — Video R2 Pipeline

**Goal:** 비디오 파일 직접 업로드 + 재생.

**Tasks**
- [ ] `R2_*` env 등록 (Vercel + `.env.local`)
- [ ] `@aws-sdk/client-s3` 추가
- [ ] `lib/admin/r2.ts` (S3Client wrapper, server-only)
- [ ] `POST /api/admin/upload-video/[slug]` (인증/MIME/200MB/PutObjectCommand)
- [ ] `Video` Tiptap Node + NodeView (드래그·진행률·재생 미리보기)
- [ ] paste/drop video File 가로채기, 슬래시 메뉴 "Video"
- [ ] `<Video>` MDX 컴포넌트 (`<video controls preload="metadata" playsInline>`)
- [ ] sitemap/RSS 가 `<Video>` 노드를 무시하는지 sanity check

**Acceptance**
- mp4 드래그 → 진행률 → R2 업로드 완료 → 재생 가능 비디오 박힘
- 새로고침 후에도 재생 OK

### 6.5 Slice 5.4 — Embed Pack

**Goal:** URL paste 자동 임베드 (8종 + OG 폴백).

**Tasks**
- [ ] paste plugin URL 매칭 분기 (YouTube, Vimeo, Tweet, CodePen, Gist, Spotify, Notion, GitHubRepo)
- [ ] 각 컴포넌트 Tiptap Node + NodeView + MDX 렌더러
- [ ] `GET /api/admin/og?url=…` (cheerio, SSRF 방어)
- [ ] `<Embed>` 일반 OG 카드 폴백
- [ ] `Tweet` / `GitHubRepo` 서버 fetch + `unstable_cache` revalidate(1h)
- [ ] 슬래시 메뉴 "Embed (paste URL)"

**Acceptance**
- 각 8종 URL paste → 1초 안 카드
- 일반 외부 URL paste → OG 카드, 외부 사이트 죽어도 텍스트 살아있음
- 모든 컴포넌트 dark mode 호환

### 6.6 Slice 5.5 — In-place Editing

**Goal:** 공개 페이지에 admin이면 Edit 토글.

**Tasks**
- [ ] `posts/[slug]/page.tsx` 가 `getAdminSession()` 확인 → `<EditOverlay>` lazy 마운트
- [ ] `<EditOverlay>` 클라이언트 (Edit 버튼, 모드 토글, RichEditor lazy mount, Save/Cancel/Open in /admin)
- [ ] `<MetadataPanel>` 추출 (post-form.tsx 메타 필드 재사용)
- [ ] `savePostInPlaceAction(slug, mdx, meta, baseSha)` server action
- [ ] sha 충돌 가드 (baseSha vs 현재 GitHub sha)
- [ ] `revalidatePath` 4개 경로
- [ ] Cmd/Ctrl+S, Esc, beforeunload, dirty confirm
- [ ] 모바일 FAB
- [ ] draft 글 admin 접근 정책 검증 / 명시화
- [ ] `INPLACE_EDIT_ENABLED` env flag 가드

**Acceptance**
- 공개 글 → Edit → in-place 편집 → Save → revalidate 후 view 모드 복귀
- sha 충돌 케이스가 안전하게 거부됨
- 비-admin 추가 JS 0 (LCP 회귀 없음)

### 6.7 Slice 5.6 — Callout + Polish

**Goal:** 마지막 정돈.

**Tasks**
- [ ] `<Callout type="info|warn|tip|danger">` Node + NodeView + 렌더러 + 슬래시 메뉴
- [ ] 키보드 단축키 모달 (`?` 키)
- [ ] 에러 토스트 통일
- [ ] 다크모드 토큰 매칭
- [ ] a11y (ARIA, focus trap, screen reader)
- [ ] 회귀 테스트 보강 (§7)

**Acceptance**
- 에디터/렌더 컴포넌트 다크/라이트 양쪽 정상
- 슬래시·툴바·NodeView 키보드 only 사용 가능
- 회귀 테스트 통과

### 6.8 의존성 그래프

```
5.1 ──▶ 5.2 ──▶ 5.5 ──▶ 5.6
   ╲       ╲       ╱
    ▶ 5.3 ─┤
   ╲       ╲
    ▶ 5.4 ─▶ 5.6
```

- 5.1 은 모든 후속 선행
- 5.2/5.3/5.4 서로 독립 (병렬·순서 자유)
- 5.5 는 5.1 만 있어도 가능하지만 5.2-5.4 후가 만족도 큼

### 6.9 시간 감

- 5.1: 0.5~1일
- 5.2: 1~1.5일 (NodeView 깊이)
- 5.3: 0.5~1일
- 5.4: 1.5~2일 (8개 컴포넌트)
- 5.5: 0.5~1일
- 5.6: 0.5일

총 4~7일치, dogfood 인터럽트 포함 2주 호흡.

---

## 7. 엣지 케이스 / 테스트

### 7.1 콘텐츠 round-trip 안전성

| 케이스 | 위험 | 대응 |
|---|---|---|
| `<Figure>` 손편집 (PR) | parseHTML 인식 못 하면 raw text | 각 Node `parseHTML` 명세 + 테스트 케이스 |
| 자체닫기 vs 열닫는 태그 | 한쪽만 인식 | 자체닫기 형태로 직렬화 정규화 |
| 본문에 `<` 부등호 | MDX 파서가 태그로 오해 | `transformPastedText` 에서 `<` → `&lt;` escape |
| 코드 펜스 안 컴포넌트 태그 | 렌더되면 안 됨 | next-mdx-remote 기본 동작 + 회귀 테스트 |
| 빈 props (`<Tweet id="" />`) | 빈 카드 | parseHTML 빈 값 → null, 렌더 fallback |

**계약 테스트** `lib/admin/mdx-roundtrip.test.ts`:
- 각 컴포넌트 fixture MDX → parse → Tiptap doc → serialize → 동일 (whitespace normalize)
- markdown native 도 같은 방식
- 통합 fixture 글 3개 (현 운영 글 + 신규 미디어 풀패키지 글)

### 7.2 업로드 실패

| 케이스 | 처리 |
|---|---|
| 이미지 4MB 초과 | 클라이언트 pre-flight reject |
| 비디오 200MB 초과 | 동일 |
| GitHub PUT 409 (sha 충돌) | 자동 재시도 1회 (latest sha 재PUT). 실패 시 안내 |
| GitHub rate limit | 에러 배너 + 1분 후 재시도 안내 |
| R2 401/403 | env 잘못. server 로그 + 일반 메시지 |
| 네트워크 끊김 | placeholder를 retry 카드로, 본문 유지 |
| placeholder 둔 채 Save | 거부 + "업로드 중인 미디어 있음" |
| 같은 파일 두 번 paste | timestamp prefix 다르므로 별 path |

### 7.3 인증 / 권한 경계

| 라우트 | 보호 |
|---|---|
| `POST /api/admin/upload/[slug]` | `getAdminSession()` |
| `POST /api/admin/upload-video/[slug]` | 동일 |
| `GET /api/admin/og?url=...` | 동일 (외부 노출 시 SSRF 게이트로 악용 위험) |
| `savePostInPlaceAction` | server action 진입에서 세션 검증 |
| 공개 `<EditOverlay>` 마운트 | 서버에서 admin 분기, 비-admin DOM 진입 없음 |

테스트:
- 비-admin이 직접 admin 라우트 POST → 401
- 세션 만료 시 RichEditor 동작 → Save 실패 + 재로그인 유도

### 7.4 SSRF 방어 (OG 엔드포인트)

```
1. URL 파싱 실패 → 400
2. 프로토콜 != https → 400
3. host == localhost / 127.0.0.1 / 0.0.0.0 → 400
4. RFC1918 IP → 400
5. 169.254.0.0/16 → 400
6. DNS resolve 후 IP 재검사
7. redirect ≤ 3, 각 redirect 위 체크
8. 응답 1MB 컷, text/html만
9. timeout 5s
```

위 9개 케이스 fixture로 reject 테스트.

### 7.5 페인풀 paste

| 입력 | 처리 |
|---|---|
| Word/Docs 풀스타일 paste | `transformPastedHTML` inline style 스트립, 헤딩/리스트 보존 |
| 클립보드 큰 이미지 | pre-flight rejection 모달 |
| Excel/Sheets 표 | tiptap table extension 로 보존 |
| 마크다운 raw text | `tiptap-markdown` `transformPastedText: true` (현재) |
| 멀티 이미지 paste | 병렬 placeholder + swap |
| 한글 IME 조합 중 슬래시 | suggestion이 IME 이벤트 무시 (회귀 검증 필요) |

### 7.6 모바일

- IME 키보드 위로 sticky 툴바 띄움 (`visualViewport`)
- IME 뜨면 FAB 숨김
- 슬래시 메뉴 IME 조합 종료 후 트리거
- 이미지 핸들 터치 영역 24px 이상
- 모바일 좌/우 정렬은 자동 center 폴백 (CSS)

### 7.7 성능

- 비-admin `/posts/[slug]` 추가 JS 0
  - Lighthouse First-Load JS 측정
  - `<EditOverlay>` 와 RichEditor 모두 `dynamic({ ssr: false })`
- 공개 페이지 렌더 컴포넌트 ≠ 에디터 NodeView. 각자 분리.
- `<Tweet>`, `<GitHubRepo>` 서버 fetch `unstable_cache` revalidate(1h)
- iframe lazy + `<noscript>` 폴백

### 7.8 접근성

- 모든 버튼 `aria-label`
- 키보드 only: Tab, Enter, Esc, 화살표
- Edit 버튼 `aria-pressed`
- Save/Cancel `aria-live="polite"`
- alt 미입력 시 경고 (저장 막진 않음)
- 컬러만으로 상태 표시 안 함 (아이콘 + 텍스트)

### 7.9 테스트 매트릭스

| 종류 | 도구 | 범위 |
|---|---|---|
| 단위 (server) | `node --test` | upload route, OG SSRF 가드, sha conflict, slug 정규화 |
| 단위 (parse) | 동일 | mdx round-trip per component, paste rule URL match |
| 통합 | manual checklist (MVP) | login → 작성 → paste 이미지/비디오 → Save → public render |
| 시각 | manual screenshot diff | dark/light × mobile/desktop |
| 성능 | Lighthouse 수동 | LCP/CLS/JS 사이즈 회귀 0 |

CI 자동 e2e 추가 안 함 (1인 운영, 과한 스코프).

### 7.10 운영 / 롤백

- 각 slice가 별 PR → 문제 시 그 slice만 revert
- R2 죽으면 비디오만 막힘 (다른 영역 영향 0)
- in-place 편집 토글: `posts/[slug]/page.tsx` env flag `INPLACE_EDIT_ENABLED`
- 모든 글은 GitHub commit history에 → revert 가능

---

## 8. 문서 동기화

본 작업이 끝나면 갱신해야 할 문서:

| 문서 | 갱신 내용 |
|---|---|
| `docs/50_execution/IMPLEMENTATION_PLAN.md` | Phase 5 라인 status `Active`, goal 갱신 |
| `docs/50_execution/phase-5-editor-media/README.md` | 재작성 (Active, slice 6개, ADR-004 근거) |
| `docs/50_execution/phase-5-editor-media/_archive-adr-002/` | 기존 5.1~5.4 git mv |
| `docs/60_decisions/ADR-004-github-backed-admin-editor.md` | footer 에 "Open Questions 답변 — 본 spec 링크" |
| `docs/10_content/CONTENT_MODEL.md` | `<Figure>`, `<Video>`, 임베드 12종 표기법 추가 |
| `docs/10_content/ARTICLE_TEMPLATE.md` | 새 컴포넌트 사용 예 추가 |
| `docs/20_features/media-library.md` | (보류 문서) — R2 + 이미지 GitHub 정책 한 줄 메모 |
| `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md` | iframe sandbox / lazy 정책 한 줄 메모 |
| `docs/70_ops/DEPLOYMENT.md` | `R2_*`, `INPLACE_EDIT_ENABLED` env 추가 |

---

## 9. Open Questions (스펙 잔여)

본 스펙 외에 확정 안 된 사소한 항목:

1. `<GitHubRepo>` 카드의 stars/forks 가 잘못 표시될 때 — 1시간 캐시 동안은 stale. 필요 시 사용자가 수동 새로고침 트리거할지?
2. `<Notion>` 비공개 페이지를 paste 한 사용자에게 어떤 가이드를 줄지 (공유 토글 안내 모달)?
3. R2 트래픽이 r2.dev rate limit 에 걸리면 — 그때 가서 커스텀 도메인 전환. 본 스펙 범위 밖.
4. 이미지 width 단위가 `%` 만인데 일부 케이스에 `px` 가 더 자연스러울지 — dogfood 후 결정.

위 4개는 dogfood 진행하며 phase 5.6 polish 또는 별도 후속 PR 에서 처리.

---

## 10. 참고

- ADR-003 GitHub + MDX content workflow (`docs/60_decisions/ADR-003-github-mdx-content-workflow.md`)
- ADR-004 GitHub-backed Admin Editor (`docs/60_decisions/ADR-004-github-backed-admin-editor.md`)
- 현 에디터: `apps/web/src/components/admin/NovelBodyEditor.tsx`
- 현 업로드: `apps/web/app/api/admin/upload/[slug]/route.ts`
- 현 GitHub IO: `apps/web/src/lib/admin/github-content.ts`
- Tiptap NodeView 가이드: https://tiptap.dev/docs/editor/guide/node-views
- Cloudflare R2 S3 호환: https://developers.cloudflare.com/r2/api/s3/api/
