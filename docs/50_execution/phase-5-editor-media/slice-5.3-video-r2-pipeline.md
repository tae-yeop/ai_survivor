# Slice 5.3 — Video R2 Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor
Status: Ready (depends on 5.1, independent of 5.2)
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md) §3, §4.4, §5.1

**Goal:** mp4 / webm / mov 비디오 파일을 클립보드 paste / 드래그&드롭 / 슬래시 명령 으로 즉시 placeholder 박고 Cloudflare R2 에 업로드, 완료 후 `<Video>` MDX 컴포넌트로 교체하여 공개 페이지에서 HTML5 video 로 재생.

**Architecture:** S3 호환 SDK (`@aws-sdk/client-s3`) 로 R2 PUT. server-only `lib/admin/r2.ts` 래퍼가 env 검증 + S3Client 단일 인스턴스 제공. 새 라우트 `/api/admin/upload-video/[slug]` 가 인증·검증 후 PutObject. 클라이언트는 XHR upload 로 진행률 추적. Tiptap `video` Node + ReactNodeView, MDX 직렬화는 `<Video src poster caption />`.

**Tech Stack:** `@aws-sdk/client-s3`, Tiptap 2.27, XMLHttpRequest (진행률), Cloudflare R2 (S3 API).

---

## Files

**Create:**
- `apps/web/src/lib/admin/r2.ts`
- `apps/web/src/lib/admin/r2.test.ts`
- `apps/web/app/api/admin/upload-video/[slug]/route.ts`
- `apps/web/app/api/admin/upload-video/[slug]/route.test.ts`
- `apps/web/src/components/admin/RichEditor/nodes/video-node.ts`
- `apps/web/src/components/admin/RichEditor/nodes/video-view.tsx`
- `apps/web/src/components/admin/RichEditor/plugins/upload-video.ts`
- `apps/web/src/components/mdx/Video.tsx`

**Modify:**
- `apps/web/package.json` (`@aws-sdk/client-s3` 추가, test 스크립트)
- `apps/web/src/components/admin/RichEditor/extensions.ts` (Video node 등록)
- `apps/web/src/components/admin/RichEditor/plugins/media-paste.ts` (video File 분기 추가)
- `apps/web/src/components/admin/RichEditor/commands.ts` (`Video` 슬래시 항목)
- `apps/web/src/components/admin/RichEditor/index.tsx` (slash items 합치기)
- `apps/web/src/components/admin/RichEditor/serialize.ts` (Video → MDX 직렬화)
- `apps/web/src/components/mdx/mdx-components.tsx` (Video 등록)
- `docs/70_ops/DEPLOYMENT.md` (R2 env)

---

## Tasks

### Task 1: `@aws-sdk/client-s3` 추가

- [ ] **Step 1: package.json dependencies**

```json
"@aws-sdk/client-s3": "^3.700.0",
```

- [ ] **Step 2: install**

```bash
cd apps/web && npm install --legacy-peer-deps
```

- [ ] **Step 3: 검증**

```bash
cd apps/web && npm ls @aws-sdk/client-s3
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/package.json apps/web/package-lock.json
git commit -m "deps(web): add @aws-sdk/client-s3 for R2"
```

---

### Task 2: R2 server-only 래퍼

**Files:**
- Create: `apps/web/src/lib/admin/r2.ts`

- [ ] **Step 1: env 검증 + S3Client 싱글톤**

```ts
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string; // r2.dev or custom domain, no trailing slash
};

export type R2ConfigStatus =
  | { configured: true; config: R2Config }
  | { configured: false; missing: string[] };

const ENV_KEYS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_URL",
] as const;

export function getR2ConfigStatus(): R2ConfigStatus {
  const values: Record<string, string | undefined> = {};
  const missing: string[] = [];
  for (const key of ENV_KEYS) {
    const raw = process.env[key]?.trim();
    if (!raw) missing.push(key);
    values[key] = raw;
  }
  if (missing.length > 0) return { configured: false, missing };
  return {
    configured: true,
    config: {
      accountId: values.R2_ACCOUNT_ID!,
      accessKeyId: values.R2_ACCESS_KEY_ID!,
      secretAccessKey: values.R2_SECRET_ACCESS_KEY!,
      bucket: values.R2_BUCKET!,
      publicUrl: values.R2_PUBLIC_URL!.replace(/\/+$/, ""),
    },
  };
}

let cached: { client: S3Client; bucket: string; publicUrl: string } | null = null;

export function getR2Client() {
  if (cached) return cached;
  const status = getR2ConfigStatus();
  if (!status.configured) {
    throw new Error(`R2 config missing: ${status.missing.join(", ")}`);
  }
  const { config } = status;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cached = { client, bucket: config.bucket, publicUrl: config.publicUrl };
  return cached;
}

export function buildPublicUrl(publicUrl: string, key: string): string {
  return `${publicUrl}/${key.replace(/^\/+/, "")}`;
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/lib/admin/r2.ts
git commit -m "feat(admin): R2 client + env config"
```

