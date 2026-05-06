# Content Authoring Guide

AI Vibe Lab의 글 원본은 GitHub repository 안의 MDX 파일입니다. Supabase, `/admin`, 외부 CMS 없이 Git commit/PR만으로 글을 추가합니다.

## 새 글 만들기

1. `apps/web/content/posts/<slug>/index.mdx` 폴더와 파일을 만듭니다.
2. `<slug>`는 소문자 영문/숫자/kebab-case만 사용합니다.
3. frontmatter의 `slug` 값은 폴더명과 정확히 같아야 합니다.
4. 이미지는 같은 글 폴더 안의 `cover.*` 또는 `assets/` 아래에 둡니다.
5. `status: draft`로 작성한 뒤, 공개 준비가 끝나면 `status: published`로 바꿉니다.

## Frontmatter

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
coverImage: null
---
```

## 본문 규칙

- 본문은 Markdown 또는 검토 가능한 HTML을 사용할 수 있습니다.
- 허용 HTML 태그는 `h2`, `h3`, `h4`, `p`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `figure`, `figcaption`, `img`, `a`, `strong`, `em`, `mark`, `hr`, `br`입니다.
- `script`, `style`, `iframe`, `object`, `embed`, `onClick` 같은 inline event, `javascript:` URL은 빌드 검증에서 실패해야 합니다.

## 공개 노출 규칙

- public listing, taxonomy, sitemap, RSS에는 `status: published`이고 `publishedAt`이 오늘 이하인 글만 들어갑니다.
- `draft`, `scheduled`, `archived` 글은 repository 안에 있어도 공개 페이지에 노출되지 않아야 합니다.

## 로컬 검증

```powershell
cd apps/web
npm run test
npm run typecheck
npm run build
```

`npm run test`는 frontmatter 오류, slug mismatch, unsafe HTML, draft/scheduled 제외를 확인합니다.
