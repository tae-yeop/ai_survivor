# CLAUDE.md

이 파일은 Claude Code 및 다른 LLM 코딩 에이전트가 이 저장소에서 작업할 때 따라야 하는 **공유 운영 계약**이다. Claude 전용 문서가 아니라, Codex/Claude/기타 에이전트가 모두 따라야 하는 프로젝트 규칙이다.

문서 체계와 상세 구현 근거는 `docs/` 아래에 있고, 이 파일은 그 위의 최소 실행 규약이다.

---

## 1. 프로젝트 요약

- 이름: AI Survivor / AI Vibe Lab
- 목적: AI 도구, 바이브코딩, 업무 자동화, 시행착오와 결과물을 실제 사용 관점에서 기록하는 한국어 콘텐츠 서비스
- 기본 언어: 사용자-facing 문서와 요약은 **한국어**를 기본으로 한다.
- 현재 active app: `apps/web/`
- 현재 active architecture: **Next.js App Router + Git-backed MDX + GitHub OAuth admin + GitHub Contents API + Vercel**
- legacy/reference surface: 루트 `src/`의 Astro 앱은 전환/참고용이다. 특별한 지시가 없으면 새 기능은 `apps/web/` 기준으로 작업한다.

핵심 원칙: public read path는 단순하고 SEO 친화적으로 유지하고, admin/editor 복잡도는 public rendering과 분리한다.

---

## 2. 최상위 원칙

1. **docs가 source of truth다.** 코드가 문서를 앞서가면 안 된다. 동작, IA, 데이터 모델, 인증, 배포, 작성 흐름이 바뀌면 관련 `docs/`를 먼저 또는 같은 변경 안에서 갱신한다.
2. **현재 구현 지도는 반드시 유지한다.** `docs/40_architecture/HOW_IT_WORKS.md`는 이 프로젝트가 어떻게 구현되어 있는지 설명하는 핵심 문서다. 구조·흐름·환경변수·배포·admin/write path가 바뀌면 반드시 갱신한다.
3. **유사 서비스 스타터 관점을 유지한다.** 이 저장소는 나중에 비슷한 콘텐츠 서비스를 빠르게 만들기 위한 레퍼런스이기도 하다. 재사용 가능한 패턴, 복제 순서, 주의점이 바뀌면 `docs/50_execution/SIMILAR_SERVICE_STARTER.md`를 갱신한다.
4. **현재 상태 문서를 stale하게 두지 않는다.** 구현 완료/보류/비활성 경계가 바뀌면 `docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md` 또는 그 날짜를 잇는 새 status 문서를 갱신한다.
5. **임의 확정 금지.** 문서가 비어 있거나 충돌하면 추측으로 결정하지 않는다. 작은 구현 세부사항은 합리적으로 처리하되, 제품/아키텍처/보안/배포 결정은 ADR 또는 execution 문서로 남긴다.
6. **범위는 문자 그대로 해석한다.** 요청받은 작업에 필요한 파일만 수정한다. 인접 리팩터링, 디자인 변경, dependency 추가, route 변경은 요청 또는 명확한 필요가 없으면 하지 않는다.
7. **검증 없는 완료 보고 금지.** 코드 변경은 가능한 가장 작은 검증부터 실행하고, 위험도가 커질수록 test/typecheck/lint/build/smoke를 넓힌다. 문서 변경은 링크, 파일 존재, diff sanity를 확인한다.

---

## 3. 작업 시작 전 읽기 순서

저장소 작업을 시작할 때는 요청 범위에 맞춰 아래 문서를 읽는다. 모든 파일을 매번 깊게 읽을 필요는 없지만, 관련 source of truth는 반드시 확인한다.