---

### Task 3: R2 config 검증 단위 테스트

**Files:**
- Create: `apps/web/src/lib/admin/r2.test.ts`

- [ ] **Step 1: env 검증 로직만 테스트 (S3Client 인스턴스 생성은 e2e)**

```ts
import assert from "node:assert/strict";
import test from "node:test";

const KEYS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_URL",
] as const;

function snapshot() {
  return Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
}
function restore(snap: Record<string, string | undefined>) {
  for (const k of KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

test("getR2ConfigStatus reports missing env keys", async () => {
  const snap = snapshot();
  for (const k of KEYS) delete process.env[k];
  const { getR2ConfigStatus } = await import("./r2.ts");
  const status = getR2ConfigStatus();
  assert.equal(status.configured, false);
  if (!status.configured) {
    assert.deepEqual(status.missing.sort(), [...KEYS].sort());
  }
  restore(snap);
});

test("buildPublicUrl strips leading slash and trailing slash", async () => {
  const { buildPublicUrl } = await import("./r2.ts");
  assert.equal(
    buildPublicUrl("https://pub-xxx.r2.dev", "/posts/a/b.mp4"),
    "https://pub-xxx.r2.dev/posts/a/b.mp4",
  );
  assert.equal(
    buildPublicUrl("https://pub-xxx.r2.dev", "posts/a/b.mp4"),
    "https://pub-xxx.r2.dev/posts/a/b.mp4",
  );
});
```

> **NOTE:** `r2.ts` 가 `import "server-only"` 를 가지면 node --test 에서 import 실패할 수 있다. 만약 실패하면 `import "server-only"` 줄을 dev/test 환경에선 skip 하도록 가드 또는 별도 `r2-config.ts` 로 분리 (env 검증 + buildPublicUrl 만). S3Client 생성만 r2-client.ts 로.

권장 분리:
- `r2-config.ts` — `R2Config`, `getR2ConfigStatus`, `buildPublicUrl` (테스트 가능)
- `r2-client.ts` — `import "server-only"` + `getR2Client`

테스트 파일은 `r2-config.ts` 만 import.

- [ ] **Step 2: 분리 적용**

`apps/web/src/lib/admin/r2-config.ts` 새 파일:
```ts
export type R2Config = { /* 동일 */ };
export type R2ConfigStatus = /* 동일 */;
export function getR2ConfigStatus(): R2ConfigStatus { /* 동일 */ }
export function buildPublicUrl(publicUrl: string, key: string): string { /* 동일 */ }
```

`apps/web/src/lib/admin/r2.ts` 는 `getR2Client` 만:
```ts
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { getR2ConfigStatus } from "./r2-config";
// (getR2Client 만)
export { buildPublicUrl, getR2ConfigStatus, type R2Config } from "./r2-config";
```

테스트는 `r2-config.ts` 를 import.

- [ ] **Step 3: 테스트 실행**

```bash
cd apps/web && node --test src/lib/admin/r2-config.test.ts
```

(파일명 변경: `r2.test.ts` → `r2-config.test.ts`)

Expected: `# pass 2`, `# fail 0`.

- [ ] **Step 4: package.json test 스크립트 추가**

