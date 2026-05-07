# Slice 5.4 — Embed Pack (8 components + OG fallback)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor
Status: Ready (depends on 5.1, independent of 5.2 / 5.3)
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md) §3, §4.5, §5.1

**Goal:** URL 한 줄 paste 만으로 8개 서비스 카드(YouTube, Vimeo, X/Tweet, CodePen, Gist, Spotify, Notion, GitHubRepo) + 일반 OG 카드 (`<Embed>`) 가 자동으로 박힘. 모든 카드는 MDX 자체닫기 컴포넌트로 직렬화되어 GitHub PR 에서 사람이 읽을 수 있음.

**Architecture:** 모든 서비스를 단일 *registry* 로 정의 — 각 항목은 `{ name, urlPattern, parseUrl, attrsToShortcode, NodeView, MdxRenderer }` 를 갖는다. 단일 paste plugin 이 registry 순회하며 첫 매칭 항목으로 분기, 매칭 없으면 OG 카드 fallback. NodeView·MDX renderer 는 config 에서 자동 생성. 외부 fetch 가 필요한 컴포넌트(`Tweet`, `GitHubRepo`)는 서버 컴포넌트 + `unstable_cache` revalidate(1h).

**Tech Stack:** Tiptap 2.27, ProseMirror Plugin, `cheerio` 0.22, Next.js `unstable_cache`.

---

## Files

**Create:**
- `apps/web/src/components/admin/RichEditor/embeds/registry.ts`
- `apps/web/src/components/admin/RichEditor/embeds/url-match.ts`
- `apps/web/src/components/admin/RichEditor/embeds/url-match.test.ts`
- `apps/web/src/components/admin/RichEditor/embeds/embed-node.ts`
- `apps/web/src/components/admin/RichEditor/embeds/embed-view.tsx`
- `apps/web/src/components/admin/RichEditor/plugins/embed-paste.ts`
- `apps/web/src/components/mdx/Vimeo.tsx`
- `apps/web/src/components/mdx/Tweet.tsx`
- `apps/web/src/components/mdx/CodePen.tsx`
- `apps/web/src/components/mdx/Gist.tsx`
- `apps/web/src/components/mdx/Spotify.tsx`
- `apps/web/src/components/mdx/Notion.tsx`
- `apps/web/src/components/mdx/GitHubRepo.tsx`
- `apps/web/src/components/mdx/Embed.tsx`
- `apps/web/app/api/admin/og/route.ts`
- `apps/web/app/api/admin/og/og.ts` (검증 로직 + cheerio 파싱)
- `apps/web/app/api/admin/og/og.test.ts`
- `apps/web/src/components/admin/RichEditor/embeds/serialize.test.ts`

**Modify:**
- `apps/web/package.json` (`cheerio`, test 스크립트)
- `apps/web/src/components/admin/RichEditor/extensions.ts` (Embed nodes 등록 + EmbedPaste plugin)
- `apps/web/src/components/admin/RichEditor/commands.ts` (`Embed` 슬래시 항목)
- `apps/web/src/components/admin/RichEditor/serialize.ts` (Embed 직렬화 추가)
- `apps/web/src/components/admin/RichEditor/index.tsx` (slash items 합치기)
- `apps/web/src/components/mdx/mdx-components.tsx` (8개 + Embed 등록)

---

## Tasks

### Task 1: cheerio 추가

- [ ] **Step 1: package.json**

```json
"cheerio": "^1.0.0",
```

- [ ] **Step 2: install**

```bash
cd apps/web && npm install --legacy-peer-deps
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/package.json apps/web/package-lock.json
git commit -m "deps(web): add cheerio for OG metadata parsing"
```

---

### Task 2: URL 매칭 라이브러리 (testable)

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/embeds/url-match.ts`

- [ ] **Step 1: 8개 서비스 매처 작성**

```ts
export type EmbedKind =
  | "youtube"
  | "vimeo"
  | "tweet"
  | "codepen"
  | "gist"
  | "spotify"
  | "notion"
  | "githubRepo";

export type EmbedAttrs = Record<string, string>;

export type EmbedMatch = { kind: EmbedKind; attrs: EmbedAttrs };

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

function tryUrl(input: string): URL | null {
  try {
    return new URL(input.trim());
  } catch {
    return null;
  }
}

export function matchYouTube(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (/(?:^|\.)youtube(?:-nocookie)?\.com$/.test(url.hostname)) {
    if (url.pathname === "/watch") {
      const v = url.searchParams.get("v") ?? "";
      if (YOUTUBE_ID.test(v)) return { id: v };
    }
    const m = /^\/embed\/([A-Za-z0-9_-]{6,20})/.exec(url.pathname);
    if (m) return { id: m[1]! };
  }
  if (url.hostname === "youtu.be") {
    const id = url.pathname.replace(/^\/+/, "");
    if (YOUTUBE_ID.test(id)) return { id };
  }
  return null;
}

export function matchVimeo(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (!/(?:^|\.)vimeo\.com$/.test(url.hostname)) return null;
  const m = /^\/(\d{6,12})/.exec(url.pathname);
  return m ? { id: m[1]! } : null;
}

export function matchTweet(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (!/^(?:twitter|x)\.com$/.test(url.hostname.replace(/^www\./, ""))) return null;
  const m = /^\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})/.exec(url.pathname);
  return m ? { author: m[1]!, id: m[2]! } : null;
}

