# Phase 3 — Admin Auth & Shell

Status: Done via ADR-004
Goal: 운영자만 브라우저에서 로그인하고 Git-backed 콘텐츠를 수정할 수 있다.

> Current path: ADR-004 이후 실제 구현은 Supabase Auth가 아니라 GitHub OAuth + HMAC-signed owner session이다. 아래 slice들은 ADR-002 Supabase/Admin CMS 경로를 위한 historical reference이며, 현재 진행률 계산에는 포함하지 않는다.

## Current implementation

| 기능 | 상태 | 근거 |
| --- | --- | --- |
| GitHub OAuth 시작/콜백 | Implemented | `apps/web/app/api/admin/github/*` |
| OAuth helper | Implemented | `apps/web/src/lib/admin/github-oauth.ts` |
| signed owner session | Implemented | `apps/web/src/lib/admin/session*.ts` |
| admin login page | Implemented | `apps/web/app/(admin)/admin/login/page.tsx` |
| admin route boundary | Implemented | `apps/web/app/(admin)/admin/*` |

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 3.1 | [slice-3.1-supabase-auth.md](./slice-3.1-supabase-auth.md) | Supabase Auth + Google OAuth |
| 3.2 | [slice-3.2-allowlist.md](./slice-3.2-allowlist.md) | 이메일 allowlist + 라우트 보호 |
| 3.3 | [slice-3.3-admin-shell.md](./slice-3.3-admin-shell.md) | `/admin` 레이아웃 + 대시보드 placeholder |

## Reactivation Criteria

- Supabase/Auth.js/DB 기반 CMS로 되돌아갈 근거가 생긴다.
- 새 ADR에서 Auth provider, content write path, media storage, preview policy를 다시 결정한다.
