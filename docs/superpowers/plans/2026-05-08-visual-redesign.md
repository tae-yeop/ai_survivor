# Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Clean White visual redesign — hero canvas with living text and cosmic particles, 3-col card grid with category filtering, 680px centered post detail with floating TOC.

**Architecture:** Ten sequential tasks from design tokens → new components → page composition. Each task commits independently. New components live in `src/components/home/` and `src/components/post/`. HeroCanvas (Task 5) is a self-contained canvas animation client component with no external animation dependencies.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS 3, CSS custom properties, Canvas API (`requestAnimationFrame`, `ctx.measureText`), `IntersectionObserver`, Node built-in test runner

---

## File Structure

**New files:**
- `apps/web/src/components/home/HeroCanvas.tsx` — Canvas + HTML SEO overlay (Client)
- `apps/web/src/components/home/CategoryFilterPills.tsx` — Filter pills (Client)
- `apps/web/src/components/home/HomePostsSection.tsx` — Pills + grid wrapper (Client)
- `apps/web/src/components/post/PostCardGrid.tsx` — 3-col card grid (Shared)
- `apps/web/src/components/post/PostCoverImage.tsx` — Next/Image + gradient fallback (Server/Shared)
- `apps/web/src/components/home/PopularPosts.tsx` — Featured/latest list (Server)
- `apps/web/src/components/home/TagCloud.tsx` — Tag pill cloud (Server)
- `apps/web/src/components/post/TableOfContents.tsx` — Sticky floating TOC (Client)

**Modified files:**
- `apps/web/src/styles/global.css` — updated token values, new alias vars, prose-post styles
- `apps/web/tailwind.config.mjs` — add `bg.page/surface/subtle`, `line.DEFAULT/strong`
- `apps/web/src/lib/content/posts.ts` — add `featured: boolean` field
- `apps/web/src/lib/content/posts.test.ts` — tests for `featured` field
- `apps/web/app/(public)/page.tsx` — new homepage layout
- `apps/web/app/(public)/posts/[slug]/page.tsx` — new post detail layout

---

### Task 1: Design System Tokens

**Files:**
- Modify: `apps/web/src/styles/global.css`
- Modify: `apps/web/tailwind.config.mjs`

- [ ] **Step 1: Replace the `:root` block in global.css with clean white values**

The current `:root` block starts at line 9 and ends at line 75. Replace the entire block (from `/* Paper — cool neutral slate stack */` through the closing `}` before `.dark {`) with:

```css
:root {
  /* Paper — warm white (Clean White system) */
  --paper: #f5f5f3;
  --paper-deep: #f0f0ee;
  --paper-rule: #e8e8e4;
  --paper-elevated: #ffffff;
  --paper-overlay: rgba(245, 245, 243, 0.88);

  /* New named aliases (used by new components) */
  --bg-page: #f5f5f3;
  --bg-surface: #ffffff;
  --bg-subtle: #f8f8f6;
  --border: #e8e8e4;
  --border-strong: #d0d0cc;

  /* Bg layer aliases */
  --bg-primary: #f5f5f3;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f0f0ee;

  /* Surface aliases */
  --surface: #f0f0ee;
  --surface-elevated: #ffffff;
  --surface-overlay: rgba(245, 245, 243, 0.88);

  /* Ink — warm neutral grays */
  --ink-50: #f0f0ee;
  --ink-100: #e8e8e4;
  --ink-200: #d0d0cc;
  --ink-300: #aaaaaa;
  --ink-400: #888888;
  --ink-500: #666666;
  --ink-600: #444444;
  --ink-700: #333333;
  --ink-800: #111111;
  --ink-900: #000000;

  /* Accent — Cinnabar / vermilion (editorial signature mark) */
  --accent: #b8341c;
  --accent-fg: #ffffff;
  --accent-soft: #fee2e2;
  --accent-muted: #fca5a5;
  --accent-deep: #7f1d1d;

  /* Markers */
  --mark: rgba(184, 52, 28, 0.22);
  --tick: #b8341c;

  /* Radii */
  --radius-sm: 0;
  --radius: 0;
  --radius-lg: 4px;
  --radius-xl: 6px;

  /* Shadows */
  --shadow-sm: 0 1px 0 rgba(0, 0, 0, 0.04);
  --shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 4px 12px -4px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px -8px rgba(0, 0, 0, 0.16);
  --shadow-xl: 0 16px 40px -12px rgba(0, 0, 0, 0.20);

  --noise-opacity: 0.015;

  /* Typography */
  --font-sans: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont,
    "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
  --font-display: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont,
    "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
  --font-serif: "Fraunces", "Source Serif 4", "Apple SD Gothic Neo", "Pretendard",
    ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
```

