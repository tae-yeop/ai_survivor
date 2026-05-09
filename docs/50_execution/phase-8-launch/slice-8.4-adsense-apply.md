# Slice 8.4 — AdSense 및 초기 수익화 적용

Phase: 8 — Launch
Status: Prepared / external approval pending

## Goal

AdSense 가 승인되고, 광고 단위가 안전한 위치에 점진 활성화된다. 동시에 AdSense 승인 전에도 적용 가능한 제휴 링크, `/resources`, 문의 CTA는 콘텐츠 신뢰도를 해치지 않는 범위에서 준비한다.

기준 문서:

- `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`
- `docs/30_seo_monetization/MONETIZATION_STRATEGY.md`

## Tasks

- [ ] AdSense 신청
- [ ] 승인 후 광고 단위 생성 + AdSlot 에 연결
- [ ] `ADS_ENABLED=true` 점진 적용
- [x] `/resources` starter page implemented and included in sitemap/navigation
- [x] `AffiliateLink`, `ProductCard`, `DisclosureBox` components implemented
- [x] Required disclosure principles documented for Coupang Partners, Amazon Associates, and AI tool referrals
- [x] Consulting/workshop CTA connects to the Contact flow

## Acceptance

- 본문 UX 를 해치지 않는 위치에 광고가 노출된다.
- 제휴/스폰서 링크는 `rel="sponsored"` 또는 `rel="sponsored nofollow"`를 사용한다.
- 제휴/스폰서 관계는 본문 상단 또는 링크 근처에서 명확히 표시된다.
- 무관한 상품 링크나 실제 사용 경험 없는 추천 글은 발행하지 않는다.
