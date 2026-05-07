# AI 시대 생존기 — Rebrand & Free-form Taxonomy Design

Status: Draft — awaiting owner review
Owner: 개인 운영자
Created: 2026-05-07
Spec format: superpowers brainstorming output → input to `/writing-plans`

---

## 1. Why this redesign

The site domain is `aisurvivor.vercel.app` but the in-code identity has been "AI Vibe Lab — 실험 기록 저널" since the editorial pivot. The owner's actual content direction is narrower than "실험실": **튜토리얼을 직접 따라 해보고 검증하는 1인 기록**. Two concrete problems follow from that mismatch:

1. **Brand voice is off.** "Vibe Lab / 실험 기록 저널" reads as an experiment-driven research blog. The actual voice is closer to a humble, self-deprecating dev journaling tutorials they run end-to-end. Domain (`aisurvivor`) and voice already drifted apart from the code's wordmark.
2. **Taxonomy is rigid.** `CONTENT_MODEL.md §5` hard-codes 5 category slugs. The owner wants to add new categories on the fly while writing, not by amending the enum.

Two editorial signature moments were also lost during a recent cleanup commit (`e269b53`): the home "원본은 여기 남긴다" 03/03 section and the footer tagline "기록되지 않은 실험은 사라진다". The current site reads as a stripped-down version of the original editorial design, which is part of why the owner says "느낌이 사라졌다".

This redesign re-grounds the brand on the survival-journal concept, frees the taxonomy, restores the lost editorial moments under new copy, and trims a few decorative elements that have no functional reason to exist.

---

## 2. Confirmed decisions (already locked in brainstorming)

| # | Decision | Detail |
|---|---|---|
| 1 | Brand wordmark | **AI 시대 생존기** (Korean primary) / `aisurvivor` (English secondary, small) |
| 2 | Tagline | **AI 시대 살아남기 위한 컴퓨터쟁이의 기록소** |
| 3 | Editorial promise (hero one-liner) | **AI 튜토리얼, 제가 먼저 끝까지 해봅니다.** — 설치부터 에러, 비용, 결과물까지 살아남은 것만 정리합니다. |
| 4 | Voice / persona | "컴퓨터쟁이" — 친근하지만 정확. 자조적, 1인 메이커 시점, 비용·실패까지 공개. (Sources: 첨부 전략 문서 §"포지셔닝", `articles/voice.md`) |
| 5 | Content category model | **Free-form frontmatter** — no enum. `category` (single, free string) + `tags` (multi, free strings). Listing pages auto-derived from frontmatter at build time. |
| 6 | Visual aesthetic | **Editorial newspaper** — current direction kept. Pretendard headlines + Fraunces drop caps + JetBrains Mono metadata + slate paper. |
| 7 | Accent color | **Cinnabar / vermilion** replacing deep teal. Light: `#b8341c`. Dark: `#fca5a5`. Survival-flavored without screaming, distinct from the AI-blog teal/blue mass, classic editorial accent (book spine red, hanko stamp). |
| 8 | Masthead "VOL · ISSUE" | **Remove.** Decorative-only, didn't earn its place against the new tagline. |
| 9 | Primary navigation | **HOME** / **POSTS** (hover dropdown — categories + 전체 글) / **ABOUT**. SERIES, TOOLS, TAGS removed from primary nav (low post volume currently makes them empty pages; can be reintroduced later). |
| 10 | Editorial moments to restore | (a) home "원본은 여기 남긴다" 03/03 section — re-copied for new brand. (b) footer signature tagline — replaces "기록되지 않은 실험은 사라진다". |

---

## 3. Brand & copy

### 3.1 Wordmark

```
AI 시대 생존기
└── aisurvivor          (uppercase mono, 10–11px, kerned, ink-400)
```

- Display font: Pretendard, weight 800, letter-spacing -0.025em.
- "생존기" gets the cinnabar accent color; "AI 시대" stays ink-900.
- Subtitle "컴퓨터쟁이의 기록소" appears in the header secondary slot (replacing "실험 기록 저널") in mono kicker style.

### 3.2 Tagline grid (where each line lives)

