# Service IA

Status: Active  
Owner: 개인 운영자  
Last Updated: 2026-05-05

## 1. IA 원칙

- 블로그의 핵심은 글 상세 페이지다.
- 모든 주요 글은 카테고리, 태그, 시리즈, 검색 결과 중 최소 하나 이상의 경로로 접근 가능해야 한다.
- URL은 짧고 예측 가능해야 한다.
- 메뉴는 적게 유지하고, 태그로 세부 분류를 보완한다.

---

## 2. 상단 메뉴

초기 메뉴:

```text
Home
Posts
Series
Tools
About
```

하단 메뉴:

```text
Privacy Policy
Contact
RSS
```

---

## 3. URL 구조

| URL | 설명 |
|---|---|
| `/` | 홈 |
| `/posts/` | 전체 글 목록 |
| `/posts/[slug]/` | 글 상세 |
| `/categories/[category]/` | 카테고리별 글 목록 |
| `/tags/[tag]/` | 태그별 글 목록 |
| `/series/` | 시리즈 목록 |
| `/series/[series]/` | 시리즈 상세 |
| `/tools/` | 도구별 글 모음 |
| `/tools/[tool]/` | 특정 도구 관련 글 |
| `/about/` | 운영자/블로그 소개 |
| `/contact/` | 연락처 |
| `/privacy/` | 개인정보처리방침 |
| `/rss.xml` | RSS |
| `/sitemap-index.xml` 또는 `/sitemap.xml` | 사이트맵 |
| `/robots.txt` | 크롤러 정책 |

---

## 4. 카테고리 진입 구조

홈에서는 아래 섹션을 제공한다.

1. 최신 글
2. 추천 시리즈
3. 카테고리별 대표 글
4. 도구별 글 모음
5. About/Newsletter CTA, 단 뉴스레터는 MVP 이후

---

## 5. 글 상세 내부 구조

글 상세 페이지는 아래 구조를 따른다.

```text
Breadcrumb
Title
Description
Metadata: date, updated date, category, tags, reading time
Optional cover image
Table of Contents
Article Body
Related Posts
Series Navigation
Author Box
```

---

## 6. 검색 기능

MVP에서는 검색 기능을 필수로 만들지 않는다.

우선순위:

1. 카테고리 / 태그 / 시리즈 구조
2. 빌드 시 생성되는 간단한 검색 인덱스
3. 외부 검색 서비스

---

## 7. 추후 확장 후보

- `/newsletter/`
- `/resources/`
- `/templates/`
- `/uses/`
- `/now/`
- `/sponsor/`
