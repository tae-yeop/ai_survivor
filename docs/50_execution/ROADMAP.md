# Roadmap

Status: Phase-aligned roadmap
Last Updated: 2026-05-09

이 문서는 `docs/50_execution/phase-*` 폴더와 같은 번호 체계를 쓰는 상위 로드맵이다. 예전 로드맵의 “콘텐츠/브라우저 글쓰기/AdSense/성장” 묶음은 아래 phase 체계로 재분류했다.

진행률을 볼 때 우선순위는 다음 순서다.

1. [`EXECUTION_STATUS.md`](./EXECUTION_STATUS.md) — 최신 현황판
2. 이 파일 — phase 번호와 남은 작업 요약
3. 각 `phase-*/README.md`와 `slice-*.md` — 세부 작업 단위

## Phase 0. Foundations

상태: Done locally
문서: [`phase-0-foundations`](./phase-0-foundations/README.md)

- [x] 브랜드/제품 방향 정리
- [x] ADR 작성 체계 준비
- [x] Next.js + GitHub/MDX 운영 경로 확정
- [x] Supabase 의존 MVP 제외 결정 반영
- [x] 도메인/계정/브랜치 정책은 Launch phase로 이관

## Phase 1. Next.js Skeleton

상태: Done locally
문서: [`phase-1-nextjs-skeleton`](./phase-1-nextjs-skeleton/README.md)

- [x] Next.js App Router 프로젝트 구성
- [x] 공개/관리자 route group 분리
- [x] 기본 레이아웃/Header/Footer/Theme 구성
- [x] 홈, 글 목록, 글 상세, taxonomy, About, Contact, Privacy route 골격
- [x] sitemap, robots.txt, RSS 기본 경로
- [ ] 선택: 실제 Vercel URL 기준 visual smoke 재검증

## Phase 2. Public Read

상태: Done locally
문서: [`phase-2-public-read`](./phase-2-public-read/README.md)

- [x] MDX frontmatter schema 확정
- [x] Git content tree로 게시글/초안 관리
- [x] published/draft/scheduled/archived 공개 필터링
- [x] 글 목록/상세 정적 렌더링
- [x] free-form category/tag/series/tool slug 처리
- [x] sitemap, robots.txt, RSS 실콘텐츠 연결

## Phase 3. Admin Auth

상태: Done via ADR-004
문서: [`phase-3-admin-auth`](./phase-3-admin-auth/README.md)

- [x] GitHub OAuth 기반 관리자 로그인
- [x] signed owner session
- [x] owner allowlist 성격의 검증
- [x] `/write`/admin shell 접근 경로
- [ ] production 환경변수 입력: `ADMIN_GITHUB_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`

## Phase 4. Admin CRUD

상태: Done via ADR-004
문서: [`phase-4-admin-crud`](./phase-4-admin-crud/README.md)

- [x] GitHub Contents API 기반 글 목록
- [x] 새 글 작성/기존 글 수정 폼
- [x] MDX serialize/parse 경로
- [x] GitHub 저장/sha 충돌 가드
- [x] post detail in-place edit 경로
- [ ] 선택: 관리자 UX polish

## Phase 5. Editor & Media

상태: Partial
문서: [`phase-5-editor-media`](./phase-5-editor-media/README.md)

- [x] Rich editor core
- [x] GitHub 이미지 업로드/figure serialization
- [x] standalone local draft editor
- [x] post detail in-place edit
- [ ] R2 video pipeline
- [ ] embed pack: YouTube/Vimeo/X/Gist/CodePen/Spotify/OG card
- [ ] Callout/shortcut/toast/a11y polish

## Phase 6. Content Ops

상태: Partial / backlog
문서: [`phase-6-content-ops`](./phase-6-content-ops/README.md)

- [x] Git commit history를 revision source로 사용
- [x] status/date 기반 public filtering
- [x] 기본 metadata form
- [x] 제휴 링크 정책 문서화
- [x] `/resources` 시작 페이지
- [x] public editor와 protected editor 경계 문서화 강화
- [ ] autosave/local draft 보강 검토
- [ ] schedule automation 필요성 결정
- [ ] taxonomy admin UI
- [ ] advanced SEO panel/search preview
- [x] `AffiliateLink` / `ProductCard` / `DisclosureBox` 컴포넌트 정책 적용

## Phase 7. SEO & AdSense Readiness

Status: Live verified, AdSense external approval pending
문서: [`phase-7-seo-adsense`](./phase-7-seo-adsense/README.md)

- [x] About 본문 보강
- [x] Privacy Policy 보강
- [x] Contact 동작 경로
- [x] 카테고리 빈 페이지 제거/얇은 글 정리
- [x] 광고 슬롯 컴포넌트 준비
- [x] `ads.txt` route 준비
- [x] 실제 Vercel URL 기준 Lighthouse/a11y 점검
- [x] production canonical/sitemap/RSS URL 확인

## Phase 8. Production Launch

Status: Partial / live Vercel verified / credential-gated
문서: [`phase-8-launch`](./phase-8-launch/README.md)

- [x] Vercel app published and live smoke passed
- [ ] Preview/Production 환경변수 최종 분리
- [ ] 운영 도메인 구매/연결
- [ ] apex vs www 정책 결정 및 redirect
- [ ] `NEXT_PUBLIC_SITE_URL`을 운영 도메인으로 변경
- [ ] Google Search Console 등록 + sitemap 제출
- [ ] Naver Search Advisor 등록 + sitemap 제출
- [ ] AdSense 신청
- [ ] 승인 후 광고 단위 생성 + `ADS_ENABLED=true` 점진 적용

## Phase 9. Operating Loop

상태: Starts after production launch
문서: [`phase-9-operating`](./phase-9-operating/README.md)

- [ ] 주간 발행 루틴
- [ ] 검색 노출 키워드 분석
- [ ] 오래된 AI 도구 글 업데이트 주기
- [ ] 인기 글 기반 후속 글 작성
- [ ] 도구별 허브 페이지 강화
- [ ] 인스타/유튜브 재가공 루틴

## Phase 10. Brand Redesign

상태: Done
문서: [`phase-10-brand-redesign`](./phase-10-brand-redesign/README.md)

- [x] AI 시대 생존기 rebrand
- [x] clean white visual system
- [x] hero canvas
- [x] category filter card grid
- [x] popular posts/tag cloud sidebar
- [x] post detail TOC and cover image
- [x] superpowers 산출물 정리

## 런칭 전 개발-only 우선순위

도메인 구매/검색엔진/AdSense처럼 외부 계정이 필요한 작업 전에 로컬에서 끝낼 수 있는 우선순위는 다음이다.

1. [`PRE_LAUNCH_DEV_CHECKLIST.md`](./PRE_LAUNCH_DEV_CHECKLIST.md)를 기준으로 환경변수/canonical/metadata/보안 헤더 점검
2. Phase 6의 editor 경계 문서와 수익화 컴포넌트 정책 적용
3. ~~Phase 7 Lighthouse/a11y pre-check~~
4. Phase 8에서 domain 연결 후 `NEXT_PUBLIC_SITE_URL` 교체와 search console 제출
