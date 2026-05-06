# Slice 1.1 — 신규 Next.js 프로젝트 부트스트랩

Phase: 1 — Next.js Skeleton
Status: Completed

## Goal

TypeScript + App Router + Tailwind + shadcn/ui 가 깔린 Next.js 앱이 로컬에서 동작한다.

## Tasks

- [x] `apps/web/`에 Next.js 15+ App Router 프로젝트 생성 (ADR-002에서 시작, ADR-003에서도 유지)
- [x] TypeScript strict, ESLint, Prettier 통일
- [x] Tailwind CSS 셋업 + 기존 Astro `tailwind.config.mjs` 토큰(폰트/색/spacing) 이식
- [x] shadcn/ui init, 기본 컴포넌트 1–2개만 설치 (Button, Card)
- [x] `next.config.ts` 최소 설정 유지 (repo-local 이미지 우선; 외부 이미지 도메인은 필요 시 추가)
- [x] `app/(public)/` 와 `app/(admin)/` 라우트 그룹 분리

## Acceptance

- `npm run dev` → `/` 가 “Hello” 텍스트로라도 뜬다.
- `npm run build` 통과.

## Verification

- `npm run format`
- `npm run lint`
- `npm run typecheck`
- `npm audit --audit-level=moderate`
- `npm run build`

## Risks

- Next.js 앱 위치는 `apps/web/`로 확정했다. 기존 루트 Astro 프로젝트는 전환 기간 동안 참조용으로 유지한다.
