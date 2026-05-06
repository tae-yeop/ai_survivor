# Docs README

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

이 문서 공간은 **AI Vibe Lab**을 바이브코딩으로 만들 때, 사람과 LLM이 같은 기준을 보고 작업하기 위한 최소 문서 세트다.

현재 구현 방향은 `ADR-003`에 따라 **Next.js + GitHub + MDX + Vercel 기반 공개 블로그**다. `ADR-002`의 Supabase + Tiptap 비공개 관리자 CMS는 보류하며, 공개 글을 SEO 친화적인 HTML로 제공한다는 원칙만 유지한다.

목표는 문서를 많이 만드는 것이 아니라 아래를 만족하는 것이다.

- 어떤 문서가 무엇의 source of truth인지 명확하다.
- 블로그 구조, 콘텐츠 방향, SEO/수익화 기준, 관리자 CMS 기준이 섞이지 않는다.
- LLM이 임의로 IA, URL, 콘텐츠 모델, SEO 정책, 권한 정책을 바꾸지 않는다.
- 구현 변경이 생겼을 때 어떤 문서를 갱신해야 하는지 알 수 있다.

---

## 0. 현재 운영 범위

```text
/
├─ CLAUDE.md
└─ docs/
   ├─ README.md
   ├─ 00_overview/
   │  ├─ PRODUCT_BRIEF.md
   │  └─ OPEN_QUESTIONS.md
   ├─ 10_content/
   │  ├─ CONTENT_STRATEGY.md
   │  ├─ CONTENT_MODEL.md
   │  └─ ARTICLE_TEMPLATE.md
   ├─ 20_site/
   │  ├─ SERVICE_IA.md
   │  └─ SCREEN_INVENTORY.md
   ├─ 20_features/
   │  ├─ admin-cms.md       # 보류: ADR-002 admin CMS
   │  └─ media-library.md   # 보류: ADR-002 storage/media library
   ├─ 30_seo_monetization/
   │  └─ SEO_ADSENSE_CHECKLIST.md
   ├─ 40_architecture/
   │  ├─ ARCHITECTURE.md
   │  └─ AUTH_AND_PERMISSIONS.md
   ├─ 50_execution/
   │  ├─ ROADMAP.md
   │  ├─ IMPLEMENTATION_PLAN.md
   │  └─ phase-*/
   ├─ 60_decisions/
   │  ├─ ADR-001-static-content-first-blog.md
   │  ├─ ADR-002-nextjs-supabase-admin-cms.md
   │  └─ ADR-003-github-mdx-content-workflow.md
   └─ 70_ops/
      └─ DEPLOYMENT.md
```

---

## 1. 문서별 책임

| 문서                                           | 역할                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| `00_overview/PRODUCT_BRIEF.md`                 | 블로그의 목적, 독자, 범위, 수익화 방향              |
| `00_overview/OPEN_QUESTIONS.md`                | 아직 결정되지 않은 질문                             |
| `10_content/CONTENT_STRATEGY.md`               | 카테고리, 시리즈, 글의 품질 기준                    |
| `10_content/CONTENT_MODEL.md`                  | 글 metadata/frontmatter와 MDX content tree 기준     |
| `10_content/ARTICLE_TEMPLATE.md`               | 실제 글 작성 템플릿                                 |
| `20_site/SERVICE_IA.md`                        | 공개 메뉴, URL, 정보구조                            |
| `20_site/SCREEN_INVENTORY.md`                  | 공개 화면별 목적, 데이터, 액션, 상태                |
| `20_features/admin-cms.md`                     | 보류된 관리자 CMS 기능, route, 글 상태              |
| `20_features/media-library.md`                 | 보류된 이미지 업로드, metadata, storage 정책        |
| `30_seo_monetization/SEO_ADSENSE_CHECKLIST.md` | SEO, AdSense, 정책 페이지, 광고 슬롯 기준           |
| `40_architecture/ARCHITECTURE.md`              | 기술 스택, 폴더 구조, 렌더링 원칙                   |
| `40_architecture/AUTH_AND_PERMISSIONS.md`      | 보류된 로그인, 관리자 권한, RLS 정책                |
| `50_execution/ROADMAP.md`                      | 상위 구현 마일스톤                                  |
| `50_execution/IMPLEMENTATION_PLAN.md`          | Phase/Slice 단위 실행 인덱스                        |
| `60_decisions/ADR-*.md`                        | 되돌리기 어려운 설계 결정                           |
| `70_ops/DEPLOYMENT.md`                         | Vercel, GitHub, 도메인, 검색엔진, AdSense 운영 설정 |
| `CLAUDE.md`                                    | LLM/바이브코딩 작업 규칙                            |

---

## 2. Source of Truth 규칙

