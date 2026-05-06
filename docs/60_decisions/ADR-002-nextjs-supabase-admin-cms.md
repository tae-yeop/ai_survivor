# ADR-002: Next.js + Supabase Admin CMS Pivot

Status: Superseded by ADR-003 for current MVP content workflow
Date: 2026-05-06
Owner: 개인 운영자
Supersedes: ADR-001 static-content-first approach, partially

> 2026-05-06 update: Supabase project availability became a blocker and the project returned to a GitHub + MDX content workflow in `ADR-003-github-mdx-content-workflow.md`. The Next.js App Router decision remains useful; Supabase Auth/Postgres/Storage and Tiptap admin CMS are deferred.

## Context

초기 계획은 Astro + MDX 정적 블로그였다. 이 구조는 빠르고 단순하지만, 글 작성과 이미지 관리가 로컬 IDE와 Git에 묶인다.

요구사항이 바뀌었다. 공개 블로그는 SEO 친화적인 독립 도메인 사이트여야 하고, 운영자는 `/admin`에서 글을 작성, 편집, 이미지 업로드, 발행할 수 있어야 한다. 즉, 단순 정적 블로그가 아니라 **공개 블로그 + 비공개 1인 관리자 CMS**가 필요하다.

공개 사용자는 글만 읽는다. 관리자 기능은 공개 내비게이션, footer, sitemap, RSS에 노출하지 않는다.

## Locked Values

| 항목 | 결정값 |
|---|---|
| 블로그 정식명 | `AI Vibe Lab` |
| 운영 도메인 | `aivibelab.com` |
| 관리자 이메일 allowlist | `ADMIN_EMAILS=driedflame@gmail.com` |
| Next.js 디렉토리 전략 | `apps/web/`에 신규 Next.js 앱을 두고, 라우트는 `apps/web/app`에서 관리 |

도메인은 2026-05-06 기준 RDAP/DNS에서 등록 상태로 확인했다. Phase 8에서 실제 소유권, DNS, Vercel 연결을 검증한다.

## Decision

기술 스택을 아래로 전환한다.

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI primitives: shadcn/ui
- Auth: Supabase Auth + Google OAuth
- Database: Supabase Postgres
- Storage: Supabase Storage
- Editor: Tiptap
- Deploy: Vercel, production/AdSense launch 시점에 Pro 전환

렌더링과 데이터 전략은 다음을 따른다.

- 공개 글 상세는 서버에서 HTML로 렌더링한다. SSR 또는 ISR을 사용하고, 클라이언트 전용 SPA 렌더링은 금지한다.
- 글 본문은 Supabase Postgres의 `posts.content_json`에 저장한다.
- 이미지와 첨부 파일은 Supabase Storage `media` bucket에 저장한다.
- 관리자 화면은 `/admin` 아래에 둔다.
- `/admin`, `/api/admin/*`, preview, draft 접근은 서버에서 세션과 이메일 allowlist를 모두 확인한다.
- `ADMIN_EMAILS`는 쉼표로 구분 가능한 문자열로 두되, 초기값은 단일 이메일이다.
- AdSense 광고 슬롯은 만들 수 있지만, 승인 전과 관리자/미리보기/draft 화면에서는 실제 광고 코드를 로드하지 않는다.

Next.js 프로젝트는 기존 Astro 앱을 즉시 덮어쓰지 않는다. 전환 기간에는 기존 루트 Astro 앱을 참조 자산으로 유지하고, 신규 Next.js 앱을 `apps/web/`에 만든다. Vercel 배포 루트는 Phase 8에서 `apps/web/`로 설정한다.

## Alternatives Considered

### Keep Astro + MDX

장점은 단순성, 빠른 빌드, 낮은 운영 비용이다. 하지만 웹 기반 글쓰기, Google 로그인, 이미지 업로드, 관리자 API, DB 기반 draft/schedule 흐름을 붙이면 장점이 줄어든다.

### Astro + Decap CMS

정적 블로그에 관리자 UI를 붙일 수 있지만 콘텐츠 저장이 Git 중심이다. 원하는 운영 경험은 네이버 블로그/티스토리처럼 웹에서 바로 작성하고 발행하는 방식이므로 맞지 않는다.

### Next.js + Sanity 또는 Payload

완성형 CMS를 빠르게 붙일 수 있다. 다만 이 프로젝트의 목표는 개인 독립 블로그와 직접 만든 관리자 CMS 운영 경험을 함께 쌓는 것이다. 외부 CMS 구조에 맞추기보다 Supabase 기반으로 직접 구성한다.

### Notion 또는 hosted blog platform

초기 작성 경험은 빠르지만 독립 도메인 SEO, 광고 정책, 데이터 구조, 관리자 기능 확장에 대한 제어권이 줄어든다.

## Consequences

장점:

- 웹에서 글 작성, 편집, 이미지 업로드, 발행이 가능하다.
- 공개 블로그와 관리자 기능을 한 프로젝트에서 관리할 수 있다.
- Supabase Auth, Postgres, Storage를 한 계층에서 연결할 수 있다.
- 글별 SEO metadata, sitemap, RSS, robots, ads.txt를 Next.js convention으로 관리할 수 있다.
- 향후 autosave, schedule, media library, SEO panel, analytics loop를 확장하기 쉽다.

비용:

- Astro 정적 블로그보다 구현 범위가 커진다.
- Auth, RLS, 관리자 API 보호, Storage 정책을 직접 검증해야 한다.
- 기존 Astro 디자인 자산은 Next.js + Tailwind 위에서 이식해야 한다.
- MDX 파일 기반 콘텐츠는 Supabase Postgres로 1회 마이그레이션해야 한다.
- Vercel/Supabase 환경변수와 Preview/Production 분리가 필요하다.

## Non-Negotiables

- 공개 글 상세를 클라이언트 전용 렌더링으로 만들지 않는다.
- `/admin` 링크를 공개 메뉴, footer, sitemap, RSS에 넣지 않는다.
- allowlist 검증을 클라이언트에서만 하지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`를 브라우저에 노출하지 않는다.
- draft, scheduled, archived 글을 공개 sitemap/RSS/Search 결과에 노출하지 않는다.
- 관리자, preview, draft 화면에 AdSense를 마운트하지 않는다.

## Revisit Trigger

아래 조건 중 하나가 생기면 ADR-003에서 재검토한다.

- 다중 작성자와 역할 기반 권한이 필요해진다.
- Supabase 비용 또는 정책 제약이 운영 병목이 된다.
- Tiptap JSON 저장 구조가 SEO 렌더링 또는 마이그레이션에 불리해진다.
- hosted CMS를 쓰는 편이 유지보수 비용을 크게 낮춘다는 근거가 생긴다.
