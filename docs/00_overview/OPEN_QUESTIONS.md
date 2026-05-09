# Open Questions

아직 결정하지 않았거나 운영하면서 다시 봐야 하는 질문만 남긴다. 결정된 내용은 관련 ADR 또는 overview 문서로 이동한다.

## 브랜드 / 도메인

- [x] 블로그 표시 브랜드는 무엇인가? → `AI 시대 생존기 / AI Survivor`
- [x] 브랜드 사용 문장은 무엇인가? → `BRAND_OVERVIEW.md` 기준
- [x] 코드 기본 canonical fallback은 무엇인가? → `http://localhost:3000`, Vercel에서는 `VERCEL_PROJECT_PRODUCTION_URL` 또는 `NEXT_PUBLIC_SITE_URL`
- [ ] 운영 도메인을 `aisurvivor.*` 계열로 살 것인가, 다른 짧은 한국어/영문 조합으로 살 것인가?

## 기술 스택

- [x] 프레임워크는 무엇인가? → Next.js App Router
- [x] 배포는 어디인가? → Vercel
- [x] 글 원본은 어디에 저장하는가? → GitHub-backed MDX, `apps/web/content/posts/<slug>/index.mdx`
- [x] 카테고리/태그는 enum인가 free-form인가? → free-form frontmatter, slugified route
- [ ] 검색 기능은 빌드 타임 인덱스로 갈 것인가, 외부 검색 서비스를 쓸 것인가?

## 콘텐츠

- [x] 첫 콘텐츠 방향은 무엇인가? → AI 도구 사용기, 튜토리얼 검증, 생성/영상 AI, 자동화, 바이브코딩
- [x] 기본 글 템플릿은 무엇인가? → `ARTICLE_TEMPLATE.md`
- [ ] 반말/존댓말 중 최종 톤은 무엇인가?
- [ ] 코드 중심 글과 사용기 중심 글의 비율은 어떻게 가져갈 것인가?
- [ ] 전문 영역(주식, 의료, 법률, AI 개발 등)을 언제부터 포함할 것인가?

## 수익화

- [ ] AdSense 신청 시점의 최소 콘텐츠 기준은 어떻게 잡을 것인가?
- [ ] 제휴 링크는 언제부터 허용할 것인가?
- [ ] 도구 리뷰 글의 이해관계 표시 규칙은 어떻게 운영할 것인가?

## 운영

- [ ] 주당 글 발행 목표는 몇 개인가?
- [ ] 업데이트가 잦은 AI 도구 글의 갱신 주기는 어떻게 잡을 것인가?
- [ ] 스크린샷, 로고, UI 이미지 사용 정책은 어떻게 정리할 것인가?
- [ ] 인스타/유튜브로 확장할 글은 어떻게 선별할 것인가?
