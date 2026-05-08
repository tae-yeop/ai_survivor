# AI 시대 생존기 Docs

이 폴더는 블로그의 제품 방향, 콘텐츠 운영, 사이트 구조, 실행 계획, 의사결정, 배포 운영 문서를 보관한다.

현재 표시 브랜드는 **AI 시대 생존기 / AI Survivor**다. 운영 도메인은 코드 기본값 기준 `aivibelab.com`이며, 브랜드와 도메인은 분리해서 관리한다.

## 문서 지도

| 폴더 | 역할 | 대표 문서 |
| --- | --- | --- |
| `00_overview/` | 제품 목적, 브랜드, 열려 있는 질문 | `PRODUCT_BRIEF.md`, `BRAND_OVERVIEW.md`, `OPEN_QUESTIONS.md` |
| `10_content/` | 글 저장 방식, 글쓰기 흐름, 콘텐츠 전략 | `CONTENT_MODEL.md`, `CONTENT_STRATEGY.md`, `ARTICLE_TEMPLATE.md`, `ARTICLE_WORKFLOW.md` |
| `20_features/` | 기능별 사용자/운영 설명 | admin CMS, GitHub backed editor, media library |
| `20_site/` | 화면 목록과 정보 구조 | `SCREEN_INVENTORY.md`, `SERVICE_IA.md` |
| `30_seo_monetization/` | 검색/광고 준비 | `SEO_ADSENSE_CHECKLIST.md` |
| `40_architecture/` | 시스템 구조와 권한 모델 | `ARCHITECTURE.md`, `AUTH_AND_PERMISSIONS.md` |
| `50_execution/` | 구현 단계, 로드맵, 실행 산출물 | `IMPLEMENTATION_PLAN.md`, `ROADMAP.md`, phase folders |
| `60_decisions/` | ADR과 디자인 결정 기록 | `ADR-*.md`, `design-notes/` |
| `70_ops/` | 배포와 운영 절차 | `DEPLOYMENT.md` |

## 현재 기준 문서

1. 제품/브랜드를 바꾸면 `00_overview/PRODUCT_BRIEF.md`와 `00_overview/BRAND_OVERVIEW.md`를 먼저 수정한다.
2. 글의 카테고리, 태그, frontmatter, 저장 위치를 바꾸면 `10_content/CONTENT_MODEL.md`를 수정한다.
3. 글쓰기 방식이나 운영 루틴을 바꾸면 `10_content/ARTICLE_WORKFLOW.md`와 `10_content/CONTENT_STRATEGY.md`를 수정한다.
4. 구현 순서나 완료 상태를 바꾸면 `50_execution/IMPLEMENTATION_PLAN.md`와 `50_execution/ROADMAP.md`를 수정한다.
5. 되돌리기 어려운 기술/제품 결정을 내리면 `60_decisions/ADR-*.md`를 추가한다.
6. 배포, 도메인, 환경 변수, Vercel 설정이 바뀌면 `70_ops/DEPLOYMENT.md`를 수정한다.

## 원본 산출물 보관 규칙

- ChatGPT 대화 export 같은 원본 전략 자료는 `00_overview/source-notes/`에 둔다.
- Superpowers 계획/스펙처럼 구현을 도운 원본 산출물은 다음처럼 나눈다.
  - 실행 계획: `50_execution/**/source-plans/`
  - 디자인/결정 근거: `60_decisions/design-notes/`
- 운영자가 읽는 문서는 원본 산출물을 직접 읽지 않아도 이해되도록 요약 문서를 별도로 둔다.

## LLM 작업 순서

1. `docs/README.md`로 문서 위치를 확인한다.
2. 관련 source of truth 문서를 읽는다.
3. 코드 변경 전, 필요한 ADR 또는 execution note가 있는지 확인한다.
4. 코드 변경 후, 문서의 완료 상태와 링크를 갱신한다.
5. 오래된 root-level 임시 문서는 `source-notes/`, `source-plans/`, `design-notes/` 중 하나로 이동한다.
