# Admin CMS

Status: Draft
Owner: 개인 운영자
Last Updated: 2026-05-06
Source of Truth: 관리자 글쓰기, 편집, 발행 기능

## 1. Goal

`AI Vibe Lab` 운영자가 웹에서 글을 작성, 편집, 미리보기, 발행할 수 있는 비공개 1인 CMS를 만든다.

공개 독자는 관리자 기능을 볼 수 없다. `/admin`은 Google OAuth 로그인 후 `ADMIN_EMAILS` allowlist에 포함된 계정만 접근한다.

## 2. Routes

| Route | 목적 | 우선순위 |
|---|---|---|
| `/admin/login` | Google 로그인 진입 | P0 |
| `/admin` | 관리자 대시보드 | P0 |
| `/admin/posts` | 글 목록, 검색, 상태 필터 | P0 |
| `/admin/posts/new` | 새 글 작성 | P0 |
| `/admin/posts/[id]/edit` | 글 편집 | P0 |
| `/admin/posts/[id]/preview` | draft/예약 글 미리보기 | P0 |
| `/admin/media` | 이미지/파일 관리 | P1 |
| `/admin/taxonomy` | 카테고리, 태그, 시리즈 관리 | P1 |
| `/admin/settings` | 사이트 설정 placeholder | P2 |

## 3. Post Capabilities

- 글 생성
- 글 수정
- 글 삭제 또는 archive
- draft 저장
- published 발행
- scheduled 예약
- archived 보관
- slug 편집 및 중복 검증
- title, description, canonical, OG image 설정
- category, tags, series 연결
- cover image 설정
- preview URL 제공

## 4. Editor Capabilities

- Tiptap 기반 본문 편집
- heading, paragraph, list, quote, code block
- link 삽입
- image 삽입
- table of contents 생성을 위한 heading 구조 유지
- 저장 포맷: `posts.content_json`
- 서버 렌더링 가능한 HTML 변환 경로 제공

## 5. States

| 상태 | 공개 노출 | sitemap/RSS | 관리자 노출 |
|---|---:|---:|---:|
| `draft` | 아니오 | 아니오 | 예 |
| `published` | 예 | 예 | 예 |
| `scheduled` | 발행 시각 전 아니오 | 발행 시각 전 아니오 | 예 |
| `archived` | 아니오 | 아니오 | 예 |

## 6. MVP Gate

Phase 4 종료 기준:

- allowlist 외 계정은 어떤 admin URL/API도 200을 받지 못한다.
- 관리자는 텍스트 글을 작성하고 발행할 수 있다.
- 발행된 글은 공개 글 상세 페이지에서 서버 렌더링된다.
- draft와 scheduled 글은 공개 경로, sitemap, RSS에 노출되지 않는다.

## 7. Non-Goals

- 다중 작성자 역할 관리
- 댓글 관리
- 유료 멤버십
- 실시간 공동 편집
- Notion 수준의 전체 block editor
