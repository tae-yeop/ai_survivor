# Docs README

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

이 문서 공간은 **AI 시대 기술 실험 블로그**를 바이브코딩으로 만들 때, 사람과 LLM이 같은 기준을 보고 작업하기 위한 최소 문서 세트다.

목표는 문서를 많이 만드는 것이 아니라 아래를 만족하는 것이다.

- 어떤 문서가 무엇의 source of truth인지 명확하다.
- 블로그 구조, 콘텐츠 방향, SEO/수익화 기준이 섞이지 않는다.
- LLM이 임의로 IA, URL, 콘텐츠 모델, SEO 정책을 바꾸지 않는다.
- 구현 변경이 생겼을 때 어떤 문서를 갱신해야 하는지 알 수 있다.

---

## 0. 현재 운영 범위

이 블로그는 일반 웹서비스보다 문서가 가벼워야 한다. 따라서 초기에는 아래 문서만 관리한다.

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
   ├─ 30_seo_monetization/
   │  └─ SEO_ADSENSE_CHECKLIST.md
   ├─ 40_architecture/
   │  └─ ARCHITECTURE.md
   ├─ 50_execution/
   │  └─ ROADMAP.md
   └─ 60_decisions/
      └─ ADR-001-static-content-first-blog.md
```

---

## 1. 문서별 책임

| 문서 | 역할 |
|---|---|
| `00_overview/PRODUCT_BRIEF.md` | 블로그의 목적, 독자, 범위, 수익화 방향 |
| `00_overview/OPEN_QUESTIONS.md` | 아직 결정되지 않은 질문 |
| `10_content/CONTENT_STRATEGY.md` | 카테고리, 시리즈, 글의 품질 기준 |
| `10_content/CONTENT_MODEL.md` | 글 frontmatter, 태그, slug, 메타데이터 구조 |
| `10_content/ARTICLE_TEMPLATE.md` | 실제 글 작성 템플릿 |
| `20_site/SERVICE_IA.md` | 메뉴, URL, 정보구조 |
| `20_site/SCREEN_INVENTORY.md` | 화면별 목적, 데이터, 액션, 상태 |
| `30_seo_monetization/SEO_ADSENSE_CHECKLIST.md` | SEO, 애드센스, 정책 페이지, 광고 슬롯 기준 |
| `40_architecture/ARCHITECTURE.md` | 기술 스택, 폴더 구조, 렌더링 원칙 |
| `50_execution/ROADMAP.md` | 구현 순서와 런칭 단계 |
| `60_decisions/ADR-*.md` | 되돌리기 어려운 설계 결정 |
| `CLAUDE.md` | LLM/바이브코딩 작업 규칙 |

---

## 2. Source of Truth 규칙

| 주제 | Source of Truth |
|---|---|
| 블로그 목적 / 독자 / MVP 범위 | `PRODUCT_BRIEF.md` |
| 콘텐츠 카테고리 / 글 품질 기준 | `CONTENT_STRATEGY.md` |
| 글 데이터 구조 / frontmatter | `CONTENT_MODEL.md` |
| 글 작성 포맷 | `ARTICLE_TEMPLATE.md` |
| 메뉴 / URL / 페이지 구조 | `SERVICE_IA.md` |
| 페이지별 기능과 상태 | `SCREEN_INVENTORY.md` |
| SEO / AdSense / 정책 페이지 | `SEO_ADSENSE_CHECKLIST.md` |
| 기술 스택 / 렌더링 방식 | `ARCHITECTURE.md` |
| 구현 순서 | `ROADMAP.md` |
| 큰 기술 결정 | `ADR-*.md` |

---

## 3. 변경 관리 규칙

### 신규 페이지가 생기면

- `SERVICE_IA.md`
- `SCREEN_INVENTORY.md`
- 필요 시 `ARCHITECTURE.md`

### 새 글 타입이 생기면

- `CONTENT_STRATEGY.md`
- `CONTENT_MODEL.md`
- `ARTICLE_TEMPLATE.md`

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
3. `00_overview/PRODUCT_BRIEF.md`
4. `10_content/CONTENT_STRATEGY.md`
5. `10_content/CONTENT_MODEL.md`
6. `20_site/SERVICE_IA.md`
7. `20_site/SCREEN_INVENTORY.md`
8. `30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
9. `40_architecture/ARCHITECTURE.md`
10. `50_execution/ROADMAP.md`

---

## 5. 운영 원칙

- 블로그는 콘텐츠가 제품이다.
- 예쁜 UI보다 읽기 쉬운 글, 빠른 로딩, 명확한 URL, 좋은 내부 링크가 우선이다.
- 콘텐츠 페이지는 검색엔진과 사용자가 읽을 수 있는 정적 HTML을 우선한다.
- AI가 만든 일반론 글보다 운영자가 직접 실험한 글을 우선한다.
- 광고는 본문 경험을 해치지 않는 범위에서만 배치한다.
- 문서가 구현을 방해할 정도로 커지면 줄인다.
