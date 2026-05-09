# Execution Docs

Status: Active
Last Updated: 2026-05-09

이 폴더는 AI Survivor의 실행 상태, 로드맵, 출시 전 점검표, phase별 작업 단위를 보관한다.
현재 구현 판단은 오래된 slice 체크박스가 아니라 아래 문서 순서로 한다.

## 읽는 순서

1. [`IMPLEMENTATION_STATUS_2026-05-09.md`](./IMPLEMENTATION_STATUS_2026-05-09.md) — 현재 코드 기준 구현 상태
2. [`EXECUTION_STATUS.md`](./EXECUTION_STATUS.md) — phase별 진행 현황과 다음 작업
3. [`ROADMAP.md`](./ROADMAP.md) — 앞으로 남은 실행 순서
4. [`PRE_LAUNCH_DEV_CHECKLIST.md`](./PRE_LAUNCH_DEV_CHECKLIST.md) — 도메인/검색/AdSense 전 점검
5. [`SIMILAR_SERVICE_STARTER.md`](./SIMILAR_SERVICE_STARTER.md) — 이 구현을 복제해 비슷한 서비스를 만들 때의 절차

## 폴더 규칙

- `phase-*/README.md`: 현재 기준 phase 요약과 남은 일.
- `phase-*/slice-*.md`: 세부 작업 단위. 일부는 과거 계획이므로 README와 상태 문서를 우선한다.
- `source-plans/`, `_design/`, `_archive-*`: 구현 근거/과거 계획 보관용. 진행률 산정에는 포함하지 않는다.

## 현재 active path

- Active app: `apps/web/`
- Content: `apps/web/content/posts/<slug>/index.mdx`
- Admin/write: GitHub OAuth owner session + GitHub Contents API
- Media v1: 4MB 이하 image/audio/document를 post assets에 커밋, 큰 파일은 외부 저장소로 분리
- Not active: Supabase/Auth.js/DB CMS, large media object storage runtime
