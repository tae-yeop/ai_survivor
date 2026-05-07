# Implementation Plan — Index

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

> SEO 검토 결과와 실행 중 제약을 받아 **Next.js + GitHub + MDX + Vercel** 중심으로 구체화한 실행 계획. 이 파일은 인덱스이고, 실제 작업 내용은 phase 폴더 안의 README와 slice 파일을 본다.
>
> 상위 마일스톤은 [ROADMAP.md](./ROADMAP.md), 현재 콘텐츠 결정은 `../60_decisions/ADR-003-github-mdx-content-workflow.md` 를 본다. ADR-002의 Supabase/Admin CMS 경로는 보류한다.

---

## 0. 폴더 규칙

```text
docs/50_execution/
├─ ROADMAP.md                  # 상위 마일스톤만
├─ IMPLEMENTATION_PLAN.md      # 본 인덱스
├─ phase-0-foundations/
│  ├─ README.md                # Phase 개요 + Slice 목록
│  └─ slice-0.x-*.md           # Slice 단위 상세
├─ phase-1-nextjs-skeleton/
│  └─ ...
└─ ...
```

- **Phase**: 외부 공개 가치를 만드는 큰 단계. 직선 진행.
- **Slice**: Phase 안의 얇은 수직 단면. 단독 머지 가능, 머지 후에도 사이트가 망가지지 않아야 한다.
- **Task**: 0.5–1일 단위. Slice 파일 안 체크박스로 추적.
- 완료 항목은 `[x]` 표기, 임의로 지우지 않는다.

---

## 1. 결정 컨텍스트 (피벗 요약)

| 항목 | ADR-002 경로 | 현재 경로 (ADR-003) |
|---|---|---|
| 글 저장 | Supabase Postgres (`posts.content_json`) | GitHub repo의 MDX 파일 |
| 작성 환경 | 웹 `/admin` Tiptap 에디터 | VS Code/GitHub 편집, PR, 선택적 Pages CMS/Decap CMS |
| 인증 | Google OAuth + 이메일 allowlist | MVP에는 없음; GitHub 권한으로 대체 |
| 이미지 | Supabase Storage | post 폴더 안 `cover.png`, `assets/` |
| 렌더링 | Next.js App Router SSR/ISR | Next.js App Router 정적/서버 HTML 렌더링 |
| 배포 | Vercel + Supabase env | Vercel + GitHub 연동 |
| 광고 | AdSlot + 승인 후 활성화 | 동일 |

**현재 원칙**: 콘텐츠 원본은 사람이 읽고 diff 할 수 있는 MDX로 둔다. 결과물은 HTML로 렌더링한다. Supabase/Auth/Storage/Admin CMS는 운영 병목이 실제로 생길 때 ADR-004+에서 재검토한다.

---

## 2. Phase 지도

| # | Phase | 폴더 | 외부에 보이는 결과 |
|---|---|---|---|
| 0 | Decision Lock & Doc Foundations | [phase-0-foundations/](./phase-0-foundations/) | (없음) 기준 문서 확정 |
| 1 | Next.js App Skeleton | [phase-1-nextjs-skeleton/](./phase-1-nextjs-skeleton/) | 빈 사이트지만 모든 라우트 200 |
| 2 | Git-backed MDX Public Read Path | [phase-2-public-read/](./phase-2-public-read/) | MDX 실제 글로 신규 사이트 공개 가능 |
| 3 | Editorial Workflow on GitHub | [phase-3-admin-auth/](./phase-3-admin-auth/) | 보류: GitHub/Pages CMS/Decap CMS 중 선택 전까지 기존 Admin Auth 계획은 실행하지 않음 |
| 4 | Content Production & Review | [phase-4-admin-crud/](./phase-4-admin-crud/) | 보류: CRUD 대신 PR 기반 작성/검수로 대체 예정 |
| 5 | MDX Components & Rich Editor | [phase-5-editor-media/](./phase-5-editor-media/) | Active (ADR-004 Phase C/D): 리치 에디터 + 이미지 paste/리사이즈 + 비디오 R2 + 8종 임베드 + 인플레이스 편집 |
| 6 | Content Ops (cadence/taxonomy/SEO) | [phase-6-content-ops/](./phase-6-content-ops/) | 운영 부담 최소화 |
| 7 | SEO & AdSense Readiness | [phase-7-seo-adsense/](./phase-7-seo-adsense/) | AdSense 신청 가능 상태 |
| 8 | Production Launch | [phase-8-launch/](./phase-8-launch/) | 도메인 + 검색엔진 + AdSense |
| 9 | Operating Loop | [phase-9-operating/](./phase-9-operating/) | 1주 1편 루틴 |

---

## 3. 의존성

```text
P0 ──▶ P1 ──▶ P2 ──▶ P7 ──▶ P8 ──▶ P9
              │
              └── P3~P6 = GitHub 기반 운영을 몇 회 해본 뒤 필요한 것만 재작성
```

- **P2 종료**: 기존 Astro 사이트와 시각적/콘텐츠적 동등 + 실제 MDX 글 렌더링 → 도메인 스왑 가능 시점.
- **P3~P4, P6**: Supabase/Tiptap admin 경로는 실행하지 않는다. GitHub 편집 흐름이 불편하다는 운영 근거가 생기면 재계획한다.
- **P5**: ADR-004 기반으로 reactivated — Supabase 없이 GitHub repo + Cloudflare R2 + Tiptap NodeView 로 리치 에디터 / 비디오 / 임베드 / 인플레이스 편집을 6개 slice (5.1~5.6) 로 실행. 자세한 설계는 [phase-5-editor-media/_design/2026-05-07-rich-editor-overhaul.md](./phase-5-editor-media/_design/2026-05-07-rich-editor-overhaul.md).
- **P7 종료**: AdSense 신청 가능 상태.
- **P8 종료**: 정식 운영 시작.

---

## 4. 글로벌 NOT-DO

본 계획을 진행하는 동안 다음은 절대 하지 않는다 (CLAUDE.md §6 + ADR-003):

- 글 상세를 클라이언트 렌더링 only 로 만든다.
- 모든 글에 같은 description.
- `/admin` 링크를 공개 메뉴/sitemap/footer 에 넣는다.
- AdSense 승인 전 실제 광고 코드를 production 에 로드한다.
- 검증 없는 MDX frontmatter를 public route에 연결한다.
- raw HTML/iframe/embed를 allowlist 없이 무제한 허용한다.
- draft / scheduled 글을 sitemap/RSS/검색결과에 노출한다.
- Supabase/Auth/Admin CMS 작업을 ADR 없이 되살린다.

---

## 5. 진행 추적 규칙

- 각 Slice 파일의 체크박스를 `[ ]` → 작업 시작 시 git branch 이름으로 추적 → 완료 시 `[x]`.
- Phase 종료마다 해당 Phase의 `README.md` 끝에 `> Retro:` 한 줄 회고.
- 새로운 큰 결정은 ADR-003+ 추가하고 본 인덱스의 “결정 컨텍스트”를 갱신.