export function matchCodePen(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (!/(?:^|\.)codepen\.io$/.test(url.hostname)) return null;
  const m = /^\/([A-Za-z0-9_-]+)\/(?:pen|details|full)\/([A-Za-z0-9]+)/.exec(url.pathname);
  return m ? { user: m[1]!, id: m[2]! } : null;
}

export function matchGist(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (url.hostname !== "gist.github.com") return null;
  const m = /^\/([A-Za-z0-9_-]+)\/([0-9a-f]{20,40})/.exec(url.pathname);
  return m ? { user: m[1]!, id: m[2]! } : null;
}

export function matchSpotify(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (url.hostname !== "open.spotify.com") return null;
  const m = /^\/(track|episode|album|playlist|show)\/([A-Za-z0-9]{15,40})/.exec(url.pathname);
  return m ? { type: m[1]!, id: m[2]! } : null;
}

export function matchNotion(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  // notion.so/...-<32hex> or *.notion.site/<32hex>
  if (url.hostname === "www.notion.so" || url.hostname === "notion.so") {
    const m = /-([0-9a-f]{32})(?:[/?#]|$)/.exec(url.pathname + url.search);
    if (m) return { pageId: m[1]! };
  }
  if (/\.notion\.site$/.test(url.hostname)) {
    const m = /([0-9a-f]{32})/.exec(url.pathname);
    if (m) return { pageId: m[1]! };
  }
  return null;
}

export function matchGitHubRepo(input: string): EmbedAttrs | null {
  const url = tryUrl(input);
  if (!url) return null;
  if (url.hostname !== "github.com") return null;
  // exclude /<o>/<r>/issues|pull|...
  const m = /^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/.exec(url.pathname);
  return m ? { owner: m[1]!, repo: m[2]! } : null;
}

export function matchAnyEmbed(input: string): EmbedMatch | null {
  const tries: Array<[EmbedKind, (s: string) => EmbedAttrs | null]> = [
    ["youtube", matchYouTube],
    ["vimeo", matchVimeo],
    ["tweet", matchTweet],
    ["codepen", matchCodePen],
    ["gist", matchGist],
    ["spotify", matchSpotify],
    ["notion", matchNotion],
    ["githubRepo", matchGitHubRepo],
  ];
  for (const [kind, fn] of tries) {
    const attrs = fn(input);
    if (attrs) return { kind, attrs };
  }
  return null;
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/embeds/url-match.ts
git commit -m "feat(editor): URL match library for 8 embed services"
```

---

### Task 3: URL 매처 단위 테스트

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/embeds/url-match.test.ts`

- [ ] **Step 1: 케이스 테이블 테스트**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { matchAnyEmbed } from "./url-match.ts";

const cases: Array<[string, string, Record<string, string> | null]> = [
  ["YouTube watch", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", { id: "dQw4w9WgXcQ" }],
  ["YouTube short", "https://youtu.be/dQw4w9WgXcQ", { id: "dQw4w9WgXcQ" }],
  ["Vimeo", "https://vimeo.com/76979871", { id: "76979871" }],
  ["X status", "https://x.com/elonmusk/status/1234567890123456789", { author: "elonmusk", id: "1234567890123456789" }],
  ["Twitter status", "https://twitter.com/jack/status/20", { author: "jack", id: "20" }],
  ["CodePen pen", "https://codepen.io/ty-kim/pen/abc123XY", { user: "ty-kim", id: "abc123XY" }],
  ["Gist", "https://gist.github.com/ty-kim/abcdef0123456789abcdef0123456789abcdef01", { user: "ty-kim", id: "abcdef0123456789abcdef0123456789abcdef01" }],
  ["Spotify track", "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp", { type: "track", id: "3n3Ppam7vgaVa1iaRUc9Lp" }],
  ["Notion .so", "https://www.notion.so/My-Page-0123456789abcdef0123456789abcdef", { pageId: "0123456789abcdef0123456789abcdef" }],
  ["Notion .site", "https://example.notion.site/My-Page-0123456789abcdef0123456789abcdef", { pageId: "0123456789abcdef0123456789abcdef" }],
  ["GitHub repo", "https://github.com/ty-kim/ai_survivor", { owner: "ty-kim", repo: "ai_survivor" }],
  ["GitHub issue (NOT a repo)", "https://github.com/ty-kim/ai_survivor/issues/1", null],
  ["Random URL", "https://example.com/article", null],
];

for (const [label, url, expected] of cases) {
  test(`matchAnyEmbed: ${label}`, () => {
    const result = matchAnyEmbed(url);
    if (expected === null) assert.equal(result, null);
    else {
      assert.notEqual(result, null);
      assert.deepEqual(result?.attrs, expected);
    }
  });
}
```

- [ ] **Step 2: 실행**

```bash
cd apps/web && node --test src/components/admin/RichEditor/embeds/url-match.test.ts
```

Expected: `# pass 13`, `# fail 0`.

- [ ] **Step 3: package.json 추가**

```json
"test": "... src/components/admin/RichEditor/embeds/url-match.test.ts"
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/embeds/url-match.test.ts apps/web/package.json
git commit -m "test(editor): URL match cases for 8 services"
```

---

### Task 4: OG 엔드포인트 검증 로직 + 단위 테스트

**Files:**
- Create: `apps/web/app/api/admin/og/og.ts`

- [ ] **Step 1: SSRF 가드 + 파서**

```ts
import * as cheerio from "cheerio";

const PRIVATE_RANGES: Array<(ip: string) => boolean> = [
  (ip) => ip === "0.0.0.0",
  (ip) => ip === "127.0.0.1" || ip === "::1",
  (ip) => /^10\./.test(ip),
  (ip) => /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip),
  (ip) => /^192\.168\./.test(ip),
  (ip) => /^169\.254\./.test(ip),
];

export type OgValidationResult =
  | { ok: true; url: URL }
  | { ok: false; error: string; status: number };

export function validateOgUrl(input: string): OgValidationResult {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { ok: false, error: "Invalid URL", status: 400 };
  }
  if (url.protocol !== "https:") {
    return { ok: false, error: "Only https URLs are allowed", status: 400 };
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "0.0.0.0") {
    return { ok: false, error: "Forbidden host", status: 400 };
  }
  // raw IP check
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    if (PRIVATE_RANGES.some((fn) => fn(host))) {
      return { ok: false, error: "Forbidden IP range", status: 400 };
    }
  }
  return { ok: true, url };
}

export type OgMeta = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

export function parseOgFromHtml(html: string, sourceUrl: string): OgMeta {
  const $ = cheerio.load(html);
  const meta = (selector: string): string | undefined => {
    const v = $(selector).attr("content")?.trim();
    return v || undefined;
  };
  return {
    url: sourceUrl,
    title:
      meta('meta[property="og:title"]') ||
      $("title").first().text().trim() ||
      undefined,
    description:
      meta('meta[property="og:description"]') ||
      meta('meta[name="description"]') ||
      undefined,
    image: meta('meta[property="og:image"]'),
    siteName: meta('meta[property="og:site_name"]'),
  };
}
```

- [ ] **Step 2: 단위 테스트**

`apps/web/app/api/admin/og/og.test.ts`:
```ts
import assert from "node:assert/strict";
import test from "node:test";
import { parseOgFromHtml, validateOgUrl } from "./og.ts";

test("validateOgUrl rejects http", () => {
  const r = validateOgUrl("http://example.com");
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.status, 400);
});
test("validateOgUrl rejects localhost", () => {
  assert.equal(validateOgUrl("https://localhost/").ok, false);
});
test("validateOgUrl rejects 127.0.0.1", () => {
  assert.equal(validateOgUrl("https://127.0.0.1/").ok, false);
});
test("validateOgUrl rejects 10.0.0.1", () => {
  assert.equal(validateOgUrl("https://10.0.0.1/").ok, false);
});
test("validateOgUrl rejects 169.254.169.254 (AWS metadata)", () => {
  assert.equal(validateOgUrl("https://169.254.169.254/").ok, false);
});
test("validateOgUrl accepts public https", () => {
  assert.equal(validateOgUrl("https://example.com/").ok, true);
});
test("validateOgUrl rejects malformed", () => {
  assert.equal(validateOgUrl("not a url").ok, false);
});

test("parseOgFromHtml extracts og tags", () => {
  const html = `<html><head>
    <title>Page</title>
    <meta property="og:title" content="Hello"/>
    <meta property="og:description" content="World"/>
    <meta property="og:image" content="https://x/og.jpg"/>
    <meta property="og:site_name" content="Example"/>
  </head></html>`;
  const m = parseOgFromHtml(html, "https://example.com/x");
  assert.equal(m.title, "Hello");
  assert.equal(m.description, "World");
  assert.equal(m.image, "https://x/og.jpg");
  assert.equal(m.siteName, "Example");
});

test("parseOgFromHtml falls back to <title> and meta description", () => {
  const html = `<html><head><title>Page</title><meta name="description" content="Plain"/></head></html>`;
  const m = parseOgFromHtml(html, "https://example.com/y");
  assert.equal(m.title, "Page");
  assert.equal(m.description, "Plain");
});
```

- [ ] **Step 3: 실행**

```bash
cd apps/web && node --test app/api/admin/og/og.test.ts
```

Expected: `# pass 9`.

- [ ] **Step 4: 커밋**

```bash
git add apps/web/app/api/admin/og/og.ts apps/web/app/api/admin/og/og.test.ts apps/web/package.json
git commit -m "feat(admin): OG validation + cheerio parser with SSRF guard"
```

---

### Task 5: OG 라우트 핸들러

**Files:**
- Create: `apps/web/app/api/admin/og/route.ts`

- [ ] **Step 1: 라우트 — admin 인증 + DNS resolve 후 fetch**

```ts
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { parseOgFromHtml, validateOgUrl } from "./og";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 5000;
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_REDIRECTS = 3;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const url = new URL(request.url);
  const target = url.searchParams.get("url");
  if (!target) return jsonError("Missing url param", 400);

  const v1 = validateOgUrl(target);
  if (!v1.ok) return jsonError(v1.error, v1.status);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(v1.url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ai-vibe-lab-og-fetcher" },
    });
  } catch (error) {
    clearTimeout(timer);
    return jsonError(error instanceof Error ? error.message : "Fetch failed", 502);
  }
  clearTimeout(timer);

  // redirect 횟수 검증 — fetch는 follow 시 자동 처리하므로 redirect.count 가 따로 없음.
  // 서버 응답 URL 이 같은 도메인 SSRF 게이트를 통과한 URL인지 한 번 더 확인.
  const finalV = validateOgUrl(response.url);
  if (!finalV.ok) return jsonError(finalV.error, finalV.status);

  const ct = response.headers.get("content-type") ?? "";
  if (!ct.includes("text/html")) {
    return NextResponse.json({ url: response.url });
  }

  const reader = response.body?.getReader();
  if (!reader) return NextResponse.json({ url: response.url });
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      reader.cancel().catch(() => {});
      break;
    }
    chunks.push(value);
  }
  const html = Buffer.concat(chunks).toString("utf8");
  const meta = parseOgFromHtml(html, response.url);
  return NextResponse.json(meta);
}
```

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/app/api/admin/og/route.ts
git commit -m "feat(admin): /api/admin/og fetch with SSRF guard"
```

---

### Task 6: 8개 + Embed MDX 렌더 컴포넌트

**Files:**
- Create: `apps/web/src/components/mdx/Vimeo.tsx`
- Create: `apps/web/src/components/mdx/Tweet.tsx`
- Create: `apps/web/src/components/mdx/CodePen.tsx`
- Create: `apps/web/src/components/mdx/Gist.tsx`
- Create: `apps/web/src/components/mdx/Spotify.tsx`
- Create: `apps/web/src/components/mdx/Notion.tsx`
- Create: `apps/web/src/components/mdx/GitHubRepo.tsx`
- Create: `apps/web/src/components/mdx/Embed.tsx`

각 단계별로 한 컴포넌트씩 작성·커밋.

- [ ] **Step 1: Vimeo**

```tsx
const VIMEO_ID = /^\d{6,12}$/;
export function Vimeo({ id }: { id: string }) {
  if (!VIMEO_ID.test(id)) return null;
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-md border border-paper-rule bg-black">
      <iframe
        src={`https://player.vimeo.com/video/${id}`}
        title="Vimeo video"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
      />
    </div>
  );
}
```

- [ ] **Step 2: Tweet — 서버 fetch + cache**

```tsx
import { unstable_cache } from "next/cache";

type Syndication = { text?: string; user?: { name?: string; screen_name?: string } };

const fetchTweet = unstable_cache(
  async (id: string): Promise<Syndication | null> => {
    const url = `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(id)}&lang=en`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "ai-vibe-lab" } });
      if (!res.ok) return null;
      return (await res.json()) as Syndication;
    } catch {
      return null;
    }
  },
  ["tweet-syndication"],
  { revalidate: 3600 },
);

