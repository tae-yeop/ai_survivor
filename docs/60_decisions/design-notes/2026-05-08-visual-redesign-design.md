# Visual Redesign — AI 시대 생존기

**Date:** 2026-05-08
**Status:** Draft — awaiting user review
**Scope:** Homepage, Post Detail, Navigation, Design System

---

## 1. Goal

리디자인의 목적은 blog.maximeheckel.com, joshwcomeau.com, linear.app/now, vercel.com/blog를 참조하여 **프리미엄하고 깔끔한 라이트 테마**를 구현하는 것이다. 기존 에디토리얼 신문 느낌에서, 더 현대적이고 인터랙티브한 개발 블로그 느낌으로 전환한다.

---

## 2. Design System

### 2.1 Color Palette

현재 dark/paper 이중 배경에서 **Clean White (Vercel-inspired)** 라이트 우선 시스템으로 전환.

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#f5f5f3` | 페이지 배경 |
| `--bg-surface` | `#ffffff` | 카드, 패널 배경 |
| `--bg-subtle` | `#f8f8f6` | 섹션 구분, hover 배경 |
| `--border` | `#e8e8e4` | 카드/구분선 border |
| `--border-strong` | `#d0d0cc` | 강조 border |
| `--ink-900` | `#000000` | 제목, 강한 텍스트 |
| `--ink-700` | `#333333` | 본문 텍스트 |
| `--ink-500` | `#666666` | 보조 텍스트 |
| `--ink-300` | `#aaaaaa` | 메타 텍스트, placeholder |
| `--accent` | `#b8341c` | 신나바 액센트 (유지) |
| `--accent-light` | `rgba(184,52,28,0.08)` | 콜아웃 배경 |

다크모드 toggle은 유지하되, **라이트 모드가 기본**이다.

### 2.2 Typography

기존 폰트 스택 유지 (Pretendard + Fraunces + JetBrains Mono). 변경 사항:

- 제목 `font-weight: 800`, `letter-spacing: -0.03em` — Vercel처럼 임팩트 강조
- 본문 `font-size: 15px`, `line-height: 1.85` — 읽기 편안함 우선
- 메타/kicker: `font-family: monospace`, `letter-spacing: 0.08–0.12em`

### 2.3 Card Radius & Shadow

- 카드: `border-radius: 6px`, `border: 1px solid var(--border)`, hover 시 shadow 없이 `border-color: var(--border-strong)` + `translateY(-2px)`
- 코드블록: `background: #111`, `border-radius: 8px` (다크)

---

## 3. Navigation

### 3.1 Global Sticky Nav

기존 `PostsNavDropdown` 구현을 유지한다. 변경 없음.

- 로고 + `SITE_SUBTITLE` (현재 구현 그대로)
- sticky `nav` bar: Home / Posts▾ / About
- Posts 호버 시 드롭다운: 전체 글 + 상위 카테고리 + 카테고리 모두 보기

### 3.2 Homepage Category Filter Pills (신규)

홈페이지 hero 바로 아래, 카드 그리드 위에 **카테고리 필터 pills** 추가.

```
[ 전체 ] [ AI 도구 ] [ 바이브코딩 ] [ 자동화 ] [ 리서치 ] ...
```

- 가로 스크롤 가능 (`overflow-x: auto`, 스크롤바 숨김)
- 선택 시: `background: #000; color: #fff` (pill.on 스타일)
- 클라이언트 컴포넌트 (`"use client"`)
- `useState`로 선택 카테고리 관리 (URL 변경 없음, 클라이언트 필터링)
- `HomePostsSection` Client 래퍼가 pills + 필터된 카드 그리드를 함께 관리
- `전체` 선택 시 모든 카드 표시

---

## 4. Homepage Layout

페이지 구조 (위 → 아래):

```
[Global Header + Sticky Nav]
[Hero Section — Canvas 애니메이션]
[Category Filter Pills]
[Card Grid — 3열]
[2-Column Section — 인기글 + 사이드바]
[Footer]
```