| Slot | Copy |
|---|---|
| `<title>` / OpenGraph | AI 시대 생존기 — AI 튜토리얼 검증 기록 |
| Header subtitle (next to wordmark) | 컴퓨터쟁이의 기록소 |
| Home hero h1 | AI 튜토리얼, 제가 먼저 끝까지 해봅니다. |
| Home hero lede | 설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다. |
| Home 03/03 section title (restored) | 진짜 되는 것만 남긴다 |
| Home 03/03 section body | 인터넷에 떠도는 AI 튜토리얼을 직접 따라 해보고, 안 된 부분과 막힌 지점, 비용까지 기록합니다. |
| Home 03/03 cards (3 chips) | `tutorial · 직접 따라 한 기록` / `survived · 비용·에러·결과까지` / `archive · 카테고리·태그로 재탐색` |
| Footer signature (replaces "기록되지 않은…") | **안 해본 튜토리얼은 검증되지 않는다** |
| Footer "end of dispatch" kicker | 그대로 유지 |
| About promise | AI Survivor 는 AI 뉴스 요약 블로그가 아닙니다. 직접 따라 한 튜토리얼만 기록합니다. |

The underlying tone rule (used for any new copy): "이 글을 읽은 사람이 시간·돈·시행착오 중 하나를 줄일 수 있는가?" If a piece of UI copy doesn't pass that filter, it's decoration and gets cut.

### 3.3 Copy style for posts

Post titles should default to "직접 해봤다" / "끝까지 해봤다" / "막힌 부분 정리" 패턴 (per attached strategy doc). This is editorial guidance in `CONTENT_STRATEGY.md`, not a hard validator. Existing posts are not retitled by this rebrand.

---

## 4. Content model — free-form taxonomy

### 4.1 Frontmatter shape (changes from `CONTENT_MODEL.md §3-§5`)

```yaml
title: "..."
description: "..."
slug: "..."
publishedAt: "2026-05-07"
updatedAt: "2026-05-07"
status: "draft" | "published" | "scheduled" | "archived"

# CHANGED: free-form, no enum
category: "비용절감"            # single, free-form string. Required.
tags:
  - "claude-code"
  - "kimi"
  - "튜토리얼-검증"            # multi, free-form. Required (≥1).

# Unchanged
series: null
seriesOrder: null
author: "owner"
difficulty: "beginner" | "intermediate" | "advanced"
tools: ["Claude Code", "Kimi"]
coverImage: null
coverAlt: null
canonical: null
ogImage: null
```

Migration: existing posts already use enum slugs (`vibe-coding-lab`, `ai-productivity`, etc.). They keep working — those strings are now just free-form values. We add display labels for them in `lib/labels.ts` so the kicker text and breadcrumb stay readable, and let new posts use any string.

### 4.2 Slug normalization

Categories and tags can contain Korean / spaces / mixed case. URLs need a deterministic slug:

```
"비용절감"           → "비용절감"           (Korean preserved, URL-encoded by browser)
"Claude Code"       → "claude-code"        (lowercased, hyphenated)
"AI 업무 자동화"     → "ai-업무-자동화"     (lowercased, spaces → hyphens, Korean preserved)
"튜토리얼-검증"      → "튜토리얼-검증"      (already a slug)
```

Implementation: `slugifyTaxonomy(value: string)` with this exact rule, top to bottom:

1. Trim leading/trailing whitespace.
2. Normalize internal whitespace runs (spaces, tabs) to a single ASCII hyphen `-`.
3. Lowercase ASCII letters (`A`..`Z` → `a`..`z`). Other Unicode codepoints, including Hangul, are left untouched.
4. Drop characters not in `[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-]` (punctuation, slashes, etc.).
5. Collapse repeated hyphens to one and trim leading/trailing hyphens.

Used at:

- Build time when emitting category/tag pages
- Frontmatter validation (warn if two values slugify to the same target → owner reconciles)
- Internal links (`/categories/<slug>`, `/tags/<slug>`)

Display label = the original frontmatter string (preserved verbatim in a manifest at build time).

### 4.3 Generated indexes (no schema needed)

At build time, derive:

```
categoryBuckets()  → [{ slug, label, count, posts[] }, ...]
tagBuckets()       → [{ slug, label, count, posts[] }, ...]
```

The home page, the navigation dropdown, the `/posts/[slug]` "관련 글" section, and the auto-generated `/categories/<slug>` + `/tags/<slug>` archive pages all consume these buckets.

### 4.4 Validation rules

