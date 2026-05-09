# Admin CMS

Status: Implemented via GitHub-backed admin editor
Owner: 개인 운영자
Last Updated: 2026-05-09
Source of Truth: `docs/20_features/github-backed-admin-editor.md`, `docs/40_architecture/EDITOR_BOUNDARIES.md`

## 1. Goal

AI 시대 생존기 운영자가 웹에서 글을 작성, 편집, 저장할 수 있는 비공개 1인 CMS를 제공한다. Active MVP는 Supabase/DB CMS가 아니라 GitHub OAuth와 GitHub Contents API를 사용한다.

공개 독자는 관리자 기능을 볼 수 없다. `/admin`, `/write`, public in-place edit 저장 경로는 owner session이 있어야 접근할 수 있다.

## 2. Routes

| Route                        | 목적                               | 보호                    |
| ---------------------------- | ---------------------------------- | ----------------------- |
| `/admin/login`               | GitHub OAuth 로그인 진입           | OAuth config            |
| `/admin`                     | 글 목록과 GitHub content 상태 확인 | `requireAdminSession()` |
| `/admin/posts/new`           | 새 글 작성                         | `requireAdminSession()` |
| `/admin/posts/[slug]`        | 기존 글 편집                       | `requireAdminSession()` |
| `/write`                     | 빠른 새 글 작성                    | `requireAdminSession()` |
| `/api/admin/github/login`    | OAuth 시작                         | state cookie            |
| `/api/admin/github/callback` | OAuth callback/session 발급        | state + owner 검증      |
| `/api/admin/upload/[slug]`   | 이미지 업로드                      | `requireAdminSession()` |

## 3. Post Capabilities

- 글 생성
- 글 수정
- draft/published/scheduled/archived 상태 설정
- slug 검증
- title, description, cover, category, tags, series, tools 설정
- GitHub Contents API 저장
- sha 기반 충돌 방지
- 저장 후 GitHub commit URL 표시

## 4. Editor Capabilities

- Tiptap 기반 rich editor
- heading, paragraph, list, quote, code block
- table, task list, highlight, color, align
- image paste/drag/drop and figure serialization
- MDX serialize/parse
- standalone `/write` flow
- public post in-place edit flow

## 5. States

| 상태        |           공개 노출 |         sitemap/RSS | 관리자 노출 |
| ----------- | ------------------: | ------------------: | ----------: |
| `draft`     |              아니오 |              아니오 |          예 |
| `published` |                  예 |                  예 |          예 |
| `scheduled` | 발행 시각 전 아니오 | 발행 시각 전 아니오 |          예 |
| `archived`  |              아니오 |              아니오 |          예 |

## 6. MVP Gate

- owner가 아닌 계정은 admin URL/API에서 session을 받을 수 없다.
- admin 저장은 GitHub commit을 만든다.
- published 글만 public route, sitemap, RSS에 노출된다.
- admin token과 OAuth secret은 server-only env에만 존재한다.
- `/admin`, `/write`, `/preview`는 robots/ads/sitemap 대상에서 제외한다.

## 7. Non-Goals

- 다중 작성자 권한 관리
- 댓글 관리
- 유료 멤버십
- 실시간 공동 편집
- DB-backed CMS
- Supabase reactivation without a new ADR
