# SEO & AdSense Checklist

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

## 1. 원칙

이 블로그의 SEO는 트릭이 아니라 “검색엔진과 사용자가 글을 이해하기 쉽게 만드는 것”을 목표로 한다.

AdSense는 수익화 수단일 뿐이며, 광고 배치가 콘텐츠 경험을 해치면 안 된다. 첫 배포부터 광고를 켜지 않는다.

## 2. 기술 SEO 체크리스트

### 사이트 단위

- [ ] 독립 도메인 연결
- [ ] HTTPS 적용
- [x] `robots.txt` 제공
- [x] `sitemap.xml` 제공
- [x] RSS 제공
- [ ] Google Search Console 등록
- [ ] Naver Search Advisor 등록
- [x] 404 페이지 제공
- [ ] 모바일에서 읽기 편한 레이아웃
- [ ] 이미지 최적화
- [ ] 불필요한 클라이언트 JavaScript 최소화

### 페이지 단위

- [x] 고유한 `<title>`
- [x] 고유한 meta description
- [x] canonical URL
- [x] Open Graph title/description/image
- [x] Article JSON-LD 또는 BlogPosting JSON-LD
- [x] H1은 1개
- [ ] H2/H3 계층이 자연스러움
- [ ] 이미지 alt 제공
- [ ] 내부 링크 2개 이상
- [ ] 외부 링크는 공식 문서/신뢰 가능한 출처 우선

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

## 4. AdSense 신청 전 체크리스트

### 필수 페이지

- [x] About
- [x] Contact
- [x] Privacy Policy
- [ ] 독립 도메인 연결
- [ ] Search Console 등록
- [ ] 충분히 탐색 가능한 글 목록
- [x] 404 페이지

### 콘텐츠

- [ ] 최소 5개 이상의 유용한 글
- [ ] 권장: 10-15개 이상의 고유하고 충분한 분량의 글
- [ ] 카테고리별 빈 페이지 없음
- [ ] 복붙/자동생성/중복 콘텐츠 없음
- [ ] 이미지/로고/스크린샷 사용 권리 확인
- [ ] 광고/제휴/후원 관련 이해관계 표시 준비

### UX

- [ ] 광고 없이 사이트가 완성된 상태
- [ ] 모바일에서 메뉴와 본문이 잘 보임
- [ ] 팝업, 방해 요소 없음
- [ ] 본문보다 광고가 우선하지 않음

## 5. AdSense 활성화 타이밍

권장 순서:

1. Vercel 배포 성공
2. 독립 도메인 연결
3. `NEXT_PUBLIC_SITE_URL=https://aivibelab.com` 적용 후 재배포
4. Search Console/Naver Search Advisor 등록
5. sitemap 제출
6. 글 10-15개 수준까지 확장
7. 색인 확인
8. AdSense 신청
9. 승인 후 `ADSENSE_CLIENT` 입력
10. `ADS_ENABLED=true`로 변경 후 재배포

현재 구현은 다음 상태를 유지한다.

- `/ads.txt`는 publisher id가 없으면 placeholder만 반환한다.
- `<AdSlot />`은 `ADS_ENABLED=true`, `ADSENSE_CLIENT`, slot id가 모두 있을 때만 실제 AdSense script/slot을 렌더링한다.
- MVP public route에는 아직 실제 광고 슬롯을 적극 배치하지 않는다.

## 6. 광고 슬롯 원칙

| 위치     | 사용 | 원칙                         |
| -------- | ---- | ---------------------------- |
| 글 상단  | 선택 | 첫 화면을 너무 밀어내지 않기 |
| 글 중간  | 선택 | 긴 글에서만 테스트           |
| 글 하단  | 추천 | 읽기 완료 후 낮은 방해도     |
| 사이드바 | 선택 | 데스크톱 전용                |
| 팝업     | 금지 | 초기 런칭에서 사용하지 않음  |
| Auto ads | 보류 | 승인 후 별도 테스트          |

## 7. 금지 패턴

- 광고 클릭을 유도하는 문구
- 광고와 글 본문을 혼동시키는 레이아웃
- 과도한 광고 밀도
- 얇은 AI 대량 생성 콘텐츠
- 무단 이미지/스크린샷
- 숨겨진 제휴/후원 관계

## 8. 발행 후 모니터링

- 색인 상태
- 검색어와 노출수
- 클릭률
- 체류 시간
- 내부 링크 클릭
- 인기 카테고리
- 업데이트가 필요한 글
