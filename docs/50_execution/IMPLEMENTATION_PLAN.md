# Implementation Plan - Index

이 문서는 구현 phase의 입구다. 상세 작업은 각 phase 폴더에 둔다.

## 0. 폴더 규칙

- `phase-N-name/README.md`: phase 목표, 상태, 검증 결과
- `slice-N.x-name.md`: 세부 구현 단위
- `source-plans/`: 구현 후 보존하는 원본 계획 산출물
- 완료된 큰 결정은 `60_decisions/ADR-*.md`에 따로 남긴다.

## 1. 현재 구현 상태

| Phase | 상태 | 설명 |
| --- | --- | --- |
| 0. foundations | 완료 | 방향 문서, ADR, 기본 운영 규칙 |
| 1. Next.js skeleton | 완료 | App Router 기반 공개 사이트 뼈대 |
| 2. public read | 완료 | MDX content model, post rendering, taxonomy, RSS/sitemap |
| 3. admin auth | 완료 | admin session과 allowlist 기반 접근 |
| 4. admin CRUD | 완료 | GitHub backed 글 작성/수정 흐름 |
| 5. editor/media | 진행 | rich editor, media/embed/in-place editing 계열 |
| 6. content ops | 계획 | autosave, schedule, taxonomy UI, SEO panel |
| 7. SEO/AdSense | 진행 | 정책 페이지, sitemap/RSS, 광고 준비 |
| 8. launch | 진행 | Vercel, 도메인, 검색 콘솔, AdSense 신청 |
| 9. operating | 계획 | 발행 루틴, analytics loop, future extensions |
| 10. brand redesign | 완료 | AI 시대 생존기 rebrand, free-form taxonomy, clean white home/post UI |

## 2. 최근 완료된 큰 작업

### AI 시대 생존기 rebrand

- 표시 브랜드를 AI 시대 생존기 / AI Survivor로 정리했다.
- 카테고리/태그를 고정 enum이 아닌 frontmatter 기반 free-form 값으로 다룬다.
- route에는 `slugifyTaxonomy()` 결과를 사용한다.
- 관련 결정: `../60_decisions/ADR-005-ai-survivor-brand-and-freeform-taxonomy.md`

### Clean White visual redesign

- homepage에 `HeroCanvas`, category filter, card grid, popular posts, tag cloud를 연결했다.
- post detail은 680px 중심 읽기 폭, cover image, floating TOC를 기준으로 정리했다.
- 관련 결정: `../60_decisions/ADR-006-clean-white-home-and-post-redesign.md`

### Browser writing workflow

- protected `/write`와 in-place edit 흐름을 브라우저 글쓰기의 주 경로로 둔다.
- standalone `public/write-editor.html`은 local draft helper로만 취급한다.

## 3. 의존성 원칙

- 콘텐츠 원본은 MDX 파일이다.
- GitHub commit history를 콘텐츠 변경 로그로 사용한다.
- Vercel은 build/deploy surface다.
- DB/CMS/Storage 의존성은 운영 병목이 실제로 생길 때 다시 결정한다.

## 4. 글로벌 NOT-DO

- 공개 사용자가 임의로 글을 저장하게 하지 않는다.
- 검증되지 않은 LLM 초안을 published로 올리지 않는다.
- 카테고리/태그 route에 raw label을 직접 넣지 않는다.
- 원본 계획 산출물을 root docs에 방치하지 않는다.
