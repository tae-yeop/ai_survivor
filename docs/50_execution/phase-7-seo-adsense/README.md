# Phase 7 — SEO & AdSense Readiness

Status: Locally Ready (2026-05-06)
Goal: AdSense 신청을 “탈락 사유 없는 사이트”로 통과시키는 마무리 단계.

## Slices

| #   | 파일                                                     | 한 줄                               |
| --- | -------------------------------------------------------- | ----------------------------------- |
| 7.1 | [slice-7.1-policy-pages.md](./slice-7.1-policy-pages.md) | About / Privacy / Contact 본문 완성 |
| 7.2 | [slice-7.2-ads-txt-slot.md](./slice-7.2-ads-txt-slot.md) | `ads.txt` + AdSlot 컴포넌트         |
| 7.3 | [slice-7.3-lighthouse.md](./slice-7.3-lighthouse.md)     | Lighthouse / 접근성 점검            |

## Phase Exit Criteria

- 정책 페이지가 readable + indexable.
- `ADS_ENABLED=true` 일 때만 실제 광고 코드가 로드된다.
- Lighthouse Mobile Performance/SEO/Best Practices 90+, Accessibility 95+ (pending external Lighthouse run after deployment).

> Retro: About/Privacy/Contact, disabled-by-default AdSlot, and `/ads.txt` route are implemented locally. Actual AdSense activation waits for publisher id and approval.