export async function Tweet({ id, author }: { id: string; author?: string }) {
  const data = await fetchTweet(id);
  const text = data?.text ?? "";
  const name = data?.user?.name ?? author ?? "";
  const screenName = data?.user?.screen_name ?? author ?? "";
  const href = `https://x.com/${screenName || "i"}/status/${id}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex flex-col gap-2 rounded-md border border-paper-rule bg-paper px-4 py-3 no-underline hover:border-accent"
    >
      <div className="flex items-center gap-2 text-sm text-ink-700">
        {name && <span className="font-semibold">{name}</span>}
        {screenName && <span className="text-ink-400">@{screenName}</span>}
      </div>
      <p className="text-sm text-ink-800">{text || "View on X"}</p>
    </a>
  );
}
```

- [ ] **Step 3: CodePen**

```tsx
const PEN_ID = /^[A-Za-z0-9]{4,}$/;
const USER = /^[A-Za-z0-9_-]+$/;
export function CodePen({
  user,
  id,
  defaultTab = "result",
}: {
  user: string;
  id: string;
  defaultTab?: string;
}) {
  if (!USER.test(user) || !PEN_ID.test(id)) return null;
  return (
    <div className="my-6 h-[420px] w-full overflow-hidden rounded-md border border-paper-rule">
      <iframe
        src={`https://codepen.io/${user}/embed/${id}?default-tab=${encodeURIComponent(defaultTab)}`}
        title={`CodePen ${id}`}
        loading="lazy"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups"
        className="h-full w-full"
      />
    </div>
  );
}
```

- [ ] **Step 4: Gist**

```tsx
const GIST_ID = /^[0-9a-f]{20,40}$/;
const USER = /^[A-Za-z0-9_-]+$/;
export function Gist({ user, id, file }: { user: string; id: string; file?: string }) {
  if (!USER.test(user) || !GIST_ID.test(id)) return null;
  const src = `https://gist.github.com/${user}/${id}.js${file ? `?file=${encodeURIComponent(file)}` : ""}`;
  return (
    <div className="my-6 rounded-md border border-paper-rule">
      <iframe
        sandbox="allow-scripts"
        srcDoc={`<html><body><script src="${src}"></script></body></html>`}
        loading="lazy"
        className="h-[400px] w-full"
        title={`Gist ${id}`}
      />
    </div>
  );
}
```

- [ ] **Step 5: Spotify**

```tsx
const ID = /^[A-Za-z0-9]{15,40}$/;
const TYPE = new Set(["track", "episode", "album", "playlist", "show"]);
const HEIGHT: Record<string, string> = { track: "152", episode: "232", album: "352", playlist: "352", show: "232" };
export function Spotify({ type, id }: { type: string; id: string }) {
  if (!TYPE.has(type) || !ID.test(id)) return null;
  return (
    <div className="my-6 w-full">
      <iframe
        src={`https://open.spotify.com/embed/${type}/${id}`}
        height={HEIGHT[type] ?? "232"}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="w-full rounded-md border border-paper-rule"
        title={`Spotify ${type} ${id}`}
      />
    </div>
  );
}
```

- [ ] **Step 6: Notion**

```tsx
const PAGE_ID = /^[0-9a-f]{32}$/;
export function Notion({ pageId, title }: { pageId: string; title?: string }) {
  if (!PAGE_ID.test(pageId)) return null;
  // Notion does not expose a stable iframe embed for arbitrary pages without sharing.
  // Render a card linking to notion.so. Public site embeds are owner's responsibility.
  const url = `https://www.notion.so/${pageId}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex flex-col gap-1 rounded-md border border-paper-rule bg-paper px-4 py-3 no-underline hover:border-accent"
    >
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">Notion</span>
      <span className="text-sm text-ink-800">{title || "Open in Notion"}</span>
    </a>
  );
}
```

> **NOTE:** Notion 의 iframe 임베드는 공개 페이지에 한정되어 작동하며 *page hash* 방식이라 public URL 형태가 변할 수 있다. 단순 카드 링크로 가는 게 가장 안정적.

- [ ] **Step 7: GitHubRepo — 서버 fetch + cache**

```tsx
import { unstable_cache } from "next/cache";

type Repo = { name: string; description: string | null; stargazers_count: number; forks_count: number; language: string | null; license: { name: string } | null };

const fetchRepo = unstable_cache(
  async (owner: string, repo: string): Promise<Repo | null> => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "ai-vibe-lab" },
      });
      if (!res.ok) return null;
      return (await res.json()) as Repo;
    } catch {
      return null;
    }
  },
  ["github-repo"],
  { revalidate: 3600 },
);

const NAME = /^[A-Za-z0-9_.-]+$/;

export async function GitHubRepo({ owner, repo }: { owner: string; repo: string }) {
  if (!NAME.test(owner) || !NAME.test(repo)) return null;
  const data = await fetchRepo(owner, repo);
  const url = `https://github.com/${owner}/${repo}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex flex-col gap-2 rounded-md border border-paper-rule bg-paper px-4 py-3 no-underline hover:border-accent"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">GitHub</span>
        <span className="font-semibold text-ink-800">{owner}/{repo}</span>
      </div>
      {data?.description && <p className="text-sm text-ink-700">{data.description}</p>}
      {data && (
        <div className="flex flex-wrap gap-3 text-xs text-ink-500">
          <span>⭐ {data.stargazers_count.toLocaleString()}</span>
          <span>🍴 {data.forks_count.toLocaleString()}</span>
          {data.language && <span>{data.language}</span>}
          {data.license && <span>{data.license.name}</span>}
        </div>
      )}
    </a>
  );
}
```

- [ ] **Step 8: Embed (일반 OG)**

```tsx
export function Embed({
  url,
  title,
  description,
  image,
  siteName,
}: {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex gap-4 overflow-hidden rounded-md border border-paper-rule bg-paper p-3 no-underline hover:border-accent"
    >
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-24 w-32 flex-shrink-0 rounded object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        {siteName && <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">{siteName}</span>}
        {title && <span className="font-semibold text-ink-800">{title}</span>}
        {description && <p className="text-sm text-ink-700 line-clamp-2">{description}</p>}
      </div>
    </a>
  );
}
```

- [ ] **Step 9: mdx-components 등록**

```tsx
import { Embed } from "./Embed";
import { Figure } from "./Figure";
import { Gist } from "./Gist";
import { GitHubRepo } from "./GitHubRepo";
import { Notion } from "./Notion";
import { CodePen } from "./CodePen";
import { Spotify } from "./Spotify";
import { Tweet } from "./Tweet";
import { Video } from "./Video";
import { Vimeo } from "./Vimeo";
import { YouTube } from "./YouTube";

export const mdxComponents = {
  CodePen,
  Embed,
  Figure,
  Gist,
  GitHubRepo,
  Notion,
  Spotify,
  Tweet,
  Video,
  Vimeo,
  YouTube,
  img: MdxImage,
};
```

- [ ] **Step 10: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 11: 커밋**

```bash
git add apps/web/src/components/mdx
git commit -m "feat(mdx): 8 embed components + generic Embed card"
```

---

### Task 7: Embed registry + 단일 Tiptap node

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/embeds/registry.ts`
- Create: `apps/web/src/components/admin/RichEditor/embeds/embed-node.ts`
- Create: `apps/web/src/components/admin/RichEditor/embeds/embed-view.tsx`

> **단순화:** 9개 컴포넌트 각각 별도 Tiptap Node 를 만들지 않는다. 대신 단일 `embed` Node 가 `kind` attribute (`youtube`/`vimeo`/...) 를 갖고, NodeView 가 미리보기를 그림. 직렬화 시 `kind` 에 따라 `<YouTube ... />` / `<Vimeo ... />` 등으로 분기.

- [ ] **Step 1: registry.ts**

```ts
export type EmbedKindKey =
  | "youtube" | "vimeo" | "tweet" | "codepen" | "gist"
  | "spotify" | "notion" | "githubRepo" | "embed";

export type EmbedConfig = {
  kind: EmbedKindKey;
  /** MDX 컴포넌트 이름 (`<YouTube .../>`) */
  componentName: string;
  /** 직렬화 시 포함할 attribute 키 순서 */
  attrKeys: string[];
  /** 미리보기 라벨 */
  previewLabel: string;
};

export const EMBED_REGISTRY: Record<EmbedKindKey, EmbedConfig> = {
  youtube: { kind: "youtube", componentName: "YouTube", attrKeys: ["id", "start"], previewLabel: "YouTube" },
  vimeo: { kind: "vimeo", componentName: "Vimeo", attrKeys: ["id"], previewLabel: "Vimeo" },
  tweet: { kind: "tweet", componentName: "Tweet", attrKeys: ["id", "author"], previewLabel: "X" },
  codepen: { kind: "codepen", componentName: "CodePen", attrKeys: ["user", "id", "defaultTab"], previewLabel: "CodePen" },
  gist: { kind: "gist", componentName: "Gist", attrKeys: ["user", "id", "file"], previewLabel: "Gist" },
  spotify: { kind: "spotify", componentName: "Spotify", attrKeys: ["type", "id"], previewLabel: "Spotify" },
  notion: { kind: "notion", componentName: "Notion", attrKeys: ["pageId", "title"], previewLabel: "Notion" },
  githubRepo: { kind: "githubRepo", componentName: "GitHubRepo", attrKeys: ["owner", "repo"], previewLabel: "GitHub" },
  embed: { kind: "embed", componentName: "Embed", attrKeys: ["url", "title", "description", "image", "siteName"], previewLabel: "Link" },
};

export function attrsToShortcode(kind: EmbedKindKey, attrs: Record<string, string>): string {
  const cfg = EMBED_REGISTRY[kind];
  const parts = cfg.attrKeys
    .filter((k) => attrs[k] !== undefined && attrs[k] !== "")
    .map((k) => ` ${k}="${(attrs[k] ?? "").replace(/"/g, "&quot;")}"`)
    .join("");
  return `<${cfg.componentName}${parts} />`;
}
```

- [ ] **Step 2: embed-node.ts**

```ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { EmbedNodeView } from "./embed-view";
import type { EmbedKindKey } from "./registry";

