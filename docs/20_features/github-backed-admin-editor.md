# GitHub-backed Admin Editor

Status: Proposed
Owner: 개인 운영자
Last Updated: 2026-05-06
Related ADR: `docs/60_decisions/ADR-004-github-backed-admin-editor.md`

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
