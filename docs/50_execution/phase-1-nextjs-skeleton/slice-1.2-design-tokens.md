# Slice 1.2 — 디자인 토큰 & 공통 레이아웃 이식

Phase: 1 — Next.js Skeleton
Status: Implemented — visual parity review pending

## Goal

기존 Astro 헤더/푸터/타이포 톤이 Next.js 에서도 동일하게 나온다.

## Tasks

- [x] `src/styles/global.css` 의 `@layer` 외부 룰(특히 char animation) 검토 후 이식 정책 결정
- [x] `BaseLayout` → Next.js `app/(public)/layout.tsx` 로 이식
- [x] `Header`, `Footer`, `ThemeToggle`, `Preloader` 동등 컴포넌트 재구현
- [x] `font-display`, `kicker`, `rule-thick` 등 커스텀 유틸리티 이식

## Acceptance

- 빈 라우트 페이지여도 헤더/푸터/타이포가 기존과 시각적으로 동일하다.

## Notes

- Existing Astro `global.css` and Tailwind token definitions were ported into `apps/web`.
- Header/footer/theme/preloader were rebuilt in React with the same public navigation constraints.
- Screenshot-based visual parity is still pending before the Phase 1 README can be marked fully completed.