- [ ] **Step 2: Add prose-post custom styles inside the `@layer components` block**

In `global.css`, inside the `@layer components { ... }` block, add these styles at the end (before the closing `}`):

```css
  /* Post detail — ## prefix for h2, wide image bleed, callout block */
  .prose-post h2::before {
    content: "## ";
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    opacity: 0.6;
    margin-right: 2px;
    vertical-align: middle;
  }

  .prose-post .wide-img {
    max-width: 820px;
    margin-left: -70px;
    margin-right: -70px;
    border-radius: 8px;
    overflow: hidden;
  }

  @media (max-width: 860px) {
    .prose-post .wide-img {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .callout {
    background: #fdf8f5;
    border-left: 3px solid var(--accent);
    padding: 14px 18px;
    border-radius: 0 6px 6px 0;
    margin: 24px 0;
  }

  .callout p {
    margin: 0;
    font-size: 14px;
    color: #555;
    line-height: 1.7;
  }
```

- [ ] **Step 3: Extend Tailwind color config with new tokens**

In `apps/web/tailwind.config.mjs`, inside `theme.extend.colors`, replace the `bg` entry and add a `line` entry:

```js
        bg: {
          page: "var(--bg-page)",
          surface: "var(--bg-surface)",
          subtle: "var(--bg-subtle)",
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
```

The full `colors` object after this change:

```js
      colors: {
        ink: {
          50: "var(--ink-50)",
          100: "var(--ink-100)",
          200: "var(--ink-200)",
          300: "var(--ink-300)",
          400: "var(--ink-400)",
          500: "var(--ink-500)",
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          800: "var(--ink-800)",
          900: "var(--ink-900)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
          soft: "var(--accent-soft)",
          muted: "var(--accent-muted)",
          deep: "var(--accent-deep)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          overlay: "var(--surface-overlay)",
        },
        bg: {
          page: "var(--bg-page)",
          surface: "var(--bg-surface)",
          subtle: "var(--bg-subtle)",
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          deep: "var(--paper-deep)",
          elevated: "var(--paper-elevated)",
          rule: "var(--paper-rule)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },
```

- [ ] **Step 4: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles/global.css apps/web/tailwind.config.mjs
git commit -m "style: update design tokens to clean white palette, add line/bg Tailwind aliases"
```

---

### Task 2: `featured` Frontmatter Field

**Files:**
- Modify: `apps/web/src/lib/content/posts.ts`
- Modify: `apps/web/src/lib/content/posts.test.ts`

- [ ] **Step 1: Write failing tests**

In `apps/web/src/lib/content/posts.test.ts`, add these two tests after the last test (after line 179):

```typescript
test("featured field is parsed as true when set in frontmatter", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "featured-post",
      validBase
        .replace("slug: published-one", "slug: featured-post")
        .replace("series: building-ai-blog", "series: building-ai-blog\nfeatured: true"),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts[0]?.featured, true);
  });
});

test("featured field defaults to false when absent from frontmatter", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "normal-post",
      validBase.replace("slug: published-one", "slug: normal-post"),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts[0]?.featured, false);
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

```
cd apps/web && npm test
```

Expected: FAIL — `posts[0]?.featured` is `undefined`, not `true`/`false`

- [ ] **Step 3: Add `featured` to the PostFrontmatter type**

In `apps/web/src/lib/content/posts.ts`, add `featured: boolean;` to `PostFrontmatter` (after `coverImage`):

