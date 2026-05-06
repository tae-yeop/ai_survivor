# Slice 5.3 — 미디어 라이브러리 + alt/caption

Phase: 5 — Editor & Media
Status: Deferred by ADR-003

> Historical ADR-002 slice. Do not implement in the current MVP unless a new ADR reactivates the Supabase/Admin CMS path.

## Goal

업로드된 이미지를 검색하고 재사용할 수 있다.

## Tasks

- [ ] `/admin/media` — 그리드, 검색, alt/caption 편집, 삭제
- [ ] 본문에서 “라이브러리에서 선택” 가능
- [ ] 기존 `public/images/` 자산을 Storage 로 일괄 업로드 (Slice 2.2 마이그레이션 보완)

## Acceptance

- 모든 본문 이미지가 Storage URL 로 서빙되고 alt/caption 이 정상 노출된다.
