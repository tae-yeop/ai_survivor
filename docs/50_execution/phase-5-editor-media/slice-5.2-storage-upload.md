# Slice 5.2 — Supabase Storage 업로드

Phase: 5 — Editor & Media
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

본문에 이미지를 드래그하면 업로드되고 즉시 미리보기에 뜬다.

## Tasks

- [ ] Storage bucket `media` 생성 (public read, RLS write=admin)
- [ ] 서버 라우트 `/api/admin/upload` — multipart 수신, 검증(용량/MIME), 저장, `assets` row 생성
- [ ] 클라이언트 업로드 어댑터 (Tiptap Image 확장 + drag-drop)

## Acceptance

- 본문에 이미지를 드래그 → 업로드 → 본문에 이미지가 즉시 표시된다.
- 비관리자 키로는 `/api/admin/upload` 가 거부된다.
