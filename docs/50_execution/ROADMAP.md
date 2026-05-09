# Roadmap

Status: Phase-aligned roadmap
Last Updated: 2026-05-09

이 로드맵은 현재 코드 기준의 남은 일을 정리한다. 완료 상태는 [`EXECUTION_STATUS.md`](./EXECUTION_STATUS.md)를 우선한다.

## 완료된 기반

- [x] Next.js App Router 공개 사이트
- [x] Git-backed MDX content model
- [x] public post/detail/taxonomy/RSS/sitemap/robots/ads routes
- [x] GitHub OAuth owner login
- [x] GitHub Contents API save path
- [x] RichEditor core
- [x] image/audio/document upload v1: 4MB 이하 GitHub asset commit
- [x] `<Figure />`, `<AudioEmbed />`, `<DocumentEmbed />`, `<YouTube />` MDX render path
- [x] in-place edit baseline
- [x] monetization disclosure/link components
- [x] live Vercel smoke and PageSpeed baseline

## 다음 로컬 우선순위

1. **Phase 5 polish**
   - [ ] Callout block
   - [ ] editor toast/error UX 정리
   - [ ] keyboard shortcut/help modal
   - [ ] editor node a11y polish

2. **Phase 5 advanced embed**
   - [ ] Vimeo / X / Gist / CodePen / Spotify / OG card 중 우선순위 결정
   - [ ] URL-only embed부터 구현
   - [ ] SSRF/iframe allowlist 정책 문서화

3. **Phase 6 content ops**
   - [ ] local draft/autosave 필요성 운영 후 판단
   - [ ] taxonomy admin UI 필요성 판단
   - [ ] SEO preview panel 필요성 판단
   - [ ] schedule automation은 실제 예약 발행 병목 확인 후 결정

4. **Optional performance**
   - [ ] Desktop PageSpeed 90+ 목표가 필요하면 main-thread/TBT/unused JS/render-blocking CSS 점검

## 외부 권한 이후 진행

1. custom domain 구매/연결
2. `NEXT_PUBLIC_SITE_URL`을 운영 도메인으로 변경
3. Vercel production env 최종 점검
4. Google Search Console 등록 + sitemap 제출
5. Naver Search Advisor 등록 + sitemap 제출
6. AdSense 신청
7. 승인 후 `ADS_ENABLED=true` 점진 적용

## 보류된 확장

- R2/Vercel Blob 기반 large media object storage
- DB/Supabase CMS
- multi-user roles
- analytics dashboard
- newsletter/comment/community 기능

보류 항목은 새 ADR 또는 명시 요청 없이 active architecture로 되살리지 않는다.
