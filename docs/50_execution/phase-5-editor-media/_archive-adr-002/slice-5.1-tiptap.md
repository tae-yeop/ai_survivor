# Slice 5.1 — Tiptap 기본 에디터 통합

Phase: 5 — Editor & Media
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

Tiptap 에디터가 폼 안에서 동작하고 JSON ↔ HTML 양방향 변환이 안정적.

## Tasks

- [ ] Tiptap StarterKit + Heading, Link, CodeBlock, Image, HorizontalRule extension 설치
- [ ] Editor 컴포넌트 (`'use client'`) — JSON 출력
- [ ] `posts.content_json` ↔ Editor 양방향 바인딩
- [ ] 저장 시 서버에서 `content_json` → `content_html` + `plain_text` 함께 저장

## Acceptance

- 글 작성 → 저장 → 공개 페이지에 동일 본문이 렌더된다.
