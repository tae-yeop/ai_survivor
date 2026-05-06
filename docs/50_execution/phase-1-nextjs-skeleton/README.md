# Phase 1 — Next.js App Skeleton (read-only public)

Status: In Progress — local skeleton implemented, browser visual parity review pending
Goal: 비어 있는 Next.js 앱을 띄우고, 기존 Astro 디자인의 “느낌”을 가져갈 컴포넌트 베이스를 만든다. 이 단계 끝에는 데이터 없이도 모든 라우트가 200을 낸다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 1.1 | [slice-1.1-bootstrap.md](./slice-1.1-bootstrap.md) | Completed — TypeScript + App Router + Tailwind + shadcn/ui 부트스트랩 |
| 1.2 | [slice-1.2-design-tokens.md](./slice-1.2-design-tokens.md) | Implemented — 디자인 토큰 & 공통 레이아웃 이식, visual parity review pending |
| 1.3 | [slice-1.3-route-skeleton.md](./slice-1.3-route-skeleton.md) | Completed — 정적 더미 데이터로 모든 공개 라우트 골격 |

## Phase Exit Criteria

- 모든 SERVICE_IA URL 이 200 을 낸다.
- 헤더/푸터/타이포가 기존 Astro 와 시각적으로 동일하다.
- `npm run build` 통과.

> Retro: 2026-05-06 — `apps/web/` Next.js skeleton created; lint/typecheck/build/audit passed and public routes smoke-tested. `/404` correctly returns HTTP 404 while rendering the custom page. Visual screenshot parity against Astro remains the only Phase-level review item.
