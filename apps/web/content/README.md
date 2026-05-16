# Content Authoring Guide

AI 시대 생존기의 공개 글 원본은 GitHub repository 안의 MDX 파일입니다. 현재 MVP는 Supabase, 브라우저 `/admin`, 외부 CMS 없이 Git commit/PR로 글을 발행합니다.

## 1. 글쓰기 위치

| 위치                                      | 용도                                               |
| ----------------------------------------- | -------------------------------------------------- |
| `articles/`                               | 자유 초안, 조사 메모, 아직 사이트에 올리지 않을 글 |
| `apps/web/content/posts/<slug>/index.mdx` | 사이트가 읽는 발행 후보 글                         |
| `apps/web/public/media/posts/<slug>/`     | 공개 이미지/짧은 영상 asset                        |

`articles/`에 있는 글은 자동으로 사이트에 나오지 않습니다. 발행하려면 `apps/web/content/posts/<slug>/index.mdx`로 옮겨야 합니다.

## 2. 새 글 만들기

1. `articles/<topic>.md`에서 초안을 씁니다.
2. 발행 후보가 되면 `apps/web/content/posts/<slug>/index.mdx` 폴더와 파일을 만듭니다.
3. `<slug>`는 소문자 영문/숫자/kebab-case만 사용합니다.
4. frontmatter의 `slug` 값은 폴더명과 정확히 같아야 합니다.
5. `status: draft`로 검증한 뒤 공개 준비가 끝나면 `status: published`로 바꿉니다.

## 3. Frontmatter

```yaml
---
title: 글 제목
description: 검색 결과와 카드에 보일 고유 설명
slug: example-post-slug
publishedAt: 2026-05-06
updatedAt: 2026-05-06
status: draft # draft | published | scheduled | archived
category: vibe-coding-lab
tags:
  - vibe-coding
  - mdx
series: building-ai-blog # 없으면 null
seriesOrder: 1 # 없으면 null
author: owner
difficulty: beginner # beginner | intermediate | advanced
tools:
  - Cursor
  - GitHub
coverImage: /media/posts/example-post-slug/cover.webp
coverAlt: 대표 이미지 설명
---
```

## 4. 이미지와 영상

### 이미지

- 사이트에 넣는 이미지는 `apps/web/public/media/posts/<slug>/`에 둡니다.
- 가능하면 `webp`로 최적화합니다.
- 본문에서는 `/media/posts/<slug>/file.webp`처럼 절대 경로로 참조합니다.
- 모든 이미지는 alt text를 씁니다.

### 영상

- 5~15초 이하의 작은 데모만 repository에 넣는 것을 허용합니다.
- 긴 영상은 YouTube/Vimeo/Vercel Blob/Cloudflare R2 같은 외부 저장소를 우선합니다.
- 원본 영상은 Git에 넣지 말고 로컬 `.artifacts/`나 외부 저장소에 둡니다.

## 5. 본문 규칙

- 본문은 Markdown 또는 검토 가능한 HTML을 사용할 수 있습니다.
- 허용 HTML 태그는 `h2`, `h3`, `h4`, `p`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `figure`, `figcaption`, `img`, `a`, `strong`, `em`, `mark`, `hr`, `br`입니다.
- `script`, `style`, `iframe`, `object`, `embed`, inline event, `javascript:` URL은 빌드 검증에서 실패해야 합니다.

## 6. 공개 노출 규칙

- public listing, taxonomy, sitemap, RSS에는 `status: published`이고 `publishedAt`이 오늘 이하인 글만 들어갑니다.
- `draft`, `scheduled`, `archived` 글은 repository 안에 있어도 공개 페이지에 노출되지 않아야 합니다.

## 7. 로컬 검증

```powershell
cd apps/web
npm run test
npm run typecheck
npm run build
```

`npm run test`는 frontmatter 오류, slug mismatch, unsafe HTML, draft/scheduled 제외를 확인합니다.