```typescript
export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  status: PostStatus;
  category: string;
  tags: string[];
  series: string | null;
  seriesOrder: number | null;
  author: PostAuthor;
  difficulty: PostDifficulty;
  tools: string[];
  coverImage: string | null;
  featured: boolean;
};
```

- [ ] **Step 4: Add `optionalBoolean` helper and wire it into `parsePostFrontmatter`**

In `posts.ts`, add `optionalBoolean` after the `optionalNumber` function (after line ~170):

```typescript
function optionalBoolean(data: Record<string, unknown>, key: string): boolean {
  const value = data[key];
  if (value === undefined || value === null || value === "") return false;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error(`${key} must be true or false when provided`);
}
```

In `parsePostFrontmatter`, in the return object (after `coverImage: optionalString(data, "coverImage"),`), add:

```typescript
    featured: optionalBoolean(data, "featured"),
```

- [ ] **Step 5: Run tests to confirm they pass**

```
cd apps/web && npm test
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/content/posts.ts apps/web/src/lib/content/posts.test.ts
git commit -m "feat(content): add featured boolean frontmatter field"
```

---

### Task 3: PostCoverImage Component

**Files:**
- Create: `apps/web/src/components/post/PostCoverImage.tsx`

- [ ] **Step 1: Create the component**

```typescript
// apps/web/src/components/post/PostCoverImage.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

const GRADIENT_FALLBACKS = [
  "linear-gradient(135deg, #0d1020, #1e1b4b)",
  "linear-gradient(135deg, #1a0800, #7c2d12)",
  "linear-gradient(135deg, #0d1a14, #064e3b)",
  "linear-gradient(135deg, #1a1500, #78350f)",
  "linear-gradient(135deg, #0d1a1a, #164e63)",
  "linear-gradient(135deg, #13111a, #4c1d95)",
] as const;

function gradientIndex(slug: string): number {
  return slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENT_FALLBACKS.length;
}

type Props = {
  src: string | null;
  alt: string;
  categorySlug: string;
  className?: string;
};

export function PostCoverImage({ src, alt, categorySlug, className }: Props) {
  if (src) {
    const isExternal = src.startsWith("http://") || src.startsWith("https://");
    if (isExternal) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full rounded-lg object-cover", className)}
        />
      );
    }
    return (
      <div className={cn("overflow-hidden rounded-lg", className)}>
        <Image
          src={src}
          alt={alt}
          width={760}
          height={428}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-lg", className)}
      style={{ background: GRADIENT_FALLBACKS[gradientIndex(categorySlug)] }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/post/PostCoverImage.tsx
git commit -m "feat(ui): add PostCoverImage with gradient fallback"
```

---

### Task 4: PostCardGrid Component

**Files:**
- Create: `apps/web/src/components/post/PostCardGrid.tsx`

- [ ] **Step 1: Create the component**

```typescript
// apps/web/src/components/post/PostCardGrid.tsx
import Link from "next/link";
import { PostCoverImage } from "./PostCoverImage";
import type { Post } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { slugifyTaxonomy } from "@/lib/content/slugify";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  className?: string;
};

export function PostCardGrid({ posts, className }: Props) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center font-mono text-sm text-ink-400">
        공개된 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((post) => (
        <PostGridCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

function PostGridCard({ post }: { post: Post }) {
  const catSlug = slugifyTaxonomy(post.category);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[6px] border border-line bg-bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong"
    >
      <PostCoverImage
        src={post.coverImage}
        alt={post.title}
        categorySlug={catSlug}
        className="h-40 w-full flex-shrink-0"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent">
            {categoryLabel(post.category)}
          </span>
          <time dateTime={post.publishedAt} className="font-mono text-[10px] text-ink-300">
            {post.publishedAt}
          </time>
        </div>
        <h2 className="line-clamp-2 text-sm font-bold leading-snug tracking-[-0.01em] text-ink-900">
          {post.title}
        </h2>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-ink-400">
          {post.description}
        </p>
        <div className="mt-2 font-mono text-[10px] text-ink-300">
          ty-kim · {post.readingTimeMinutes}분 읽기
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/post/PostCardGrid.tsx
git commit -m "feat(ui): add PostCardGrid with cover image and gradient fallback"
```

