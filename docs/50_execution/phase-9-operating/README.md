# Phase 9: Operating Loop

Status: Active after first production deploy
Goal: 글 발행, 색인 확인, 분석, 다음 글 개선이 반복되는 운영 루프를 만든다.

## Current Operating Model

- 초안은 `articles/`에 쓴다.
- 발행 후보는 `apps/web/content/posts/<slug>/index.mdx`로 옮긴다.
- 이미지는 최적화해서 `apps/web/public/media/posts/<slug>/`에 둔다.
- 긴 영상은 외부 저장소/동영상 플랫폼을 우선한다.
- commit/push가 발행 트리거다.

## Slices

| #   | File                                                                 | 기준           |
| --- | -------------------------------------------------------------------- | -------------- |
| 9.1 | [slice-9.1-publishing-cadence.md](./slice-9.1-publishing-cadence.md) | 발행 루틴      |
| 9.2 | [slice-9.2-analytics-loop.md](./slice-9.2-analytics-loop.md)         | 분석 기반 개선 |
| 9.3 | [slice-9.3-future-extensions.md](./slice-9.3-future-extensions.md)   | 확장 후보 검토 |

## Weekly Loop

1. `articles/`에서 초안 1-3개 정리
2. 발행할 글 1개를 MDX로 승격
3. 이미지/영상 asset 정리
4. local build/test
5. commit/push
6. Vercel deployment 확인
7. Search Console 색인/쿼리 확인
8. 다음 글 주제 업데이트

## Browser Editor Future

사이트에서 로그인 후 글을 쓰는 기능은 Phase 9 이후 확장 후보로 둔다. 기본 방향은 Supabase CMS가 아니라 `ADR-004`의 GitHub-backed admin editor다.

## Phase Exit Criteria

- 독립 도메인 production 배포가 완료되어 있다.
- Search Console/Naver Search Advisor에 sitemap이 제출되어 있다.
- 최소 10개 이상의 원본 글이 발행되어 있다.
- 이미지/영상 운영 규칙이 지켜지고 있다.
- 브라우저 editor가 정말 필요한지 운영 데이터를 기반으로 판단할 수 있다.
