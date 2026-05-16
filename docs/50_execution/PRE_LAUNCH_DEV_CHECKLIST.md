# Pre-launch Developer Checklist

Status: Active
Last Updated: 2026-05-09

목표: custom domain을 구매/연결하기 전, 로컬 코드와 문서만으로 끝낼 수 있는 출시 전 점검을 분리한다.

## 1. Domain이 왜 필요한가

`*.vercel.app`만으로도 smoke test와 임시 공유는 가능하다. 하지만 브랜드 신뢰, canonical 안정성, Search Console domain property, AdSense 심사를 생각하면 운영 도메인이 필요하다.

도메인 전:

- `NEXT_PUBLIC_SITE_URL`은 현재 접근 가능한 Vercel production URL을 가리켜야 한다.
- sitemap/RSS/OG/canonical이 placeholder domain을 쓰면 안 된다.

도메인 후:

- `NEXT_PUBLIC_SITE_URL=https://<운영도메인>`으로 교체한다.
- sitemap/RSS/OG/canonical을 다시 검증한다.

## 2. Env 기준

| 항목                   | 현재 용도                            | 도메인 전               | 도메인 후                 |
| ---------------------- | ------------------------------------ | ----------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL` | canonical, sitemap, RSS, OG base URL | Vercel production URL   | 운영 도메인               |
| `ADS_ENABLED`          | 광고 렌더 플래그                     | `false`                 | 승인 후 제한적으로 `true` |
| `ADSENSE_CLIENT`       | ads.txt / AdSense client             | 비움                    | 승인 후 입력              |
| `ADMIN_*`, `GITHUB_*`  | GitHub-backed admin editor           | production env에만 입력 | 유지                      |
| `R2_*`                 | 향후 large media 확장                | 비워둬도 됨             | Phase 5.3 진행 시 입력    |

## 3. 도메인 전 로컬 완료 체크

### Site identity / canonical

- [x] `NEXT_PUBLIC_SITE_URL`이 실제 접근 가능한 Vercel production URL 또는 운영 도메인인지 확인
- [x] sitemap URL이 `NEXT_PUBLIC_SITE_URL` 기준으로 생성되는지 확인
- [x] RSS link/canonical/OG URL이 같은 기준 URL을 쓰는지 확인
- [x] 기본값이 placeholder 도메인을 canonical로 쓰지 않도록 보정

### Admin/editor

- [ ] production env의 GitHub OAuth callback URL이 실제 production URL과 일치하는지 확인
- [ ] `ADMIN_GITHUB_ID` 또는 owner 검증값이 로그인 사용자와 일치하는지 확인
- [x] `/admin`, `/write`, `/preview`가 robots/sitemap/RSS에 노출되지 않는지 확인
- [x] public editor와 protected editor 경계 문서화
- [x] 4MB 이하 image/audio/document upload v1 문서화

### SEO / policy / monetization

- [x] About / Privacy / Contact가 production URL에서 접근 가능한지 확인
- [x] `/ads.txt`가 publisher id 없이도 안전하게 placeholder를 반환하는지 확인
- [x] affiliate/sponsored 링크에 `rel="sponsored nofollow"` 정책 적용
- [x] disclosure component/copy 적용
- [x] `/resources`가 sitemap/navigation에 포함되는지 확인

### Reliability / security / DX

- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run lint`
- [x] `npm run build`
- [x] live Vercel smoke test
- [x] Lighthouse/PageSpeed baseline
- [x] security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
- [x] 큰 이미지/동영상/문서는 repo가 아니라 외부 object storage로 분리한다는 정책 확인

## 4. 외부 계정/도메인 체크

- [ ] 도메인 구매
- [ ] Vercel custom domain 추가
- [ ] apex vs www canonical 정책 결정
- [ ] DNS A/CNAME/TXT 레코드 설정
- [ ] HTTPS 정상 발급 확인
- [ ] Google Search Console Domain property 검증
- [ ] Naver Search Advisor 등록
- [ ] AdSense 사이트 신청
- [ ] 승인 후 광고 단위 생성/삽입

## 5. 권장 순서

1. 도메인 전에는 Vercel production URL로 `NEXT_PUBLIC_SITE_URL`을 맞춘다.
2. 로컬에서 typecheck/test/lint/build를 모두 통과시킨다.
3. Vercel URL 기준 live smoke와 PageSpeed를 확인한다.
4. 도메인을 구매하고 Vercel custom domain을 연결한다.
5. `NEXT_PUBLIC_SITE_URL`을 운영 도메인으로 교체하고 다시 build/smoke한다.
6. GSC/Naver/AdSense를 순서대로 등록한다.
