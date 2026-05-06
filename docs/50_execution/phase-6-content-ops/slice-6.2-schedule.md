# Slice 6.2 — 예약 발행

Phase: 6 — Content Ops
Status: Needs Rewrite for ADR-003

> This slice was written for the ADR-002 admin CMS path. Rework it into GitHub/MDX checklist, lint, or GitHub Actions workflow before implementation.

## Goal

미래 시각으로 예약한 글이 그 시각에 자동 공개된다.

## Tasks

- [ ] `scheduled` 상태 + `scheduled_at` 필드 활용
- [ ] Vercel Cron (`/api/cron/publish-scheduled`) — 분 단위 폴링하여 published 전환 + revalidate 호출

## Acceptance

- 미래 시각으로 예약한 글이 그 시각에 자동 공개된다.
- 예약 글은 sitemap/RSS 에 들어가지 않는다.
