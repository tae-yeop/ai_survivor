# Phase 5 — MDX Components & Rich Editor

Status: Active (reactivated by ADR-004)
Goal: 사이트 안에서 게시판급 글쓰기 경험을 갖춘다 — 이미지 paste/D&D + 정렬/크기, YouTube/X/Spotify/Notion/CodePen/Gist/GitHubRepo/Vimeo/일반 OG 카드 자동 임베드, mp4 비디오 업로드(R2), 공개 페이지에서 바로 편집(in-place).

> **재가동 근거**: ADR-004 GitHub-backed Admin Editor의 Phase C/D 실행. 본 Phase 의 설계는 [_design/2026-05-07-rich-editor-overhaul.md](./_design/2026-05-07-rich-editor-overhaul.md) 에 정리되어 있다. ADR-002 기반 historical slice (Tiptap + Supabase Storage) 는 `_archive-adr-002/` 에 보관 — 본 Phase 는 GitHub + R2 경로로 다시 작성됐다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 5.1 | [slice-5.1-rich-editor-core.md](./slice-5.1-rich-editor-core.md) | 풀 툴바·슬래시·표·정렬·색상 (RichEditor 모듈 분할, foundation) |
| 5.2 | [slice-5.2-image-pipeline.md](./slice-5.2-image-pipeline.md) | 이미지 paste/D&D + 리사이즈/정렬 (Figure NodeView + GitHub 업로드) |
| 5.3 | [slice-5.3-video-r2-pipeline.md](./slice-5.3-video-r2-pipeline.md) | mp4/webm/mov 업로드 → Cloudflare R2 (`<Video>` 컴포넌트) |
| 5.4 | [slice-5.4-embed-pack.md](./slice-5.4-embed-pack.md) | YouTube/Vimeo/X/CodePen/Gist/Spotify/Notion/GitHubRepo + OG 카드 |
| 5.5 | [slice-5.5-inplace-editing.md](./slice-5.5-inplace-editing.md) | 공개 페이지 Edit 토글 (sha 충돌 가드, env flag) |
| 5.6 | [slice-5.6-callout-and-polish.md](./slice-5.6-callout-and-polish.md) | Callout + 키보드 모달 + Toast + 다크모드/a11y 스윕 |

## Design Doc

- [_design/2026-05-07-rich-editor-overhaul.md](./_design/2026-05-07-rich-editor-overhaul.md) — spec (결정 컨텍스트 / 아키텍처 / 12 컴포넌트 카탈로그 / 엣지 케이스 / 테스트)

## 의존성

```
5.1 (foundation) ──▶ 5.2 ──▶ 5.5 ──▶ 5.6
              ╲                     ╱
               ▶ 5.3 ───────────────┤
              ╲                     ╲
               ▶ 5.4 ──────────────▶ 5.6
```

- 5.1 은 모든 후속의 필수 선행.
- 5.2 / 5.3 / 5.4 는 서로 독립이라 순서 자유 (1인 작업이라 사실상 순차).
- 5.5 는 5.1 만 있어도 가능하지만 5.2-5.4 끝낸 뒤 들어가는 게 만족도 큼.
- 5.6 은 1-5 가 모두 끝난 뒤.

## ADR-004 Open Questions 답변

| Open Question | 본 Phase 결정 |
|---|---|
| 로그인 provider | 기존 GitHub OAuth 유지 (이미 구현됨) |
| 커밋 브랜치 | master 직접 (현행 유지). 보호가 필요해지면 추후 별 ADR |
| 미디어 store | 이미지 = GitHub repo (현행). 비디오 = Cloudflare R2. 외부 이미지 URL = paste만으로 그대로 |
| 에디터 plain vs rich | Tiptap rich (현행 확장). NodeView + 커스텀 paste plugin |

## Reactivation Criteria

이 Phase 는 이미 reactivated. 기존 historical slice 의 reactivation criteria 는 본 Phase 가 ADR-002 경로로 회귀하는 결정을 내릴 때만 의미가 있다 — 그럴 일이 발생하면 새 ADR 필수.

> Retro: (Phase 종료 후 한 줄)