---

### Task 5: HeroCanvas Component

**Files:**
- Create: `apps/web/src/components/home/HeroCanvas.tsx`

The component has three layers rendered in z-order: (1) canvas drawing grid + particles + animated letters, (2) a transparent HTML `<h1>` overlay for SEO/screen readers, (3) a visible subline paragraph below the canvas letters.

- [ ] **Step 1: Create the component**

```typescript
// apps/web/src/components/home/HeroCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

const HEADLINE_1 = "AI 튜토리얼,";
const HEADLINE_2 = "제가 먼저 끝까지 해봅니다.";
const SUBLINE = "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다.";
const ACCENT_WORD = "끝까지";
const MAX_DOTS = 90;
const CANVAS_BG = "#ffffff";

// ── SpaceDot: cosmic particle spawned from canvas edges ────────────────────
class SpaceDot {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  r = 0;
  life = 0;
  lifeSpeed = 0;
  maxAlpha = 0;
  isAccent = false;
  trail: Array<{ x: number; y: number }> = [];
  private trailMax = 0;

  constructor(
    private W: number,
    private H: number,
  ) {
    this.spawn();
  }

  spawn() {
    const edge = Math.floor(Math.random() * 4);
    const speed = 0.15 + Math.random() * 0.4;
    const angle = (Math.random() - 0.5) * (Math.PI / 2.4);
    this.r = 0.8 + Math.random() * 2.2;
    this.life = 0;
    this.lifeSpeed = 0.003 + Math.random() * 0.004;
    this.maxAlpha = 0.12 + Math.random() * 0.22;
    this.isAccent = Math.random() < 0.1;
    this.trail = [];
    this.trailMax = 2 + Math.floor(Math.random() * 6);

    switch (edge) {
      case 0: // top
        this.x = Math.random() * this.W;
        this.y = -this.r;
        this.vx = Math.sin(angle) * speed;
        this.vy = Math.cos(angle) * speed;
        break;
      case 1: // right
        this.x = this.W + this.r;
        this.y = Math.random() * this.H;
        this.vx = -(Math.cos(angle) * speed);
        this.vy = Math.sin(angle) * speed;
        break;
      case 2: // bottom
        this.x = Math.random() * this.W;
        this.y = this.H + this.r;
        this.vx = Math.sin(angle) * speed;
        this.vy = -(Math.cos(angle) * speed);
        break;
      default: // left
        this.x = -this.r;
        this.y = Math.random() * this.H;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        break;
    }
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailMax) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    this.life = Math.min(1, this.life + this.lifeSpeed);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.sin(this.life * Math.PI) * this.maxAlpha;
    if (alpha <= 0) return;

    for (let i = 0; i < this.trail.length - 1; i++) {
      const pt = this.trail[i]!;
      const trailAlpha = (i / this.trail.length) * alpha * 0.35;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isAccent
        ? `rgba(184,52,28,${trailAlpha})`
        : `rgba(0,0,0,${trailAlpha})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.isAccent
      ? `rgba(184,52,28,${alpha})`
      : `rgba(0,0,0,${alpha})`;
    ctx.fill();
  }

  get isDead() {
    return this.life >= 1;
  }
}

// ── Letter: independently animated headline character ─────────────────────
class Letter {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  rotation = 0;
  alpha = 0;
  readonly phase: number;
  readonly waveAmp: number;
  readonly waveFreq: number;

  constructor(
    readonly char: string,
    readonly restX: number,
    readonly restY: number,
    readonly isAccent: boolean,
    readonly fontSize: number,
  ) {
    this.x = restX + (Math.random() - 0.5) * 320;
    this.y = restY + (Math.random() - 0.5) * 220;
    this.phase = Math.random() * Math.PI * 2;
    this.waveAmp = 1.5 + Math.random() * 3.5;
    this.waveFreq = 0.4 + Math.random() * 0.8;
  }