```json
"test": "node --test src/lib/content/posts.test.ts src/lib/admin/session-token.test.ts src/lib/admin/mdx.test.ts src/lib/admin/github-content.test.ts src/lib/admin/r2-config.test.ts src/components/admin/RichEditor/markdown-roundtrip.test.ts src/components/admin/RichEditor/figure-serialize.test.ts"
```

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/lib/admin/r2.ts apps/web/src/lib/admin/r2-config.ts apps/web/src/lib/admin/r2-config.test.ts apps/web/package.json
git commit -m "test(admin): r2 config validation"
```

---

### Task 4: 비디오 업로드 라우트

**Files:**
- Create: `apps/web/app/api/admin/upload-video/[slug]/route.ts`

- [ ] **Step 1: 라우트 작성 — 인증/검증/PutObject**

```ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getAdminSession } from "@/lib/admin/session";
import { assertValidPostSlug } from "@/lib/admin/slug";
import { buildPublicUrl } from "@/lib/admin/r2-config";
import { getR2Client } from "@/lib/admin/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 200 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const EXT_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function safeStem(name: string): string {
  const dot = name.lastIndexOf(".");
  const stem = dot >= 0 ? name.slice(0, dot) : name;
  return (
    stem
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "video"
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  let slug: string;
  try {
    const { slug: rawSlug } = await params;
    slug = assertValidPostSlug(rawSlug);
  } catch {
    return jsonError("Invalid post slug", 400);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart/form-data body", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("Missing file field", 400);
  if (file.size === 0) return jsonError("File is empty", 400);
  if (file.size > MAX_BYTES) return jsonError("File exceeds 200MB limit", 413);
  if (!ALLOWED_MIME.has(file.type)) return jsonError(`Unsupported MIME: ${file.type}`, 400);

  const ext = EXT_BY_MIME[file.type];
  const key = `posts/${slug}/${Date.now()}-${safeStem(file.name)}.${ext}`;

  let client: ReturnType<typeof getR2Client>;
  try {
    client = getR2Client();
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "R2 not configured", 500);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await client.client.send(
      new PutObjectCommand({
        Bucket: client.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "R2 upload failed", 502);
  }

  return NextResponse.json({
    url: buildPublicUrl(client.publicUrl, key),
    key,
    size: file.size,
  });
}
```

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/app/api/admin/upload-video/\[slug\]/route.ts
git commit -m "feat(admin): /api/admin/upload-video/[slug] R2 PUT"
```

---

### Task 5: 라우트 인증·검증 단위 테스트

**Files:**
- Create: `apps/web/app/api/admin/upload-video/[slug]/route.test.ts`

> **NOTE:** Next route handler 단위 테스트는 import 가 까다로움. 검증 로직 (slug, MIME, 사이즈) 만 별도 함수로 추출하여 테스트한다.

- [ ] **Step 1: route.ts 에서 검증 로직을 helper 로 export**

`route.ts` 상단에 추가:
```ts
export const VIDEO_MAX_BYTES = MAX_BYTES;
export const VIDEO_ALLOWED_MIME = ALLOWED_MIME;
export function buildVideoKey(slug: string, name: string, mime: string): string {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  return `posts/${slug}/${Date.now()}-${safeStem(name)}.${ext}`;
}
```

- [ ] **Step 2: 테스트 작성**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  VIDEO_ALLOWED_MIME,
  VIDEO_MAX_BYTES,
  buildVideoKey,
} from "./route.ts";

test("VIDEO_ALLOWED_MIME contains mp4/webm/quicktime only", () => {
  assert.equal(VIDEO_ALLOWED_MIME.has("video/mp4"), true);
  assert.equal(VIDEO_ALLOWED_MIME.has("video/webm"), true);
  assert.equal(VIDEO_ALLOWED_MIME.has("video/quicktime"), true);
  assert.equal(VIDEO_ALLOWED_MIME.has("video/x-matroska"), false);
});

test("VIDEO_MAX_BYTES is 200MB", () => {
  assert.equal(VIDEO_MAX_BYTES, 200 * 1024 * 1024);
});

test("buildVideoKey sluggifies filename and prefixes with timestamp", () => {
  const key = buildVideoKey("my-slug", "Demo Video!.mp4", "video/mp4");
  assert.match(key, /^posts\/my-slug\/\d+-demo-video\.mp4$/);
});

test("buildVideoKey falls back to 'video' when name normalizes to empty", () => {
  const key = buildVideoKey("my-slug", "###.webm", "video/webm");
  assert.match(key, /^posts\/my-slug\/\d+-video\.webm$/);
});
```

- [ ] **Step 3: 테스트 실행**

```bash
cd apps/web && node --test app/api/admin/upload-video/\[slug\]/route.test.ts
```

> route.ts 가 `getR2Client` (`import "server-only"`) 를 import 하므로 node --test 가 실패할 수 있다. 그 경우 server-only import 부분을 동적 import 로 미루거나, helper 만 다른 파일 (`upload-video-validation.ts`) 로 분리.

분리 권장:
- `apps/web/app/api/admin/upload-video/[slug]/validation.ts` — `VIDEO_*`, `buildVideoKey`, `safeStem`, `EXT_BY_MIME`
- 테스트는 `validation.ts` 만 import
- `route.ts` 는 validation 을 import 후 사용

- [ ] **Step 4: 분리 적용 + 재실행 + package.json 추가**

```json
"test": "node --test ... app/api/admin/upload-video/[slug]/validation.test.ts"
```

Expected: `# pass 4`.

- [ ] **Step 5: 커밋**

```bash
git add apps/web/app/api/admin/upload-video/\[slug\]/validation.ts apps/web/app/api/admin/upload-video/\[slug\]/validation.test.ts apps/web/app/api/admin/upload-video/\[slug\]/route.ts apps/web/package.json
git commit -m "test(admin): video upload validation"
```

---

### Task 6: 비디오 업로드 클라이언트 helper (XHR 진행률)

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/plugins/upload-video.ts`

- [ ] **Step 1: XHR 기반 업로드 — 진행률 콜백 지원**

```ts
"use client";

export type VideoUploadResult = { url: string; key: string; size: number };

export const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_MIME.has(file.type)) return `Unsupported video type: ${file.type}`;
  if (file.size > MAX_VIDEO_BYTES) return "Video exceeds 200MB limit";
  return null;
}