| 주제                                          | Source of Truth                                   |
| --------------------------------------------- | ------------------------------------------------- |
| 블로그 목적 / 독자 / MVP 범위                 | `PRODUCT_BRIEF.md`                                |
| 브랜드명 / 도메인 / 앱 디렉토리 / 콘텐츠 원본 | `ADR-003-github-mdx-content-workflow.md`          |
| 콘텐츠 카테고리 / 글 품질 기준                | `CONTENT_STRATEGY.md`                             |
| 글 데이터 구조 / metadata                     | `CONTENT_MODEL.md`                                |
| 글 작성 포맷                                  | `ARTICLE_TEMPLATE.md`                             |
| 공개 메뉴 / URL / 페이지 구조                 | `SERVICE_IA.md`                                   |
| 공개 페이지별 기능과 상태                     | `SCREEN_INVENTORY.md`                             |
| 관리자 CMS 기능                               | 보류: `admin-cms.md`                              |
| 이미지 업로드 / media metadata                | 보류: `media-library.md`; MVP는 post-local assets |
| SEO / AdSense / 정책 페이지                   | `SEO_ADSENSE_CHECKLIST.md`                        |
| 기술 스택 / 렌더링 방식 / 디렉토리 전략       | `ARCHITECTURE.md`                                 |
| 인증 / 권한 / RLS                             | 보류: `AUTH_AND_PERMISSIONS.md`                   |
| 배포 / 환경변수 / 도메인 연결                 | `DEPLOYMENT.md`                                   |
| 구현 순서                                     | `IMPLEMENTATION_PLAN.md`                          |
| 큰 기술 결정                                  | `ADR-*.md`                                        |

---

## 3. 변경 관리 규칙

### 신규 공개 페이지가 생기면

- `SERVICE_IA.md`
- `SCREEN_INVENTORY.md`
- 필요 시 `ARCHITECTURE.md`

### 신규 관리자 기능이 생기면

- `admin-cms.md`
- `AUTH_AND_PERMISSIONS.md`
- 필요 시 `SCREEN_INVENTORY.md`

### 새 글 타입이나 metadata 필드가 생기면

- `CONTENT_STRATEGY.md`
- `CONTENT_MODEL.md`
- `ARTICLE_TEMPLATE.md`

### 이미지/파일 정책이 바뀌면

- `media-library.md`
- `AUTH_AND_PERMISSIONS.md`
- 필요 시 `DEPLOYMENT.md`

### SEO/광고 관련 변경이 생기면

- `SEO_ADSENSE_CHECKLIST.md`
- 필요 시 `SCREEN_INVENTORY.md`
- 필요 시 `ARCHITECTURE.md`

### URL 구조가 바뀌면

- `SERVICE_IA.md`
- `CONTENT_MODEL.md`
- 필요 시 `ADR` 추가

### 큰 기술 스택 결정이 바뀌면

- `ARCHITECTURE.md`
- `ADR` 추가

---

## 4. LLM 작업 순서

LLM은 아래 순서로 문서를 읽고 작업한다.

1. `CLAUDE.md`
2. `docs/README.md`
3. `docs/60_decisions/ADR-003-github-mdx-content-workflow.md`
4. `docs/40_architecture/ARCHITECTURE.md`
5. `docs/00_overview/PRODUCT_BRIEF.md`
6. `docs/00_overview/OPEN_QUESTIONS.md`
7. `docs/10_content/CONTENT_STRATEGY.md`
8. `docs/10_content/CONTENT_MODEL.md`
9. `docs/20_site/SERVICE_IA.md`
10. `docs/20_site/SCREEN_INVENTORY.md`
11. `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
12. `docs/70_ops/DEPLOYMENT.md`
13. `docs/50_execution/IMPLEMENTATION_PLAN.md`

Deferred/historical references only: `ADR-002-nextjs-supabase-admin-cms.md`, `AUTH_AND_PERMISSIONS.md`, `20_features/admin-cms.md`, and `20_features/media-library.md`. Do not read these as active implementation inputs unless a new ADR reactivates the browser CMS path.

---

## 5. 운영 원칙

- 블로그는 콘텐츠가 제품이다.
- 예쁜 UI보다 읽기 쉬운 글, 빠른 로딩, 명확한 URL, 좋은 내부 링크가 우선이다.
- 공개 콘텐츠 페이지는 검색엔진과 사용자가 읽을 수 있는 서버 렌더링 HTML을 우선한다.
- AI가 만든 일반론 글보다 운영자가 직접 실험한 글을 우선한다.
- 광고는 본문 경험을 해치지 않는 범위에서만 배치한다.
- 관리자 CMS는 운영 효율을 위한 도구이며, 공개 사용자 기능이 아니다.
- 문서가 구현을 방해할 정도로 커지면 줄인다.
