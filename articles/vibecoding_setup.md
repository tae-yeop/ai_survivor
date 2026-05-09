# AI 개발을 위한 셋업

워크플로우를 어떻게 하지?

유튜브 시작하면서 같이 동시에 돌리는게 좋을듯

그러기 위해선 영상을 만들어야하는데 보이스부터 해보자
보이스 컨버전
보이스 TTS

바이브 코딩이나 AI 개발을 위해 제가 한 셋팅을 공유해봅니다.

보이스 컨버전하면 어색한

로컬 실험 결과

Male tech creator voice prompt

```
Native Korean. Male, early 30s. Studio-quality narration.
Persona: knowledgeable tech content creator and developer. Emotion: calm, friendly, confident.
A clear, warm male voice with a modern and professional tone. Speaks with natural enthusiasm, precise technical pronunciation, and approachable confidence. The delivery is steady, conversational, and engaging, suitable for developer tutorials, tech blog videos, AI explanations, product reviews, and coding walkthroughs.
```

Female tech creator voice prompt

```
Native Korean. Female, late 20s to early 30s. Studio-quality narration.
Persona: sharp tech content creator and developer. Emotion: bright, composed, trustworthy.
A clean, articulate female voice with a smart and friendly tone. Speaks with crisp pronunciation, natural energy, and confident pacing. The delivery is clear, conversational, and polished, suitable for developer tutorials, tech blog videos, AI explanations, product reviews, and coding walkthroughs.

```

합성할 예시 문장

```
안녕하세요. 오늘은 파이토치에서 자주 사용하는 텐서 연산과 모델 학습 흐름을, 실제 코드 예제와 함께 차근차근 살펴보겠습니다.

```

---

## 결론 먼저

바이브코딩으로 블로그를 만들 때 가장 먼저 세팅해야 하는 것은 에디터가 아니라 “AI가 마음대로 바꾸면 안 되는 기준”이다. 글 저장 위치, draft/published 규칙, 검증 명령, Git/Vercel 배포 흐름을 먼저 고정해야 이후에 글쓰기 기능을 붙여도 덜 꼬인다.

내가 정한 기본 원칙은 이렇다.

- 원문 메모는 `articles/`에 둔다.
- 실제 블로그가 읽는 글은 `apps/web/content/posts/<slug>/index.mdx`에 둔다.
- 새 글은 먼저 `status: draft`로 만든다.
- 검토 후 `status: published`로 바꾸고 push한다.
- Vercel은 GitHub push를 기준으로 배포한다.

## 왜 먼저 세팅이 필요한가

AI에게 “블로그 만들어줘”라고만 말하면 URL 구조, 카테고리, 글 저장 방식, 관리자 화면 구현을 모델이 임의로 정하기 쉽다. 초반에는 그럴듯해 보여도 나중에 글이 늘어나면 문제가 된다.

예를 들어 이런 일이 생길 수 있다.

- 어떤 글은 DB에 있고 어떤 글은 MDX 파일에 있다.
- draft 글이 sitemap이나 RSS에 노출된다.
- slug가 한글/영문/날짜 형식으로 섞인다.
- Vercel 배포와 앱 안 글쓰기 기능이 서로 다른 저장소를 바라본다.
- 에디터가 만든 HTML이 MDX 빌드에서 깨진다.

그래서 구현보다 먼저 콘텐츠 운영 규칙을 작게 잠가 둔다.

## 1. 폴더 역할을 분리한다

현재 구조에서는 폴더 역할을 이렇게 둔다.

```text
articles/
  아직 다듬기 전 원문 메모, 아이디어, 조사 노트

apps/web/content/posts/<slug>/index.mdx
  실제 Next.js 블로그가 읽는 포스트 파일

apps/web/public/media/posts/<slug>/
  공개 이미지, gif, 짧은 영상 asset
```

`articles/`에 파일이 있다고 자동으로 공개되지는 않는다. 공개 후보가 되려면 `apps/web/content/posts/<slug>/index.mdx`로 옮겨야 한다. 이 규칙이 있어야 메모와 발행 글을 구분할 수 있다.