export const EmbedNode = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      kind: { default: "embed" as EmbedKindKey },
      // 자유 형식 attribute. attrs 는 JSON-encoded string 으로 보관.
      data: { default: "{}" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-embed]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { kind, data } = node.attrs as { kind: string; data: string };
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-embed": "true",
        "data-kind": kind,
        "data-attrs": data,
      }),
      ["span", {}, `[${kind}]`],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNodeView);
  },
});
```

- [ ] **Step 3: embed-view.tsx — 미리보기 카드**

```tsx
"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { EMBED_REGISTRY, type EmbedKindKey } from "./registry";

export function EmbedNodeView({ node, deleteNode, selected }: NodeViewProps) {
  const { kind, data } = node.attrs as { kind: EmbedKindKey; data: string };
  let attrs: Record<string, string> = {};
  try {
    attrs = JSON.parse(data) as Record<string, string>;
  } catch {}
  const cfg = EMBED_REGISTRY[kind] ?? EMBED_REGISTRY.embed;
  const summary =
    attrs.url ??
    attrs.id ??
    `${attrs.user ?? ""}/${attrs.repo ?? attrs.id ?? ""}`.replace(/^\/|\/$/g, "");

  return (
    <NodeViewWrapper
      as="div"
      className={`my-6 flex flex-col gap-1 rounded-md border border-paper-rule bg-paper-deep px-4 py-3 ${
        selected ? "ring-2 ring-accent" : ""
      }`}
      data-embed="true"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">{cfg.previewLabel}</span>
        {selected && (
          <button
            type="button"
            aria-label="Delete embed"
            onClick={() => deleteNode()}
            className="rounded px-2 py-0.5 text-sm text-red-600 hover:bg-paper"
          >
            🗑
          </button>
        )}
      </div>
      <span className="text-sm text-ink-800">{summary}</span>
    </NodeViewWrapper>
  );
}
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/embeds
git commit -m "feat(editor): single embed Tiptap node + registry"
```

---

### Task 8: paste plugin — URL 매칭 + OG fallback

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/plugins/embed-paste.ts`

