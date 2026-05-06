# Slice 7.2 — `ads.txt` & AdSlot

Phase: 7 — SEO & AdSense
Status: Done locally (2026-05-06)

## Goal

광고 인프라 골격이 완성되고, 토글로 안전하게 활성/비활성 가능.

## Tasks

- [x] `app/ads.txt/route.ts` — Google AdSense publisher line
- [x] `<AdSlot />` 컴포넌트 (기본 disabled)
- [x] env `ADS_ENABLED=false` 일 때 placeholder 만 렌더
- [x] 본문 광고 위치 정책 문서화 (`SEO_ADSENSE_CHECKLIST.md` 갱신)
- [x] `/admin`, `/preview`, draft 에는 AdSlot 절대 마운트 금지 (테스트 추가)

## Acceptance

- `ADS_ENABLED=true` 로 토글했을 때만 실제 광고 코드가 로드된다.
- 관리자/미리보기/draft 페이지에는 AdSlot 마운트가 0건.