export function uploadVideoForSlug(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<VideoUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 100);
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as VideoUploadResult);
        } catch {
          reject(new Error("Invalid upload response"));
        }
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          if (body.error) message = body.error;
        } catch {}
        reject(new Error(message));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.open("POST", `/api/admin/upload-video/${encodeURIComponent(slug)}`);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/plugins/upload-video.ts
git commit -m "feat(editor): video upload helper with progress (XHR)"
```

---

### Task 7: Video Tiptap Node + NodeView

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/nodes/video-node.ts`
- Create: `apps/web/src/components/admin/RichEditor/nodes/video-view.tsx`

- [ ] **Step 1: Node 정의**

`video-node.ts`:
```ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VideoNodeView } from "./video-view";

export type VideoAttrs = {
  src: string;
  poster: string;
  caption: string;
  uploading: boolean;
  progress: number; // 0..100
};

export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      poster: { default: "" },
      caption: { default: "" },
      uploading: { default: false, rendered: false },
      progress: { default: 0, rendered: false },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-video]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { src, poster, caption } = node.attrs as VideoAttrs;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-video": "true",
        "data-src": src,
        "data-poster": poster,
        "data-caption": caption,
      }),
      ["span", {}, caption || src],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },
});
```

- [ ] **Step 2: NodeView**

`video-view.tsx`:
```tsx
"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";

export function VideoNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const { src, poster, caption, uploading, progress } = node.attrs as {
    src: string;
    poster: string;
    caption: string;
    uploading: boolean;
    progress: number;
  };
  const [isCaptionEditing, setCaptionEditing] = useState(false);

  return (
    <NodeViewWrapper
      as="div"
      className={`relative my-6 ${selected ? "ring-2 ring-accent" : ""}`}
      data-video="true"
    >
      {src && !uploading ? (
        <video
          controls
          preload="metadata"
          playsInline
          poster={poster || undefined}
          src={src}
          className="block w-full rounded-md border border-paper-rule bg-black"
        />
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed border-paper-rule bg-paper-deep text-sm text-ink-500">
          <span>업로드 중… {Math.round(progress)}%</span>
          <div className="mt-3 h-1 w-1/2 overflow-hidden rounded bg-paper-rule">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {selected && (
        <div className="absolute -top-10 right-0 flex items-center gap-0.5 rounded-md border border-paper-rule bg-paper p-1 shadow">
          <button
            type="button"
            aria-label="Edit caption"
            onClick={() => setCaptionEditing(true)}
            className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
          >
            ✏
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={() => deleteNode()}
            className="rounded px-2 py-1 text-sm text-red-600 hover:bg-paper-deep"
          >
            🗑
          </button>
        </div>
      )}
      {isCaptionEditing ? (
        <input
          autoFocus
          defaultValue={caption}
          onBlur={(e) => {
            updateAttributes({ caption: e.currentTarget.value });
            setCaptionEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
            if (e.key === "Escape") setCaptionEditing(false);
          }}
          className="mt-2 w-full rounded border border-paper-rule bg-paper px-2 py-1 text-center text-sm"
          placeholder="캡션 (선택)"
        />
      ) : caption ? (
        <p className="mt-2 text-center text-sm text-ink-500">{caption}</p>
      ) : null}
    </NodeViewWrapper>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/nodes/video-node.ts apps/web/src/components/admin/RichEditor/nodes/video-view.tsx
git commit -m "feat(editor): Video Tiptap node + NodeView with progress"
```

