# Phase 6 — Content Ops

Status: Needs Rewrite for ADR-003
Goal: 운영자가 “1주 1편” 루틴을 부담 없이 돌릴 수 있다. 현재는 DB/Admin 기능 대신 GitHub issue/PR/checklist 기반 운영으로 재작성해야 한다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 6.1 | [slice-6.1-autosave.md](./slice-6.1-autosave.md) | 보류: GitHub history/PR draft로 대체 검토 |
| 6.2 | [slice-6.2-schedule.md](./slice-6.2-schedule.md) | 보류: 예약 발행은 GitHub Actions/Vercel deploy 예약으로 재검토 |
| 6.3 | [slice-6.3-taxonomy-ui.md](./slice-6.3-taxonomy-ui.md) | 보류: taxonomy는 frontmatter + lint로 관리 |
| 6.4 | [slice-6.4-seo-panel.md](./slice-6.4-seo-panel.md) | 보류: SEO는 frontmatter schema/checklist로 관리 |

## Phase Exit Criteria

- GitHub 기반 작성 체크리스트가 있다.
- 모든 발행 글이 글별 고유 SEO 필드 + OG 이미지를 가진다.
- taxonomy 변경은 frontmatter schema와 검증을 통과한다.
