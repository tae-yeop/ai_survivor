# Screen Inventory

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

## 1. 화면 목록

| 화면 | URL | 목적 | 우선순위 |
|---|---|---|---|
| Home | `/` | 블로그 소개와 핵심 콘텐츠 진입 | P0 |
| Posts Index | `/posts/` | 전체 글 탐색 | P0 |
| Post Detail | `/posts/[slug]/` | 콘텐츠 소비와 내부 링크 | P0 |
| Category Detail | `/categories/[category]/` | 주제별 글 탐색 | P0 |
| Tag Detail | `/tags/[tag]/` | 세부 키워드별 글 탐색 | P1 |
| Series Index | `/series/` | 연재 콘텐츠 탐색 | P1 |
| Series Detail | `/series/[series]/` | 연재 순서 제공 | P1 |
| Tools Index | `/tools/` | 도구별 콘텐츠 탐색 | P1 |
| Tool Detail | `/tools/[tool]/` | 특정 도구 관련 글 탐색 | P1 |
| About | `/about/` | 운영자 신뢰도와 소개 | P0 |
| Contact | `/contact/` | 연락 수단 제공 | P0 |
| Privacy | `/privacy/` | 광고/분석/쿠키 정책 고지 | P0 |
| RSS | `/rss.xml` | 구독 피드 | P1 |
| Sitemap | `/sitemap.xml` | 검색엔진 색인 보조 | P0 |
| Robots | `/robots.txt` | 크롤러 정책 | P0 |

---

## 2. Home

### 목적

블로그의 정체성과 최신/대표 글을 보여준다.

### 데이터

- 최신 글 5~10개
- 추천 시리즈 1~3개
- 주요 카테고리
- About 요약

### 주요 액션

- 글 상세로 이동
- 카테고리로 이동
- About으로 이동

### 상태

- 글이 없는 상태
- 글이 일부 있는 상태
- 추천 시리즈가 없는 상태

---

## 3. Post Detail

### 목적

사용자가 글을 읽고 관련 글로 이동하게 한다.

### 데이터

- Post frontmatter
- 본문 MDX
- 목차
- 관련 글
- 이전/다음 글
- 시리즈 정보

### 주요 액션

- 내부 링크 이동
- 외부 링크 이동
- 태그/카테고리 이동
- RSS 구독

### 상태

- 정상 발행 글
- draft 글은 프로덕션에서 노출하지 않음
- slug가 없는 경우 404

---

## 4. Posts Index

### 목적

전체 글을 최신순으로 탐색한다.

### 데이터

- 발행된 글 목록
- 카테고리 필터
- 태그 요약

### 주요 액션

- 글 상세 이동
- 카테고리 필터 이동

---

## 5. Category / Tag / Tool / Series Detail

### 목적

같은 관심사를 가진 글을 묶어 보여준다.

### 데이터

- 해당 분류의 글 목록
- 분류 설명
- 관련 태그

### 주요 액션

- 글 상세 이동
- 다른 분류 이동

---

## 6. About

### 목적

운영자의 배경과 블로그 신뢰도를 제공한다.

### 포함 내용

- 운영자 소개
- 관심 분야
- 글 작성 원칙
- AI 사용 방식
- 문의 링크

---

## 7. Privacy

### 목적

분석 도구, 광고, 쿠키, 제3자 서비스 관련 고지를 제공한다.

### 포함 내용

- 수집 가능한 정보
- 쿠키 사용
- 광고 서비스
- 분석 도구
- 문의 방법

실제 배포 전 법적/정책 문구는 최신 기준으로 재검토한다.