  update(t: number, mouseX: number, mouseY: number) {
    const waveY = this.restY + Math.sin(t * this.waveFreq + this.phase) * this.waveAmp;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let fx = 0;
    let fy = 0;
    const repelRadius = this.fontSize * 3.8;
    if (dist < repelRadius && dist > 0) {
      const force = (repelRadius - dist) / repelRadius;
      fx = (dx / dist) * force * 6;
      fy = (dy / dist) * force * 6;
    }

    this.vx = (this.vx + (this.restX - this.x) * 0.13 + fx) * 0.74;
    this.vy = (this.vy + (waveY - this.y) * 0.13 + fy) * 0.74;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation = this.vx * 0.035;
    if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.035);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.isAccent ? "#b8341c" : "#000000";
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

// ── Build Letter array by measuring character positions on canvas ──────────
function buildLetterLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  y: number,
  W: number,
  accentWord: string,
): Letter[] {
  ctx.font = `800 ${fontSize}px Pretendard Variable, Pretendard, system-ui, sans-serif`;
  ctx.textBaseline = "middle";

  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  let curX = (W - totalWidth) / 2;

  const accentStart = text.indexOf(accentWord);
  const accentEnd = accentStart === -1 ? -1 : accentStart + accentWord.length;

  return chars.map((char, i) => {
    const charX = curX + widths[i]! / 2;
    curX += widths[i]!;
    const isAccent = accentStart !== -1 && i >= accentStart && i < accentEnd;
    return new Letter(char, charX, y, isAccent, fontSize);
  });
}

// ── HeroCanvas ─────────────────────────────────────────────────────────────
export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: SpaceDot[] = [];
    let letters: Letter[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    let startTime = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container!.getBoundingClientRect();
      W = rect.width;
      H = Math.min(420, W * 0.42);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLetters();
      startTime = performance.now();
    }

    function buildLetters() {
      letters = [];
      if (W === 0) return;

      const size1 = Math.max(28, Math.min(54, W * 0.048));
      const size2 = Math.max(24, Math.min(48, W * 0.042));
      const lineGap = size1 * 0.22;
      const blockH = size1 + lineGap + size2;
      const startY = H / 2 - blockH / 2;

      const line1 = buildLetterLine(
        ctx!,
        HEADLINE_1,
        size1,
        startY + size1 / 2,
        W,
        ACCENT_WORD,
      );
      const line2 = buildLetterLine(
        ctx!,
        HEADLINE_2,
        size2,
        startY + size1 + lineGap + size2 / 2,
        W,
        ACCENT_WORD,
      );
      letters = [...line1, ...line2];
    }

    function drawGrid() {
      const step = 40;
      ctx!.strokeStyle = "rgba(0,0,0,0.022)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += step) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, H);
        ctx!.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
    }

    function drawCrosshairs() {
      ctx!.strokeStyle = "rgba(0,0,0,0.10)";
      ctx!.lineWidth = 1;
      const marks: [number, number][] = [
        [10, 10],
        [W - 10, 10],
        [10, H - 10],
        [W - 10, H - 10],
      ];
      for (const [x, y] of marks) {
        ctx!.beginPath();
        ctx!.moveTo(x - 6, y);
        ctx!.lineTo(x + 6, y);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(x, y - 6);
        ctx!.lineTo(x, y + 6);
        ctx!.stroke();
      }
    }

    function drawConnections() {
      const MAX_DIST = 75;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i]!.x - dots[j]!.x;
          const dy = dots[i]!.y - dots[j]!.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.07;
            ctx!.beginPath();
            ctx!.moveTo(dots[i]!.x, dots[i]!.y);
            ctx!.lineTo(dots[j]!.x, dots[j]!.y);
            ctx!.strokeStyle = `rgba(0,0,0,${a})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    function loop() {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const t = (performance.now() - startTime) / 1000;
      ctx!.fillStyle = CANVAS_BG;
      ctx!.fillRect(0, 0, W, H);
      drawGrid();

      dots = dots.filter((d) => !d.isDead);
      while (dots.length < MAX_DOTS) dots.push(new SpaceDot(W, H));
      for (const dot of dots) dot.update();
      drawConnections();
      for (const dot of dots) dot.draw(ctx!);

      for (const letter of letters) {
        letter.update(t, mouse.x, mouse.y);
        letter.draw(ctx!);
      }

      drawCrosshairs();
      raf = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onTouchMove(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }

    resize();
    loop();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-bg-surface"
      style={{ height: "min(420px, 42vw)", minHeight: "220px" }}
      role="presentation"
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* SEO/a11y overlay: same text, color:transparent so crawlers/screen readers see it */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ color: "transparent", userSelect: "none", zIndex: 10 }}
      >
        <h1
          style={{
            fontFamily:
              "Pretendard Variable, Pretendard, system-ui, sans-serif",
            fontSize: "clamp(28px, 4.8vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          {HEADLINE_1}
          <br />
          {HEADLINE_2}
        </h1>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(11px, 1.3vw, 14px)",
            marginTop: "12px",
          }}
        >
          {SUBLINE}
        </p>
      </div>

      {/* Visible subline (canvas animates the headlines, not the subline) */}
      <div
        className="pointer-events-none absolute bottom-6 left-0 right-0 px-6 text-center"
        style={{ zIndex: 11 }}
      >
        <p
          className="font-mono text-ink-400"
          style={{ fontSize: "clamp(11px, 1.3vw, 14px)", lineHeight: 1.7 }}
          aria-hidden="true"
        >
          {SUBLINE}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/home/HeroCanvas.tsx
git commit -m "feat(ui): add HeroCanvas with living text spring physics and cosmic particle animation"
```

