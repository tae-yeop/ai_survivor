# Phase 3 — Admin Auth & Shell

Status: Deferred by ADR-003
Goal: 현재 MVP에서는 실행하지 않는다. GitHub/MDX 운영이 실제 병목이 되기 전까지 `/admin`, OAuth, allowlist, admin API를 만들지 않는다.

> Historical plan: 아래 slice들은 ADR-002 Supabase/Admin CMS 경로를 위한 보관 문서다. ADR-003 경로에서는 실행 대상이 아니다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 3.1 | [slice-3.1-supabase-auth.md](./slice-3.1-supabase-auth.md) | Supabase Auth + Google OAuth |
| 3.2 | [slice-3.2-allowlist.md](./slice-3.2-allowlist.md) | 이메일 allowlist + 라우트 보호 |
| 3.3 | [slice-3.3-admin-shell.md](./slice-3.3-admin-shell.md) | `/admin` 레이아웃 + 대시보드 placeholder |

## Reactivation Criteria

- GitHub/PR 또는 Pages CMS/Decap CMS로 운영해본 뒤 브라우저 전용 관리자 화면이 필요하다는 근거가 생긴다.
- 새 ADR에서 Auth provider, content write path, media storage, preview policy를 다시 결정한다.