### 4.1 Hero Section

**배경:** `background: #fff`, 흰 배경 위에 canvas 오버레이

**Canvas 애니메이션 스펙:**

1. **Cosmic particle supply** — 4개 edge(상/우/하/좌)에서 파티클이 계속 생성되어 drift. 각 파티클은 fade-in → cruise → fade-out 생애주기(`life: 0→1`). 이동 중 꼬리(trail) 생성. 죽으면 자동 제거, 새것이 edge에서 탄생.
   - 최대 파티클 수: `MAX_DOTS = 90`
   - 파티클 색: `rgba(0,0,0,α)` 90% + `rgba(184,52,28,α)` 10% (신나바 포인트)
   - trail 길이: 2–8프레임
   - 연결선: 75px 이내 파티클 사이 `rgba(0,0,0,0.07)` 선

2. **Living text** — 두 레이어로 분리:
   - **Canvas 레이어:** `ctx.fillText`로 글자를 canvas에 그려 애니메이션 적용 (각 문자 독립 부유, 마우스 반발, rotation). SEO/접근성 없음.
   - **HTML 레이어:** canvas 위에 `aria-hidden="false"` 절대위치 div로 동일 텍스트 렌더링. `visibility: hidden`이 아닌 `pointer-events: none; color: transparent`로 처리 — 화면에 안 보이지만 크롤러와 스크린리더에 노출.
   - **Pretext(`@chenglou/pretext`):** canvas context에서 한국어 포함 각 문자의 정확한 x,y + width를 계산. canvas 글자 초기 위치(target position) 및 마우스 repulsion 계산에 활용.
   - 각 문자가 개별 `phase` + `waveAmp` + `waveFreq`를 가져 독립적으로 부유
   - 마우스 근접 시 글자가 밀려남 (repulsion radius: `fontSize × 3.8`)
   - 속도에 따라 미세한 rotation
   - 페이지 로드 시 글자가 흩어진 위치에서 제자리로 조립 (alpha 0 → 1 with spring)

3. **클릭 인터랙션** — 클릭 시 글자 폭발(explode), 600ms 후 제자리로 재조립

4. **배경 요소:** 40px grid overlay (`rgba(0,0,0,0.022)`), 4코너 crosshair marks (`rgba(0,0,0,0.1)`)

**텍스트 (HTML overlay):**
```
제목 line 1: "AI 튜토리얼,"  (font-size: clamp(28px, 4.8vw, 54px), weight: 800)
제목 line 2: "제가 먼저 끝까지 해봅니다."  (clamp(24px, 4.2vw, 48px))
  → "끝까지" 는 color: #b8341c (신나바 액센트)
부제: "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다."
  (font-family: monospace, color: #888, clamp(11px, 1.3vw, 14px))
```

Hero 높이: `min(420px, 42vw)`

**컴포넌트:** `HeroCanvas` (Client Component) — canvas ref + HTML overlay 분리

### 4.2 Card Grid

카테고리 pills 아래, 최신 글을 **3열 카드**로 표시.

```
섹션 헤더: "최신 기록" kicker + "모두 보기 →" 링크 (publishedPosts > 6 일 때)
카드 그리드: grid-template-columns: repeat(3, 1fr), gap: 20px
모바일: 1열 → 태블릿: 2열 → 데스크톱: 3열
```

**PostCardGrid 컴포넌트 (신규):**

```
┌────────────────────────────────┐
│ [Cover Image 160px]            │
│  or [Category color gradient]  │
├────────────────────────────────┤
│ CATEGORY kicker (accent)  Date │
│                                │
│ Title (font-weight:700, -0.01em│
│ letter-spacing, line-clamp:2)  │
│                                │
│ Description (line-clamp:2)     │
│                                │
│ author · reading-time          │
└────────────────────────────────┘
```

