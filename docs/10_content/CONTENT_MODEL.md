# Content Model

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

## 1. 콘텐츠 저장 위치

기본 가정:

```text
src/content/posts/*.mdx
```

글은 Markdown 또는 MDX로 작성한다.

---

## 2. Post Frontmatter

모든 글은 아래 frontmatter를 가진다.

```yaml
title: "Cursor로 Astro 블로그를 만들어본 후기"
description: "AI 코딩 도구 Cursor를 사용해 Astro 기반 독립 블로그를 만든 과정, 실패한 점, SEO 체크리스트를 정리한다."
slug: "cursor-astro-blog-build-review"
publishedAt: "2026-05-05"
updatedAt: "2026-05-05"
draft: true
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
coverImage: "/images/posts/cursor-astro-blog-build-review/cover.png"
coverAlt: "Cursor와 Astro로 블로그를 만드는 화면"
canonical: null
ogImage: "/images/og/cursor-astro-blog-build-review.png"
```

---

## 3. 필드 규칙

| 필드 | 필수 | 설명 |
|---|---:|---|
| `title` | O | 검색 결과와 글 상단에 노출되는 제목 |
| `description` | O | 메타 설명. 글마다 고유해야 함 |
| `slug` | O | 영문 소문자, 하이픈 사용 |
| `publishedAt` | O | 최초 발행일 |
| `updatedAt` | O | 주요 수정일 |
| `draft` | O | 발행 전 true |
| `category` | O | 핵심 카테고리 1개 |
| `tags` | O | 3~7개 권장 |
| `series` | 선택 | 시리즈가 없으면 null 또는 생략 |
| `seriesOrder` | 선택 | 시리즈 순서 |
| `author` | O | 작성자 key |
| `difficulty` | O | beginner / intermediate / advanced |
| `tools` | 선택 | 사용한 AI 도구 / 프레임워크 |
| `coverImage` | 선택 | 대표 이미지 |
| `coverAlt` | 선택 | 대표 이미지 alt |
| `canonical` | 선택 | 외부 원문이 있거나 중복 페이지 방지 시 사용 |
| `ogImage` | 선택 | 공유 이미지 |

---

## 4. Category Slug

| slug | 이름 |
|---|---|
| `ai-tool-review` | AI 도구 사용기 |
| `vibe-coding-lab` | 바이브코딩 실험실 |
| `ai-workflow-automation` | AI 업무 자동화 |
| `ai-productivity` | AI 생산성 팁 |
| `domain-ai` | 전문 영역 적용기 |

---

## 5. Difficulty

| 값 | 의미 |
|---|---|
| `beginner` | 비개발자도 따라 할 수 있음 |
| `intermediate` | 기본 개발/도구 이해 필요 |
| `advanced` | 코드, 배포, 데이터 구조 이해 필요 |

---

## 6. Slug 규칙

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

---

## 7. 내부 링크 규칙

각 글은 가능하면 아래 링크를 포함한다.

- 같은 카테고리 글 1개 이상
- 같은 시리즈 이전/다음 글
- 관련 도구 페이지 또는 태그 페이지
- 필요 시 외부 공식 문서