---

### Task 6: CategoryFilterPills + HomePostsSection

**Files:**
- Create: `apps/web/src/components/home/CategoryFilterPills.tsx`
- Create: `apps/web/src/components/home/HomePostsSection.tsx`

- [ ] **Step 1: Create CategoryFilterPills**

```typescript
// apps/web/src/components/home/CategoryFilterPills.tsx
"use client";

import { cn } from "@/lib/utils";

type Pill = { slug: string; label: string };

type Props = {
  pills: Pill[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryFilterPills({ pills, selected, onSelect }: Props) {
  const btnBase =
    "flex-shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] transition-colors";
  const btnOn = "border-ink-900 bg-ink-900 text-bg-surface";
  const btnOff =
    "border-line bg-bg-surface text-ink-400 hover:border-ink-400 hover:text-ink-700";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(btnBase, selected === null ? btnOn : btnOff)}
      >
        전체
      </button>
      {pills.map((pill) => (
        <button
          key={pill.slug}
          type="button"
          onClick={() => onSelect(pill.slug)}
          className={cn(btnBase, selected === pill.slug ? btnOn : btnOff)}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create HomePostsSection**

```typescript
// apps/web/src/components/home/HomePostsSection.tsx
"use client";

import { useState } from "react";
import { CategoryFilterPills } from "./CategoryFilterPills";
import { PostCardGrid } from "@/components/post/PostCardGrid";
import type { Post } from "@/lib/content/posts";
import { slugifyTaxonomy } from "@/lib/content/slugify";

type Pill = { slug: string; label: string };

type Props = {
  posts: Post[];
  categoryPills: Pill[];
  hasMore: boolean;
};

const CARDS_PER_PAGE = 6;

export function HomePostsSection({ posts, categoryPills, hasMore }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered =
    selected === null
      ? posts.slice(0, CARDS_PER_PAGE)
      : posts
          .filter((p) => slugifyTaxonomy(p.category) === selected)
          .slice(0, CARDS_PER_PAGE);

  return (
    <section className="mt-8 space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
          최신 기록
        </p>
        {hasMore && selected === null ? (
          <a
            href="/posts"
            className="font-mono text-[10px] text-ink-400 transition-colors hover:text-accent"
          >
            모두 보기 →
          </a>
        ) : null}
      </div>
      <CategoryFilterPills pills={categoryPills} selected={selected} onSelect={setSelected} />
      <PostCardGrid posts={filtered} />
    </section>
  );
}
```

- [ ] **Step 3: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/home/CategoryFilterPills.tsx apps/web/src/components/home/HomePostsSection.tsx
git commit -m "feat(ui): add CategoryFilterPills and HomePostsSection with client-side category filter"
```

