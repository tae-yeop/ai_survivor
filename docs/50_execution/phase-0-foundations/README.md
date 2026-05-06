# Phase 0 — Decision Lock & Doc Foundations

Status: In Progress
Goal: 기술 피벗을 문서로 고정하고, 이후 Slice들이 의존할 결정값을 박는다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 0.1 | [slice-0.1-adr-and-docs.md](./slice-0.1-adr-and-docs.md) | Completed — ADR-002 작성 후 ADR-003로 현재 MVP 경로 갱신 |
| 0.2 | [slice-0.2-environment-locks.md](./slice-0.2-environment-locks.md) | In Progress — 이름·도메인·Next.js·GitHub/MDX 전략 동결 |

## Phase Exit Criteria

- 새 LLM 세션이 ADR-003 + 실행 계획만 읽어도 GitHub/MDX 경로를 이해할 수 있다.
- `.env.example`에는 Supabase 필수 키가 남아 있지 않거나, 보류 항목으로 명확히 분리되어 있다.
