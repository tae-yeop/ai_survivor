# Phase 3 — Admin Auth & Shell

Status: Done via ADR-004
Last Updated: 2026-05-09

Goal: 운영자만 브라우저에서 로그인해 Git-backed content를 수정할 수 있게 한다.

## Current summary

완료/미완료 판단은 이 README와 상위 [`../EXECUTION_STATUS.md`](../EXECUTION_STATUS.md)를 우선한다.

## Done

- GitHub OAuth login/callback
- HMAC-signed owner session
- admin route boundary

## Remaining / notes

- 아래 Supabase auth slices는 historical reference이며 현재 진행률에 포함하지 않는다.

## Slice files

세부 slice 문서는 작업 단위와 과거 계획을 보존한다. 현재 active implementation과 충돌하면 상위 상태 문서를 우선한다.