---

### Task 7: PopularPosts + TagCloud

**Files:**
- Create: `apps/web/src/components/home/PopularPosts.tsx`
- Create: `apps/web/src/components/home/TagCloud.tsx`

- [ ] **Step 1: Create PopularPosts**

```typescript
// apps/web/src/components/home/PopularPosts.tsx
import Link from "next/link";
import type { Post } from "@/lib/content/posts";

type Props = { posts: Post[] };

export function PopularPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section>
      <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
        인기 글
      </p>
      <ol className="space-y-0">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line pt-5 first:border-t-0 first:pt-0"
          >
            <span className="font-mono text-xs font-medium text-accent">
              № {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pb-5">
              <time
                dateTime={post.publishedAt}
                className="mb-1 block font-mono text-[10px] text-ink-300"
              >
                {post.publishedAt}
              </time>
              <Link
                href={`/posts/${post.slug}`}
                className="block text-sm font-bold leading-snug tracking-[-0.01em] text-ink-900 transition-colors hover:text-accent"
              >
                {post.title}
              </Link>
              <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-ink-400">
                {post.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Create TagCloud**

```typescript
// apps/web/src/components/home/TagCloud.tsx
import Link from "next/link";
import type { Bucket } from "@/lib/content/posts";

type Props = { tags: Bucket[] };

