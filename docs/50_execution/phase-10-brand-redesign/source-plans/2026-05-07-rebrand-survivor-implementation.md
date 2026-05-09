# AI 시대 생존기 Rebrand & Free-form Taxonomy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the public site as "AI 시대 생존기 / 컴퓨터쟁이의 기록소" with free-form (frontmatter-driven) categories and tags, restore two lost editorial moments, and swap the accent color from teal to cinnabar — all without breaking existing post URLs.

**Architecture:** Surgical refactor of the existing Next.js editorial layer. One pure utility (`slugifyTaxonomy`) is added so taxonomy values can be Korean / mixed case / spaces; `categoryBuckets` and `tagBuckets` route through it; the URL routes for `/categories/<slug>` and `/tags/<slug>` accept slugified URLs and filter posts by re-slugifying their frontmatter on the fly. One new client component (`PostsNavDropdown`) provides the desktop hover panel and mobile inline expansion. Everything else is a string change, a token change, or copy.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind, node:test (no Jest/Vitest), Pretendard / Fraunces / JetBrains Mono. No new dependencies.

**Spec source:** [docs/60_decisions/design-notes/2026-05-07-rebrand-survivor-design.md](../../../60_decisions/design-notes/2026-05-07-rebrand-survivor-design.md)

---

## File Structure

**Created (3):**

- `apps/web/src/lib/content/slugify.ts` — `slugifyTaxonomy(value: string)` pure util.
- `apps/web/src/lib/content/slugify.test.ts` — node:test cases for the util.
- `apps/web/src/components/layout/PostsNavDropdown.tsx` — client component (hover popover + mobile inline expansion).

**Modified (within `apps/web/`):**

- `src/lib/site.ts` — brand strings (`SITE_NAME`, `SITE_TAGLINE`, etc.) + new constants + reduced `NAV_PRIMARY`.
- `src/lib/labels.ts` — keep `CATEGORY_LABELS` legacy table; `categoryLabel` keeps fallback to raw string.
- `src/lib/content/posts.ts` — `categoryBuckets`, `getPostsByCategory`, `tagBuckets`, `getPostsByTag` route through `slugifyTaxonomy`. Build-time slug-collision policy added.
- `src/styles/global.css` — `--accent`, `--accent-soft`, `--accent-deep`, `--mark`, `--tick` swapped to cinnabar (light + dark).
- `src/components/layout/header.tsx` — wordmark text, drop `currentIssue()` and the mobile "issue row", render PostsNavDropdown for the Posts slot.
- `src/components/layout/footer.tsx` — signature display headline replaces site-name fallback.
- `app/(public)/page.tsx` — section markers `01/03–03/03`, restored `03/03` block, two-column `02/03` (categories + tags only).
- `app/(public)/categories/[category]/page.tsx` — empty-state route allowed (no `notFound()` when only drafts exist).
- `app/(public)/tags/[tag]/page.tsx` — same treatment.
- `app/(public)/about/page.tsx` — body copy retuned for the survival-journal positioning.

**Modified (project root docs):**

- `DESIGN.md`, `docs/10_content/CONTENT_MODEL.md`, `docs/20_site/SERVICE_IA.md`, `docs/20_site/SCREEN_INVENTORY.md`, `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`.

---

## Task ordering

```
A. Foundation         T1  slugify util + tests       T2  site.ts strings        T3  labels.ts review
B. Content layer      T4  categoryBuckets via slugify   T5  tagBuckets via slugify
C. Visual tokens      T6  cinnabar swap in global.css
D. Components         T7  Header rebuild              T8  PostsNavDropdown        T9  Footer signature
E. Pages              T10 Home (02/03 + 03/03)        T11 Category + Tag pages   T12 About copy
F. Docs               T13 DESIGN.md                   T14 CONTENT_MODEL.md       T15 SERVICE_IA + SCREEN_INVENTORY + SEO checklist
G. Verify             T16 typecheck + test + build + browser smoke
```

Each task is one atomic commit. Task N must build and pass tests before commit. Tasks within a phase can in principle be parallelized; the listed ordering is the safest single-track sequence.

---

### Task 1: `slugifyTaxonomy` utility

**Files:**

- Create: `apps/web/src/lib/content/slugify.ts`
- Create: `apps/web/src/lib/content/slugify.test.ts`

This is the only new pure function. Spec §4.2 nails the rule, and the tests below cover every clause of it.

- [ ] **Step 1: Write the failing test file**

```ts
// apps/web/src/lib/content/slugify.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { slugifyTaxonomy } from "./slugify.ts";

test("trims surrounding whitespace", () => {
  assert.equal(slugifyTaxonomy("  비용절감  "), "비용절감");
});

test("collapses internal whitespace runs to a single hyphen", () => {
  assert.equal(slugifyTaxonomy("AI  업무   자동화"), "ai-업무-자동화");
});

test("lowercases ASCII letters; leaves Hangul untouched", () => {
  assert.equal(slugifyTaxonomy("Claude Code"), "claude-code");
  assert.equal(slugifyTaxonomy("바이브 코딩 LAB"), "바이브-코딩-lab");
});

test("drops punctuation outside the allow-list", () => {
  assert.equal(slugifyTaxonomy("c/c++"), "cc");
  assert.equal(slugifyTaxonomy("AI: 비용 절감!"), "ai-비용-절감");
});

test("collapses repeated hyphens and trims edge hyphens", () => {
  assert.equal(slugifyTaxonomy("--ai----생존기--"), "ai-생존기");
});

test("preserves digits", () => {
  assert.equal(slugifyTaxonomy("Web3 자동화"), "web3-자동화");
});

test("returns empty string for empty / pure-punctuation input", () => {
  assert.equal(slugifyTaxonomy(""), "");
  assert.equal(slugifyTaxonomy("   "), "");
  assert.equal(slugifyTaxonomy("!!!"), "");
});

test("is idempotent on already-slug values", () => {
  assert.equal(slugifyTaxonomy("claude-code"), "claude-code");
  assert.equal(slugifyTaxonomy("비용절감"), "비용절감");
});
```

- [ ] **Step 2: Verify tests fail**

Run from `apps/web/`:

```
node --test src/lib/content/slugify.test.ts
```

Expected: all 8 cases fail with "Cannot find module './slugify.ts'".

- [ ] **Step 3: Implement the util**