---

### Task 8: extensions.ts 에 Video 등록 + media-paste 에 video File 분기

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/extensions.ts`
- Modify: `apps/web/src/components/admin/RichEditor/plugins/media-paste.ts`

- [ ] **Step 1: extensions.ts**

```ts
import { Video } from "../nodes/video-node";
// ...
return [
  // ...
  Figure,
  Video,
  MediaPaste.configure({ slug: options.slug, onError: options.onMediaError }),
];
```

- [ ] **Step 2: media-paste.ts 에 비디오 핸들러 추가**

```ts
import { uploadVideoForSlug, validateVideoFile } from "./upload-video";

async function handleVideoFile(
  editor: import("@tiptap/core").Editor,
  file: File,
  slug: string,
  onError?: (m: string) => void,
) {
  const issue = validateVideoFile(file);
  if (issue) {
    onError?.(issue);
    return;
  }
  const placeholderId = `pv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  editor
    .chain()
    .focus()
    .insertContent({
      type: "video",
      attrs: { src: "", poster: "", caption: "", uploading: true, progress: 0, "data-placeholder-id": placeholderId },
    })
    .run();

  try {
    const { url } = await uploadVideoForSlug(slug, file, (pct) => {
      const { state } = editor;
      state.doc.descendants((node, pos) => {
        if (node.type.name === "video" && node.attrs["data-placeholder-id"] === placeholderId) {
          editor.chain().setNodeSelection(pos).updateAttributes("video", { progress: pct }).run();
          return false;
        }
        return true;
      });
    });
    const { state } = editor;
    state.doc.descendants((node, pos) => {
      if (node.type.name === "video" && node.attrs["data-placeholder-id"] === placeholderId) {
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("video", { src: url, uploading: false, progress: 100, "data-placeholder-id": null })
          .run();
        return false;
      }
      return true;
    });
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "Video upload failed");
  }
}
```

`handlePaste` 와 `handleDrop` 안에 비디오 분기 추가:
```ts
// paste — files iteration 안:
if (file && file.type.startsWith("video/")) {
  event.preventDefault();
  void handleVideoFile(editor, file, slug, onError);
  return true;
}
// drop — imageFiles 와 동일 패턴으로 videoFiles 도 처리
const videoFiles = Array.from(files).filter((f) => f.type.startsWith("video/"));
if (videoFiles.length > 0) {
  event.preventDefault();
  for (const f of videoFiles) void handleVideoFile(editor, f, slug, onError);
  return true;
}
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/extensions.ts apps/web/src/components/admin/RichEditor/plugins/media-paste.ts
git commit -m "feat(editor): wire Video node + paste/drop handler"
```

---

### Task 9: 슬래시 메뉴 Video 항목

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/commands.ts`

- [ ] **Step 1: 새 builder 추가**

```ts
import {
  uploadVideoForSlug,
  validateVideoFile,
} from "./plugins/upload-video";

export function buildVideoSlashItems(slug: string, onError: (m: string) => void): SlashItem[] {
  return [
    {
      title: "Video",
      description: "비디오 파일 업로드 (R2)",
      command: async ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const file = await pickFile("video/mp4,video/webm,video/quicktime");
        if (!file) return;
        const issue = validateVideoFile(file);
        if (issue) {
          onError(issue);
          return;
        }
        const placeholderId = `pv-${Date.now()}`;
        editor
          .chain()
          .focus()
          .insertContent({
            type: "video",
            attrs: { src: "", poster: "", caption: "", uploading: true, progress: 0, "data-placeholder-id": placeholderId },
          })
          .run();
        try {
          const { url } = await uploadVideoForSlug(slug, file, (pct) => {
            editor.state.doc.descendants((node, pos) => {
              if (node.type.name === "video" && node.attrs["data-placeholder-id"] === placeholderId) {
                editor.chain().setNodeSelection(pos).updateAttributes("video", { progress: pct }).run();
                return false;
              }
              return true;
            });
          });
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === "video" && node.attrs["data-placeholder-id"] === placeholderId) {
              editor
                .chain()
                .setNodeSelection(pos)
                .updateAttributes("video", { src: url, uploading: false, progress: 100, "data-placeholder-id": null })
                .run();
              return false;
            }
            return true;
          });
        } catch (e) {
          onError(e instanceof Error ? e.message : "Video upload failed");
        }
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
    ...extraSlashItems,
  ],
  [slug, onMediaError, extraSlashItems],
);
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/commands.ts apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): Video slash command"
```

---

### Task 10: serialize.ts 에 Video → MDX 직렬화 추가

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/serialize.ts`

