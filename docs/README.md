# Docs README

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

이 문서 공간은 **AI Vibe Lab**을 만들 때 사람과 LLM이 같은 기준을 보고 작업하기 위한 문서 세트다.

현재 활성 구현 방향은 `ADR-003`에 따른 **Next.js + GitHub + MDX + Vercel 기반 공개 블로그**다. `ADR-002`의 Supabase + Tiptap 비공개 관리자 CMS는 보류한다. 사이트에서 로그인 후 글을 쓰는 기능은 `ADR-004`의 GitHub-backed admin editor로 검토한다.

## 0. 현재 운영 범위

```text
/
├─ articles/                         # 자유 초안/조사 메모
├─ apps/web/                         # Vercel production target
│  ├─ content/posts/<slug>/index.mdx # 발행 후보 글
│  └─ public/media/posts/<slug>/     # 공개 이미지/짧은 미디어
└─ docs/
   ├─ README.md
   ├─ 00_overview/
   ├─ 10_content/
   │  ├─ CONTENT_STRATEGY.md
   │  ├─ CONTENT_MODEL.md
   │  ├─ ARTICLE_TEMPLATE.md
   │  └─ ARTICLE_WORKFLOW.md
   ├─ 20_features/
   │  ├─ admin-cms.md                # 보류: ADR-002 admin CMS
   │  ├─ media-library.md            # 보류: ADR-002 storage/media library
   │  └─ github-backed-admin-editor.md
   ├─ 30_seo_monetization/
   ├─ 40_architecture/
   ├─ 50_execution/
   ├─ 60_decisions/
   │  ├─ ADR-001-static-content-first-blog.md
   │  ├─ ADR-002-nextjs-supabase-admin-cms.md
   │  ├─ ADR-003-github-mdx-content-workflow.md
   │  └─ ADR-004-github-backed-admin-editor.md
   └─ 70_ops/
      └─ DEPLOYMENT.md
```

## 1. Source of Truth

| 주제                          | Source of Truth                                       |
| ----------------------------- | ----------------------------------------------------- |
| 제품 목적 / 사용자 / MVP 범위 | `00_overview/PRODUCT_BRIEF.md`                        |
| 현재 콘텐츠 워크플로우        | `60_decisions/ADR-003-github-mdx-content-workflow.md` |
| 향후 로그인 기반 글쓰기       | `60_decisions/ADR-004-github-backed-admin-editor.md`  |
| 초안→발행 운영                | `10_content/ARTICLE_WORKFLOW.md`                      |
| 글 metadata/frontmatter       | `10_content/CONTENT_MODEL.md`                         |
| SEO/AdSense 타이밍            | `30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`        |
| 배포/도메인/Vercel 설정       | `70_ops/DEPLOYMENT.md`                                |
| 기술 구조                     | `40_architecture/ARCHITECTURE.md`                     |
| 실행 계획                     | `50_execution/IMPLEMENTATION_PLAN.md`                 |

## 2. 콘텐츠 운영 원칙

- `articles/`는 초안 작업장이다.
- public site는 `apps/web/content/posts/**/index.mdx`만 읽는다.
- 이미지는 최적화본만 Git에 넣는다.
- 긴 영상은 Git에 넣지 않고 외부 저장소/동영상 플랫폼을 사용한다.
- commit/push가 발행 트리거다.
- AdSense는 도메인, 색인, 충분한 글이 준비된 뒤 신청한다.

## 3. LLM 작업 순서

LLM은 아래 순서로 문서를 읽고 작업한다.

1. `CLAUDE.md`
2. `docs/README.md`
3. `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`
4. `docs/10_content/ARTICLE_WORKFLOW.md`
5. `docs/10_content/CONTENT_MODEL.md`
6. `docs/40_architecture/ARCHITECTURE.md`
7. `docs/70_ops/DEPLOYMENT.md`
8. `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
9. `docs/60_decisions/ADR-004-github-backed-admin-editor.md` only when browser authoring is requested
10. `docs/50_execution/IMPLEMENTATION_PLAN.md`

Deferred/historical references only: `ADR-002-nextjs-supabase-admin-cms.md`, `AUTH_AND_PERMISSIONS.md`, `20_features/admin-cms.md`, and `20_features/media-library.md`. Do not read these as active implementation inputs unless a new ADR reactivates that path.

## 4. 변경 관리 규칙

### 글/metadata가 바뀌면

- `10_content/CONTENT_MODEL.md`
- `10_content/ARTICLE_WORKFLOW.md`
- 필요 시 `apps/web/content/README.md`

### 이미지/영상 정책이 바뀌면

- `10_content/CONTENT_MODEL.md`
- `10_content/ARTICLE_WORKFLOW.md`
- 필요 시 `70_ops/DEPLOYMENT.md`

### 배포/도메인/AdSense가 바뀌면

- `70_ops/DEPLOYMENT.md`
- `30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`

### 사이트 로그인 글쓰기를 구현하려면

- 먼저 `ADR-004-github-backed-admin-editor.md`를 확정한다.
- 이후 구현 계획을 별도로 만든다.
- Supabase CMS를 되살리려면 새 ADR이 필요하다.