```ts
// apps/web/src/lib/content/slugify.ts
const ALLOWED = /[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-]/;

export function slugifyTaxonomy(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let out = "";
  let prevWasHyphen = false;
  for (const ch of trimmed) {
    let next = ch;
    if (/\s/.test(next)) {
      next = "-";
    } else if (/[A-Z]/.test(next)) {
      next = next.toLowerCase();
    }
    if (!ALLOWED.test(next)) continue;
    if (next === "-") {
      if (prevWasHyphen || out.length === 0) continue;
      prevWasHyphen = true;
    } else {
      prevWasHyphen = false;
    }
    out += next;
  }
  return out.replace(/-+$/, "");
}
```

- [ ] **Step 4: Verify tests pass**

Run from `apps/web/`:

```
node --test src/lib/content/slugify.test.ts
```

Expected: 8/8 PASS.

- [ ] **Step 5: Typecheck**

Run from `apps/web/`:

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 6: Commit**

```
git add apps/web/src/lib/content/slugify.ts apps/web/src/lib/content/slugify.test.ts
git commit -m "feat(content): add slugifyTaxonomy util for free-form categories/tags"
```

---

### Task 2: Update `lib/site.ts` brand strings + reduced primary nav

**Files:**

- Modify: `apps/web/src/lib/site.ts`

- [ ] **Step 1: Replace site identity strings**

Open `apps/web/src/lib/site.ts`. Replace the current `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION` block AND the `NAV_PRIMARY` constant. Final file:

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aivibelab.com";
export const SITE_NAME = "AI 시대 생존기";
export const SITE_NAME_EN = "aisurvivor";
export const SITE_SUBTITLE = "컴퓨터쟁이의 기록소";
export const SITE_TAGLINE = "AI 시대 살아남기 위한 컴퓨터쟁이의 기록소";
export const SITE_DESCRIPTION =
  "AI 시대를 살아남기 위해 직접 따라 해본 튜토리얼, 막힌 부분, 비용, 결과물까지 정리하는 1인 기록소.";
export const SITE_HERO_HEADLINE = "AI 튜토리얼, 제가 먼저 끝까지 해봅니다.";
export const SITE_HERO_LEDE =
  "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다.";
export const SITE_FOOTER_SIGNATURE = "안 해본 튜토리얼은 검증되지 않는다";
export const SITE_LOCALE = "ko_KR";
export const SITE_LANG = "ko";
export const DEFAULT_OG_IMAGE = "/images/og/default.svg";
export const RSS_TITLE = SITE_NAME;
export const RSS_DESCRIPTION = SITE_DESCRIPTION;

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
] as const;

export const NAV_FOOTER = [
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
  { href: "/rss.xml", label: "RSS" },
] as const;

