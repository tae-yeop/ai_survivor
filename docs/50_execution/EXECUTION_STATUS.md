# Execution Status Dashboard

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-09

이 문서는 `docs/50_execution`의 최신 진행 현황판이다. 오래된 slice 체크박스, archived source plan, ADR-002/ADR-003 기반 보류 문서보다 이 파일과 `IMPLEMENTATION_STATUS_2026-05-09.md`를 우선한다.

## 1. 읽는 순서

1. 현재 코드 기준 구현 여부: [`IMPLEMENTATION_STATUS_2026-05-09.md`](./IMPLEMENTATION_STATUS_2026-05-09.md)
2. Phase별 실행 현황: 이 문서
3. 큰 로드맵 체크: [`ROADMAP.md`](./ROADMAP.md)
4. 세부 구현 단위: 각 `phase-*/slice-*.md`
5. 오래된 원본 계획: `source-plans/`, `_archive-*`는 참고용이며 진행률 계산에서 제외

## 2. 현재 한 줄 상태

**공개 블로그 + Git-backed 관리자 글쓰기 + 기본 SEO/광고 인프라는 로컬 구현 완료이고, Vercel app 출판까지는 진행된 상태(사용자 보고 기준)다.**

아직 남은 핵심은 **운영 도메인 연결, production env/canonical 최종화, 검색 콘솔/AdSense 신청, 운영 루프, 고급 미디어/임베드, 수익화 컴포넌트**다.

## 3. Phase 현황

| Phase                    | 상태                       | 현재 완료                                                                                                   | 남은 작업                                                    | 비고                                  |
| ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| 0. Foundations           | Done                       | 브랜드/문서/ADR 골격                                                                                        | 없음                                                         | 완료                                  |
| 1. Next.js skeleton      | Done                       | App Router 공개 사이트 뼈대                                                                                 | 외부 visual parity 재검증 선택                               | 로컬 구현 완료                        |
| 2. Public read           | Done                       | MDX, post rendering, taxonomy, RSS/sitemap                                                                  | Search Console 제출은 Phase 8                                | 완료                                  |
| 3. Admin auth            | Done via ADR-004           | GitHub OAuth, owner session, allowlist 성격의 owner 검증                                                    | production env 입력                                          | 예전 Supabase Auth slice는 historical |
| 4. Admin CRUD            | Done via ADR-004           | admin list, new/edit form, GitHub Contents save                                                             | UX polish 선택                                               | 예전 DB CRUD slice는 historical       |
| 5. Editor/media          | Partial                    | Rich editor, GitHub image upload, in-place edit 일부                                                        | R2 video, embed pack, callout, toast/a11y polish             | 세부 slice 체크박스는 backlog 성격    |
| 6. Content ops           | Partial/backlog            | Git commit history, status/date public filtering, metadata form 일부, editor boundary 문서, 수익화 컴포넌트 | autosave, schedule automation, taxonomy UI, SEO panel polish | GitHub-backed 운영 모델로 재정의 필요 |
| 7. SEO/AdSense readiness | Locally ready              | 정책 페이지, ads.txt, AdSlot, sitemap/RSS/robots, baseline security headers                                 | Lighthouse/a11y 외부 검증                                    | AdSense 신청은 Phase 8                |
| 8. Launch                | Partial / credential-gated | Vercel app 출판(owner report), 로컬 준비 문서                                                               | custom domain, production env/canonical, GSC, Naver, AdSense | 외부 계정/도메인 권한 필요            |
| 9. Operating             | Not started                | 운영 루프 문서 초안                                                                                         | 발행 루틴, analytics loop, 업데이트 정책                     | production deploy 후 활성             |
| 10. Brand redesign       | Done                       | AI 시대 생존기 rebrand, clean white UI                                                                      | 선택적 visual QA                                             | 완료                                  |

## 4. 진행률 해석

`ROADMAP.md`는 2026-05-09에 phase 폴더 기준으로 재정렬했다.

- 단순 체크박스 진행률보다 “phase 상태”를 우선한다.
- Launch 관련 체크박스는 Vercel app 출판만 완료이고, 도메인/DNS/검색/광고 신청은 외부 권한 대기다.
- `source-plans/`, `_archive-*`, Supabase 기반 old slices는 진행률 계산에서 제외한다.

단, `slice-*.md` 전체 체크박스를 기계적으로 세면 오래된 source plan, archived slice, 이미 대체된 Supabase 경로가 섞여 실제 진행률보다 낮게 보인다. 따라서 진행률은 다음처럼 해석한다.

| 축               | 체감 진행률 | 이유                                                             |
| ---------------- | ----------- | ---------------------------------------------------------------- |
| 공개 읽기 사이트 | 높음        | home/posts/taxonomy/SEO/RSS/sitemap 구현                         |
| 브라우저 글쓰기  | 높음        | GitHub OAuth admin, save, rich editor, in-place edit 구현        |
| 고급 편집 경험   | 중간        | 이미지/기본 rich editor는 있으나 video/embed/callout polish 남음 |
| 런칭/검색/광고   | 낮음        | 외부 계정·도메인·AdSense 신청 전                                 |
| 운영/성장        | 낮음        | production 데이터 기반 루프 전                                   |

## 5. 바로 진행 가능한 로컬 작업

외부 계정 권한 없이 지금 진행 가능한 작업:

1. production 전 `NEXT_PUBLIC_SITE_URL`이 실제 Vercel URL 또는 운영 도메인을 가리키는지 확인
2. 실제 Vercel production URL에서 smoke test
3. Lighthouse 실행 전/후 a11y/metadata 점검
4. R2 없이 가능한 embed/callout/UX polish 일부 구현

## 6. 외부 권한이 필요한 작업

다음은 사용자의 계정/도메인/승인 절차가 필요하므로 로컬에서 완료했다고 표시하지 않는다.

- Vercel project/team 설정 확인 또는 변경
- production env 입력/수정
- 도메인 구매 및 DNS 연결
- Google Search Console / Naver Search Advisor 등록
- AdSense 신청 및 승인
- 실제 광고 단위 생성
- Coupang Partners / Amazon Associates 계정 생성 및 승인

## 7. 다음 실행 순서

권장 순서:

1. ~~문서 정합성 정리: Phase 3/4/5/6의 stale status 보정~~
2. ~~/resources 시작 페이지 추가~~
3. ~~sitemap/navigation에 `/resources` 연결~~
4. ~~로컬 typecheck/build 검증~~
5. ~~Vercel 출판 이후 pre-launch developer checklist 문서화~~
6. ~~`AffiliateLink`/`ProductCard`/`DisclosureBox` 구현~~
7. ~~editor 경계 문서화~~
8. ~~security headers 사전 적용~~
9. 다음 후보: 실제 Vercel URL smoke/Lighthouse 또는 Phase 5 embed/callout polish

## 2026-05-09 Launch QA update

Shared PageSpeed report findings addressed in code:

- Fixed public-page console error by making `/api/admin/me` return anonymous state with HTTP 200 instead of 401 when no admin session exists.
- Raised light theme subtle ink tokens so `text-ink-300` and `text-ink-400` pass 4.5:1 contrast on white and paper backgrounds.
- Added regression tests for anonymous admin identity and contrast token safety.
- Local production smoke passed for `/`, `/api/admin/me`, `/resources`, sitemap `/resources`, and baseline security headers.

Deployment note: the live `https://aisurvivor.vercel.app` deployment still needs a production redeploy before these fixes appear in PageSpeed.