- [ ] **Step 1: plugin 작성**

```ts
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { matchAnyEmbed } from "../embeds/url-match";

const URL_RE = /^https?:\/\/\S+$/;

export type EmbedPasteOptions = {
  onError?: (m: string) => void;
};

async function fetchOg(url: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`/api/admin/og?url=${encodeURIComponent(url)}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) return { url };
    const data = (await res.json()) as Record<string, string>;
    return { url, ...data };
  } catch {
    return { url };
  }
}

export const EmbedPaste = Extension.create<EmbedPasteOptions>({
  name: "embedPaste",

  addOptions() {
    return { onError: undefined };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("embedPaste"),
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData("text/plain")?.trim() ?? "";
            if (!URL_RE.test(text)) return false;

            // 이미지 URL 은 mediaPaste 에서 처리 (이미지 확장자 매칭) — 여기로 도달했다면 임베드 후보.
            const matched = matchAnyEmbed(text);
            if (matched) {
              event.preventDefault();
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "embed",
                  attrs: { kind: matched.kind, data: JSON.stringify(matched.attrs) },
                })
                .run();
              return true;
            }
            // OG fallback — placeholder 먼저 박고 fetch 후 갱신
            event.preventDefault();
            const placeholderId = `og-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            editor
              .chain()
              .focus()
              .insertContent({
                type: "embed",
                attrs: { kind: "embed", data: JSON.stringify({ url: text, "data-placeholder-id": placeholderId }) },
              })
              .run();
            void fetchOg(text).then((meta) => {
              editor.state.doc.descendants((node, pos) => {
                if (node.type.name === "embed") {
                  const cur = JSON.parse(node.attrs.data || "{}") as Record<string, string>;
                  if (cur["data-placeholder-id"] === placeholderId) {
                    delete cur["data-placeholder-id"];
                    editor
                      .chain()
                      .setNodeSelection(pos)
                      .updateAttributes("embed", { data: JSON.stringify({ ...cur, ...meta }) })
                      .run();
                    return false;
                  }
                }
                return true;
              });
            });
            return true;
          },
        },
      }),
    ];
  },
});
```

- [ ] **Step 2: extensions.ts 에 등록**

```ts
import { EmbedNode } from "../embeds/embed-node";
import { EmbedPaste } from "../plugins/embed-paste";
// ...
return [
  // ...
  EmbedNode,
  EmbedPaste.configure({ onError: options.onMediaError }),
];
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/plugins/embed-paste.ts apps/web/src/components/admin/RichEditor/extensions.ts
git commit -m "feat(editor): paste plugin for embeds + OG fallback"
```

---

### Task 9: serialize.ts 에 Embed → MDX 직렬화 추가

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/serialize.ts`

- [ ] **Step 1: htmlEmbedToMdx 추가**

```ts
import { attrsToShortcode, type EmbedKindKey, EMBED_REGISTRY } from "../embeds/registry";

export function htmlEmbedToMdx(markdown: string): string {
  const RE = /<div[^>]*data-embed="true"([^>]*)>[\s\S]*?<\/div>/g;
  const ATTR = (raw: string, name: string) => {
    const m = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
    return m?.[1] ?? "";
  };
  return markdown.replace(RE, (_match, attrsRaw: string) => {
    const kind = (ATTR(attrsRaw, "kind") || "embed") as EmbedKindKey;
    if (!(kind in EMBED_REGISTRY)) return "";
    let parsed: Record<string, string> = {};
    try {
      const dataRaw = ATTR(attrsRaw, "attrs");
      const decoded = dataRaw
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      parsed = JSON.parse(decoded || "{}") as Record<string, string>;
    } catch {}
    return attrsToShortcode(kind, parsed);
  });
}

export function postProcessMarkdown(md: string): string {
  return htmlEmbedToMdx(htmlVideoToMdx(htmlFigureToMdx(md)));
}
```

- [ ] **Step 2: 단위 테스트**

`apps/web/src/components/admin/RichEditor/embeds/serialize.test.ts`:
```ts
import assert from "node:assert/strict";
import test from "node:test";
import { attrsToShortcode } from "./registry.ts";
import { htmlEmbedToMdx } from "../serialize.ts";

test("attrsToShortcode YouTube id only", () => {
  assert.equal(attrsToShortcode("youtube", { id: "abc123XYZ" }), `<YouTube id="abc123XYZ" />`);
});

test("attrsToShortcode Tweet id+author", () => {
  assert.equal(
    attrsToShortcode("tweet", { id: "1234", author: "elonmusk" }),
    `<Tweet id="1234" author="elonmusk" />`,
  );
});

test("attrsToShortcode Spotify type+id", () => {
  assert.equal(
    attrsToShortcode("spotify", { type: "track", id: "abc" }),
    `<Spotify type="track" id="abc" />`,
  );
});

test("attrsToShortcode Embed full", () => {
  assert.equal(
    attrsToShortcode("embed", {
      url: "https://x/y",
      title: "Hi",
      description: "A",
      image: "https://x/z.jpg",
      siteName: "X",
    }),
    `<Embed url="https://x/y" title="Hi" description="A" image="https://x/z.jpg" siteName="X" />`,
  );
});

test("htmlEmbedToMdx parses HTML attrs back to MDX", () => {
  const html = `<div data-embed="true" data-kind="youtube" data-attrs="{&quot;id&quot;:&quot;abc&quot;}"><span>[youtube]</span></div>`;
  assert.equal(htmlEmbedToMdx(html), `<YouTube id="abc" />`);
});

test("htmlEmbedToMdx with unknown kind drops the node", () => {
  const html = `<div data-embed="true" data-kind="unknown" data-attrs="{}"><span>[unknown]</span></div>`;
  assert.equal(htmlEmbedToMdx(html), "");
});
```

- [ ] **Step 3: 실행**

```bash
cd apps/web && node --test src/components/admin/RichEditor/embeds/serialize.test.ts
```

Expected: `# pass 6`.

- [ ] **Step 4: package.json 추가 + 전체 테스트**

```json
"test": "... src/components/admin/RichEditor/embeds/serialize.test.ts"
```

```bash
cd apps/web && npm test
```

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/serialize.ts apps/web/src/components/admin/RichEditor/embeds/serialize.test.ts apps/web/package.json
git commit -m "test(editor): embed serialization roundtrip"
```

---

### Task 10: Embed 슬래시 명령

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/commands.ts`

- [ ] **Step 1: builder 추가**

```ts
import { matchAnyEmbed } from "./embeds/url-match";

export function buildEmbedSlashItems(onError: (m: string) => void): SlashItem[] {
  return [
    {
      title: "Embed (paste URL)",
      description: "URL 한 줄로 자동 임베드",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const url = window.prompt("URL?");
        if (!url) return;
        const matched = matchAnyEmbed(url.trim());
        if (matched) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "embed",
              attrs: { kind: matched.kind, data: JSON.stringify(matched.attrs) },
            })
            .run();
          return;
        }
        // OG fallback — fetch 트리거를 paste plugin 과 동일하게 — 단순화: paste plugin 코드 재사용 함수로
        editor
          .chain()
          .focus()
          .insertContent({
            type: "embed",
            attrs: { kind: "embed", data: JSON.stringify({ url: url.trim() }) },
          })
          .run();
        void fetch(`/api/admin/og?url=${encodeURIComponent(url.trim())}`, {
          credentials: "same-origin",
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((meta: Record<string, string> | null) => {
            if (!meta) return;
            editor.state.doc.descendants((node, pos) => {
              if (
                node.type.name === "embed" &&
                node.attrs.kind === "embed" &&
                JSON.parse(node.attrs.data || "{}").url === url.trim()
              ) {
                editor
                  .chain()
                  .setNodeSelection(pos)
                  .updateAttributes("embed", { data: JSON.stringify({ url: url.trim(), ...meta }) })
                  .run();
                return false;
              }
              return true;
            });
          })
          .catch(() => onError("OG fetch failed"));
      },
    },
  ];
}
```

- [ ] **Step 2: index.tsx 에서 합치기**

```tsx
const slashItems = useMemo<SlashItem[]>(
  () => [
    ...buildCoreSlashItems(),
    ...buildImageSlashItems(slug, onMediaError ?? (() => {})),
    ...buildVideoSlashItems(slug, onMediaError ?? (() => {})),
    ...buildEmbedSlashItems(onMediaError ?? (() => {})),
    ...extraSlashItems,
  ],
  [slug, onMediaError, extraSlashItems],
);
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/commands.ts apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): Embed slash command"
```

---

### Task 11: 통합 수동 검증

- [ ] **Step 1: dev 서버**

```bash
cd apps/web && npm run dev
```

- [ ] **Step 2: 체크리스트 — 각 URL paste 한 줄**

`/admin/posts/<slug>` 본문 영역에 paste:

1. `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → 즉시 YouTube 카드
2. `https://vimeo.com/76979871` → Vimeo 카드
3. `https://x.com/elonmusk/status/1234567890123456789` → Tweet 카드 (서버 fetch 표시)
4. `https://codepen.io/ty-kim/pen/abc123XY` → CodePen 카드
5. `https://gist.github.com/ty-kim/<40hex>` → Gist
6. `https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp` → Spotify
7. `https://www.notion.so/Page-<32hex>` → Notion 카드
8. `https://github.com/ty-kim/ai_survivor` → GitHub repo 카드
9. `https://example.com/article` → OG 카드 (placeholder 후 갱신)
10. Save → MDX 가 `<YouTube id="..." />` 등으로 직렬화됐는지 GitHub PR 미리보기 확인
11. 공개 페이지 새로고침 → 모든 카드 렌더 확인

- [ ] **Step 3: SSRF 가드 검증**

```bash
curl -i 'http://localhost:3000/api/admin/og?url=http://localhost:8080' \
  -H "Cookie: aiv_admin_session=..."
```

Expected: `400 Only https URLs are allowed`.

```bash
curl -i 'http://localhost:3000/api/admin/og?url=https://10.0.0.1' \
  -H "Cookie: aiv_admin_session=..."
```

Expected: `400 Forbidden IP range`.

- [ ] **Step 4: 인증 가드**

쿠키 없이:
```bash
curl -i 'http://localhost:3000/api/admin/og?url=https://example.com'
```

Expected: `401 Unauthorized`.

---

## Acceptance

- [ ] `npm test` 통과 (URL match 13 + OG validation 9 + embed serialize 6 케이스)
- [ ] 8개 서비스 URL paste → 1초 안 카드 박힘
- [ ] 일반 외부 URL paste → OG 카드 (서버 fetch + 1h 캐시)
- [ ] SSRF 가드 (localhost / RFC1918 / link-local) 모두 400
- [ ] 비-admin 의 OG 라우트 호출 → 401
- [ ] MDX 직렬화 — `<YouTube id="..." />`, `<Tweet id="..." author="..." />` 등 자체닫기 형태
- [ ] 공개 페이지에서 모든 카드 렌더 확인 (다크모드 토큰 매칭 OK)

## Notes

- **Notion iframe 제약**: 임의 페이지 임베드는 페이지 owner 가 "공유 → 공개" 토글을 켜야 한다. 본 슬라이스는 카드 링크로 우선 처리 (미래에 사용자가 공개 페이지 알고 있다는 가정 하에 iframe NodeView 옵션 추가 가능).
- **Tweet 갱신**: 서버 syndication API 에 의존. Twitter 정책 변경 시 Tweet 카드가 빈 텍스트로 떨어질 수 있음 — 컴포넌트가 자동으로 "View on X" 폴백.
- **OG fetch redirect**: `fetch` 의 `redirect: "follow"` 가 자동 처리. 더 엄격한 redirect 카운팅이 필요하면 `redirect: "manual"` 로 바꾸고 직접 카운트.
- **이미지 URL 은 5.2 mediaPaste 에서 가로채진다** — embedPaste 까지 도달하지 않음. 이미지 확장자가 아닌 URL 만 임베드 분기.
