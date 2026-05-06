# Slice 5.4 — 코드 블록 / 임베드 / 표

Phase: 5 — Editor & Media
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

기존 markdown 글에 등장하는 모든 패턴을 Tiptap 에서 표현 가능.

## Tasks

- [ ] CodeBlockLowlight + 언어 선택
- [ ] 외부 임베드 (YouTube, GitHub gist, X) — oEmbed 또는 iframe 화이트리스트
- [ ] Table extension

## Acceptance

- 기존 `articles/*.md` 의 모든 markdown 패턴이 Tiptap 에서 동등하게 표현 가능하다.
