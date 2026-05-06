# Auth And Permissions

Status: Draft
Owner: 개인 운영자
Last Updated: 2026-05-06
Source of Truth: 보류된 로그인, 관리자 권한, Supabase RLS 정책

> 2026-05-06 update: ADR-003에서 Supabase/Auth/Admin CMS를 MVP 범위 밖으로 보류했다. 현재 공개 블로그는 별도 앱 로그인 없이 GitHub repository 권한과 PR 리뷰로 작성 권한을 관리한다. 이 문서는 ADR-002 경로를 재개할 때 참고하는 보관 문서다.

## 1. Goal

공개 블로그는 누구나 읽을 수 있다. 관리자 CMS는 Google OAuth 로그인과 이메일 allowlist를 모두 통과한 계정만 접근할 수 있다.

초기 관리자 allowlist:

```env
ADMIN_EMAILS=driedflame@gmail.com
```

## 2. Auth Model

- Auth provider: Supabase Auth
- OAuth provider: Google
- Session handling: `@supabase/ssr`
- Admin identity: Supabase user email
- Admin authorization: server-side `ADMIN_EMAILS` allowlist

로그인만으로는 관리자가 아니다. 로그인한 사용자의 이메일이 `ADMIN_EMAILS`에 포함되어야 관리자다.

## 3. Permission Matrix

| 대상 | Public visitor | Authenticated non-admin | Admin |
|---|---:|---:|---:|
| published 글 읽기 | 예 | 예 | 예 |
| draft/scheduled preview | 아니오 | 아니오 | 예 |
| `/admin` 접근 | 아니오 | 아니오 | 예 |
| `/api/admin/*` 접근 | 아니오 | 아니오 | 예 |
| 글 생성/수정/삭제 | 아니오 | 아니오 | 예 |
| 이미지 업로드 | 아니오 | 아니오 | 예 |
| taxonomy 수정 | 아니오 | 아니오 | 예 |

## 4. Next.js Enforcement

필수 보호 지점:

- `middleware.ts`: `/admin/*` 요청의 세션과 allowlist 확인
- `src/lib/auth/requireAdmin.ts`: server action, route handler, admin loader에서 공통 사용
- `/api/admin/*`: 모든 mutation 전에 `requireAdmin()` 호출
- preview route: draft/scheduled 글 조회 전 `requireAdmin()` 호출

클라이언트 UI에서 버튼을 숨기는 것은 보조 UX일 뿐이다. 권한의 source of truth는 서버 검증이다.

## 5. Supabase RLS

원칙:

- 노출되는 모든 테이블은 RLS를 켠다.
- 공개 read policy는 `posts.status = 'published'`와 `published_at <= now()` 조건을 포함한다.
- draft, scheduled, archived row는 anon/public read로 읽을 수 없다.
- admin write는 서버에서 검증된 경로를 통해서만 수행한다.
- service role key는 서버 전용이며 브라우저 번들에 포함하지 않는다.

초기 테이블 후보:

- `posts`
- `post_revisions`
- `assets`
- `categories`
- `tags`
- `post_tags`
- `series`
- `series_posts`
- `admin_users`

## 6. Secrets And Env

| Env | 공개 여부 | 용도 |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | browser/server anon client |
| `SUPABASE_SERVICE_ROLE_KEY` | secret | admin-only server operations |
| `ADMIN_EMAILS` | secret | 관리자 이메일 allowlist |
| `NEXT_PUBLIC_SITE_URL` | public | canonical URL |
| `ADS_ENABLED` | secret/public config | 광고 로딩 토글 |
| `ADSENSE_CLIENT` | public after approval | AdSense client id |

## 7. Security Non-Negotiables

- allowlist 검증을 클라이언트에서만 하지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`를 `NEXT_PUBLIC_` prefix로 만들지 않는다.
- `/admin`이 robots.txt로 막혀 있어도 보안 처리가 된 것으로 간주하지 않는다.
- draft/preview URL은 긴 URL이어도 비밀 URL로 취급하지 않는다. 관리자 인증을 요구한다.
- 관리자 API는 CSRF, MIME, 파일 크기, 입력값 검증을 포함한다.
