# Slice 0.2 — 환경 결정값 동결

Phase: 0 — Foundations
Status: In Progress

## Goal

이름·도메인·콘텐츠 저장소·계정 등 코드보다 먼저 결정해야 할 값을 잠근다.

## Tasks

- [x] 블로그 정식명 확정
- [x] 운영 도메인 1개 확정 (예: `aivibelab.com`)
- [x] 관리자 이메일 allowlist 결정 (`ADMIN_EMAILS=...`) — Supabase admin 재개 시에만 사용
- [x] Next.js 디렉토리 전략 확정 (`apps/web/`)
- [x] Supabase 프로젝트 생성은 MVP 범위에서 제외
- [ ] Vercel 팀/계정 정리, Hobby vs Pro 시점 결정 메모
- [ ] GitHub 저장소 권한/브랜치 정책 확정 (master 보호 등)

## Locked Values

| 항목 | 결정값 |
|---|---|
| 블로그 정식명 | `AI Vibe Lab` |
| 운영 도메인 | `aivibelab.com` |
| 관리자 이메일 allowlist | `ADMIN_EMAILS=driedflame@gmail.com` |
| Next.js 앱 위치 | `apps/web/` |
| Next.js route 위치 | `apps/web/app/` |
| 공개 route group | `apps/web/app/(public)/` |
| 관리자 route group | `apps/web/app/(admin)/` |
| 공유 코드 | `apps/web/src/lib`, `apps/web/src/components`, `apps/web/src/styles` |
| 콘텐츠 원본 | GitHub repo의 MDX 파일 |
| 글 폴더 규칙 | `content/posts/<slug>/index.mdx` 또는 Phase 2에서 확정한 동등 경로 |

`aivibelab.com`은 2026-05-06 기준 RDAP/DNS에서 등록 상태로 확인했다. 도메인 구매 자체는 Phase 8 범위지만, 구현 문서와 환경변수는 이 도메인을 기준으로 작성한다.

## Acceptance

- MVP `.env.example` 작성 가능한 모든 키 이름이 결정되어 있다.
- Supabase 관련 키는 필수값이 아니라 보류/미사용 항목으로 분리되어 있다.

## Notes

- 도메인 구매는 Phase 8에서 해도 된다. 다만 “이 이름으로 갈 것”은 지금 확정.
- Vercel/GitHub 계정 생성과 권한 정책은 남은 slice-0.2 작업으로 유지한다.
- Supabase는 free-project 한도 이슈로 현재 MVP에서 제외한다.
