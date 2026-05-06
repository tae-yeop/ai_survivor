# Phase 2 — Git-backed MDX Public Read Path

Status: Completed locally (2026-05-06)
Goal: GitHub에 커밋된 MDX 글을 Next.js 공개 라우트의 실제 데이터로 연결한다. 이 시점부터 Supabase 없이도 신규 사이트를 도메인에 올릴 수 있다.

## Decision Boundary

- Source of truth: GitHub repository files
- Authoring format: MDX + typed frontmatter
- Rendered output: server/static HTML
- Deferred: Supabase DB/Auth/Storage, Tiptap `/admin`

## Slices

| #   | 파일                                                                       | 기준                                      |
| --- | -------------------------------------------------------------------------- | ----------------------------------------- |
| 2.1 | [slice-2.1-mdx-content-model.md](./slice-2.1-mdx-content-model.md)         | MDX frontmatter schema + 폴더 규칙        |
| 2.2 | [slice-2.2-git-content-import.md](./slice-2.2-git-content-import.md)       | 기존 글/샘플 글을 Git content tree로 이식 |
| 2.3 | [slice-2.3-static-post-rendering.md](./slice-2.3-static-post-rendering.md) | 글 목록/상세 HTML 렌더링                  |
| 2.4 | [slice-2.4-taxonomy.md](./slice-2.4-taxonomy.md)                           | categories/tags/series/tools 분류 페이지  |
| 2.5 | [slice-2.5-sitemap-rss.md](./slice-2.5-sitemap-rss.md)                     | Sitemap / Robots / RSS 실콘텐츠 연결      |

## Phase Exit Criteria

- `/posts`와 `/posts/[slug]`가 fixture가 아니라 MDX content tree에서 데이터를 읽는다.
- 글 상세 페이지가 JS 비활성 환경에서도 본문 HTML을 보여준다.
- frontmatter 누락/오류가 build 또는 typecheck에서 실패한다.
- `draft`, `scheduled`, `archived` 글이 sitemap/RSS/public listing에 노출되지 않는다.
- categories/tags/series/tools 페이지가 MDX metadata 기준으로 정상 렌더링된다.
- 이 시점의 사이트를 Vercel에 연결하면 Supabase 없이 외부 공개가 가능하다.
