# Phase 6 — Content Ops

Status: Partially Implemented / Backlog
Goal: 운영자가 “1주 1편” 루틴을 부담 없이 돌릴 수 있다. 현재 운영 모델은 DB/Admin CMS가 아니라 GitHub-backed MDX + 브라우저 관리자 + commit history다.

## Current model

| 운영 영역 | 현재 상태 | 남은 일 |
| --- | --- | --- |
| 작성/수정 | 브라우저 admin form + in-place edit에서 GitHub commit 저장 | autosave 또는 local draft preservation 검토 |
| 리비전 | Git commit history가 기본 리비전 로그 | UI에서 diff/rollback을 보여주지는 않음 |
| 예약 발행 | `status`, `publishedAt` 기반 public filtering | 자동 deploy/cron 예약은 없음 |
| taxonomy | public route는 frontmatter 기반 free-form slug 지원 | admin taxonomy UI 또는 free-form 입력 UX 보강 필요 |
| SEO metadata | title/description/cover/date 등 기본 필드 입력 가능 | 검색 미리보기, canonical/noindex/OG 자동 생성은 backlog |

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 6.1 | [slice-6.1-autosave.md](./slice-6.1-autosave.md) | Backlog: DB revision table 대신 local draft/Git commit 전략으로 재설계 |
| 6.2 | [slice-6.2-schedule.md](./slice-6.2-schedule.md) | Partial: public filtering은 있음, 자동 예약 deploy는 backlog |
| 6.3 | [slice-6.3-taxonomy-ui.md](./slice-6.3-taxonomy-ui.md) | Partial: frontmatter free-form route는 있음, admin UI는 backlog |
| 6.4 | [slice-6.4-seo-panel.md](./slice-6.4-seo-panel.md) | Partial: 기본 metadata form은 있음, 고급 SEO panel은 backlog |

## Phase Exit Criteria

- GitHub 기반 작성 체크리스트가 있다.
- 모든 발행 글이 글별 고유 SEO 필드 + OG 이미지를 가진다.
- taxonomy 변경은 frontmatter schema와 검증을 통과한다.
- autosave/schedule/taxonomy/SEO 중 실제 운영 병목이 된 항목만 구현한다.
