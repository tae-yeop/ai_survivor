# Phase 1 — Next.js App Skeleton (read-only public)

Status: Done locally — optional visual smoke remains
Goal: Git-backed public blog를 올릴 수 있는 Next.js App Router 골격을 만든다.

## Slices

| # | 파일 | 한 줄 |
| --- | --- | --- |
| 1.1 | [slice-1.1-bootstrap.md](./slice-1.1-bootstrap.md) | Completed — TypeScript + App Router + Tailwind + shadcn/ui 부트스트랩 |
| 1.2 | [slice-1.2-design-tokens.md](./slice-1.2-design-tokens.md) | Completed locally — 디자인 토큰 & 공통 레이아웃 이식 |
| 1.3 | [slice-1.3-route-skeleton.md](./slice-1.3-route-skeleton.md) | Completed — 공개 라우트 골격 |

## Phase Exit Criteria

- [x] `apps/web`에서 Next.js 앱이 빌드된다.
- [x] 공개 route group과 관리자 route group이 분리되어 있다.
- [x] home/posts/taxonomy/policy/contact 경로가 존재한다.
- [x] sitemap/robots/RSS 경로가 존재한다.
- [ ] 선택: 실제 Vercel production URL 기준 visual smoke test를 한 번 더 수행한다.
