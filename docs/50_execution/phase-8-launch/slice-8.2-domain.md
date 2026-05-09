# Slice 8.2 — Custom Domain & HTTPS

Phase: 8 — Launch
Status: Not Started / external purchase required

## Goal

확정된 운영 도메인으로 사이트가 보이고, canonical/redirect/HTTPS가 정상 작동한다.

## 도메인 결론

정식 런칭을 목표로 하면 custom domain 구매/연결을 권장한다. `*.vercel.app`만으로도 테스트와 공유는 가능하지만, 운영 브랜드·검색 콘솔 domain property·AdSense 신청·장기 canonical 안정성을 고려하면 운영 도메인을 기준으로 런칭하는 편이 안전하다.

## Tasks

- [ ] 도메인 구매
- [ ] Vercel project에 custom domain 추가
- [ ] apex vs www 정책 결정
- [ ] DNS A/CNAME/TXT 레코드 설정
- [ ] HTTPS 발급 확인
- [ ] canonical URL, sitemap URL, RSS URL이 운영 도메인을 가리키는지 확인
- [ ] 이전 `*.vercel.app` URL 공유가 남아 있으면 canonical이 운영 도메인을 가리키는지 확인

## Acceptance

- `https://<domain>`에서 사이트가 보인다.
- `https://www.<domain>` 또는 apex 중 비대표 URL은 대표 URL로 redirect된다.
- canonical/sitemap/RSS/OG가 운영 도메인을 사용한다.
