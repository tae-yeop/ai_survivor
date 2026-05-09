# Slice 6.2 — 예약 발행

Phase: 6 — Content Ops
Status: Partial — public filtering implemented, automation backlog

> Current public read path already excludes draft/scheduled/archived and future-dated posts from public outputs. Automatic publish/deploy scheduling is not implemented.

## Goal

미래 시각으로 예약한 글이 그 시각에 자동 공개된다.

## Tasks

- [x] `status: scheduled` 글은 public list/detail/sitemap/RSS에서 제외
- [x] future `publishedAt` 글은 public list/detail/sitemap/RSS에서 제외
- [ ] 예약 발행이 실제 운영 병목인지 확인
- [ ] 필요 시 GitHub Actions 또는 Vercel Cron으로 scheduled → published 전환 + deploy 트리거 설계

## Acceptance

- 미래 시각으로 예약한 글이 그 시각에 자동 공개된다.
- 예약 글은 sitemap/RSS 에 들어가지 않는다.
