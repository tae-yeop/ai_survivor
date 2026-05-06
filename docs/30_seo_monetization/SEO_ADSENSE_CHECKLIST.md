# SEO & AdSense Checklist

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

## 1. 원칙

이 블로그의 SEO는 트릭이 아니라 “검색엔진과 사용자가 글을 이해하기 쉽게 만드는 것”을 목표로 한다.

AdSense는 수익화 수단일 뿐이며, 광고 배치가 콘텐츠 경험을 해치면 안 된다.

---

## 2. 기술 SEO 체크리스트

### 사이트 단위

- [ ] 독립 도메인 연결
- [ ] HTTPS 적용
- [x] `robots.txt` 제공
- [x] `sitemap.xml` 또는 `sitemap-index.xml` 제공
- [x] RSS 제공
- [ ] Google Search Console 등록
- [ ] Naver Search Advisor 등록
- [x] 404 페이지 제공
- [ ] 모바일에서 읽기 편한 레이아웃
- [ ] 이미지 최적화
- [ ] 불필요한 클라이언트 JavaScript 최소화

### 페이지 단위

- [ ] 고유한 `<title>`
- [ ] 고유한 meta description
- [ ] canonical URL
- [ ] Open Graph title/description/image
- [ ] Article JSON-LD 또는 BlogPosting JSON-LD
- [ ] H1은 1개
- [ ] H2/H3 계층이 자연스러움
- [ ] 이미지 alt 제공
- [ ] 내부 링크 2개 이상
- [ ] 외부 링크는 공식 문서/신뢰 가능한 출처 우선

---

## 3. 콘텐츠 SEO 체크리스트

- [ ] 제목이 검색 의도를 담고 있음
- [ ] 글 첫 부분에 결론 또는 요약이 있음
- [ ] 직접 경험, 실험, 코드, 스크린샷 중 하나 이상 포함
- [ ] 독자가 따라 할 수 있는 단계가 있음
- [ ] 실패/한계/주의사항이 있음
- [ ] AI로 작성한 일반론처럼 보이지 않음
- [ ] 본문이 과도하게 짧지 않음
- [ ] 업데이트가 필요한 글은 `updatedAt`을 갱신
- [ ] 관련 글로 연결

---

## 4. AdSense 신청 전 체크리스트

### 필수 페이지

- [x] About
- [x] Contact
- [x] Privacy Policy
- [ ] 충분히 탐색 가능한 글 목록
- [x] 404 페이지

### 콘텐츠

- [ ] 얇은 글보다 직접 실험형 글 중심
- [ ] 카테고리별 빈 페이지가 없음
- [ ] 복붙/자동생성/중복 콘텐츠 없음
- [ ] 외부 이미지/로고/스크린샷 사용 정책 확인
- [ ] 광고/제휴/후원 관련 이해관계 표시 준비

### UX

- [ ] 광고 없이도 사이트가 완성된 상태
- [ ] 모바일에서 메뉴와 본문이 잘 보임
- [ ] 팝업, 방해 요소 없음
- [ ] 본문보다 광고가 우선하지 않음

---

## 5. 광고 슬롯 원칙

### Current implementation

- `/ads.txt` returns a placeholder comment until a publisher id is configured.
- `<AdSlot />` renders real AdSense script/slot markup only when `ADS_ENABLED=true`, `ADSENSE_CLIENT`, and a slot id are all present.
- MVP public routes do not mount AdSlot yet. After approval, connect ads from the post footer or low-interruption slots first.

MVP includes the ad component and `ads.txt` route, but real ads stay disabled until approval and explicit env activation.

Initial candidates:

| Position          | Use         | Principle                                   |
| ----------------- | ----------- | ------------------------------------------- |
| Top of article    | Optional    | Do not push the first viewport too far down |
| Middle of article | Optional    | Long articles only                          |
| Bottom of article | Recommended | Low interruption after reading              |
| Sidebar           | Optional    | Desktop only                                |
| Popup             | Avoid       | Do not use in the initial launch            |
| Auto ads          | Hold        | Test only after approval                    |

---

## 6. Prohibited ad/content patterns

- Copy that asks users to click ads
- Layout that confuses ads with article content
- Excessive ad density
- Thin AI-generated bulk content
- Unlicensed images or screenshots
- Hidden affiliate or sponsorship relationships

---

## 7. Post-publish monitoring

- Indexing status
- Search queries and impressions
- Click-through rate
- Time on page
- Internal link clicks
- Popular categories
- Articles that need updates
