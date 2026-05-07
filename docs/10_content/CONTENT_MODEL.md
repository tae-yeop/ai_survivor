# Content Model

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

## 1. 저장소 역할

AI 시대 생존기는 글을 두 단계로 관리한다.

| 위치                                      | 역할                                                | Git 공개 여부                                    |
| ----------------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `articles/`                               | 아이디어, 초안, 조사 메모를 자유롭게 쓰는 작업 공간 | 커밋 가능하지만 공개 페이지에 자동 노출되지 않음 |
| `apps/web/content/posts/<slug>/index.mdx` | 사이트가 빌드 때 읽는 발행 후보 원본                | 공개/비공개 상태를 frontmatter로 제어            |
| `apps/web/public/media/posts/<slug>/`     | Git에 넣을 수 있는 최종 이미지/짧은 영상 asset      | public URL로 제공                                |

원칙:

- `articles/`는 글쓰기 편한 작업장이다.
- 실제 사이트 노출 기준은 항상 `apps/web/content/posts/**/index.mdx`이다.
- `status: draft | scheduled | archived` 글은 Git에 있어도 public listing, RSS, sitemap에 나오면 안 된다.
- `status: published`이고 `publishedAt`이 현재 날짜 이하인 글만 공개한다.

## 2. 발행 폴더 구조

권장 구조:

```text
apps/web/content/posts/<slug>/
├─ index.mdx
└─ assets/              # 글 전용 이미지/짧은 미디어 원본 또는 web-optimized 파일

apps/web/public/media/posts/<slug>/
├─ cover.webp
├─ screenshot-01.webp
└─ demo-short.mp4       # 아주 짧고 최적화된 경우만
```

본문에서는 public asset을 절대 경로로 참조한다.

```mdx
![Cursor 설정 화면](/media/posts/cursor-astro-blog-build-review/screenshot-01.webp)
```

## 3. Post Frontmatter

모든 발행 후보 글은 아래 frontmatter를 가진다.

> `category`와 `tags` 값은 자유 문자열이다. 한국어, 공백, 대소문자 모두 가능. 기존 글의 kebab-case 슬러그도 그대로 유효하다.

```yaml
title: "Cursor로 Astro 블로그를 만들어본 후기"
description: "AI 코딩 도구 Cursor를 사용해 Astro 기반 독립 블로그를 만든 과정, 실패한 점, SEO 체크리스트를 정리한다."
slug: "cursor-astro-blog-build-review"
publishedAt: "2026-05-05"
updatedAt: "2026-05-05"
status: "draft"
category: "vibe-coding-lab"
tags:
  - cursor
  - astro
  - vibe-coding
  - seo
series: "building-ai-blog"
seriesOrder: 1
author: "owner"
difficulty: "beginner"
tools:
  - Cursor
  - Astro
  - Google Search Console
coverImage: "/media/posts/cursor-astro-blog-build-review/cover.webp"
coverAlt: "Cursor와 Astro로 블로그를 만드는 화면"
canonical: null
ogImage: "/images/og/default.svg"
```

## 4. 필드 규칙

| 필드          | 필수 | 설명                                             |
| ------------- | ---: | ------------------------------------------------ |
| `title`       |    O | 검색 결과와 글 상단에 노출되는 제목              |
| `description` |    O | 메타 설명. 글마다 고유해야 함                    |
| `slug`        |    O | 영문 소문자, 숫자, 하이픈만 사용                 |
| `publishedAt` |    O | 최초 발행일                                      |
| `updatedAt`   |    O | 주요 수정일                                      |
| `status`      |    O | `draft` / `published` / `scheduled` / `archived` |
| `category`    |    O | 핵심 카테고리 1개                                |
| `tags`        |    O | 3~7개 권장                                       |
| `series`      | 선택 | 시리즈가 없으면 `null` 또는 생략                 |
| `seriesOrder` | 선택 | 시리즈 순서                                      |
| `author`      |    O | 작성자 key                                       |
| `difficulty`  |    O | `beginner` / `intermediate` / `advanced`         |
| `tools`       | 선택 | 사용한 AI 도구 / 프레임워크                      |
| `coverImage`  | 선택 | 대표 이미지 public path                          |
| `coverAlt`    | 선택 | 대표 이미지 alt                                  |
| `canonical`   | 선택 | 외부 원문 또는 중복 페이지 방지 시 사용          |
| `ogImage`     | 선택 | 공유 이미지                                      |

