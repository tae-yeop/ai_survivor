# Slice 0.2 — 환경 결정값 동결

Status: Completed locally — external launch decisions deferred to Phase 8

## Goal

MVP 구현이 흔들리지 않도록 로컬/코드 레벨의 결정값을 잠그고, 외부 계정·도메인·DNS 결정은 Launch phase에서 별도로 추적한다.

## Tasks

- [x] 블로그 정식명 확정
- [x] Next.js 디렉토리 전략 확정 (`apps/web/`)
- [x] GitHub/MDX 콘텐츠 원본 전략 확정
- [x] Supabase 프로젝트 생성은 MVP 범위에서 제외
- [x] GitHub OAuth admin editor를 ADR-004 경로로 확정
- [x] 운영 도메인 구매/DNS/검색엔진 등록은 Phase 8로 이관
- [x] Vercel 팀/계정, Hobby vs Pro 시점 결정은 Phase 8로 이관
- [x] GitHub 저장소 권한/브랜치 보호 정책은 production launch 직전에 재점검

## Locked Values

| 항목 | 결정값 |
| --- | --- |
| 블로그 정식명 | `AI 시대 생존기` |
| 영문/slug 성격 이름 | `aisurvivor` |
| 운영 도메인 | 미확정 — Phase 8에서 구매/연결 |
| 임시 URL 기준 | Vercel production URL 또는 `NEXT_PUBLIC_SITE_URL` |
| Next.js 앱 위치 | `apps/web/` |
| Next.js route 위치 | `apps/web/app/` |
| 공개 route group | `apps/web/app/(public)/` |
| 관리자 route group | `apps/web/app/(admin)/` |
| 공유 코드 | `apps/web/src/lib`, `apps/web/src/components`, `apps/web/src/styles` |
| 콘텐츠 원본 | GitHub repo의 MDX 파일 |
| 글 폴더 규칙 | `content/posts/<slug>/index.mdx` |
| 관리자 인증 | GitHub OAuth + signed owner session |
| 광고 | 승인 전 `ADS_ENABLED=false` |

## Acceptance

- [x] 새 기능 구현자가 어디에 앱/콘텐츠/관리 코드가 있는지 알 수 있다.
- [x] 아직 구매하지 않은 도메인을 완료 조건으로 오해하지 않는다.
- [x] Launch phase에서만 외부 계정·DNS·검색/광고 신청을 완료 처리한다.

## Notes

`apps/web/src/lib/site.ts`는 `NEXT_PUBLIC_SITE_URL`을 canonical/sitemap/RSS 기준으로 사용한다. 도메인 구매 전 production에서는 실제 Vercel production URL을 env로 넣고, 도메인 연결 후 운영 도메인으로 교체한다.