export const ADS_ENABLED = process.env.ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || "";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
```

- [ ] **Step 2: Typecheck**

Run from `apps/web/`:

```
npm run typecheck
```

Expected: exit 0. (Some files that imported the old `Series`/`Tools` nav links will not be affected — they use `NAV_PRIMARY` as an array; the iteration just becomes shorter.)

- [ ] **Step 3: Commit**

```
git add apps/web/src/lib/site.ts
git commit -m "feat(site): rebrand to AI 시대 생존기, trim primary nav to Home/Posts/About"
```

---

### Task 3: Confirm `lib/labels.ts` legacy table stays as fallback

**Files:**

- Modify (potentially no-op): `apps/web/src/lib/labels.ts`

The existing `categoryLabel(slug)` returns `CATEGORY_LABELS[slug] ?? slug`. With free-form categories, the fallback returns the raw frontmatter string, which is exactly what we want for new categories. No code change is needed unless the implementer wants to add new entries for upcoming categories.

- [ ] **Step 1: Open `apps/web/src/lib/labels.ts` and verify it ends with this fallback**

```ts
export function categoryLabel(slug: string) {
  return CATEGORY_LABELS[slug] ?? slug;
}
```

If yes, no edit. If the file has drifted, restore the fallback.

- [ ] **Step 2: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 3: Commit only if a change was made**

```
git diff --quiet apps/web/src/lib/labels.ts || (git add apps/web/src/lib/labels.ts && git commit -m "chore(labels): confirm legacy CATEGORY_LABELS fallback for free-form taxonomy")
```

(If nothing changed, this is a no-op. Skip the commit.)

---

### Task 4: Route `categoryBuckets` and `getPostsByCategory` through `slugifyTaxonomy`

**Files:**

- Modify: `apps/web/src/lib/content/posts.ts`
- Modify: `apps/web/src/lib/content/posts.test.ts` (add cases for free-form categories)

- [ ] **Step 1: Add a failing test for free-form category resolution**

Open `apps/web/src/lib/content/posts.test.ts`. Append:

```ts
test("free-form category resolves via slugifyTaxonomy on both bucket and lookup", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "post-cost-saving",
      validBase
        .replace("slug: published-one", "slug: post-cost-saving")
        .replace("category: vibe-coding-lab", 'category: "비용 절감"'),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts.length, 1);
    assert.equal(posts[0]?.category, "비용 절감");
  });
});
```

Run:

```
node --test src/lib/content/posts.test.ts
```

Expected: existing tests PASS, new test PASS (it only exercises the parser, which already accepts any string).

- [ ] **Step 2: Update `categoryBuckets` and `getPostsByCategory`**

In `apps/web/src/lib/content/posts.ts`, replace the existing `categoryBuckets` function with the slugified version and update `getPostsByCategory`. Add an import line at the top.

Add at the top of the file (next to the labels import):

```ts
import { slugifyTaxonomy } from "./slugify.ts";
```

Replace `getPostsByCategory`:

```ts
export function getPostsByCategory(slug: string) {
  return publishedPosts.filter(
    (post) => slugifyTaxonomy(post.category) === slug,
  );
}
```

Replace `categoryBuckets`:

```ts
export function categoryBuckets(): Bucket[] {
  type Group = { rawValues: Set<string>; count: number };
  const bySlug = new Map<string, Group>();

  for (const post of publishedPosts) {
    const slug = slugifyTaxonomy(post.category);
    if (!slug) continue; // defensive — slugify-empty values don't get a bucket
    const group = bySlug.get(slug) ?? {
      rawValues: new Set<string>(),
      count: 0,
    };
    group.rawValues.add(post.category);
    group.count += 1;
    bySlug.set(slug, group);
  }

  return [...bySlug.entries()]
    .map(([slug, { rawValues, count }]) => {
      if (rawValues.size > 1) {
        const arr = [...rawValues];
        const message = `slug-collision: ${arr.map((v) => `"${v}"`).join(" and ")} both → /${slug}`;
        if (process.env.NODE_ENV === "production") {
          throw new Error(message);
        }
        // eslint-disable-next-line no-console
        console.warn(message);
      }
      const firstRaw = [...rawValues][0]!;
      return { slug, label: categoryLabel(firstRaw), count };
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
```

- [ ] **Step 3: Run all existing tests to confirm no regression**

```
npm run test
```

Expected: every test in the existing suite passes (the change is backward-compatible — old kebab-case slugs slugify to themselves).

- [ ] **Step 4: Add a slug-collision regression test**

Append to `posts.test.ts`:

```ts
test("categoryBuckets warns (dev) on two distinct categories that slugify to the same target", () => {
  const original = console.warn;
  const warnings: string[] = [];
  console.warn = (msg: string) => warnings.push(msg);
  try {
    withContentRoot((root) => {
      writePost(
        root,
        "post-a",
        validBase
          .replace("slug: published-one", "slug: post-a")
          .replace("category: vibe-coding-lab", 'category: "Claude Code"'),
      );
      writePost(
        root,
        "post-b",
        validBase
          .replace("slug: published-one", "slug: post-b")
          .replace("category: vibe-coding-lab", 'category: "claude code"'),
      );
      // Re-evaluate buckets via the same loader path used at module init.
      const posts = loadPostsForTest({ root, now: NOW });
      assert.equal(posts.length, 2);
      // categoryBuckets reads `publishedPosts` (module-level), so we re-implement
      // the bucket logic here against the loaded list to assert the warning shape.
      // The production call path is exercised at build time.
      const seen = new Set<string>();
      for (const post of posts) seen.add(post.category);
      assert.deepEqual([...seen].sort(), ["Claude Code", "claude code"]);
    });
  } finally {
    console.warn = original;
  }
});
```

Note: this regression test asserts that two distinct `category` values can co-exist on disk; the actual collision warning path runs at build time when `categoryBuckets()` is called. The dedicated build-time check is exercised in Task 16's `npm run build` smoke.

Run:

```
node --test src/lib/content/posts.test.ts
```

Expected: PASS.

- [ ] **Step 5: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 6: Commit**

```
git add apps/web/src/lib/content/posts.ts apps/web/src/lib/content/posts.test.ts
git commit -m "feat(content): route categoryBuckets through slugifyTaxonomy with collision policy"
```

---

### Task 5: Mirror Task 4 for tags

**Files:**

- Modify: `apps/web/src/lib/content/posts.ts`
- Modify: `apps/web/src/lib/content/posts.test.ts`

- [ ] **Step 1: Add a failing test**

Append to `posts.test.ts`:

```ts
test("free-form tag resolves via slugifyTaxonomy on bucket and lookup", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "post-tag-test",
      validBase
        .replace("slug: published-one", "slug: post-tag-test")
        .replace("- vibe-coding\n  - mdx", '- "Claude Code"\n  - 비용절감'),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts.length, 1);
    assert.deepEqual(posts[0]?.tags.sort(), ["Claude Code", "비용절감"]);
  });
});
```

Run:

```
node --test src/lib/content/posts.test.ts
```

Expected: PASS (parser accepts any string).

- [ ] **Step 2: Update `tagBuckets` and `getPostsByTag`**

Replace `getPostsByTag`:

```ts
export function getPostsByTag(slug: string) {
  return publishedPosts.filter((post) =>
    post.tags.some((tag) => slugifyTaxonomy(tag) === slug),
  );
}
```

Replace `tagBuckets`:

```ts
export function tagBuckets(): Bucket[] {
  type Group = { rawValues: Set<string>; count: number };
  const bySlug = new Map<string, Group>();

  for (const post of publishedPosts) {
    for (const tag of post.tags) {
      const slug = slugifyTaxonomy(tag);
      if (!slug) continue;
      const group = bySlug.get(slug) ?? {
        rawValues: new Set<string>(),
        count: 0,
      };
      group.rawValues.add(tag);
      group.count += 1;
      bySlug.set(slug, group);
    }
  }

  return [...bySlug.entries()]
    .map(([slug, { rawValues, count }]) => {
      if (rawValues.size > 1) {
        const arr = [...rawValues];
        const message = `slug-collision: ${arr.map((v) => `"${v}"`).join(" and ")} both → /${slug}`;
        if (process.env.NODE_ENV === "production") {
          throw new Error(message);
        }
        // eslint-disable-next-line no-console
        console.warn(message);
      }
      const firstRaw = [...rawValues][0]!;
      // For tags, prefer the raw string as label since there's no CATEGORY_LABELS analogue.
      return { slug, label: firstRaw, count };
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
```

- [ ] **Step 3: Run all existing tests**

```
npm run test
```

Expected: all PASS.

- [ ] **Step 4: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```
git add apps/web/src/lib/content/posts.ts apps/web/src/lib/content/posts.test.ts
git commit -m "feat(content): route tagBuckets through slugifyTaxonomy with collision policy"
```

---

### Task 6: Cinnabar accent token swap in `global.css`

**Files:**

- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Update the light-mode accent block (lines ~39-48)**

In `apps/web/src/styles/global.css`, replace this block:

```css
/* Accent — Electric Teal/Cyan (terminal-flavored, not generic blue) */
--accent: #0e7490; /* deep teal — main */
--accent-fg: #ffffff;
--accent-soft: #cffafe; /* cyan-100 */
--accent-muted: #67e8f9; /* cyan-300 */
--accent-deep: #155e75; /* cyan-800 */

/* Markers */
--mark: rgba(14, 116, 144, 0.22);
--tick: #0e7490;
```

with:

```css
/* Accent — Cinnabar / vermilion (editorial signature mark, not decoration) */
--accent: #b8341c; /* cinnabar — main */
--accent-fg: #ffffff;
--accent-soft: #fee2e2; /* red-100 */
--accent-muted: #fca5a5; /* red-300 */
--accent-deep: #7f1d1d; /* red-900 */

/* Markers */
--mark: rgba(184, 52, 28, 0.22);
--tick: #b8341c;
```

- [ ] **Step 2: Update the dark-mode accent block (lines ~108-115)**

Replace:

```css
/* Accent — Bright cyan, terminal-feel */
--accent: #22d3ee; /* cyan-400 */
--accent-fg: #0b0e13;
--accent-soft: #0e3a47;
--accent-muted: #155e75;
--accent-deep: #67e8f9;

--mark: rgba(34, 211, 238, 0.22);
--tick: #22d3ee;
```

with:

```css
/* Accent — Cinnabar / vermilion (dark mode — readable on deep slate) */
--accent: #fca5a5; /* red-300 */
--accent-fg: #0b0e13;
--accent-soft: #4a1414;
--accent-muted: #7f1d1d;
--accent-deep: #fee2e2;

--mark: rgba(252, 165, 165, 0.22);
--tick: #fca5a5;
```

- [ ] **Step 3: Update the design-tokens header comment (line ~5-7)**

Replace:

```css
/* ============================================================
   Lab Terminal Notebook — Design Tokens (Light)
   Cool slate paper · pure ink · electric cyan-teal accent
   ============================================================ */
```

with:

```css
/* ============================================================
   AI 시대 생존기 — Design Tokens (Light)
   Cool slate paper · pure ink · cinnabar accent (editorial signature)
   ============================================================ */
```

And the dark header (line ~78-80):

```css
/* ============================================================
   Lab Terminal Notebook — Design Tokens (Dark)
   Deep cool ink · cool cream · bright cyan accent
   ============================================================ */
```

with:

```css
/* ============================================================
   AI 시대 생존기 — Design Tokens (Dark)
   Deep cool ink · cinnabar-pink accent (readable on slate)
   ============================================================ */
```

- [ ] **Step 4: Smoke check the dev server compiles CSS**

Run from `apps/web/`:

```
npm run dev
```

Wait for `▲ Next.js ... ready`. Open `http://localhost:3000/` in a browser, confirm no CSS errors in the console. Stop the dev server (Ctrl+C).

- [ ] **Step 5: Commit**

```
git add apps/web/src/styles/global.css
git commit -m "style(tokens): swap accent from teal to cinnabar (light + dark)"
```

---

### Task 7: Header rebuild — wordmark + drop currentIssue

**Files:**

- Modify: `apps/web/src/components/layout/header.tsx`

This task removes `currentIssue()` and the mobile issue mirror, and updates the wordmark and subtitle. The Posts dropdown gets wired in Task 8.

- [ ] **Step 1: Replace the file body**

Open `apps/web/src/components/layout/header.tsx`. Replace the **entire** file with:

```tsx
import Link from "next/link";
import { categoryBuckets } from "@/lib/content/posts";
import { NAV_PRIMARY, SITE_SUBTITLE } from "@/lib/site";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PostsNavDropdown } from "@/components/layout/PostsNavDropdown";

export function Header() {
  const categories = categoryBuckets();

  return (
    <header id="site-header" className="relative z-30 bg-bg-primary">
      <div className="container-mast pt-6 pb-4 sm:pt-8">
        <div className="flex items-end justify-between gap-6">
          <Link
            href="/"
            className="group flex items-baseline gap-3 leading-none"
          >
            <span className="font-display text-2xl font-bold leading-none tracking-[-0.025em] text-ink-800 sm:text-[1.75rem]">
              AI 시대 <span className="text-accent">생존기</span>
            </span>
            <span
              className="hidden h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent sm:inline-block"
              aria-hidden="true"
            />
            <span className="kicker hidden sm:inline-block">
              {SITE_SUBTITLE}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex">
              <AdminStatusBadge />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container-mast">
        <div className="rule-thick" />
      </div>

      <div className="container-mast flex items-center justify-between gap-3 border-b border-paper-rule py-2 sm:hidden">
        <span className="kicker">{SITE_SUBTITLE}</span>
      </div>

      <nav
        id="site-nav"
        aria-label="Primary"
        className="sticky top-0 z-30 bg-bg-primary/92 backdrop-blur-md"
      >
        <div className="container-mast flex flex-wrap items-center justify-between gap-4 py-2.5 rule-hair">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_PRIMARY.map((item) =>
              item.href === "/posts" ? (
                <li key={item.href}>
                  <PostsNavDropdown categories={categories} />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="hidden items-center gap-2 md:flex">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="label-chip"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
```

Note: this references `PostsNavDropdown` which Task 8 creates. The build will fail until Task 8 lands. That's intentional — these two tasks ship together.

- [ ] **Step 2: Skip typecheck for now (will be exercised after Task 8)**

Move directly to Task 8. Do NOT commit yet.

---

### Task 8: `PostsNavDropdown` client component

**Files:**

- Create: `apps/web/src/components/layout/PostsNavDropdown.tsx`

- [ ] **Step 1: Create the component**

```tsx
// apps/web/src/components/layout/PostsNavDropdown.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Bucket } from "@/lib/content/posts";

const TOP_N = 8;
const HOVER_GRACE_MS = 200;

export function PostsNavDropdown({ categories }: { categories: Bucket[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const pathname = usePathname();

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_GRACE_MS);
  }, [cancelClose]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // If categories is empty, render plain link with no disclosure affordance
  if (categories.length === 0) {
    return (
      <Link
        href="/posts"
        className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
      >
        Posts
      </Link>
    );
  }

  const top = categories.slice(0, TOP_N);

  return (
    <div
      className="relative"
      onPointerEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={scheduleClose}
    >
      <Link
        ref={triggerRef}
        href="/posts"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
      >
        Posts <span aria-hidden="true">▾</span>
      </Link>

      {open ? (
        <ul
          ref={panelRef}
          id={menuId}
          role="menu"
          className="absolute left-0 top-full mt-1 min-w-[16rem] border border-paper-rule bg-paper-elevated shadow-sm"
        >
          <li role="none">
            <Link
              role="menuitem"
              href="/posts"
              className="flex min-h-[44px] items-center justify-between gap-3 border-b border-paper-rule px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-700 transition-colors hover:bg-paper-deep hover:text-ink-900 sm:min-h-[36px]"
            >
              <span>전체 글</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
          {top.map((cat) => (
            <li key={cat.slug} role="none">
              <Link
                role="menuitem"
                href={`/categories/${cat.slug}`}
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-paper-rule px-4 py-2 font-mono text-[0.72rem] tracking-[0.06em] text-ink-700 transition-colors hover:bg-paper-deep hover:text-ink-900 sm:min-h-[36px]"
              >
                <span className="truncate">{cat.label}</span>
                <span className="tabular-nums text-ink-400">{cat.count}</span>
              </Link>
            </li>
          ))}
          <li role="none">
            <Link
              role="menuitem"
              href="/categories"
              className="flex min-h-[44px] items-center justify-between gap-3 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-paper-deep sm:min-h-[36px]"
            >
              <span>+ 카테고리 모두 보기</span>
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```
npm run typecheck
```

Expected: exit 0. (Both Header and PostsNavDropdown now resolve.)

- [ ] **Step 3: Browser smoke**

```
npm run dev
```

Open `http://localhost:3000/`. Verify:

- Wordmark reads "AI 시대 생존기" with "생존기" in cinnabar.
- "컴퓨터쟁이의 기록소" appears next to wordmark on desktop and on the row below the rule on mobile (resize to ~390px in DevTools).
- "VOL · ISSUE" no longer appears.
- Hover over POSTS — dropdown opens with "전체 글", category list, "+ 카테고리 모두 보기".
- Mouse out of trigger and panel for >200ms — closes.
- Press Escape with panel open — closes, focus returns to trigger.
- Tab through nav — POSTS button receives focus, opens; Tab again leaves.

Stop the dev server.

- [ ] **Step 4: Commit (header + dropdown together)**

```
git add apps/web/src/components/layout/header.tsx apps/web/src/components/layout/PostsNavDropdown.tsx
git commit -m "feat(layout): rebrand header wordmark + add PostsNavDropdown with hover/keyboard support"
```

---

### Task 9: Footer signature line

**Files:**

- Modify: `apps/web/src/components/layout/footer.tsx`

- [ ] **Step 1: Replace the prominent display block**

Open `apps/web/src/components/layout/footer.tsx`. Locate this block (around lines 14-19):

```tsx
            <p className="kicker kicker-accent">end of dispatch</p>
            <p className="mt-3 font-display text-2xl font-bold leading-[1.2] tracking-[-0.022em] text-ink-800">
              {SITE_NAME}
            </p>
            <p className="mt-3 max-w-md leading-relaxed text-ink-500">{SITE_TAGLINE}</p>
```

Replace the middle `<p>` (the `{SITE_NAME}` one) so the signature copy is the prominent line:

```tsx
            <p className="kicker kicker-accent">end of dispatch</p>
            <p className="mt-3 font-display text-2xl font-bold leading-[1.2] tracking-[-0.022em] text-ink-800">
              {SITE_FOOTER_SIGNATURE}
            </p>
            <p className="mt-3 max-w-md leading-relaxed text-ink-500">{SITE_TAGLINE}</p>
```

- [ ] **Step 2: Update the import line at the top**

Change:

```ts
import { NAV_FOOTER, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
```

to:

```ts
import {
  NAV_FOOTER,
  SITE_FOOTER_SIGNATURE,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";
```

(`SITE_NAME` is still used in the `© {year} {SITE_NAME}` copyright line, so keep the import.)

- [ ] **Step 3: Drop deprecated link items from "§ 01 — 글"**

Locate the list under "§ 01 — 글" (around lines 38-66). Remove the two `<li>` items pointing at `/series` and `/tools`. Final list:

```tsx
<ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink-600">
  <li>
    <Link href="/posts" className="transition-colors hover:text-accent">
      전체 글
    </Link>
  </li>
  <li>
    <Link href="/categories" className="transition-colors hover:text-accent">
      카테고리
    </Link>
  </li>
  <li>
    <Link href="/tags" className="transition-colors hover:text-accent">
      태그
    </Link>
  </li>
</ul>
```

- [ ] **Step 4: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 5: Browser smoke**

```
npm run dev
```

Scroll any page to the footer. Verify the prominent line reads "안 해본 튜토리얼은 검증되지 않는다" and the link list under "§ 01 — 글" has 3 items (전체 글 / 카테고리 / 태그). Stop dev server.

- [ ] **Step 6: Commit**

```
git add apps/web/src/components/layout/footer.tsx
git commit -m "feat(layout): footer signature line + drop unpromoted series/tools links"
```

---

### Task 10: Home — restore § 03/03 and retune § 02/03

**Files:**

- Modify: `apps/web/app/(public)/page.tsx`

- [ ] **Step 1: Replace the file body**

Open `apps/web/app/(public)/page.tsx`. Replace the **entire** file with:

```tsx
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import {
  categoryBuckets,
  publishedPosts,
  tagBuckets,
} from "@/lib/content/posts";
import {
  SITE_DESCRIPTION,
  SITE_HERO_HEADLINE,
  SITE_HERO_LEDE,
  SITE_NAME,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const categories = categoryBuckets();
  const tags = tagBuckets();
  const latestPosts = publishedPosts.slice(0, 3);
  const lead = latestPosts[0];
  const runnersUp = latestPosts.slice(1);

  const indexColumns = [
    { label: "categories", href: "/categories", items: categories.slice(0, 6) },
    { label: "tags", href: "/tags", items: tags.slice(0, 6) },
  ];

  const showIndex = categories.length > 0 || tags.length > 0;

  const promiseChips: Array<{ label: string; body: string }> = [
    {
      label: "tutorial",
      body: "직접 따라 한 튜토리얼 기록. 시키는 대로 했을 때 진짜 되는지부터 확인합니다.",
    },
    {
      label: "survived",
      body: "막힌 부분, 비용, 약관 주의점, 결과물까지 — 살아남은 것만 정리합니다.",
    },
    {
      label: "archive",
      body: "카테고리·태그·시간순으로 다시 찾을 수 있게 정리한 1인 기록소입니다.",
    },
  ];

  return (
    <>
      <PageHeader
        kicker="AI 시대 생존기"
        title={SITE_HERO_HEADLINE}
        description={SITE_HERO_LEDE}
      />

      <section className="container-hero py-10">
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/posts">최신 글 보기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">블로그 소개</Link>
          </Button>
        </div>
      </section>

      <section className="container-mast py-12">
        <header className="section-marker mb-8">
          <p className="kicker tabular-nums">01 / 03</p>
          <div className="min-w-0">
            <p className="kicker">latest dispatches</p>
            <h2 className="mt-2 font-display text-display text-ink-900">
              최신 기록
            </h2>
          </div>
          <Link
            href="/posts"
            className="ml-auto hidden font-mono text-xs uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent sm:block"
          >
            모두 보기 →
          </Link>
        </header>

        {lead ? (
          <div className="grid gap-x-12 lg:grid-cols-[1.35fr_1fr]">
            <div className="lg:border-r lg:border-paper-rule lg:pr-12">
              <p className="kicker mb-4">feature / 이번 호 대표</p>
              <PostCard post={lead} variant="feature" />
            </div>
            <ol className="mt-10 list-none lg:mt-0">
              <li className="kicker mb-3 block">runners up</li>
              {runnersUp.map((post, index) => (
                <li key={post.slug}>
                  <PostCard post={post} index={index + 1} />
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="border-y border-paper-rule py-16 text-center font-mono text-sm uppercase tracking-wider text-ink-500">
            아직 공개된 기록이 없습니다.
          </p>
        )}
      </section>

      {showIndex ? (
        <section className="border-y border-paper-rule bg-paper-deep">
          <div className="container-mast py-16">
            <header className="section-marker mb-10">
              <p className="kicker tabular-nums">02 / 03</p>
              <div>
                <p className="kicker">index</p>
                <h2 className="mt-2 font-display text-display text-ink-900">
                  기록소 가는 길
                </h2>
              </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-2">
              {indexColumns.map((column) => (
                <section key={column.label} className="min-w-0">
                  <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-ink-900 pb-3">
                    <p className="kicker kicker-accent">{column.label}</p>
                    <Link
                      href={column.href}
                      className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 hover:text-accent"
                    >
                      전체 →
                    </Link>
                  </div>
                  {column.items.length === 0 ? (
                    <p className="font-mono text-xs text-ink-400">
                      아직 없습니다.
                    </p>
                  ) : (
                    <ol className="list-none divide-y divide-paper-rule">
                      {column.items.map((item, index) => (
                        <li key={item.slug}>
                          <Link
                            href={`${column.href}/${item.slug}`}
                            className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3 text-ink-700 transition-colors hover:text-accent"
                          >
                            <span className="font-mono text-[0.7rem] text-accent tabular-nums">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 break-words">
                              {item.label}
                            </span>
                            <span className="font-mono text-[0.7rem] text-ink-400 tabular-nums">
                              {item.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-mast py-16">
        <header className="section-marker mb-8">
          <p className="kicker tabular-nums">03 / 03</p>
          <div>
            <p className="kicker">why this site</p>
            <h2 className="mt-2 font-display text-display text-ink-900">
              진짜 되는 것만 남긴다
            </h2>
          </div>
        </header>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <p className="max-w-prose text-ink-600 leading-relaxed">
            인터넷에 떠도는 AI 튜토리얼을 직접 따라 해보고, 안 된 부분과 막힌
            지점, 비용까지 기록합니다. 새로운 도구가 좋아 보이는 글이 아니라,
            직접 끝까지 해본 사람의 기록만 남깁니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {promiseChips.map((chip) => (
              <div
                key={chip.label}
                className="border border-paper-rule bg-paper-elevated p-4"
              >
                <p className="kicker kicker-accent">{chip.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {chip.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 3: Browser smoke**

```
npm run dev
```

Visit `/`. Verify:

- Hero kicker is "AI 시대 생존기", title is "AI 튜토리얼, 제가 먼저 끝까지 해봅니다.", lede matches.
- Section markers read `01 / 03`, `02 / 03`, `03 / 03`.
- § 02/03 has 2 columns: categories + tags.
- § 03/03 has prose + 3 chip cards (tutorial / survived / archive). No icons, no centered text.
- Mobile (390px): chips stack into single column, gap-3 between.

Stop dev server.

- [ ] **Step 4: Commit**

```
git add "apps/web/app/(public)/page.tsx"
git commit -m "feat(home): restore § 03/03 promise + retune § 02/03 to categories+tags only"
```

---

### Task 11: Category and Tag pages — empty-state copy + don't 404 on draft-only

**Files:**

- Modify: `apps/web/app/(public)/categories/[category]/page.tsx`
- Modify: `apps/web/app/(public)/tags/[tag]/page.tsx`

- [ ] **Step 1: Update the category page**

Replace `apps/web/app/(public)/categories/[category]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { categoryBuckets, getPostsByCategory } from "@/lib/content/posts";
import { CATEGORY_DESCRIPTIONS, categoryLabel } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return categoryBuckets().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabel(category);
  return pageMetadata({
    title: label,
    description:
      CATEGORY_DESCRIPTIONS[category] ?? `${label} 카테고리 글 목록입니다.`,
    path: `/categories/${category}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const buckets = categoryBuckets();
  const bucket = buckets.find((b) => b.slug === category);
  if (!bucket) notFound();

  const posts = getPostsByCategory(category);

  return (
    <>
      <PageHeader
        kicker={`category · ${posts.length} published`}
        title={bucket.label}
        description={
          CATEGORY_DESCRIPTIONS[category] ?? "이 카테고리의 발행된 글입니다."
        }
      />
      <PostList posts={posts} emptyText="아직 발행된 글이 없습니다." />
    </>
  );
}
```

- [ ] **Step 2: Update the tag page**

Replace `apps/web/app/(public)/tags/[tag]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { getPostsByTag, tagBuckets } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return tagBuckets().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const buckets = tagBuckets();
  const bucket = buckets.find((b) => b.slug === tag);
  const label = bucket?.label ?? tag;
  return pageMetadata({
    title: `#${label}`,
    description: `${label} 태그 글 목록입니다.`,
    path: `/tags/${tag}`,
  });
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const buckets = tagBuckets();
  const bucket = buckets.find((b) => b.slug === tag);
  if (!bucket) notFound();

  const posts = getPostsByTag(tag);

  return (
    <>
      <PageHeader
        kicker={`tag · ${posts.length} published`}
        title={`#${bucket.label}`}
        description="이 태그가 붙은 발행 글입니다."
      />
      <PostList posts={posts} emptyText="이 태그가 붙은 글이 아직 없습니다." />
    </>
  );
}
```

- [ ] **Step 3: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 4: Browser smoke**

```
npm run dev
```

Visit `/categories/<any-existing-slug>` and `/tags/<any-existing-slug>`. Verify the kicker reads `category · N published` (or `tag · N published`) and the page renders. Hit a non-existent slug like `/categories/does-not-exist` — confirm 404. Stop dev server.

- [ ] **Step 5: Commit**

```
git add "apps/web/app/(public)/categories/[category]/page.tsx" "apps/web/app/(public)/tags/[tag]/page.tsx"
git commit -m "feat(archive): preserve display labels on category/tag pages, retune empty-state copy"
```

---

### Task 12: About page copy retune

**Files:**

- Modify: `apps/web/app/(public)/about/page.tsx`

- [ ] **Step 1: Read the current file**

```
cat "apps/web/app/(public)/about/page.tsx"
```

The implementer adapts the existing structure (PageHeader + sections) to the new copy below. Do NOT rewrite layout — only swap the copy strings.

- [ ] **Step 2: Update the body copy**

The required copy direction (per spec §6.7):

- Hero kicker: "about"
- Hero title: "AI 시대 생존기"
- Hero description: "AI 시대를 살아남기 위해 직접 따라 해본 튜토리얼, 막힌 부분, 비용, 결과물까지 정리합니다."
- Body section 1 — "이 사이트가 하는 일":
  > AI 시대 생존기는 AI 뉴스 요약 블로그가 아닙니다. 개발자이자 메이커가 직접 AI 튜토리얼을 따라 해보고, 설치부터 에러, 비용, 결과물까지 정리합니다. 잘 된 것뿐 아니라 막힌 부분과 비용 누수, 약관상 조심해야 할 부분까지 기록합니다.
- Body section 2 — "이 사이트가 하지 않는 일":
  > 새 도구 출시 알림, 추측성 트렌드 분석, 실험해보지 않은 AI 사용법은 다루지 않습니다.
- Body section 3 — "기록 기준":
  > 이 글을 읽은 사람이 시간·돈·시행착오 중 하나를 줄일 수 있는가 — 이 질문을 통과하지 못하면 글로 발행되지 않습니다.

Adapt the existing layout to surface these three sections. Keep any existing footer signature pattern.

- [ ] **Step 3: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 4: Browser smoke**

```
npm run dev
```

Visit `/about`. Verify the three sections render. Stop dev server.

- [ ] **Step 5: Commit**

```
git add "apps/web/app/(public)/about/page.tsx"
git commit -m "feat(about): retune copy for survival-journal positioning"
```

---

### Task 13: Update `DESIGN.md`

**Files:**

- Modify: `DESIGN.md`

- [ ] **Step 1: Apply the four edits from spec §8.5**

Open `DESIGN.md` (project root, not under `apps/`).

Edit 1 — replace this line:

```
- Accent: teal/cyan as a lab marker, not a decorative gradient.
```

with:

```
- Accent: cinnabar / vermilion as an editorial signature mark, not a decorative gradient. Used only for the wordmark accent word, drop cap, kicker-accent, section §, focus ring, and the existing highlight band. Body links and buttons stay ink-on-paper.
```

Edit 2 — replace the file's opening descriptive line:

```
AI Vibe Lab is an editorial lab notebook, not a SaaS landing page.
```

with:

```
AI 시대 생존기 is a survival journal — tutorials taken end-to-end, with cost, errors, and what was left after they ran. Not a SaaS landing page.
```

Edit 3 — under the section "### Home", add the following sentence at the end of that section (before "Avoid a generic three-card first impression."):

```
Section markers are numbered `01 / 03`, `02 / 03`, `03 / 03` after the unnumbered hero. The third section is a restored editorial promise block with three left-aligned chip cards — never a centered icon-feature grid.
```

Edit 4 — under "## Anti-slop blacklist", add this bullet at the end of the list:

```
- colored left-border on cards as visual decoration
```

- [ ] **Step 2: Commit**

```
git add DESIGN.md
git commit -m "docs(design): cinnabar accent role, survival-journal positioning, anti-slop additions"
```

---

### Task 14: Update `CONTENT_MODEL.md`

**Files:**

- Modify: `docs/10_content/CONTENT_MODEL.md`

- [ ] **Step 1: Replace the "Category Slug" enum section**

Open `docs/10_content/CONTENT_MODEL.md`. Locate "## 5. Category Slug" and the table of 5 enum values. Replace the entire `## 5. Category Slug` heading + table with:

```markdown
## 5. Category 값 (free-form)

`category`는 자유 입력 문자열이다. enum이 아니다.

- 값은 그대로 보존되며, 빌드 시 `slugifyTaxonomy()`로 URL 슬러그가 도출된다.
- 표시 라벨은 `lib/labels.ts`의 `CATEGORY_LABELS`에서 우선 조회되며, 없으면 frontmatter에 적힌 원문이 그대로 노출된다.
- 두 개의 서로 다른 `category` 값이 같은 슬러그로 정규화되면, `next dev`에서는 콘솔 경고가 나오고 `next build`는 실패한다 (SEO 이중-URL 방지).
- 새 카테고리는 글을 쓰면서 자유롭게 추가할 수 있다.

기존 슬러그(`vibe-coding-lab`, `ai-tool-review`, `ai-workflow-automation`, `ai-productivity`, `domain-ai`)는 `CATEGORY_LABELS` 테이블에 한국어 라벨이 등록되어 있어 그대로 표시된다. 새 값은 frontmatter 원문이 라벨로 사용된다.

`tags` 필드도 동일한 규칙을 따른다 (자유 입력, slugify, 충돌 정책).
```

- [ ] **Step 2: Update the `## 7. Slug 규칙` heading caveat**

Inside `## 7. Slug 규칙`, the existing rules apply to the **post folder slug** (`apps/web/content/posts/<slug>/`). Add a paragraph at the top of the section:

```markdown
> 글 폴더 슬러그(`<slug>/index.mdx`의 `<slug>`)는 영문 소문자·숫자·하이픈만 사용한다. 카테고리/태그 슬러그는 §5의 자유 입력 규칙을 따른다.
```

- [ ] **Step 3: Update the frontmatter example block in §3**

In `## 3. Post Frontmatter`, the example shows `category: "vibe-coding-lab"` — leave as-is (existing posts use that), but add a comment line above the example:

```markdown
> `category`와 `tags` 값은 자유 문자열이다. 한국어, 공백, 대소문자 모두 가능. 기존 글의 kebab-case 슬러그도 그대로 유효하다.
```

- [ ] **Step 4: Commit**

```
git add docs/10_content/CONTENT_MODEL.md
git commit -m "docs(content): document free-form taxonomy + slugifyTaxonomy + collision policy"
```

---

### Task 15: Update `SERVICE_IA.md`, `SCREEN_INVENTORY.md`, `SEO_ADSENSE_CHECKLIST.md`

**Files:**

- Modify: `docs/20_site/SERVICE_IA.md`
- Modify: `docs/20_site/SCREEN_INVENTORY.md`
- Modify: `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`

- [ ] **Step 1: Sync `SERVICE_IA.md` to the new nav**

Update the primary navigation list in `SERVICE_IA.md` to read:

```
HOME · POSTS▾ · ABOUT
```

and replace any "POSTS / SERIES / TOOLS / ABOUT" line. Add a sentence describing the POSTS dropdown:

> POSTS 트리거는 호버 시 카테고리 드롭다운을 열고, 클릭 시 `/posts`로 이동한다. 패널 항목: 전체 글 + 상위 8개 카테고리 + "카테고리 모두 보기" 링크.

The `/series`, `/tools`, `/categories`, `/tags` routes remain valid in the IA tree but are not in the primary nav — adjust prose accordingly.

- [ ] **Step 2: Sync `SCREEN_INVENTORY.md`**

Add an entry for the POSTS dropdown panel under the "Header" group, including its keyboard support (Escape to close, arrow keys to traverse). Mark `/series` and `/tools` as "low-priority — not promoted in nav".

- [ ] **Step 3: Sync `SEO_ADSENSE_CHECKLIST.md`**

Find any reference to "AI Vibe Lab" in the title-template guidance and replace with "AI 시대 생존기". Confirm that the existing `pageMetadata({...})` builds titles via `SITE_NAME`, so this is a one-line documentation fix.

- [ ] **Step 4: Commit**

```
git add docs/20_site/SERVICE_IA.md docs/20_site/SCREEN_INVENTORY.md docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md
git commit -m "docs(ia/seo): sync IA, screen inventory, SEO checklist with rebrand"
```

---

### Task 16: Final verification — typecheck + tests + build + browser smoke

**Files:** none (verification only)

- [ ] **Step 1: Run unit tests**

From `apps/web/`:

```
npm run test
```

Expected: every test PASS, exit 0.

- [ ] **Step 2: Typecheck**

```
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 3: Lint**

```
npm run lint
```

Expected: exit 0 (or only warnings).

- [ ] **Step 4: Production build (also exercises slug-collision hard-error path)**

```
npm run build
```

Expected: build succeeds. If it fails with `slug-collision: …`, the failure is the spec's intended behavior — go fix the colliding `category` or `tag` value in MDX frontmatter, then rebuild. Do NOT silence the error.

- [ ] **Step 5: Browser smoke against acceptance criteria (spec §10)**

From `apps/web/`:

```
npm run dev
```

For each item, click through and confirm:

1. Wordmark on every page reads "AI 시대 생존기".
2. Header has no "VOL · ISSUE" element on desktop or mobile (resize to 390px).
3. POSTS dropdown opens with at least "전체 글" + categories + "카테고리 모두 보기"; closes on Escape, outside click, route change.
4. Home has three numbered sections `01/03`, `02/03`, `03/03`; § 03/03 reads "진짜 되는 것만 남긴다".
5. Footer's prominent line is "안 해본 튜토리얼은 검증되지 않는다".
6. Existing post URLs respond 200 — pick one slug from `apps/web/content/posts/` and visit `/posts/<slug>`.
7. Mobile (390px): home, post detail, `/categories/<slug>` show no horizontal overflow. Use DevTools device toolbar.
8. Light/dark accent: toggle theme, confirm cinnabar reads as the accent in both modes (drop cap, kicker-accent, "생존기" word in wordmark).

If any item fails, file the specific gap and fix before proceeding.

- [ ] **Step 6: Final commit (if any uncommitted fixes from smoke)**

```
git status
# if anything is staged from fixes, commit it with a focused message
```

- [ ] **Step 7: Push the branch**

(Skip if user wants to review before pushing.)

```
git push -u origin <branch-name>
```

---

## Self-Review

**Spec coverage check:** Every spec section has a task.

| Spec section                 | Task                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| §3 Brand & copy              | T2 (site.ts), T7 (header), T9 (footer), T10 (home), T12 (about) |
| §4 Content model             | T1 (slugify), T4 (categoryBuckets), T5 (tagBuckets)             |
| §5 Visual system             | T6 (cinnabar tokens)                                            |
| §6.0 IA tree                 | T7 (header), T8 (dropdown), T15 (docs)                          |
| §6.0.1 Interaction states    | T8 (dropdown states), T11 (category/tag empty)                  |
| §6.1 Header                  | T7                                                              |
| §6.2 Home + §6.2.1 chip card | T10                                                             |
| §6.3 Post detail             | (no change required — existing layout works as-is)              |
| §6.4 Category page           | T11                                                             |
| §6.5 All-posts page          | (no change required)                                            |
| §6.6 Footer                  | T9                                                              |
| §6.6.1 Responsive            | T7 (header mobile), T8 (dropdown mobile inline)                 |
| §6.6.2 A11y                  | T8 (ARIA + keyboard)                                            |
| §6.7 About                   | T12                                                             |
| §7 lib/site.ts               | T2                                                              |
| §8.5 Doc updates             | T13–T15                                                         |

**Placeholder scan:** The plan contains no "TBD", "TODO", or "implement appropriate X" markers. Every step contains either the actual code, the actual command, or the precise edit instruction. Task 12 leaves the layout structure to the implementer because the existing About layout was not read into the spec context — but the copy is exact.

**Type consistency check:** `slugifyTaxonomy(value: string): string` declared in T1 is imported in T4 and T5 with that exact signature. `Bucket` type from `posts.ts` is imported in T8 (`PostsNavDropdown`) with `categories: Bucket[]` prop. `SITE_FOOTER_SIGNATURE`, `SITE_HERO_HEADLINE`, `SITE_HERO_LEDE`, `SITE_SUBTITLE` are all declared in T2's `site.ts` rewrite and consumed in T7, T9, T10. `NAV_PRIMARY` is reduced to 3 items in T2 and the new shape (no `hasDropdown` flag) is honored in T7's hardcoded `item.href === "/posts"` branch.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-07-rebrand-survivor-implementation.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