- `coverImage` 있으면 `<Image>` 표시, 없으면 카테고리별 고정 gradient fallback
- gradient fallback: 카테고리 slug를 해시해서 6가지 프리셋 중 하나 선택
  ```
  0: linear-gradient(135deg, #0d1020, #1e1b4b)  — 인디고 다크
  1: linear-gradient(135deg, #1a0800, #7c2d12)  — 레드 다크
  2: linear-gradient(135deg, #0d1a14, #064e3b)  — 그린 다크
  3: linear-gradient(135deg, #1a1500, #78350f)  — 앰버 다크
  4: linear-gradient(135deg, #0d1a1a, #164e63)  — 시안 다크
  5: linear-gradient(135deg, #13111a, #4c1d95)  — 퍼플 다크
  ```
  해시 함수: `slug.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % 6`
- hover: `translateY(-2px)`, `border-color: var(--border-strong)`

**표시 개수:** 기본 6개. 카테고리 필터 선택 시 해당 카테고리 최신 6개.

### 4.3 2-Column Section

카드 그리드 아래 2열 레이아웃.

```
grid-template-columns: 1fr 280px
gap: 48px
```

**좌측: 인기 글 목록**
- 제목: "인기 글" kicker
- 글 목록: 번호(№ 01) + 날짜 + 제목 + 한줄 설명
- 인기글 선정 기준: frontmatter `featured: true` 필드 사용 (없으면 최신순 상위 5개)

**우측 사이드바:**
- "인기 글" 섹션: 제목만 간단하게 4개
- "태그" 섹션: 태그 pill cloud (최대 12개)

---

## 5. Post Detail Layout

### 5.1 Page Structure

```
[Global Header + Sticky Nav]
[Post Header — centered 680px]
[Cover Image — 760px]
[Body — 680px centered + floating TOC]
[Tags]
[Prev/Next Nav — 680px]
[Footer]
```

### 5.2 Post Header

`max-width: 680px`, `margin: 0 auto`, `padding: 48px 24px 0`

