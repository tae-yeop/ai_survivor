# GitHub-backed Admin Editor

Status: Implemented
Owner: 개인 운영자
Last Updated: 2026-05-06
Related ADR: `docs/60_decisions/ADR-004-github-backed-admin-editor.md`

> 2026-05-09 implementation note: the Phase B GitHub-backed editor is now active in code. See `../40_architecture/HOW_IT_WORKS.md` for the current end-to-end flow.

## Goal

사이트 자체에서 owner가 로그인한 뒤 글을 작성하고 저장할 수 있게 한다. 저장 결과는 database row가 아니라 GitHub commit이어야 한다.

## Non-goals

- 여러 명의 편집자 권한 관리
- 댓글/회원/구독 기능
- Supabase Postgres 기반 CMS
- 대용량 영상 관리 시스템
- 완전한 Notion급 block editor

## MVP 기능

- owner login
- 글 목록 보기
- 새 글 생성
- frontmatter form
- Markdown body editor
- `status: draft` 기본값
- GitHub commit으로 저장
- 저장 후 Vercel 자동 배포 확인 링크

## Later 기능

- 이미지 upload to Vercel Blob/R2
- preview deployment 연결
- publish/archive 버튼
- 예약 발행 검증
- 글별 SEO 점검
- 미디어 라이브러리

## Main Risk

브라우저 editor를 너무 빨리 만들면 글쓰기보다 인증, 파일 업로드, 권한, 에러 처리, 에디터 UX에 시간이 많이 든다. 그래서 우선은 `articles/` + Git commit workflow를 유지하고, 반복 작업이 충분히 불편해졌을 때 구현한다.

## Phase B MVP implementation notes

Status: Implemented locally on 2026-05-06.

The site now includes a minimal GitHub-backed admin editor:

- `/admin/login` uses GitHub OAuth for owner login.
- `/admin` requires a signed httpOnly owner session.
- `/admin/posts/new` creates draft MDX posts.
- `/admin/posts/[slug]` edits existing MDX posts by reading the current file from GitHub.
- Save uses a server action and GitHub Contents API to commit `apps/web/content/posts/<slug>/index.mdx`.
- The public site still builds without admin secrets; missing admin env vars are shown only inside the admin UI.

Required Vercel env vars:

- `ADMIN_GITHUB_LOGIN`
- optional `ADMIN_GITHUB_ID`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ADMIN_SESSION_SECRET`
- `GITHUB_CONTENT_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

For media, keep the current manual workflow first: place images under `apps/web/public/media/posts/<slug>/` and reference them from the body/frontmatter. Browser upload can be added later with Blob/R2 after writing frequency proves it is needed.