1. `docs/README.md`
2. `docs/40_architecture/HOW_IT_WORKS.md`
3. `docs/50_execution/SIMILAR_SERVICE_STARTER.md`
4. `docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md`
5. `docs/40_architecture/ARCHITECTURE.md`
6. `docs/10_content/CONTENT_MODEL.md`
7. `docs/20_features/github-backed-admin-editor.md`
8. `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
9. `docs/70_ops/DEPLOYMENT.md`
10. 관련 ADR: `docs/60_decisions/ADR-*.md`
11. 관련 phase/task 문서: `docs/50_execution/**`

문서와 코드가 충돌하면 현재 코드 근거를 확인한 뒤, 충돌을 문서에 명시하거나 문서를 갱신한다. 오래된 Supabase/Admin CMS 계획 문서는 현재 active path가 아니다.

---

## 4. 현재 구현 경계

### 4-1. Active path

- Next.js 앱: `apps/web/`
- 글 저장 위치: `apps/web/content/posts/<slug>/index.mdx`
- 글 asset 위치: `apps/web/content/posts/<slug>/assets/*`
- public routes: `apps/web/app/(public)/**`
- admin routes: `apps/web/app/(admin)/**`
- admin API: `apps/web/app/api/admin/**`
- content loader: `apps/web/src/lib/content/posts.ts`
- admin auth/session/write: `apps/web/src/lib/admin/**`
- rich editor: `apps/web/src/components/admin/RichEditor/**`
- SEO outputs: `apps/web/app/sitemap.ts`, `robots.ts`, `rss.xml/route.ts`, `ads.txt/route.ts`

### 4-2. Non-active / deferred path

- Supabase Auth/Postgres/Storage는 현재 active path가 아니다.
- DB 기반 CMS는 현재 active path가 아니다.
- 대용량 media object storage는 `R2_*` placeholder만 있고 active upload path가 아니다.
- 루트 Astro 앱은 참고/전환용이다. 새 제품 기능의 기본 대상이 아니다.

### 4-3. Public content rules

- 공개 글은 `status: published`이고 `publishedAt <= today`여야 한다.
- `draft`, `scheduled`, `archived`는 public list/detail/taxonomy/RSS/sitemap에 노출하지 않는다.
- frontmatter slug와 folder slug가 다르면 실패해야 한다.
- unsafe MDX body(`script`, inline handler, `javascript:` URL 등)는 거부한다.
- taxonomy slug collision은 production에서 실패해야 한다.

---

## 5. 문서화 의무

코드 또는 제품 동작을 바꿀 때 아래 기준으로 문서를 함께 갱신한다.

### 5-1. 항상 갱신 후보인 문서

| 변경 종류 | 갱신 문서 |
| --- | --- |
| 구현 구조, 데이터 흐름, route/API, admin/write path, env, 배포 흐름 변경 | `docs/40_architecture/HOW_IT_WORKS.md` |
| 비슷한 서비스로 복제하는 순서나 핵심 추출물이 바뀜 | `docs/50_execution/SIMILAR_SERVICE_STARTER.md` |
| 구현 완료/보류/미활성 상태 변경 | `docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md` 또는 새 status 문서 |
| content frontmatter, post 위치, media 규칙 변경 | `docs/10_content/CONTENT_MODEL.md` |
| public IA, navigation, 화면 목록 변경 | `docs/20_site/SERVICE_IA.md`, `docs/20_site/SCREEN_INVENTORY.md` |
| admin/editor 기능 변경 | `docs/20_features/github-backed-admin-editor.md` |
| auth/session/권한/secrets 변경 | `docs/40_architecture/AUTH_AND_PERMISSIONS.md`, `docs/40_architecture/HOW_IT_WORKS.md` |
| SEO, RSS, sitemap, robots, ads 변경 | `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`, `docs/40_architecture/HOW_IT_WORKS.md` |
| Vercel/env/domain/deploy 변경 | `docs/70_ops/DEPLOYMENT.md` |
| 되돌리기 어려운 기술 선택 변경 | `docs/60_decisions/ADR-*.md` |

### 5-2. 문서 작성 품질

- “무엇을 만들었는지”만 쓰지 말고 “왜 이 구조인지, 어디를 바꾸면 되는지, 유사 서비스에서 무엇을 가져갈지”를 쓴다.
- 파일 경로와 route 경로를 구체적으로 적는다.
- active/deferred/legacy 경계를 분명히 쓴다.
- 환경변수는 public/secret 여부와 용도를 함께 적는다.
- 문서가 오래된 계획이면 상단에 현재 구현과의 차이를 명시한다.
- 문서 변경 후 주요 상대 링크가 실제로 존재하는지 확인한다.

---

## 6. 기본 작업 루프: Plan -> Implement -> Verify -> Document

모든 실질 작업은 아래 루프를 따른다.

### 6-1. Plan

- 근거 문서: 어떤 docs/ADR/phase 문서를 기준으로 하는지 명시한다.
- 범위: 수정할 영역과 건드리지 않을 영역을 정한다.
- 가정: 문서에 없는 가정은 작게 유지하고, 큰 가정은 문서/ADR 후보로 남긴다.
- 검증 계획: 완료를 증명할 테스트/명령/문서 확인을 미리 정한다.

### 6-2. Implement

- 기존 패턴을 우선한다.
- 새 dependency는 명시 요청 또는 강한 근거가 있을 때만 추가한다.
- public read path를 복잡하게 만들지 않는다.
- admin/editor 기능은 public rendering과 분리한다.
- secrets는 절대 client/public bundle로 보내지 않는다.
- GitHub write path는 owner session 검증을 통과해야 한다.

### 6-3. Verify

코드 변경 시 `apps/web` 기준으로 필요한 하위 집합을 실행한다.

```bash
cd apps/web
npm run test
npm run format
npm run lint
npm run typecheck
npm run build
```

작은 변경은 관련 테스트/타입체크부터 실행하고, release 또는 아키텍처 영향이 있으면 build까지 간다.

문서만 변경한 경우 최소 검증:

- 변경 파일 diff 확인
- 새 문서 파일 존재 확인
- 주요 상대 링크 존재 확인
- `git diff --check`

### 6-4. Document

- 구현이 문서 source of truth를 바꾸면 같은 작업에서 문서를 갱신한다.
- 작업 완료 보고에는 변경 파일, 검증 명령, 남은 위험을 포함한다.
- 실행 계획 문서의 체크박스가 있는 작업을 완료했다면 즉시 `[ ]` -> `[x]`로 갱신한다.

---

## 7. 코드 주석 규약 — 문서 근거 표시

비자명한 기능 구현에는 근거 문서를 짧게 남긴다. 모든 boilerplate에 달 필요는 없지만, public 노출 조건, auth/write guard, SEO output, content validation, media upload, conflict handling 같은 정책성 로직에는 권장한다.

형식:

```ts
// @doc docs/40_architecture/HOW_IT_WORKS.md#5-글쓰기--관리자-흐름
//   Owner-only GitHub write path. Public rendering must not depend on admin secrets.
```

사용 가능한 태그:

- `@doc` 제품/구현 문서 근거
- `@adr` 아키텍처 결정 근거
- `@content` content model 근거
- `@seo` SEO/monetization 근거
- `@ops` 배포/운영 근거

주석은 문서 원문을 복붙하지 말고, 코드가 어떤 규칙을 구현하는지만 짧게 쓴다.

---

## 8. 금지 사항

- 문서에 없는 주요 route/menu/IA를 임의로 추가하지 않는다.
- 공개 글 상세를 client-only SPA 렌더링으로 바꾸지 않는다.
- `draft`, `scheduled`, `archived`를 public RSS/sitemap/list에 노출하지 않는다.
- `/admin` 링크를 public nav/footer/sitemap/RSS에 넣지 않는다.
- owner 검증 없이 `/api/admin/*` mutation을 허용하지 않는다.
- `GITHUB_CONTENT_TOKEN`, `GITHUB_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`을 `NEXT_PUBLIC_*`로 만들지 않는다.
- ADR 없이 Supabase/Auth.js/DB CMS 등 큰 스택을 재도입하지 않는다.
- 대용량 영상/원본 파일을 GitHub content tree에 무작정 커밋하지 않는다.
- 문서만 요청받은 작업에서 앱 코드까지 수정하지 않는다.
- 구현 완료 후 docs/50_execution 체크박스나 상태 문서를 stale하게 두지 않는다.

---

## 9. 사용자 요청 모드 해석

- “문서화”, “정리”, “가이드”, “비슷한 서비스 만들 때” 요청은 기본적으로 `docs/` 산출물이 핵심이다. 코드 변경은 필요한 근거 수집 외에는 하지 않는다.
- “검토”, “리뷰”, “분석” 요청은 read-mostly로 수행한다. 명시적으로 고치라고 하지 않으면 코드 변경하지 않는다.
- “구현”, “수정”, “고쳐”, “빌드”, “ship” 요청은 Plan -> Implement -> Verify -> Document 루프를 따른다.
- 범위가 모호하지만 위험이 낮은 문서/로컬 변경은 합리적으로 진행한다. 보안/배포/외부 production/파괴적 변경은 사용자 확인 없이 진행하지 않는다.

---

## 10. 완료 보고 형식

완료 보고에는 짧게 아래를 포함한다.

- 변경한 파일
- 핵심 변경 내용
- 실행한 검증 명령과 결과
- 실행하지 못한 검증이 있으면 이유
- 남은 위험 또는 다음 작업

문서 변경만 한 경우에도 “문서만 변경, 앱 테스트/빌드 미실행”처럼 범위를 명확히 쓴다.