- `category` is required and must be a non-empty trimmed string.
- `tags` length ≥ 1.
- Two distinct frontmatter strings slugify to the same target → build-time warning (not error). Owner can resolve by editing one.
- Empty / generic values like `미분류`, `etc`, `기타` are allowed but flagged in the warning channel so they don't accidentally become permanent buckets.

### 4.5 Deprecations

- `CONTENT_MODEL.md §5 Category Slug` enum table — replaced with "free-form, examples only".
- `categoryBuckets()` / `tagBuckets()` keep their public signatures; only the underlying source changes.

---

## 5. Visual system updates

### 5.1 Kept (unchanged)

- All four containers (`container-prose / wide / hero / mast`) and their max-widths
- Slate paper palette (`--paper`, `--ink-*`)
- Square edges (`--radius: 0`)
- Print-spread hairline rules (`.rule-thick`, `.rule-hair`, `.section-marker::before` "§" mark)
- `.kicker`, `.dateline`, `.label-chip`, `.tick-list`, `.num-list`
- `.drop-cap` (Fraunces italic on first letter of post body)
- Pretendard + Fraunces + JetBrains Mono font stacks
- Subtle slate noise overlay
- Char-blur-stagger animation on hero
- Dark mode token set

### 5.2 Changed

| What | From | To |
|---|---|---|
| `--accent` (light) | `#0e7490` (deep teal) | `#b8341c` (cinnabar) |
| `--accent` (dark) | `#22d3ee` (cyan-400) | `#fca5a5` (red-300, deep mode) — readable on dark slate |
| `--accent-soft` | `#cffafe` | `#fee2e2` |
| `--accent-deep` | `#155e75` | `#7f1d1d` |
| `--mark` (highlight bg) | teal alpha | cinnabar alpha |
| Wordmark color highlight | "Vibe" in teal | "생존기" in cinnabar |
| Drop cap color | teal italic | cinnabar italic (still Fraunces) |
| `.section-marker::before` "§" mark | teal | cinnabar |

Token keys stay the same (`--accent`, `--accent-soft`, etc.) so the rest of the codebase doesn't need editing — only the values in `global.css` change.

### 5.3 Removed

- Header right-side `currentIssue()` "VOL.26 · ISSUE 19" — and its mobile mirror under the rule-thick. The function and the mobile row both go.
- Header secondary kicker "실험 기록 저널" string in `lib/site.ts` — replaced.

### 5.4 Restored

- Home 03/03 section (currently absent) — markup pattern below.
- Footer signature line replacing the bare site name fallback.

---

## 6. Page-level changes

### 6.1 Header (`src/components/layout/header.tsx`)

```
┌──────────────────────────────────────────────────────────────────────┐
│ AI 시대 생존기 ●  컴퓨터쟁이의 기록소           [admin badge] [theme] │   ← top row
│ ════════════════════════════════════════════════════════════════════ │   ← rule-thick + hair
│ HOME   POSTS▾   ABOUT                                  [chip] [chip] │   ← nav row
└──────────────────────────────────────────────────────────────────────┘
```

- Wordmark: "AI 시대 <span color=cinnabar>생존기</span>" instead of "AI <span>Vibe</span> Lab".
- Subtitle kicker: "컴퓨터쟁이의 기록소".
- Right cluster: drop the `<span>{currentIssue()}</span>`. Keep AdminStatusBadge + ThemeToggle.
- Mobile rule (the row below `rule-thick` that currently shows kicker + currentIssue) — drop the right column, leave just the kicker once.
- Nav: replace `NAV_PRIMARY` with `[HOME, POSTS, ABOUT]`. The category chips on the right keep working but now read from the dynamic `categoryBuckets()`.
- **POSTS hover dropdown** — new affordance:
  - Triggered on hover (desktop ≥`md`) and tap (mobile, behaving as a clickable disclosure).
  - Items: "전체 글" → `/posts`, then top N categories sorted by post count → `/categories/<slug>`. Render category labels with their counts in mono tabular.
  - Implementation: small client component `PostsNavDropdown` placed in the nav `<li>` for POSTS. Uses `Popover` from existing shadcn primitives if available, otherwise a CSS-only `:hover` group on desktop + an `aria-expanded` toggle on mobile.
  - Closes on route change, on outside click, on Escape.
  - Empty case (zero categories) → dropdown not rendered, POSTS becomes a plain link.

