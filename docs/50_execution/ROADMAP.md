# Roadmap

Status: Active (high-level milestones only)
Owner: 개인 운영자
Last Updated: 2026-05-06

> 이 문서는 상위 마일스톤만 본다. 실제 작업 단위(Phase → Slice → Task)는 [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) 를 본다.
> 현재 MVP 경로는 **Next.js + GitHub + MDX + Vercel** 이다. 결정 배경은 `../60_decisions/ADR-003-github-mdx-content-workflow.md` 를 본다. Supabase/Tiptap 관리자 CMS는 보류한다.

## Phase 0. 문서와 방향 확정

목표: 바이브코딩 전에 LLM이 읽을 최소 기준서를 확정한다.

- [x] 블로그 정식명 확정 (`AI Vibe Lab`)
- [x] 도메인 후보 정리 (`aivibelab.com`)
- [x] 기술 스택 확정
- [x] 첫 10개 글 후보 확정
- [x] docs 최소 세트 준비
- [x] CLAUDE.md 준비

완료 기준:

- LLM에게 구현을 맡길 수 있는 기준 문서가 존재한다.

---

## Phase 1. 블로그 뼈대 구현

목표: 광고 없이도 독립 블로그로 동작하는 최소 사이트를 만든다.

- [x] 프로젝트 생성
- [x] 기본 레이아웃
- [x] 홈
- [x] 글 목록
- [x] 글 상세
- [x] 카테고리/태그 페이지
- [x] About
- [x] Contact
- [x] Privacy
- [x] 404
- [x] sitemap
- [x] robots.txt
- [x] RSS

완료 기준:

- 샘플 글 3개가 정상적으로 노출된다.
- 각 글의 title, description, canonical, Open Graph가 생성된다.

---

## Phase 2. 콘텐츠 런칭 준비

목표: GitHub에 커밋된 MDX 콘텐츠를 실제 검색 유입을 받을 수 있는 HTML 페이지로 만든다.

- [x] MDX frontmatter schema 확정
- [x] 첫 글 5개 작성 또는 기존 글 5개 이식
- [x] 첫 시리즈 1개 구성
- [x] 내부 링크 구조 정리
- [x] 대표 이미지 또는 OG 이미지 템플릿 준비
- [x] draft/scheduled 글 sitemap/RSS 제외 검증
- [ ] Search Console 등록
- [ ] Naver Search Advisor 등록

완료 기준:

- 독립 도메인에서 MDX 기반 블로그가 공개되어 있고, 검색엔진 제출이 가능하다.

---

## Phase 3. AdSense 신청 준비

목표: AdSense 신청 전 사이트 완성도와 정책 페이지를 보완한다.

- [x] About 보강
- [x] Privacy Policy 보강
- [x] Contact 정상 동작
- [x] 얕은 글 제거 또는 보강
- [x] 카테고리 빈 페이지 제거
- [x] 광고 슬롯 컴포넌트 준비
- [ ] AdSense 신청

완료 기준:

- 광고 없이도 완성된 콘텐츠 사이트로 보인다.

---

## Phase 4. 운영과 성장

목표: 발행 루틴과 데이터 기반 개선을 시작한다.

- [ ] 주간 발행 루틴
- [ ] 검색 노출 키워드 분석
- [ ] 오래된 글 업데이트
- [ ] 인기 글 기반 후속 글 작성
- [ ] 도구별 허브 페이지 강화
- [ ] 제휴 링크 정책 검토
- [ ] 뉴스레터 또는 리소스 페이지 검토

완료 기준:

- 검색 유입 기반으로 다음 글 주제를 결정할 수 있다.
