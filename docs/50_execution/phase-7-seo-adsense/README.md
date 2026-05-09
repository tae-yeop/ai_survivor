# Phase 7 — SEO & AdSense Readiness

Status: Live Verified (2026-05-09)
Goal: AdSense 신청 전에 사이트가 readable, indexable, policy-compliant 상태가 되도록 마무리한다.

## Slices

| #   | 파일                                                     | 한 줄                               |
| --- | -------------------------------------------------------- | ----------------------------------- |
| 7.1 | [slice-7.1-policy-pages.md](./slice-7.1-policy-pages.md) | About / Privacy / Contact 본문 완성 |
| 7.2 | [slice-7.2-ads-txt-slot.md](./slice-7.2-ads-txt-slot.md) | `ads.txt` + AdSlot 컴포넌트         |
| 7.3 | [slice-7.3-lighthouse.md](./slice-7.3-lighthouse.md)     | Lighthouse / 접근성 점검            |

## Current local readiness

- About/Privacy/Contact are implemented.
- `/resources` is implemented and included in nav/sitemap.
- `AdSlot` is disabled by default unless `ADS_ENABLED=true` and `ADSENSE_CLIENT` are set.
- `/ads.txt` route exists.
- Affiliate/sponsored link rel policy is centralized in `src/lib/monetization.ts`.
- Baseline security headers are configured in `next.config.ts` and verified on the live Vercel URL.
- PageSpeed report `icpca7ddqh`: Mobile 96/100/100/100 and Desktop 84/100/100/100 for Performance/Accessibility/Best Practices/SEO.

## Phase Exit Criteria

- [x] 정책 페이지가 readable + indexable.
- [x] `ADS_ENABLED=true`일 때만 실제 광고 코드가 로드된다.
- [x] 수익화 링크 정책이 공통 helper/component로 고정되어 있다.
- [x] 기본 보안 헤더가 설정되어 있다.
- [x] Lighthouse Mobile Performance/SEO/Best Practices 90+, Accessibility 95+.

> AdSense activation still waits for domain/account/publisher approval. Desktop performance 90+ is optional optimization, not a launch blocker.