## 2. frontmatter를 먼저 채운다

글 본문보다 먼저 frontmatter를 맞춘다. 이 프로젝트에서는 최소한 아래 값이 중요하다.

```yaml
title: 글 제목
description: 검색 결과와 카드에 보일 설명
slug: kebab-case-slug
publishedAt: 2026-05-08
updatedAt: 2026-05-08
status: draft
category: vibe-coding-lab
tags:
  - vibe-coding
author: owner
difficulty: beginner
tools:
  - Claude Code
```

특히 `slug`는 폴더명과 같아야 한다. `status`는 처음부터 `published`로 두지 않고 `draft`로 시작한다.

## 3. AI에게 시킬 일을 작게 쪼갠다

바이브코딩에서 제일 위험한 프롬프트는 “알아서 해줘”다. 글쓰기 작업도 아래처럼 나눠서 시키는 편이 낫다.

- 원문 메모를 읽고 제목/description 후보를 만든다.
- 발행용 MDX 본문으로 다듬는다.
- 코드 블록과 링크를 안전한 형태로 바꾼다.
- `status: draft`로 저장한다.
- 테스트를 돌려 frontmatter와 빌드를 확인한다.

이렇게 나누면 AI가 관리자 기능, DB, 라우팅까지 갑자기 고치지 않는다.

## 4. 로컬 검증 명령을 고정한다

글 하나를 추가해도 빌드가 깨질 수 있다. 그래서 최소 검증 명령을 정해 둔다.

```powershell
cd apps/web
npm run test
npm run typecheck
npm run build
```

테스트는 draft/scheduled 글이 공개 목록, sitemap, RSS에 노출되지 않는지 확인한다. typecheck와 build는 MDX 렌더링, 라우팅, 정적 생성 문제가 없는지 확인한다.

## 5. Vercel 배포와 앱 안 글쓰기는 같이 쓸 수 있다

GitHub에 push하면 Vercel이 배포하는 구조라면 로컬에서 글을 쓰고 push하는 흐름은 자연스럽다. 나중에 Vercel 앱 안에서 바로 글쓰기 기능을 붙여도 원칙만 같으면 꼬이지 않는다.

핵심은 “저장 위치를 하나로 유지하는 것”이다.

- 로컬 작성도 `apps/web/content/posts/<slug>/index.mdx`를 바꾼다.
- 앱 안 글쓰기 기능도 같은 경로의 파일을 GitHub commit으로 바꾼다.
- 같은 slug를 로컬과 웹에서 동시에 수정하지 않는다.
- 충돌이 생기면 Git diff를 기준으로 정리한다.

즉, 앱 안 글쓰기는 별도 CMS가 아니라 GitHub 파일 편집 UI처럼 동작하면 된다.

## 6. 내가 쓸 글 발행 루틴

앞으로 글을 올릴 때는 이렇게 간다.

1. `articles/`에 원문 메모를 넣는다.
2. AI에게 발행용 MDX 초안을 만들게 한다.
3. `status: draft` 상태로 로컬에서 확인한다.
4. 제목, 설명, 카테고리, 태그를 다듬는다.
5. `npm run test`, `typecheck`, `build`를 돌린다.
6. 괜찮으면 `status: published`로 바꾼다.
7. commit 후 push한다.
8. Vercel 배포가 끝나면 실제 페이지를 확인한다.

## 체크리스트

- [ ] slug가 폴더명과 같은가?
- [ ] description이 검색 결과에서 읽을 만한가?
- [ ] draft 글이 공개 목록에 노출되지 않는가?
- [ ] 본문에 script 태그, inline event, 위험한 embed가 없는가?
- [ ] 외부 링크가 공개해도 되는 링크인가?
- [ ] 코드 블록에 실제 API key가 들어가지 않았는가?
- [ ] push 전 build가 통과했는가?

이 정도만 고정해도 AI에게 글쓰기와 편집을 맡길 때 훨씬 덜 흔들린다.