- [ ] **Step 1: htmlVideoToMdx 함수 추가**

```ts
export function htmlVideoToMdx(markdown: string): string {
  const VIDEO_RE = /<div[^>]*data-video="true"([^>]*)>[\s\S]*?<\/div>/g;
  const ATTR = (raw: string, name: string) => {
    const m = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
    return m?.[1] ?? "";
  };
  return markdown.replace(VIDEO_RE, (_match, attrsRaw: string) => {
    const src = ATTR(attrsRaw, "src");
    const poster = ATTR(attrsRaw, "poster");
    const caption = ATTR(attrsRaw, "caption");
    if (!src) return "";
    const posterAttr = poster ? ` poster="${poster}"` : "";
    const captionAttr = caption ? ` caption="${caption.replace(/"/g, "&quot;")}"` : "";
    return `<Video src="${src}"${posterAttr}${captionAttr} />`;
  });
}
```

`htmlFigureToMdx` 와 함께 chain:
```ts
export function postProcessMarkdown(md: string): string {
  return htmlVideoToMdx(htmlFigureToMdx(md));
}
```

- [ ] **Step 2: index.tsx 에서 postProcessMarkdown 사용**

```ts
import { postProcessMarkdown } from "./serialize";
// handleUpdate 안:
if (md !== undefined) onChange(postProcessMarkdown(md));
```

- [ ] **Step 3: 테스트 추가**

`figure-serialize.test.ts` 에 Video 테스트도 추가:
```ts
import { htmlVideoToMdx } from "./serialize.ts";

test("Video HTML → MDX shortcode (defaults omitted)", () => {
  const html = `<div data-video="true" data-src="https://r2.dev/x.mp4" data-poster="" data-caption=""><span>x.mp4</span></div>`;
  const mdx = htmlVideoToMdx(html);
  assert.equal(mdx, `<Video src="https://r2.dev/x.mp4" />`);
});

test("Video HTML → MDX shortcode (poster + caption)", () => {
  const html = `<div data-video="true" data-src="https://r2.dev/x.mp4" data-poster="https://r/y.jpg" data-caption="데모"><span>x</span></div>`;
  const mdx = htmlVideoToMdx(html);
  assert.equal(mdx, `<Video src="https://r2.dev/x.mp4" poster="https://r/y.jpg" caption="데모" />`);
});

test("Video HTML with empty src is dropped", () => {
  const html = `<div data-video="true" data-src="" data-poster="" data-caption=""><span>x</span></div>`;
  assert.equal(htmlVideoToMdx(html), "");
});
```

- [ ] **Step 4: 테스트 실행**

```bash
cd apps/web && npm test
```

Expected: 모든 테스트 통과 (Video 3 케이스 추가).

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/serialize.ts apps/web/src/components/admin/RichEditor/index.tsx apps/web/src/components/admin/RichEditor/figure-serialize.test.ts
git commit -m "test(editor): Video MDX serialization"
```

---

### Task 11: `<Video>` 공개 페이지 렌더 컴포넌트

**Files:**
- Create: `apps/web/src/components/mdx/Video.tsx`

- [ ] **Step 1: 컴포넌트**