### 6.2 Home (`app/(public)/page.tsx`)

Three sections, restoring the 03/03 numbering:

1. **PageHeader hero** — kicker "AI 시대 생존기", title "AI 튜토리얼, 제가 먼저 끝까지 해봅니다.", description new copy. CTA buttons "최신 글 보기" / "블로그 소개" stay.
2. **01 / 02 — latest dispatches** — feature + runners-up layout kept. Lead PostCard variant=feature, runners up indexed list.
3. **02 / 02 — index** ("기록소 가는 길") — replace the current 3-column "categories / series / tools" with **2 columns: categories (auto from `categoryBuckets()`) + tags (top N from `tagBuckets()`)**. Series and tools are gone from primary nav, so the index reflects that.
4. **03 / 03 — restored "진짜 되는 것만 남긴다"** — left column prose, right column 3 cards: `tutorial`, `survived`, `archive`. Same structural pattern as the deleted block, copy retuned for the new brand.

(Numbering in section markers updates: `01 / 03`, `02 / 03`, `03 / 03`.)

### 6.3 Post detail (`app/(public)/posts/[slug]/page.tsx`)

- Breadcrumb "Posts / {category label}" — already in place; works without code changes once `categoryLabel()` falls back to the raw frontmatter string.
- Title h1, description lede, dateline metadata band — unchanged.
- `.drop-cap` on prose first paragraph — unchanged (just inherits the new accent color).
- Tag chips footer — unchanged.

### 6.4 Category page (`/categories/<slug>`)

- Pre-existing route. Behavior:
  - h1 = category label (the original frontmatter string, not the slug).
  - Subhead: "{count}개의 글" (mono kicker).
  - PostList of that category, chronological newest-first.
  - Empty state: "아직 글이 없습니다." (already exists in `PostList`).
- One change: don't 404 on a category that exists in frontmatter but has only `draft` posts (would render an empty state instead) — keeps editing-while-writing flow nice.

### 6.5 All-posts page (`/posts`)

- Already exists. Behavior:
  - h1: "전체 기록".
  - Description: existing copy keeps working.
  - PostSearch component: existing, accepts `publishedPosts`.
- Becomes the target of the dropdown's "전체 글" item.

### 6.6 Footer (`src/components/layout/footer.tsx`)

- Replace the `{SITE_NAME}` heading with the **signature tagline** in `font-display`:
  ```
  안 해본 튜토리얼은 검증되지 않는다
  ```