export function TagCloud({ tags }: Props) {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, 12);

  return (
    <section>
      <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
        태그
      </p>
      <div className="flex flex-wrap gap-2">
        {visible.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="rounded border border-line bg-bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-400 transition-colors hover:border-ink-400 hover:text-ink-700"
          >
            #{tag.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/home/PopularPosts.tsx apps/web/src/components/home/TagCloud.tsx
git commit -m "feat(ui): add PopularPosts and TagCloud server components"
```

---

### Task 8: Homepage Layout

**Files:**
- Modify: `apps/web/app/(public)/page.tsx`

- [ ] **Step 1: Replace the homepage**

Replace the entire content of `apps/web/app/(public)/page.tsx`:

```typescript
import { HeroCanvas } from "@/components/home/HeroCanvas";
import { HomePostsSection } from "@/components/home/HomePostsSection";
import { PopularPosts } from "@/components/home/PopularPosts";
import { TagCloud } from "@/components/home/TagCloud";
import { categoryBuckets, publishedPosts, tagBuckets } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const posts = publishedPosts;
  const hasMore = posts.length > 6;

  const categoryPills = categoryBuckets().map((b) => ({
    slug: b.slug,
    label: categoryLabel(b.slug) || b.label,
  }));

  const featuredPosts = posts.filter((p) => p.featured);
  const popularPosts =
    featuredPosts.length >= 1 ? featuredPosts.slice(0, 5) : posts.slice(0, 5);

  return (
    <>
      <HeroCanvas />

      <div className="mx-auto w-full max-w-[1100px] px-5">
        <HomePostsSection posts={posts} categoryPills={categoryPills} hasMore={hasMore} />

        <section className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-[1fr_280px]">
          <PopularPosts posts={popularPosts} />
          <aside className="space-y-10">
            <TagCloud tags={tagBuckets()} />
          </aside>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Run build to verify SSG works end-to-end**

```
cd apps/web && npm run build
```

Expected: build succeeds, no errors

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/(public)/page.tsx"
git commit -m "feat(home): new homepage with hero canvas, card grid, and 2-col popular/tags section"
```

---

### Task 9: TableOfContents Component

**Files:**
- Create: `apps/web/src/components/post/TableOfContents.tsx`

- [ ] **Step 1: Create the component**

```typescript
// apps/web/src/components/post/TableOfContents.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: 2 | 3 };

function extractHeadings(): Heading[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]"),
  ).map((el) => ({
    id: el.id,
    text: el.textContent?.replace(/^#+\s*/, "").trim() ?? "",
    level: el.tagName === "H2" ? 2 : 3,
  }));
}

type Props = { className?: string };

export function TableOfContents({ className }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const hs = extractHeadings();
    setHeadings(hs);
    if (hs.length === 0) return;

    const visible = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        const active = hs.find((h) => visible.has(h.id));
        if (active) setActiveId(active.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    for (const h of hs) {
      const el = document.getElementById(h.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="목차" className={cn("sticky top-24 w-[180px]", className)}>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-300">
        목차
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "block border-l-2 py-1 text-[11px] leading-snug transition-all",
                h.level === 3 ? "pl-[18px]" : "pl-2.5",
                activeId === h.id
                  ? "border-ink-900 font-semibold text-ink-900"
                  : "border-line text-ink-300 hover:border-ink-400 hover:text-ink-500",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/post/TableOfContents.tsx
git commit -m "feat(ui): add TableOfContents with IntersectionObserver active-section tracking"
```

---

### Task 10: Post Detail Layout

**Files:**
- Modify: `apps/web/app/(public)/posts/[slug]/page.tsx`

- [ ] **Step 1: Replace the post detail page**

Replace the entire content of `apps/web/app/(public)/posts/[slug]/page.tsx`:

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { EditOverlay } from "@/components/admin/EditOverlay";
import { PostCoverImage } from "@/components/post/PostCoverImage";
import { TableOfContents } from "@/components/post/TableOfContents";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { getPostBySlug, publishedPosts } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { slugifyTaxonomy } from "@/lib/content/slugify";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/posts/${post.slug}`,
    type: "article",
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const catSlug = slugifyTaxonomy(post.category);

  return (
    <article className="bg-bg-surface">
      <ArticleJsonLd post={post} />

      {/* POST HEADER — centered 680px */}
      <div className="px-6 pt-12">
        <div className="mx-auto max-w-[680px]">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 font-mono text-[11px] text-ink-300"
          >
            <Link href="/posts" className="transition-colors hover:text-accent">
              블로그
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span>{categoryLabel(post.category)}</span>
          </nav>

          <p className="mb-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent">
            {categoryLabel(post.category)}
          </p>

          <h1
            className="font-display text-balance text-ink-900"
            style={{
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "24px",
            }}
          >
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-3 border-b border-t py-3.5"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[11px] font-bold text-bg-surface">
                T
              </div>
              <span className="text-[13px] font-semibold text-ink-700">ty-kim</span>
            </div>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-200" aria-hidden="true" />
            <time dateTime={post.publishedAt} className="font-mono text-[11px] text-ink-300">
              {post.publishedAt}
            </time>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-200" aria-hidden="true" />
            <span className="font-mono text-[11px] text-ink-300">
              {post.readingTimeMinutes}분 읽기
            </span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE — max 760px */}
      <div className="mx-auto mt-7 max-w-[760px] px-6">
        <PostCoverImage
          src={post.coverImage}
          alt={post.title}
          categorySlug={catSlug}
          className="h-[220px] w-full"
        />
      </div>

      {/* BODY — 680px centered, floating TOC at ≥1100px viewport */}
      <div className="relative">
        <div
          className="absolute top-10 hidden min-[1100px]:block"
          style={{ left: "calc(50% + 360px)", width: "180px" }}
        >
          <TableOfContents />
        </div>

        <div className="mx-auto max-w-[680px] px-6 pb-16 pt-9">
          <EditOverlay slug={post.slug}>
            <div className="prose prose-post max-w-none">
              <MDXRemote source={post.body} components={mdxComponents} />
            </div>
          </EditOverlay>

          {/* Tags */}
          <div className="mt-9 flex flex-wrap gap-2 border-t border-line pt-5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded border border-line bg-bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-400 transition-colors hover:border-ink-400 hover:text-ink-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Run typecheck**

```
cd apps/web && npm run typecheck
```

Expected: no errors

- [ ] **Step 3: Run build to verify full SSG build passes**

```
cd apps/web && npm run build
```

Expected: build succeeds, all post routes statically generated

- [ ] **Step 4: Commit**

```bash
git add "apps/web/app/(public)/posts/[slug]/page.tsx"
git commit -m "feat(post): new post detail layout — 680px centered, floating TOC, cover image"
```
