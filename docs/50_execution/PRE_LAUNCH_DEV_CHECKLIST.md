# Pre-launch Developer Checklist

Status: Active
Last Updated: 2026-05-09

목표: 이미 Vercel app에 출판된 상태에서, 도메인을 구매/연결하기 전에 개발자가 로컬 코드와 문서만으로 마무리할 수 있는 일을 끝낸다.

## 1. 도메인이 꼭 필요한가?

정식 런칭, 검색엔진 운영, AdSense 심사를 목표로 하면 **사실상 custom domain을 쓰는 편이 맞다.**

- Vercel의 `*.vercel.app` URL만으로도 배포와 테스트는 가능하다.
- 하지만 브랜드 신뢰, canonical URL 안정성, Search Console의 domain property 검증, AdSense 심사/운영을 생각하면 운영 도메인을 정하고 DNS로 검증하는 흐름이 더 안전하다.
- 도메인 연결 전에는 `NEXT_PUBLIC_SITE_URL`을 현재 Vercel production URL로 맞춰 canonical/sitemap/RSS가 가짜 도메인을 가리키지 않게 해야 한다.
- 도메인 연결 후에는 `NEXT_PUBLIC_SITE_URL=https://<운영도메인>`으로 바꾸고 sitemap/RSS/OG/canonical을 다시 확인한다.

## 2. 지금 코드에서 특히 확인할 값

| 항목                   | 현재 기준                            | 도메인 전 권장          | 도메인 후 권장            |
| ---------------------- | ------------------------------------ | ----------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL` | canonical, sitemap, RSS, OG 기준 URL | Vercel production URL   | 운영 도메인               |
| `ADS_ENABLED`          | 광고 렌더링 플래그                   | `false`                 | 승인 후 제한적으로 `true` |
| `ADSENSE_CLIENT`       | AdSense publisher/client 값          | 비워둠                  | 승인 후 입력              |
| `ADMIN_*`, `GITHUB_*`  | GitHub-backed admin editor           | production env에만 입력 | 유지                      |
| `R2_*`                 | video/media 확장                     | 비워둬도 됨             | Phase 5.3 진행 시 입력    |

## 3. 도메인 전 개발-only 완료 체크

### Site identity / canonical

- [ ] `NEXT_PUBLIC_SITE_URL`이 실제 접근 가능한 Vercel production URL 또는 운영 도메인인지 확인
- [ ] sitemap URL이 `NEXT_PUBLIC_SITE_URL` 기준으로 생성되는지 확인
- [x] RSS link/canonical/OG URL이 같은 기준 URL을 쓰는지 확인
- [x] 코드 기본값이 `aivibelab.com` 같은 임시 placeholder를 canonical로 쓰지 않도록 보정

### Admin/editor

- [ ] production env의 GitHub OAuth callback URL이 실제 production URL과 일치하는지 확인
- [ ] `ADMIN_GITHUB_ID` 또는 owner 검증값이 로그인 사용자와 일치하는지 확인
- [x] `/admin`, `/write`, `/preview`가 robots/ads 대상에서 제외되는지 확인
- [x] public editor와 protected editor 경계 문서화 완료

### SEO / policy / monetization

- [ ] About / Privacy / Contact가 production URL에서 접근 가능한지 확인
- [ ] `/ads.txt`가 존재하되 승인 전 광고는 비활성인지 확인
- [x] affiliate/sponsored 링크에는 `rel="sponsored nofollow"` 정책 적용
- [x] 수익화 disclosure 컴포넌트 또는 공통 문구 적용
- [x] `/resources`가 sitemap/navigation에 포함되는지 확인

### Reliability / security / DX

- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] 실제 Vercel production URL에서 smoke test
- [ ] Lighthouse 모바일 기준 사전 점검
- [x] 기본 보안 헤더 적용: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
- [x] 큰 이미지/동영상은 repo가 아니라 외부 object storage로 분리할지 결정

## 4. 도메인/외부 계정이 있어야 완료되는 체크

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

1. 도메인 전: production Vercel URL을 기준으로 `NEXT_PUBLIC_SITE_URL`을 맞춘다.
2. 로컬: typecheck/test/lint/build를 모두 통과시킨다.
3. 로컬: 수익화 링크/광고/관리자 경계 정책을 문서와 컴포넌트에 반영한다.
4. 도메인 구매: Vercel에 custom domain을 연결한다.
5. 도메인 후: `NEXT_PUBLIC_SITE_URL`을 운영 도메인으로 교체하고 다시 build/smoke test한다.
6. 검색/광고: GSC/Naver/AdSense를 순서대로 등록한다.

## 2026-05-09 배포 QA 보강 기록

PageSpeed 공유 결과와 실제 배포 smoke test 기준으로 다음 개발 수정이 완료되었다.

- `/api/admin/me` 비로그인 응답을 401에서 200 `{ "admin": false }`로 변경해 public page console error를 제거했다.
- light theme `ink-300` / `ink-400` 색상 대비를 WCAG 일반 텍스트 기준(4.5:1) 이상으로 올렸다.
- 회귀 테스트 추가:
  - `src/lib/admin/identity.test.ts`
  - `src/lib/accessibility-tokens.test.ts`
- 로컬 production smoke 확인:
  - `/` 200
  - `/api/admin/me` 200 `{ "admin": false }`
  - `/resources` 200
  - `sitemap.xml`에 `/resources` 포함
  - 기본 보안 헤더 적용 확인

남은 단계는 이 변경분을 Vercel production에 재배포한 뒤 `/resources`, 보안 헤더, PageSpeed console/a11y 항목을 다시 확인하는 것이다.