- Keep the `kicker kicker-accent` "end of dispatch" eyebrow.
- Keep `{SITE_TAGLINE}` paragraph below as today (will read "AI 시대 살아남기 위한 컴퓨터쟁이의 기록소" since SITE_TAGLINE updates).
- The two link columns ("§ 01 — 글", "§ 02 — 정보") stay. Drop "시리즈" and "도구별" from "§ 01" (the routes still exist for now but aren't promoted).
- Bottom-line copyright row: keep, but update "Set in Pretendard, Fraunces & JetBrains Mono" — that line already names Pretendard and Fraunces and stays accurate.

### 6.7 About page

- h1 unchanged route (`/about`).
- New body copy reflects the survival-journal positioning. Direct quote target:
  > AI Survivor 는 AI 뉴스 요약 블로그가 아닙니다.
  > 개발자이자 메이커가 직접 AI 튜토리얼을 따라 해보고, 설치부터 에러, 비용, 결과물까지 정리합니다.
  > 잘 된 것뿐 아니라 막힌 부분과 비용 누수, 약관상 조심해야 할 부분까지 기록합니다.
- Specific copy stays editorial; this spec sets the direction, not the final word-by-word body.

---

## 7. `lib/site.ts` updates (single source of truth)

```ts
export const SITE_NAME = "AI 시대 생존기";
export const SITE_NAME_EN = "aisurvivor";
export const SITE_SUBTITLE = "컴퓨터쟁이의 기록소";
export const SITE_TAGLINE = "AI 시대 살아남기 위한 컴퓨터쟁이의 기록소";
export const SITE_HERO_HEADLINE = "AI 튜토리얼, 제가 먼저 끝까지 해봅니다.";
export const SITE_HERO_LEDE = "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다.";
export const SITE_FOOTER_SIGNATURE = "안 해본 튜토리얼은 검증되지 않는다";

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts", hasDropdown: true },
  { href: "/about", label: "About" },
];
```

`NAV_FOOTER` keeps its current structure.

---

## 8. Migration & non-breaking concerns

### 8.1 Existing post frontmatter

Existing `category` values (`vibe-coding-lab`, `ai-productivity`, etc.) all stay valid as free-form strings. Add a one-time `categoryLabel` lookup table for these legacy slugs so breadcrumbs and chips render Korean labels until the owner edits them. New posts are free to use any string.

### 8.2 URL stability

- `/categories/<legacy-slug>` URLs continue to resolve because the slug values stay identical.
- New `/categories/<korean-or-mixed-slug>` URLs work via the slug normalizer.
- No redirects required.

### 8.3 SEO / metadata

- Title template changes to "AI 시대 생존기 — {page title}". Already controlled by `pageMetadata()`.
- All existing per-page `description` and canonical are preserved.
- Sitemap unaffected by this redesign — it iterates `publishedPosts` and discovered category slugs the same way.

### 8.4 Dark mode color check

Cinnabar `#b8341c` on `--paper` `#f4f6f8` → contrast ratio ≥ 5.0. Cinnabar `#fca5a5` on `--paper` `#0b0e13` → contrast ratio ≥ 8. Both pass WCAG AA for non-body text.

Body links are not the accent — they inherit ink. The only places accent is read as text are: kickers, "§" marks, and the wordmark word "생존기". All have weight ≥ 600.

### 8.5 Documents to update post-implementation

Per `CLAUDE.md §5`:

- `docs/10_content/CONTENT_MODEL.md` — §3 frontmatter, §5 category slug → free-form rule.
- `docs/20_site/SERVICE_IA.md`, `SCREEN_INVENTORY.md` — nav structure (POSTS dropdown, removed routes).
- `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md` — title template if applicable.
- `DESIGN.md` — accent color note + masthead removal.
- `articles/voice.md` — already aligned; no change required.

---

## 9. Out of scope

These are intentionally **not** part of this redesign:

- Dynamic-category editing UX in the admin (in-place taxonomy renaming, merging duplicates) — beyond YAGNI for now; renaming is just a frontmatter edit + commit.
- Tag management UI — same.
- Bringing SERIES / TOOLS pages back into primary nav — gated on actual post volume.
- AdSense activation — still gated on AdSense approval per `CLAUDE.md §3`.
- Any Supabase / Tiptap / admin CMS work — still bound by ADR-002 hold.
- Image / cover redesign for legacy posts — aesthetic kept; only header/footer/home/About change.
- Logo lockup as an SVG asset — wordmark is text, no SVG generation needed.

---

## 10. Acceptance criteria

The redesign ships when, on a clean main branch:

1. `apps/web` builds with no new TypeScript or lint errors.
2. The wordmark on every page reads "AI 시대 생존기".
3. The header has no "VOL · ISSUE" element on desktop or mobile.
4. POSTS in the primary nav opens a dropdown with at minimum "전체 글" + the live category list. The dropdown closes on Escape, outside click, and route change.
5. The home page has three numbered sections (`01/03`, `02/03`, `03/03`) and the third is "진짜 되는 것만 남긴다".
6. The footer's most prominent line is "안 해본 튜토리얼은 검증되지 않는다".
7. All existing post URLs respond 200.
8. A new MDX post with `category: "비용절감"` and `tags: [claude-code, kimi]` (none of which previously existed) renders correctly, appears in `/posts`, in `/categories/비용절감`, and in `/tags/claude-code`.
9. Mobile (390px wide) shows no horizontal overflow on home, post detail, or `/categories/<slug>`.
10. Light/dark mode both render the cinnabar accent at WCAG-AA-passing contrast on every accented surface.

---

## 11. Open questions (to address in the implementation plan)

- POSTS dropdown UX details: hover-only on desktop vs. always click? (Recommendation: hover OR focus opens, hover-out with a 200ms grace closes; click on the trigger toggles persistently.)
- "전체 글" route — keep `/posts` as today, no rename.
- How many categories to show in the dropdown before "더 보기"? (Recommendation: top 8 by count, then "+ 카테고리 모두 보기" linking to `/categories`.)
- Whether to add a build-time linter that flags duplicate-slugifying frontmatter strings as a hard error vs. warning.