```tsx
export type VideoProps = {
  src: string;
  poster?: string;
  caption?: string;
};

export function Video({ src, poster, caption }: VideoProps) {
  if (!src) return null;
  return (
    <figure className="my-8">
      <video
        controls
        preload="metadata"
        playsInline
        poster={poster || undefined}
        src={src}
        className="block w-full rounded-md border border-paper-rule bg-black"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
```

- [ ] **Step 2: mdx-components 등록**

```tsx
import { Video } from "./Video";
export const mdxComponents = {
  Figure,
  Video,
  YouTube,
  img: MdxImage,
};
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/mdx/Video.tsx apps/web/src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): Video component for public render"
```

---

### Task 12: DEPLOYMENT.md 에 R2 env 추가

**Files:**
- Modify: `docs/70_ops/DEPLOYMENT.md`

- [ ] **Step 1: env 섹션에 6개 키 + 안내 추가**

```markdown
### Cloudflare R2 (비디오 호스팅)

`R2_ACCOUNT_ID` — Cloudflare 계정 ID
`R2_ACCESS_KEY_ID` — R2 API 토큰 access key
`R2_SECRET_ACCESS_KEY` — R2 API 토큰 secret
`R2_BUCKET` — 버킷 이름 (예: `ai-vibe-lab-media`)
`R2_PUBLIC_URL` — `https://pub-xxxxxxxx.r2.dev` 또는 커스텀 도메인 (trailing slash 없이)

Vercel Production / Preview / Development 모두 등록.
```

- [ ] **Step 2: 커밋**

```bash
git add docs/70_ops/DEPLOYMENT.md
git commit -m "docs(ops): R2 env vars for video pipeline"
```

---

### Task 13: 통합 수동 검증 (Dogfood)

- [ ] **Step 1: env 확인 — `.env.local` 에 R2_* 5개 (R2_BUCKET, R2_PUBLIC_URL 포함) 들어있는지**

```bash
cd apps/web && grep -c "^R2_" .env.local
```

Expected: 5.

- [ ] **Step 2: dev 서버**

```bash
cd apps/web && npm run dev
```

- [ ] **Step 3: 체크리스트**

`/admin/posts/<slug>` 진입 후:

1. `npm run dev` 콘솔에 R2 관련 에러 0
2. 작은 mp4 (~5MB) 드래그&드롭 → 진행률 0→100% → 재생 가능 비디오로 swap
3. 슬래시 `/Video` → 파일 피커 → 200MB 가까운 파일 → 진행률 표시 → 끝나면 swap
4. 250MB 파일 시도 → 즉시 alert "Video exceeds 200MB limit"
5. 본문 Save → MDX 에 `<Video src="https://pub-xxx.r2.dev/posts/<slug>/...mp4" />` 가 박혔는지 GitHub PR 미리보기에서 확인
6. 공개 페이지 `/posts/<slug>` 새로고침 → 비디오 재생 확인 (controls + preload="metadata")
7. R2 대시보드 → 버킷 → 파일 보임 (`posts/<slug>/...mp4`)

각 항목 OK 시 task 완료.

---

## Acceptance

- [ ] `npm test` 통과 (r2-config 2 + video validation 4 + Video serialize 3 케이스 추가)
- [ ] mp4 드래그&드롭 → 진행률 → R2 업로드 → 재생 가능 비디오 박힘
- [ ] 200MB 초과 → 클라이언트 reject (서버 라우트도 413)
- [ ] `<Video src=…r2.dev/… />` MDX 직렬화 + 공개 페이지 렌더 OK
- [ ] R2 버킷에 `posts/<slug>/<timestamp>-<safe-name>.mp4` 형태로 적재됨

## Notes

- **poster 자동 생성 안 함** — ffmpeg 의존 회피. 사용자가 별도 이미지 paste 후 poster 필드(미래 NodeView 의 inspector)로 설정. 본 슬라이스에선 poster 빈 채로도 재생 OK (브라우저가 첫 프레임을 자동 표시).
- **R2 secret 노출 점검**: `getR2Client` 는 server-only. 클라이언트 번들에 들어가지 않는지 빌드 후 `apps/web/.next/static/chunks/` 안에서 `r2.cloudflarestorage.com` grep 해서 확인.
- **재시도/취소**: 실패 시 placeholder 가 그대로 남음. 5.6 폴리싱에서 retry/cancel 추가.
