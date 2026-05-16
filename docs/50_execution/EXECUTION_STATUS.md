# Execution Status Dashboard

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-09

이 문서는 `docs/50_execution`의 최신 진행 현황판이다. 오래된 slice 체크박스보다 이 문서와 [`IMPLEMENTATION_STATUS_2026-05-09.md`](./IMPLEMENTATION_STATUS_2026-05-09.md)를 우선한다.

## 현재 한 줄 상태

Public blog, Git-backed admin writing, baseline SEO/monetization infrastructure, Vercel URL live smoke가 완료됐다. 남은 핵심 작업은 custom domain, Search Console/Naver/AdSense 신청, 운영 루프, 고급 editor/media polish다.

## Phase 현황

| Phase                    | 상태                       | 완료                                                                                           | 남은 작업                                             | 비고                             |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| 0. Foundations           | Done                       | 제품/문서/ADR 기반 정리                                                                        | 없음                                                  | 완료                             |
| 1. Next.js skeleton      | Done                       | App Router 공개 사이트 골격                                                                    | 선택: 추가 visual smoke                               | 완료                             |
| 2. Public read           | Done                       | MDX, post rendering, taxonomy, RSS/sitemap                                                     | Search Console 제출은 Phase 8                         | 완료                             |
| 3. Admin auth            | Done via ADR-004           | GitHub OAuth, owner session                                                                    | production env 입력                                   | Supabase Auth slice는 historical |
| 4. Admin CRUD            | Done via ADR-004           | admin list, new/edit form, GitHub Contents save                                                | 선택: admin UX polish                                 | DB CRUD slice는 historical       |
| 5. Editor/media          | Partial                    | RichEditor, Figure, image/audio/document upload, in-place edit                                 | R2 video, 고급 embed pack, callout, toast/a11y polish | slice 문서는 backlog 성격        |
| 6. Content ops           | Partial/backlog            | Git commit history, public filtering, metadata form, resources page                            | autosave, schedule automation, taxonomy UI, SEO panel | 운영 병목 확인 후 구현           |
| 7. SEO/AdSense readiness | Live verified              | policy pages, ads.txt, AdSlot, sitemap/RSS/robots, security headers, PageSpeed a11y/SEO/BP 100 | 선택: desktop performance 90+                         | AdSense 신청은 Phase 8           |
| 8. Launch                | Partial / credential-gated | Vercel deploy, live smoke, Vercel URL canonical/sitemap/RSS verified                           | custom domain, GSC, Naver, AdSense                    | 외부 계정/도메인 권한 필요       |
| 9. Operating             | Planned                    | 운영 루프 초안                                                                                 | 발행 루틴, analytics loop, content update policy      | production 이후 시작             |
| 10. Brand redesign       | Done                       | AI Survivor rebrand, clean white UI, free-form taxonomy                                        | 선택: visual QA                                       | 완료                             |

## 진행률 해석 규칙

- `source-plans/`, `_design/`, `_archive-*`, Supabase 기반 old slices는 진행률 계산에서 제외한다.
- `slice-*.md` 전체 체크박스를 기계적으로 세면 과거 source plan과 대체된 경로가 섞여 실제 상태보다 낮게 보인다.
- 현재 제품 상태는 `IMPLEMENTATION_STATUS_2026-05-09.md`, architecture docs, 실제 `apps/web` 코드로 판단한다.

## 바로 가능한 로컬 작업

1. Phase 5 callout/toast/a11y polish
2. 고급 external embed pack 중 URL-only로 끝나는 항목
3. Desktop Performance 90+ 최적화
4. Phase 6 운영 편의 기능 중 실제 병목이 확인된 항목

## 외부 권한이 필요한 작업

- Vercel production env 입력/수정
- custom domain 구매 및 DNS 연결
- Google Search Console / Naver Search Advisor 등록
- AdSense 신청 및 승인 후 광고 단위 생성
- 제휴 계정 생성 및 승인

## 최근 검증 기록

2026-05-09 live target: `https://aisurvivor.vercel.app`

- 200 OK: `/`, `/posts`, `/resources`, `/about`, `/privacy`, `/contact`, `/categories`, `/tags`, `/series`, `/tools`
- 200 OK: `/sitemap.xml`, `/rss.xml`, `/robots.txt`, `/ads.txt`, `/admin/login`, `/api/admin/me`
- `/api/admin/me`: anonymous visitor에게 `{ "admin": false }`를 200으로 반환
- sitemap: `/resources` 포함, `/admin`과 `/write` 제외, 55 URLs
- RSS: Vercel production URL 사용, placeholder 도메인 미포함
- PageSpeed: Desktop 84/100/100/100, Mobile 96/100/100/100

결론: Vercel URL 기준 공개 읽기/SEO/a11y/BP는 launch-ready다. production 완료 여부는 도메인·검색·광고 계정 작업에 달려 있다.