- Breadcrumb: `블로그 / {category}` (monospace, color: #bbb)
- Category kicker: accent color, uppercase monospace
- Title: `font-size: clamp(24px, 3.5vw, 40px)`, `font-weight: 800`, `letter-spacing: -0.03em`
- Meta row: avatar + author + date + reading time + URL 복사 버튼
  - border-top/bottom: `1px solid #f0f0ee`

### 5.3 Cover Image

`max-width: 760px`, `margin: 28px auto 0`

- `<Image>` with `aspect-ratio: 16/9`, `border-radius: 8px`
- coverImage 없으면 카테고리별 gradient block (동일한 fallback)

### 5.4 Body Layout

```
position: relative
max-width: 680px, margin: 0 auto, padding: 36px 24px 60px
```

**Floating TOC (wide viewport only, ≥1100px):**
```
position: absolute
left: calc(50% + 360px)
top: 40px
width: 180px
```
- h2/h3 항목 자동 추출 (IntersectionObserver로 active 상태 추적)
- `position: sticky; top: 100px` 내부 스크롤

**Prose 스타일:**
- `h2`: `font-size: 20px`, `font-weight: 700`, `border-top: 2px solid #000` + `##` 모노 prefix (accent color)
- `p`: `font-size: 15px`, `line-height: 1.85`, `color: #444`
- `a`: underline, `text-decoration-color: rgba(0,0,0,0.25)`, hover → accent color
- `code`: `background: #f5f5f3`, monospace
- `pre` / code block: `background: #111` (다크), `border-radius: 8px`
- Callout: `border-left: 3px solid #b8341c`, `background: #fdf8f5`
- Wide image: `max-width: 820px`, `margin: 28px -70px` (본문 밖으로 bleed)
  - 모바일에서는 음수 margin 제거

### 5.5 Tags & Prev/Next

Tags row: `max-width: 680px`, `margin: 0 auto`

Prev/Next grid: `max-width: 680px`, `margin: 0 auto`, `grid-template-columns: 1fr 1fr`

---

## 6. Frontmatter Schema Changes

기존 Post frontmatter에 다음 필드 추가:

```yaml
coverImage: /images/posts/slug/cover.jpg   # optional, string
featured: true                              # optional, boolean — 인기글 수동 선정
```

- `coverImage`: public 폴더 기준 절대 경로 또는 외부 URL
- 없으면 카테고리 gradient fallback 사용
- `featured`: 2-column 섹션 "인기 글"에 표시. 없으면 최신순 상위 5개 사용

`CONTENT_MODEL.md` 업데이트 필요.

---

## 7. New Components

| 컴포넌트 | 파일 경로 | 타입 | 비고 |
|---|---|---|---|
| `HeroCanvas` | `src/components/home/HeroCanvas.tsx` | Client | canvas + HTML overlay |
| `CategoryFilterPills` | `src/components/home/CategoryFilterPills.tsx` | Client | useState 필터 관리 |
| `HomePostsSection` | `src/components/home/HomePostsSection.tsx` | Client | pills + 카드 그리드 통합 래퍼 |
| `PostCardGrid` | `src/components/post/PostCardGrid.tsx` | Shared | posts[] props 받아 렌더링 |
| `PopularPosts` | `src/components/home/PopularPosts.tsx` | Server | featured 또는 최신 |
| `TagCloud` | `src/components/home/TagCloud.tsx` | Server | 태그 pill cloud |
| `TableOfContents` | `src/components/post/TableOfContents.tsx` | Client | IntersectionObserver |
| `PostCoverImage` | `src/components/post/PostCoverImage.tsx` | Server | Next/Image + fallback |

### 변경되는 기존 컴포넌트

| 파일 | 변경 내용 |
|---|---|
| `app/(public)/page.tsx` | HeroCanvas + CategoryFilterPills + PostCardGrid + 2-col section 조합 |
| `app/(public)/posts/[slug]/page.tsx` | PostCoverImage + floating TOC + 새 prose 스타일 적용 |
| `src/styles/global.css` | 색상 토큰 전면 교체 (paper → white-based), prose 스타일 추가 |
| `src/lib/content/posts.ts` | `coverImage`, `featured` 필드 파싱 추가 |
| `src/lib/content/posts.test.ts` | 새 frontmatter 필드 테스트 추가 |

---

## 8. Responsive Behavior

| Breakpoint | Card Grid | TOC | 2-col Section |
|---|---|---|---|
| < 640px (mobile) | 1열 | 숨김 | 1열 (sidebar 아래) |
| 640–1024px (tablet) | 2열 | 숨김 | 1열 |
| 1024–1100px | 3열 | 숨김 | 2열 |
| ≥ 1100px | 3열 | float 표시 | 2열 |

---

## 9. Animation Performance

- `HeroCanvas`: `requestAnimationFrame` 루프. 탭 비활성화 시 `document.hidden` 체크로 일시정지.
- Pretext import: `@chenglou/pretext` — 텍스트 좌표 계산에만 사용. 실제 텍스트 렌더링은 HTML.
- canvas 크기: `devicePixelRatio` 고려해 고해상도 대응 (`canvas.width = W * dpr`).
- 글자 인터랙션은 canvas 위 HTML div의 pointer-events를 통해 처리.

---

## 10. Acceptance Criteria

- [ ] 홈페이지 로드 시 canvas hero가 표시되고 글자가 조립 애니메이션으로 나타남
- [ ] 파티클이 edge에서 계속 생성/소멸하며 우주 느낌을 줌
- [ ] 마우스를 hero에 올리면 글자가 반응함
- [ ] 카테고리 pills 클릭 시 카드 그리드가 필터링됨
- [ ] 카드에 coverImage 있으면 이미지, 없으면 gradient fallback 표시
- [ ] 포스트 상세 본문이 680px 너비로 센터 정렬됨
- [ ] ≥1100px 뷰포트에서 TOC가 우측 여백에 floating 표시됨
- [ ] 모바일에서 TOC 숨김, 카드 1열
- [ ] Lighthouse performance score ≥ 90 (canvas animation은 탭 비활성화 시 정지)
- [ ] 기존 typecheck/lint/test 통과