## 5. Category 값 (free-form)

`category`는 자유 입력 문자열이다. enum이 아니다.

- 값은 그대로 보존되며, 빌드 시 `slugifyTaxonomy()`로 URL 슬러그가 도출된다.
- 표시 라벨은 `lib/labels.ts`의 `CATEGORY_LABELS`에서 우선 조회되며, 없으면 frontmatter에 적힌 원문이 그대로 노출된다.
- 두 개의 서로 다른 `category` 값이 같은 슬러그로 정규화되면, `next dev`에서는 콘솔 경고가 나오고 `next build`는 실패한다 (SEO 이중-URL 방지).
- 새 카테고리는 글을 쓰면서 자유롭게 추가할 수 있다.

기존 슬러그(`vibe-coding-lab`, `ai-tool-review`, `ai-workflow-automation`, `ai-productivity`, `domain-ai`)는 `CATEGORY_LABELS` 테이블에 한국어 라벨이 등록되어 있어 그대로 표시된다. 새 값은 frontmatter 원문이 라벨로 사용된다.

`tags` 필드도 동일한 규칙을 따른다 (자유 입력, slugify, 충돌 정책).

## 6. Media 규칙

### 이미지

- 글 본문 이미지는 가능하면 `webp`를 사용한다.
- 원본 스크린샷은 크면 `articles/` 또는 로컬 artifact에 두고, 사이트에는 최적화본만 넣는다.
- 권장 위치: `apps/web/public/media/posts/<slug>/...`
- 파일명은 영문 소문자/kebab-case를 사용한다.
- 모든 본문 이미지는 alt text를 쓴다.
- 이미지: 기본 `![alt](url)`. 정렬·크기·캡션이 필요하면 `<Figure src alt width align caption />` (Phase 5 도입).

### 영상

영상은 Git repository에 넣기 전에 한 번 더 판단한다.

| 유형                         | 권장 위치                                                 | 이유                                              |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| 5~15초 이하의 짧은 무음 데모 | `apps/web/public/media/posts/<slug>/demo.mp4`             | 파일이 작고 글 이해에 직접 필요할 때만            |
| 긴 튜토리얼/녹화 영상        | YouTube, Vimeo, Vercel Blob, Cloudflare R2 등 외부 저장소 | Git repo와 Vercel build를 무겁게 만들지 않기 위해 |
| 비공개 검토용 영상           | 로컬 `.artifacts/` 또는 외부 private storage              | public repo에 올리지 않기 위해                    |

초기 MVP에서는 긴 영상은 사이트에 직접 업로드하지 않는다. 필요하면 외부 영상 URL을 본문에 링크하거나 embed 정책을 별도로 정한다.

## 7. Slug 규칙

> 글 폴더 슬러그(`<slug>/index.mdx`의 `<slug>`)는 영문 소문자·숫자·하이픈만 사용한다. 카테고리/태그 슬러그는 §5의 자유 입력 규칙을 따른다.

- 영문 소문자 사용
- 공백 대신 하이픈 사용
- 날짜는 slug에 넣지 않는다.
- 너무 일반적인 slug를 피한다.
- 변경 시 redirect가 필요하다.

좋은 예:

```text
cursor-astro-blog-seo-issues
chatgpt-claude-research-comparison
ai-code-review-checklist
```

나쁜 예:

```text
post1
ai-tool
chatgpt
2026-05-05-cursor-review
```

## 8. 내부 링크 규칙

각 글은 가능하면 아래 링크를 포함한다.

- 같은 카테고리 글 1개 이상
- 같은 시리즈 이전/다음 글
- 관련 도구 페이지 또는 태그 페이지
- 필요 시 외부 공식 문서

## 9. 발행 체크리스트

1. `articles/`에서 초안을 완성한다.
2. 발행할 때 `apps/web/content/posts/<slug>/index.mdx`로 옮긴다.
3. 이미지/짧은 미디어는 `apps/web/public/media/posts/<slug>/`에 최적화본만 둔다.
4. frontmatter를 채운다.
5. `status: draft`로 build/test를 먼저 통과시킨다.
6. 공개 직전에 `status: published`로 바꾼다.
7. commit/push하면 Vercel이 재배포한다.
