# Implementation Plan Index

Status: Active index
Last Updated: 2026-05-09

이 문서는 실행 문서의 안내판이다. 실제 완료/미완료 판단은 [`IMPLEMENTATION_STATUS_2026-05-09.md`](./IMPLEMENTATION_STATUS_2026-05-09.md)와 [`EXECUTION_STATUS.md`](./EXECUTION_STATUS.md)를 우선한다.

## Phase 요약

| Phase               | 상태             | 현재 기준                                                                                                                     |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 0. Foundations      | Done             | 제품 방향, ADR, docs-first 운영 규칙 정리                                                                                     |
| 1. Next.js skeleton | Done             | `apps/web` App Router 기반 공개 사이트 골격                                                                                   |
| 2. Public read      | Done             | Git-backed MDX, 공개 필터, taxonomy, sitemap/RSS                                                                              |
| 3. Admin auth       | Done via ADR-004 | GitHub OAuth + HMAC owner session. Supabase auth slice는 historical                                                           |
| 4. Admin CRUD       | Done via ADR-004 | GitHub Contents API 기반 글 생성/수정/충돌 감지                                                                               |
| 5. Editor/media     | Partial          | RichEditor, 이미지/오디오/문서 업로드, Figure/Audio/Document embed, in-place edit 구현. R2 video/callout/고급 embed는 backlog |
| 6. Content ops      | Partial/backlog  | Git commit history와 frontmatter 운영. autosave/schedule/taxonomy UI/SEO panel은 backlog                                      |
| 7. SEO/AdSense      | Live verified    | 정책 페이지, RSS/sitemap/robots/ads, 보안 헤더, PageSpeed 기본 검증                                                           |
| 8. Launch           | Credential-gated | Vercel URL smoke 완료. custom domain/search console/AdSense는 외부 계정 작업                                                  |
| 9. Operating        | Planned          | 발행 루틴, 분석 루프, 오래된 글 업데이트                                                                                      |
| 10. Brand redesign  | Done             | AI Survivor rebrand, clean white UI, free-form taxonomy                                                                       |

## 문서 사용 원칙

- 새 작업은 해당 phase README와 slice를 보고 시작하되, 오래된 Supabase/ADR-002 계획은 현재 구현으로 간주하지 않는다.
- 큰 동작/구조 변경은 `docs/40_architecture/HOW_IT_WORKS.md`와 이 폴더의 상태 문서를 함께 갱신한다.
- 출시/계정/도메인 작업은 로컬 완료로 표시하지 않고 credential-gated로 남긴다.

## 보존하되 우선하지 않는 문서

- `phase-3-admin-auth/slice-3.1-supabase-auth.md` 등 Supabase 기반 slice
- `phase-5-editor-media/_archive-adr-002/*`
- `phase-5-editor-media/_design/*`, `phase-10-brand-redesign/source-plans/*`

이 문서들은 설계 근거와 대안 기록이다. 현재 active implementation은 GitHub-backed MDX + Next.js + Vercel 경로다.
